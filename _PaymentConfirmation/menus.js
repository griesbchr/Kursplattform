/**
 * Create custom menu for Payment Confirmation functions
 */
function onOpenInstallable() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu(PC_MENU_TITLE)
    .addItem(PC_MENU_CREATE_QUERY, "populateActiveTeachers")
    .addSeparator()
    .addItem(PC_MENU_START_CONFIRMATION, "initiateBatchConfirmation")
    .addItem(PC_MENU_CHECK_STATUS, "checkConfirmationStatus")
    .addSeparator()
    .addItem(PC_MENU_SEND_REMINDERS, "sendReminders")
    .addItem(PC_MENU_TEST_FUNCTION, "test_populateActiveTeachers")
    .addToUi();
}

/**
 * Placeholder functions for future implementation
 */
function initiateBatchConfirmation() {
  SpreadsheetApp.getActiveSpreadsheet().toast(PC_TOAST_NOT_IMPLEMENTED, PC_TOAST_TITLE_INFO, PC_TOAST_DURATION);
}

function checkConfirmationStatus() {
  SpreadsheetApp.getActiveSpreadsheet().toast(PC_TOAST_NOT_IMPLEMENTED, PC_TOAST_TITLE_INFO, PC_TOAST_DURATION);
}

function sendReminders() {
  SpreadsheetApp.getActiveSpreadsheet().toast(PC_TOAST_NOT_IMPLEMENTED, PC_TOAST_TITLE_INFO, PC_TOAST_DURATION);
}
