/**
 * Generates a URL for a SEPA (EPC) Payment QR Code image using api.qrserver.com.
 * (This function remains unchanged)
 *
 * @param {string} recipientName The name of the payment recipient.
 * @param {string} iban The recipient's IBAN (International Bank Account Number), without spaces.
 * @param {number} amount The payment amount (e.g., 123.45).
 * @param {string} currency The currency code (e.g., "EUR"). Defaults to "EUR".
 * @param {string} reference Text for the payment reference/remittance information (max 140 chars).
 * @param {string} bic The recipient bank's BIC (SWIFT code). Optional but recommended.
 * @param {string} purposeCode SEPA purpose code (e.g., "SALA" for Salary). Optional.
 * @param {string} recipientMessage Message for the recipient (max 70 chars). Optional.
 * @param {number} size The desired size of the QR code image in pixels (e.g., 200). Defaults to 150.
 * @return {string} The URL of the generated QR code image.
 * @customfunction
 */
function setSepaQrCodeUrl(recipientName, iban, amount, currency, reference, bic, purposeCode, recipientMessage, size) {
  // --- Input Validation and Defaults ---
  if (!recipientName || !iban || typeof amount == 'undefined') {
    console.log("Data dump")
    console.log("recipientName" + recipientName + " iban: " + iban + " amount: " + amount)
    throw new Error("Recipient Name, IBAN, and Amount are required.");
  }
  iban = iban.replace(/\s/g, ''); // Remove spaces from IBAN
  currency = currency || "EUR"; // Default to EUR if not provided
  size = size || 150; // Default size
  reference = reference || ""; // Default to empty string if not provided
  bic = bic || ""; // Default to empty string if not provided
  purposeCode = purposeCode || ""; // Default to empty string
  recipientMessage = recipientMessage || ""; // Default to empty string

  if (reference.length > 140) {
    Logger.log("Warning: Reference text exceeds 140 characters and might be truncated by banks.");
    reference = reference.substring(0, 140);
  }
   if (recipientMessage.length > 70) {
    Logger.log("Warning: Recipient message exceeds 70 characters and might be truncated.");
    recipientMessage = recipientMessage.substring(0, 70);
  }

  // --- Construct SEPA EPC QR Code Data String (Version 2) ---
  let sepaData = [
    "BCD", "002", "1", "SCT", bic, recipientName, iban,
    `${currency}${amount.toFixed(2)}`, purposeCode, reference, recipientMessage, ""
  ].join("\n");

  // --- Encode Data for URL ---
  let encodedData = encodeURIComponent(sepaData);

  // --- Construct QR Code API URL ---
  let qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=${size}x${size}&ecc=M&charset-source=UTF-8`;

  // --- Return the URL ---
  return qrApiUrl;
}


/**
 * Generates a SEPA QR code and inserts it into a specific cell of a table identified by unique text.
 * NOTE: This function must be run from the script editor or triggered
 * from a Google Doc menu/button. Requires authorization.
 *
 * @param {string} tableIdentifierText The unique text present in one of the cells of the target table.
 * @param {number} targetRowIndex The 0-based index of the row *within the identified table* where the QR code should be inserted.
 * @param {number} targetCellIndex The 0-based index of the cell (column) *within the identified table* where the QR code should be inserted.
 * @param {string} docId (Optional) The ID of the Google Doc containing the table. If null, uses the currently active open document.
 * @param {string} recipientName The name of the payment recipient.
 * @param {string} iban The recipient's IBAN (International Bank Account Number), without spaces.
 * @param {number} amount The payment amount (e.g., 123.45).
 * @param {string} currency The currency code (e.g., "EUR"). Defaults to "EUR".
 * @param {string} reference Text for the payment reference/remittance information.
 * @param {string} bic The recipient bank's BIC (SWIFT code). Optional.
 * @param {string} purposeCode SEPA purpose code. Optional.
 * @param {string} recipientMessage Message for the recipient. Optional.
 * @param {number} size The desired size of the QR code image in pixels. Defaults to 150.
 */
function insertQrCodeIntoTable(tableIdentifierText, docId, recipientName, iban, amount, bic, recipientMessage, reference) {
  var targetRowIndex = 0
  var targetCellIndex = 0
  var currency = "EUR";
  var purposeCode = "";
  var size = 500;
  // Validate inputs
  if (!tableIdentifierText) {
    throw new Error("Table identifier text must be provided.");
  }
  if (targetRowIndex === null || targetRowIndex < 0 || targetCellIndex === null || targetCellIndex < 0) {
    throw new Error("Target row index and cell index must be non-negative numbers.");
  }

  try {
    // --- Generate the QR Code URL ---
    const qrCodeUrl = setSepaQrCodeUrl(recipientName, iban, amount, currency, reference, bic, purposeCode, recipientMessage, size);
    //Logger.log(`Generated QR Code URL: ${qrCodeUrl}`);

    // --- Fetch the QR Code Image ---
    const response = UrlFetchApp.fetch(qrCodeUrl);
    const newImageBlob = response.getBlob(); // Get image data as a blob

    // --- Get the Google Document ---
    let doc;
    if (docId) {
      try {
        doc = DocumentApp.openById(docId);
      } catch (e) {
        Logger.log(`Error opening document with ID ${docId}: ${e}`);
        throw new Error(`Could not open document with ID: ${docId}. Ensure ID is correct and script has permission.`);
      }
    } else {
      doc = DocumentApp.getActiveDocument();
      if (!doc) {
         throw new Error("Could not get active document. Please provide a Document ID or run from within a Google Doc.");
      }
    }
    const body = doc.getBody();

    // --- Find the Target Table by Identifier Text ---
    const tables = body.getTables();
    let targetTable = null;
    let tableFound = false;

    for (let i = 0; i < tables.length; i++) {
      const currentTable = tables[i];
      // Search within the current table for the identifier text
      for (let r = 0; r < currentTable.getNumRows(); r++) {
        for (let c = 0; c < currentTable.getRow(r).getNumCells(); c++) {
          const cell = currentTable.getCell(r, c);
          // Use trim() to ignore leading/trailing whitespace in the cell
          if (cell.getText().trim() === tableIdentifierText.trim()) {
            targetTable = currentTable;
            tableFound = true;
            //Logger.log(`Found table containing identifier "${tableIdentifierText}" at table index ${i}`);
            break; // Stop searching cells in this row
          }
        }
        if (tableFound) break; // Stop searching rows in this table
      }
      if (tableFound) break; // Stop searching tables
    }

    if (!targetTable) {
      throw new Error(`Could not find a table containing the identifier text: "${tableIdentifierText}"`);
    }

    // --- Get the Target Cell within the Found Table ---
    // Check target row index bounds
    if (0 >= targetTable.getNumRows()) {
       throw new Error(`Target row index ${0} is out of bounds for the identified table. Table only has ${targetTable.getNumRows()} rows.`);
    }
    const targetRow = targetTable.getRow(0);

     // Check target cell index bounds
     if (0 >= targetRow.getNumCells()) {
        throw new Error(`Target cell index ${0} is out of bounds for row ${0} in the identified table. Row only has ${targetRow.getNumCells()} cells.`);
     }
    const targetCell = targetTable.getCell(0, 0);

    // --- Insert the Image into the Target Cell ---
    targetCell.clear(); // Clear any existing content in the target cell
    const image = targetCell.insertImage(0, newImageBlob); // Insert image at the beginning of the cell
    //Logger.log(`Inserted QR code into identified table, Row ${0}, Cell ${0}`);

    // Optional: Set image dimensions (adjust as needed)
    const pointsSize = (size || 150) * 72 / 96; // Convert pixels to points
    const cellWidth = targetCell.getWidth();
    const imageWidth = (cellWidth && pointsSize > cellWidth) ? cellWidth * 0.95 : pointsSize; // Use 95% of cell width if image is too big
    image.setWidth(imageWidth);
    image.setHeight(imageWidth); // Keep aspect ratio square
    //Logger.log(`Applied dimensions to new image: Width=${image.getWidth()}, Height=${image.getHeight()}`);

    //Logger.log(`Successfully inserted QR Code into Table Cell in document: ${doc.getName()} (ID: ${doc.getId()})`);

  } catch (error) {
    Logger.log(`Error in insertQrCodeIntoTable: ${error}`);
    // Optional: Display error to the user if running interactively
    // DocumentApp.getUi().alert(`Error: ${error.message}`);
    throw error; // Re-throw to indicate failure
  }
}


// --- Example Usage (for testing in the Script Editor) ---
function testInsertIntoTableCellById() {
  //console.log("Starting qr code insertion test")
  // --- !!! IMPORTANT: SET THESE VALUES !!! ---
  // 1. The unique text you placed in one cell of the target table in your template:
  const tableIdentifierText = "<<QRCode>>"; // <-- SET YOUR UNIQUE IDENTIFIER TEXT HERE

  // 3. The ID of your Google Doc Template:

  const specificDocId = "1hleIUe9oL6jCWKwttAWpTFGu8OLVRz8hEJjMbtx9Pwc"; // <-- SET THE ID OF YOUR TEMPLATE DOC

  // --- Payment Details ---
  const name = "Officero Büroservice";
  const iban = "AT741912050111228010"; // Example Austrian IBAN
  const amount = 0;
  const bic = "SPBAATWW"; // Example BIC
  const message = "Vielen Dank!"; // Optional message

  // --- Basic Validation for Test ---
   if (tableIdentifierText === "{{TABLE_FOR_QR}}" || specificDocId === "YOUR_DOCUMENT_ID_HERE") {
     Logger.log("Please edit the 'testInsertIntoTableCellById' function and set the 'tableIdentifierText' and 'specificDocId' variables before running.");
     try { DocumentApp.getUi().alert("Please edit the script and set the table identifier text and Document ID in the 'testInsertIntoTableCellById' function before running."); } catch(e) { Browser.msgBox("Please edit the script and set the table identifier text and Document ID in the 'testInsertIntoTableCellById' function before running."); }
     return;
  }

  // --- Call the insertion function ---
  insertQrCodeIntoTable(
    tableIdentifierText,
    specificDocId,
    name,
    iban,
    amount,
    bic,
    message,
  );
}
