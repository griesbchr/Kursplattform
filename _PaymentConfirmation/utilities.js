/**
 * Utility functions for Payment Confirmation system
 * These functions provide common operations used throughout the system
 */

/**
 * Get current date formatted for Austrian locale
 * @param {boolean} includeTime - Whether to include time in the format
 * @returns {string} Formatted date string
 */
function getCurrentFormattedDate(includeTime = false) {
  const now = new Date();
  const format = includeTime ? PC_DATETIME_FORMAT : PC_DATE_FORMAT;
  return Utilities.formatDate(now, PC_TIMEZONE, format);
}

/**
 * Validate teacher ID format
 * @param {string} teacherId - The teacher ID to validate
 * @returns {boolean} True if valid
 */
function isValidTeacherId(teacherId) {
  if (!teacherId || typeof teacherId !== "string") {
    return false;
  }

  const trimmedId = teacherId.trim();
  return trimmedId.length >= PC_MIN_TEACHER_ID_LENGTH && trimmedId.length <= PC_MAX_TEACHER_ID_LENGTH;
}

/**
 * Validate email address format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") {
    return false;
  }

  return email.includes(PC_REQUIRED_EMAIL_DOMAIN) && email.includes(".");
}

/**
 * Log message with consistent formatting
 * @param {string} message - The message to log
 * @param {string} level - Log level (INFO, WARN, ERROR)
 */
function logMessage(message, level = "INFO") {
  const timestamp = getCurrentFormattedDate(true);
  const logEntry = `${PC_LOG_PREFIX} [${level}] ${timestamp} - ${message}`;

  if (level === "ERROR") {
    console.error(logEntry);
  } else if (level === "WARN") {
    console.warn(logEntry);
  } else {
    console.log(logEntry);
  }
}

/**
 * Show toast message to user with consistent formatting
 * @param {string} message - The message to display
 * @param {string} title - Toast title
 * @param {number} timeout - Display timeout in seconds
 */
function showToast(message, title = "Information", timeout = 3) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(message, title, timeout);
  } catch (error) {
    logMessage("Failed to show toast: " + error.message, "ERROR");
  }
}

/**
 * Calculate days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days difference
 */
function daysBetween(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((endDate - startDate) / oneDay));
}

/**
 * Check if a reminder should be sent based on last reminder date
 * @param {Date} lastReminderDate - Date of last reminder
 * @returns {boolean} True if reminder should be sent
 */
function shouldSendReminder(lastReminderDate) {
  if (!lastReminderDate) {
    return true; // Never sent a reminder
  }

  const now = new Date();
  const daysSinceReminder = daysBetween(lastReminderDate, now);

  return daysSinceReminder >= PC_REMINDER_INTERVAL_DAYS;
}

/**
 * Check if a confirmation is overdue
 * @param {Date} requestDate - Date when confirmation was requested
 * @returns {boolean} True if overdue
 */
function isConfirmationOverdue(requestDate) {
  if (!requestDate) {
    return false;
  }

  const now = new Date();
  const daysSinceRequest = daysBetween(requestDate, now);

  return daysSinceRequest >= PC_OVERDUE_THRESHOLD_DAYS;
}

/**
 * Get next available sheet name with date
 * @param {string} prefix - Sheet name prefix
 * @returns {string} Available sheet name
 */
function getNextAvailableSheetName(prefix = PC_SHEET_NAME_PREFIX) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dateString = getCurrentFormattedDate();

  let baseName = `${prefix}${dateString}`;
  let counter = 1;
  let sheetName = baseName;

  while (spreadsheet.getSheetByName(sheetName)) {
    sheetName = `${baseName}_${counter}`;
    counter++;
  }

  return sheetName;
}

/**
 * Safely get cell value and convert to string
 * @param {Sheet} sheet - The sheet object
 * @param {number} row - Row number
 * @param {number} col - Column number
 * @returns {string} Cell value as string
 */
function getSafeCellValue(sheet, row, col) {
  try {
    const value = sheet.getRange(row, col).getValue();
    return value ? value.toString().trim() : "";
  } catch (error) {
    logMessage(`Error getting cell value at ${row},${col}: ${error.message}`, "ERROR");
    return "";
  }
}

/**
 * Safely set cell value with error handling
 * @param {Sheet} sheet - The sheet object
 * @param {number} row - Row number
 * @param {number} col - Column number
 * @param {*} value - Value to set
 */
function setSafeCellValue(sheet, row, col, value) {
  try {
    sheet.getRange(row, col).setValue(value);
  } catch (error) {
    logMessage(`Error setting cell value at ${row},${col}: ${error.message}`, "ERROR");
  }
}

/**
 * Create a backup of the current sheet state
 * @param {Sheet} sheet - Sheet to backup
 * @returns {string} Backup sheet name
 */
function createSheetBackup(sheet) {
  try {
    const timestamp = getCurrentFormattedDate(true).replace(/[.:]/g, "-");
    const backupName = `Backup_${sheet.getName()}_${timestamp}`;

    const backup = sheet.copyTo(SpreadsheetApp.getActiveSpreadsheet());
    backup.setName(backupName);

    logMessage(`Created backup sheet: ${backupName}`, "INFO");
    return backupName;
  } catch (error) {
    logMessage(`Failed to create backup: ${error.message}`, "ERROR");
    return null;
  }
}

/**
 * Count non-empty rows in a sheet
 * @param {Sheet} sheet - Sheet to count
 * @param {number} startRow - Starting row (default 2 to skip header)
 * @returns {number} Number of non-empty rows
 */
function countNonEmptyRows(sheet, startRow = PC_DATA_START_ROW) {
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < startRow) {
      return 0;
    }

    const data = sheet.getRange(startRow, 1, lastRow - startRow + 1, 1).getValues();
    return data.filter((row) => row[0] && row[0].toString().trim() !== "").length;
  } catch (error) {
    logMessage(`Error counting rows: ${error.message}`, "ERROR");
    return 0;
  }
}
