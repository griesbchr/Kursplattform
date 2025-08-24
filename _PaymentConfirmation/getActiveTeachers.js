/**
 * Main function to populate active teachers in the confirmation sheet
 * This function pulls all active teachers and adds them to the sheet for visualization
 */
function populateActiveTeachers() {
  console.log("[PC] Starting to populate active teachers");

  // Prompt user for payment number with validation
  let payment_number = null;
  const ui = SpreadsheetApp.getUi();

  while (payment_number === null) {
    const result = ui.prompt(
      "Teilzahlung auswählen",
      "Bitte Teilzahlung angeben (Nummer von 1 bis 5):",
      ui.ButtonSet.OK_CANCEL
    );

    // Check if user cancelled or clicked X
    if (result.getSelectedButton() !== ui.Button.OK) {
      console.log("[PC] User cancelled payment number input");
      return;
    }

    const userInput = result.getResponseText();

    // Validate input
    const inputNumber = parseInt(userInput);
    if (isNaN(inputNumber) || inputNumber < 1 || inputNumber > 5) {
      ui.alert("Ungültige Eingabe", "Bitte geben Sie eine Zahl zwischen 1 und 5 ein.", ui.ButtonSet.OK);
      continue;
    }

    payment_number = inputNumber;
    console.log("[PC] User selected payment number: " + payment_number);
  }

  try {
    // Get all active 2A teachers data
    var [active_teachers, no_teacherfile_teachers] = getActiveTeachers();

    if (Object.keys(active_teachers).length === 0) {
      console.log("[PC] No active teachers found");
      ui.alert("Keine Lehrer gefunden", "Keine aktiven A2-Lehrer gefunden.", ui.ButtonSet.OK);
      return;
    }

    active_teachers = TF_GET.getOpenPayments(active_teachers, payment_number);

    // Add new sheet for each request
    const sheet = createNewConfirmationSheet(payment_number);

    // Set up headers if not already present
    setupConfirmationSheetHeaders(sheet);

    // Add teachers to sheet
    addTeachersToSheet(sheet, active_teachers);

    console.log("[PC] Successfully populated " + Object.keys(active_teachers).length + " active teachers");
    ui.alert(
      "Tabelle erfolgreich erstellt",
      "Es wurden " +
        Object.keys(active_teachers).length +
        " aktive A2-Lehrer für Teilzahlung " +
        payment_number +
        " in die Tabelle eingetragen.\n\nVerwenden Sie 'E-Mails senden' um die Bestätigungs-E-Mails zu versenden.",
      ui.ButtonSet.OK
    );

    // Return the sheet name for reference
    return sheet.getName();
  } catch (error) {
    console.error("[PC] Error populating active teachers: " + error.message);
    ui.alert("Fehler aufgetreten", "Fehler beim Laden der Lehrer: " + error.message, ui.ButtonSet.OK);
  }
}

/**
 * Send confirmation emails based on data from the latest confirmation sheet
 * This function reads teacher data from the most recent confirmation sheet and sends emails
 */
function sendConfirmationEmails() {
  console.log("[PC] Starting to send confirmation emails from sheet data");

  const ui = SpreadsheetApp.getUi();

  try {
    // Find the latest confirmation sheet
    const sheet = findLatestConfirmationSheet();
    if (!sheet) {
      ui.alert(
        "Keine Bestätigungstabelle gefunden",
        "Bitte erstellen Sie zuerst eine Bestätigungstabelle mit 'Tabelle erstellen'.",
        ui.ButtonSet.OK
      );
      return;
    }

    console.log("[PC] Using confirmation sheet: " + sheet.getName());

    // Extract payment number from sheet name
    const paymentNumber = extractPaymentNumberFromSheetName(sheet.getName());
    if (!paymentNumber) {
      throw new Error("Konnte Teilzahlungsnummer aus dem Tabellennamen nicht extrahieren");
    }

    // Read teacher data from the sheet
    const teachersDict = readTeacherDataFromSheet(sheet);
    const teacherCount = Object.keys(teachersDict).length;

    if (teacherCount === 0) {
      ui.alert("Keine Lehrerdaten gefunden", "Die Bestätigungstabelle enthält keine Lehrerdaten.", ui.ButtonSet.OK);
      return;
    }

    // Confirm email sending
    const response = ui.alert(
      "E-Mails versenden bestätigen",
      `Es werden E-Mails an ${teacherCount} Lehrer für Teilzahlung ${paymentNumber} versendet.\n\nFortfahren?`,
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      console.log("[PC] Email sending cancelled by user");
      return;
    }

    // Send the emails
    const result = TF_EMAIL.sendPaymentConfirmationEmails(teachersDict, paymentNumber);

    // Update sheet with email status
    updateSheetWithEmailStatus(sheet, result.emailStatus);

    ui.alert(
      "E-Mail-Versand abgeschlossen",
      `E-Mails versendet: ${result.sent}\nFehler: ${result.failed}\n\nStatus wurde in der Tabelle aktualisiert.`,
      ui.ButtonSet.OK
    );

    console.log("[PC] Email sending completed successfully");
  } catch (error) {
    console.error("[PC] Error sending confirmation emails: " + error.message);
    ui.alert("Fehler beim E-Mail-Versand", "Fehler: " + error.message, ui.ButtonSet.OK);
  }
}

/**
 * Get active A2 teachers data using the TeacherTable getTeacherDataArray function
 * Only includes teachers with "Verrechnungsservice" = "2A" (A2 teachers)
 * @returns {Array} [activeTeachersDict, noTeacherFileTeachers] - Dict of teacher objects and array of teachers without files
 */
function getActiveTeachers() {
  console.log("[PC] Fetching active A2 teachers data");

  try {
    // Get teacher data using the TeacherTable library
    // This automatically filters for teachers with active teacher files
    const teacherInfoList = ["Vorname", "Nachname", "Email", "Verrechnungsservice"];
    const teacherDataDict = TT.getTeacherDataArray(teacherInfoList);

    var active_teacher_ids = TF_GET.getTeacherFileIDs();

    const activeTeachers = {};

    const noTeacherFileTeachers = [];

    // Process each teacher and filter for A2 teachers only
    for (const [teacherId, teacherDataArray] of Object.entries(teacherDataDict)) {
      const [firstName, lastName, email, verrechnungsservice] = teacherDataArray;

      // Only include A2 teachers (Verrechnungsservice = "2A")
      if (verrechnungsservice !== "2A") {
        continue;
      }

      // Check if teacher is active
      if (!active_teacher_ids.includes(teacherId)) {
        noTeacherFileTeachers.push(teacherId);
        continue;
      }

      activeTeachers[teacherId] = {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        status: PC_STATUS_PENDING,
        confirmationDate: "",
        lastReminder: "",
        issues: "",
      };
    }

    console.log("[PC] Found " + Object.keys(activeTeachers).length + " active A2 teachers");
    console.log("[PC] Found " + noTeacherFileTeachers.length + " A2 teachers without teacher files");

    return [activeTeachers, noTeacherFileTeachers];
  } catch (error) {
    console.error("[PC] Error fetching A2 teacher data: " + error.message);
    return [{}, []];
  }
}

/**
 * Create a new confirmation sheet with date-based name
 * @param {number} paymentNumber - The payment number to include in sheet name
 * @returns {Sheet} The newly created sheet
 */
function createNewConfirmationSheet(paymentNumber) {
  console.log("[PC] Creating new confirmation sheet");

  try {
    // Get current date and format it as DD.MM.YYYY
    const currentDate = new Date();
    const dateString = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "dd.MM.yyyy");

    // Create base sheet name with payment number and current date
    const baseSheetName = `Einzahlungsabfrage_TZ${paymentNumber}_${dateString}`;

    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Check if sheet with this name already exists and find available name
    let sheetName = baseSheetName;
    let counter = 1;

    while (spreadsheet.getSheetByName(sheetName)) {
      sheetName = `${baseSheetName}_${counter}`;
      counter++;
    }

    console.log("[PC] Creating new sheet: " + sheetName);
    const sheet = spreadsheet.insertSheet(sheetName);

    return sheet;
  } catch (error) {
    console.error("[PC] Error creating confirmation sheet: " + error.message);
    throw error;
  }
}

/**
 * Set up headers for the confirmation sheet
 * @param {Sheet} sheet - The sheet to set up
 */
function setupConfirmationSheetHeaders(sheet) {
  const headers = [
    "Lehrer-ID",
    "Lehrername",
    "Email",
    "Bestätigungsstatus",
    "Bestätigungsdatum",
    "Letzte Erinnerung",
    "Anmerkungen/Probleme",
    "Form-ID",
    "Bestätigungsemail",
    "Kurse Gesamt",
    "Offene Zahlungen",
  ];

  // Check if headers already exist
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== headers[0]) {
    console.log("[PC] Setting up sheet headers");

    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Auto-resize all columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }

    // Add data filters to the header row
    const dataRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
    dataRange.createFilter();

    // Set up default sort by teacher ID (column 1)
    const sortRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
    sortRange.sort(1); // Sort by first column (Lehrer-ID)
  }
}

/**
 * Add teachers to the confirmation sheet
 * @param {Sheet} sheet - The sheet to add data to
 * @param {Object} teachers - Dictionary of teacher objects with teacher_id as key
 */
function addTeachersToSheet(sheet, teachers) {
  console.log("[PC] Adding " + Object.keys(teachers).length + " teachers to sheet");

  // Convert dictionary to array of objects with id for sorting
  const teacherArray = Object.entries(teachers).map(([teacherId, teacherData]) => ({
    id: teacherId,
    ...teacherData,
  }));

  // Sort teachers by ID before adding to sheet
  teacherArray.sort((a, b) => a.id.localeCompare(b.id));

  const data = teacherArray.map((teacher) => [
    teacher.id,
    teacher.name,
    teacher.email,
    teacher.status,
    teacher.confirmationDate,
    teacher.lastReminder,
    teacher.issues,
    "", // Form-ID (will be populated later)
    "", // Bestätigungsemail (will be populated later)
    teacher.total_courses || 0,
    teacher.open_payments || 0,
  ]);

  // Add data starting from row 2
  const startRow = 2;
  const range = sheet.getRange(startRow, 1, data.length, data[0].length);
  range.setValues(data);

  // Apply formatting
  formatTeacherRows(sheet, startRow, data.length);

  // Auto-resize all columns after adding data
  for (let i = 1; i <= data[0].length; i++) {
    sheet.autoResizeColumn(i);
  }

  console.log("[PC] Successfully added teachers to sheet");
}

/**
 * Apply formatting to teacher rows
 * @param {Sheet} sheet - The sheet to format
 * @param {number} startRow - Starting row number
 * @param {number} numRows - Number of rows to format
 */
function formatTeacherRows(sheet, startRow, numRows) {
  const dataRange = sheet.getRange(startRow, 1, numRows, 11); // Updated to 11 columns

  // Add solid borders to all data
  dataRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

  // No background colors - keeping it clean and professional
  console.log("[PC] Applied formatting to " + numRows + " teacher rows");
}

/**
 * Find the latest confirmation sheet (most recently created)
 * @returns {Sheet|null} - Latest confirmation sheet or null if none found
 */
function findLatestConfirmationSheet() {
  console.log("[PC] Looking for latest confirmation sheet");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  let latestSheet = null;
  let latestDate = null;

  for (const sheet of sheets) {
    const sheetName = sheet.getName();

    // Check if this is a confirmation sheet
    if (sheetName.startsWith("Einzahlungsabfrage_")) {
      // Extract date from sheet name (format: Einzahlungsabfrage_TZ1_24.08.2025)
      const dateMatch = sheetName.match(/(\d{2}\.\d{2}\.\d{4})/);
      if (dateMatch) {
        const dateString = dateMatch[1];
        const [day, month, year] = dateString.split(".");
        const sheetDate = new Date(year, month - 1, day);

        if (!latestDate || sheetDate > latestDate) {
          latestDate = sheetDate;
          latestSheet = sheet;
        }
      }
    }
  }

  if (latestSheet) {
    console.log("[PC] Found latest confirmation sheet: " + latestSheet.getName());
  } else {
    console.log("[PC] No confirmation sheets found");
  }

  return latestSheet;
}

/**
 * Extract payment number from sheet name
 * @param {string} sheetName - Sheet name (e.g., "Einzahlungsabfrage_TZ1_24.08.2025")
 * @returns {number|null} - Payment number or null if not found
 */
function extractPaymentNumberFromSheetName(sheetName) {
  const match = sheetName.match(/TZ(\d+)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Read teacher data from confirmation sheet and convert to dictionary format
 * @param {Sheet} sheet - Confirmation sheet
 * @returns {Object} - Dictionary of teachers {teacherId: {name, email, ...}}
 */
function readTeacherDataFromSheet(sheet) {
  console.log("[PC] Reading teacher data from sheet: " + sheet.getName());

  const teachersDict = {};

  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      console.log("[PC] No data rows found in sheet");
      return teachersDict;
    }

    // Read all data starting from row 2 (skip header)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 11); // 11 columns
    const data = dataRange.getValues();

    for (const row of data) {
      const [
        teacherId,
        name,
        email,
        status,
        confirmationDate,
        lastReminder,
        issues,
        formId,
        confirmationEmail,
        totalCourses,
        openPayments,
      ] = row;

      if (teacherId && name && email) {
        teachersDict[teacherId] = {
          name: name,
          email: email,
          status: status || PC_STATUS_PENDING,
          confirmationDate: confirmationDate || "",
          lastReminder: lastReminder || "",
          issues: issues || "",
          formId: formId || "",
          confirmationEmail: confirmationEmail || "",
          total_courses: totalCourses || 0,
          open_payments: openPayments || 0,
        };
      }
    }

    console.log("[PC] Read " + Object.keys(teachersDict).length + " teachers from sheet");
    return teachersDict;
  } catch (error) {
    console.error("[PC] Error reading teacher data from sheet: " + error.message);
    return teachersDict;
  }
}

/**
 * Update sheet with email sending status
 * @param {Sheet} sheet - Confirmation sheet
 * @param {Object} emailStatus - Status for each teacher {teacherId: status}
 */
function updateSheetWithEmailStatus(sheet, emailStatus) {
  console.log("[PC] Updating sheet with email status");

  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;

    // Read teacher IDs from first column
    const teacherIdRange = sheet.getRange(2, 1, lastRow - 1, 1);
    const teacherIds = teacherIdRange.getValues().flat();

    // Find column for email status (confirmation email column)
    const confirmationEmailCol = 9; // Column I (Bestätigungsemail)

    // Update status for each teacher
    for (let i = 0; i < teacherIds.length; i++) {
      const teacherId = teacherIds[i];
      if (teacherId && emailStatus[teacherId]) {
        const row = i + 2; // +2 because we start from row 2
        const status = emailStatus[teacherId];
        const statusText = status === "sent" ? "E-Mail gesendet" : "Fehler beim Senden";

        sheet.getRange(row, confirmationEmailCol).setValue(statusText);
      }
    }

    console.log("[PC] Sheet updated with email status");
  } catch (error) {
    console.error("[PC] Error updating sheet with email status: " + error.message);
  }
}
