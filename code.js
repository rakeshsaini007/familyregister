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
      .filter(row => row[1].toString() === houseNumber.toString())
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
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'No houseNumber provided' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const body = JSON.parse(rawData);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Find if member already exists in this house
    // Criteria: House Number (B) AND Member Name (I)
    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1].toString() === body['मकान नम्बर'].toString() && 
          rows[i][8].toString() === body['सदस्य का नाम'].toString()) {
        rowIndex = i + 2; // +1 for 0-index, +1 for headers
        break;
      }
    }
    
    const timestamp = new Date().toLocaleString();
    const newRow = headers.map(header => {
      if (header === 'Timestamp') return timestamp;
      if (header === 'क्रम संख्या' && rowIndex === -1) {
        // Simple auto-increment for new rows
        return rows.length + 1;
      }
      return body[header] || '';
    });
    
    if (rowIndex !== -1) {
      // Update existing row
      // Keep original serial number if update
      newRow[0] = rows[rowIndex-2][0];
      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', action: 'updated' }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Append new row
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', action: 'saved' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
