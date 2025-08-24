/**
 * Increments the billing number for a teacher.
 *
 * @param {string} teacher_id - The ID of the teacher.
 * @returns {number} - The new, incremented billing number.
 */
function incrementBillingNumber(teacher_id) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // wait 10 seconds before conceding defeat.
  var billingNumber = getBillingNumber(teacher_id);
  //Set to zero if not set yet
  if (billingNumber == "") {
    billingNumber = 0;
  }
  //parse to int
  billingNumber = parseInt(billingNumber);
  //increment
  billingNumber++;
  setBillingNumber(teacher_id, billingNumber);
  SpreadsheetApp.flush();
  lock.releaseLock();

  //pad to 4 digits
  billingNumber = billingNumber.toString();
  while (billingNumber.length < 4) {
    billingNumber = "0" + billingNumber;
  }

  return billingNumber;
}
