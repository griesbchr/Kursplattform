function onOpenInstallable()
{
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Schüler verwalten")
    .addItem("Leere Schüler hinzufügen", "addEmptyStudents")
    .addItem("Schüler an Lehrer zuteilen", "shareMarkedStudents")
    .addSeparator()
    .addItem("Anmeldungen einholen", "fetchNewEnrollments")
    .addToUi();
  ui.createMenu("Tabelle aktualisieren")
    .addItem("Kontaktstatus aktualisieren", "updateContactStatus")
    .addItem("Kontaktstatus Statistik aktualisieren", "getAllContactStatus")
    .addSeparator()
    .addItem("Neue Zeigstellen und Lehrer in Liste laden", "updateTable")
    .addToUi();
  ui.createMenu("Funktionen")
    .addItem("Doppelte Anmeldungen finden", "fineNameDuplicates")
    .addItem("Mail", "showFormInSidebar")
    .addToUi();
  ui.createMenu("Wiederanmeldungen")
    .addItem("Wiederanmeldungen eintragen", "updatePreRegistrations")
    .addToUi();

  getNumberOfEnrollments()
}

const SHEET = SpreadsheetApp.getActiveSheet()
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet()
const SHARESTUDENTSMESSAGE = "Sollen alle markierten Schüler an die zugeteilten Lehrer freigegeben werden?"


//---------------- end authorization------------------------

function shareMarkedStudents() {
  let checked_rows = UTLS.getCheckedRows(ENROLLMENTSHEET, SHARECHECKBOXCOL) 

  var result = SpreadsheetApp.getUi().alert(SHARESTUDENTSMESSAGE+"\r\nDerzeit sind "+checked_rows.length+" Schüler markiert.", SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)
  if (result == "CANCEL")
  {
    SPREADSHEET.toast("Vorgang abgebrochen");
  }  else
  {
    //check if fields are set
    SPREADSHEET.toast("Schüler werden an Lehrer Freigegeben")
    let shared_rows = shareCheckedStudents()
    SPREADSHEET.toast("Schüler in folgenden Reihen wurden den Lehrern freigegeben: " + shared_rows)
  }
}

function updateTable()
{
  SPREADSHEET.toast("Tabelle wird aktualisiert")
  updateDropDowns()
}

function fetchNewEnrollments()
{
  SPREADSHEET.toast("Mails werden nach neuen Anmeldungen durchsucht")
  API.postTFApi("fetch_mails", {})
  //let num_students = updateEnrollments()
  //SPREADSHEET.toast("Es wurden " + String(num_students) + " neue Anmeldungen hinzugefügt.")
}

function addEmptyStudents()
{
  var num_students_string = Browser.inputBox("Wieviele Schüler sollen angelegt werden?")
  num_students = Number(num_students_string)
  addEmptyStudents_(num_students)
  SPREADSHEET.toast("Es wurden " + String(num_students) + " leere Schüler hinzugefügt.")
  Logger.log("[ET]Finished adding " + num_students + " students")

}
function addStudentTest()
{
  addEmptyStudents_(2)

}


