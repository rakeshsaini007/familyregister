/**
 * Google Apps Script for "Data" Registry
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet named "Data".
 * 2. Rename the first sheet to "Data".
 * 3. Add headers in Row 1:
 *    क्रम संख्या (A), मकान नम्बर (B), परिवार के प्रमुख का नाम (C), फैमिली ID (D), राशन कार्ड संख्या (E), राशन कार्ड का प्रकार (F), धर्म (G), जाति (H), सदस्य का नाम (I), पिता / पति का नाम (J), लिंग (पु०/म०) (K), जन्मतिथि (L), उम्र (M), आधार कार्ड संख्या (N), दिव्यांगता (O), दिव्यांगता का प्रकार (P), व्यवसाय (Q), साक्षर/निरक्षर (R), यदि साक्षर तो शैक्षिक स्तर (S), मोबाइल नंबर (T), सर्किल छोड़ देने या मृत्यु का दिनाँक (U), Timestamp (V)
 * 4. Open Extensions > Apps Script.
 * 5. Replace the code with this file.
 * 6. Deploy as Web App (Execute as: Me, Access: Anyone).
 * 7. Copy the Deployment URL and paste it into the React App constants.
 */

const SHEET_NAME = 'Data';

function doGet(e) {
  const houseNumber = e.parameter.houseNumber;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  // If houseNumber is provided, filter by it
  if (houseNumber) {
    const familyMembers = rows
      .filter(row => row[1] && row[1].toString().trim() === houseNumber.toString().trim())
      .map(row => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
    
    return ContentService.createTextOutput(JSON.stringify(familyMembers))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // If no houseNumber, return ALL members (for Advanced filter)
  const allMembers = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(allMembers))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const body = JSON.parse(rawData);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let rows = data.slice(1);
    
    // Find if member already exists in this house
    // Use original values if provided to allow renaming member or changing house number
    const houseToSearch = (body._originalHouse !== undefined ? body._originalHouse : body['मकान नम्बर']).toString().trim();
    const nameToSearch = (body._originalName !== undefined ? body._originalName : body['सदस्य का नाम']).toString().trim();
    
    let targetIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const houseInRow = rows[i][1] ? rows[i][1].toString().trim() : '';
      const nameInRow = rows[i][8] ? rows[i][8].toString().trim() : '';

      if (houseInRow === houseToSearch && nameInRow === nameToSearch) {
        targetIndex = i;
        break;
      }
    }
    
    const isDelete = (body.action === 'delete');
    const familyFields = ['परिवार के प्रमुख का नाम', 'फैमिली ID', 'राशन कार्ड संख्या', 'राशन कार्ड का प्रकार', 'धर्म', 'जाति'];
    
    // Check if any member of this house already has family data
    const houseHasFamilyData = rows.some(r => {
      if (r[1].toString() !== body['मकान नम्बर'].toString()) return false;
      return familyFields.some(field => {
        const idx = headers.indexOf(field);
        return idx !== -1 && r[idx] && r[idx].toString().trim() !== '';
      });
    });

    if (isDelete) {
      if (targetIndex !== -1) {
        rows.splice(targetIndex, 1);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Member not found' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } else {
      const formatDate = (date) => {
        const d = new Date(date);
        const day = ("0" + d.getDate()).slice(-2);
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const year = d.getFullYear();
        return day + "-" + month + "-" + year;
      };

      const timestamp = formatDate(new Date());
      const isUpdate = (targetIndex !== -1);
      
      // IF it is a NEW member AND the house already has family data elsewhere, 
      // clear the family header fields for this row as requested.
      if (!isUpdate && houseHasFamilyData) {
        familyFields.forEach(field => {
          body[field] = '';
        });
      }

      // Create/Update the row data based on headers
      const currentRow = headers.map((header, index) => {
        if (header === 'Timestamp') return timestamp;
        if (header === 'क्रम संख्या') return ''; // Will be calculated after sorting
        
        let value = body[header] !== undefined ? body[header] : (isUpdate ? rows[targetIndex][index] : '');
        
        // Format date fields if they are in YYYY-MM-DD format (typical for HTML date input)
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          value = formatDate(value);
        }
        
        return value;
      });
      
      if (isUpdate) {
        rows[targetIndex] = currentRow;
      } else {
        rows.push(currentRow);
      }
    }
    
    // 1. Sort rows to maintain grouping by House Number (Numeric/String)
    rows.sort((a, b) => {
      const houseA = parseFloat(a[1]);
      const houseB = parseFloat(b[1]);
      
      if (!isNaN(houseA) && !isNaN(houseB)) {
        if (houseA !== houseB) return houseA - houseB;
      } else {
        const strA = a[1].toString();
        const strB = b[1].toString();
        if (strA !== strB) return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
      }
      return 0; // Stable sort keeps original order within the same house
    });
    
    // 2. Recalculate Serial Numbers (Column A) from 1 to N
    for (let i = 0; i < rows.length; i++) {
      rows[i][0] = i + 1;
    }
    
    // 3. Clear existing data and write everything back
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).clearContent();
    }
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      action: isDelete ? 'deleted' : (targetIndex !== -1 ? 'updated' : 'saved') 
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
