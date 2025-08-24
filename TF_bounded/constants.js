//FILENAMES AND FILES
//use names of sheets to find them to allow reordering of sheets
const STUDENTSSHEETNAME = "Schülerliste"
const ATTENDANCESHEETNAME = "Anwesenheitsliste"
const BILLINGSTUDENTSHEETNAME = "Schülerabrechnung"
const BILLINGCOURSESHEETNAME = "Lehrerabrechnung"
const BILLINGROOMSHEETNAME = "Raumbenutzungsliste"
const FORMULASSHEETNAME = "Formeln"
const DELETEDSTUDENTSSHEETNAME = "Entfernte_Schüler"

//store sheets in constants to avoid multiple calls
const TEACHERSPREADSHEET = SpreadsheetApp.getActiveSpreadsheet()
const STUDENTSSHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === STUDENTSSHEETNAME)[0]
const ATTENDANCESHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === ATTENDANCESHEETNAME)[0]
const BILLINGSTUDENTSHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === BILLINGSTUDENTSHEETNAME)[0]
const BILLINGCOURSESHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === BILLINGCOURSESHEETNAME)[0]
const BILLINGROOMSHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === BILLINGROOMSHEETNAME)[0]
const FORMULASSHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === FORMULASSHEETNAME)[0]
const DELETEDSTUDENTSSHEET = TEACHERSPREADSHEET.getSheets().filter(e => e.getName() === DELETEDSTUDENTSSHEETNAME)[0]

//URLS
const BASEURL = "https://docs.google.com/spreadsheets/d/" + TEACHERSPREADSHEET.getId() + "/edit#gid="
const STUDENTSSHEETURL = BASEURL + STUDENTSSHEET.getSheetId()
const documentProperties = PropertiesService.getScriptProperties()
const TEACHERFILESURL = documentProperties.getProperty("TF_WEBAPP_URL")

const FOR_TEACHERINFOROW = 51
const FOR_TEACHERNAMECOL = 1
const FOR_TEACHERIDCOL = 2
const TEACHERID = FORMULASSHEET.getRange(FOR_TEACHERINFOROW, FOR_TEACHERIDCOL).getValue()

const ADDSTUDENTURL = documentProperties.getProperty("TF_ADDSTU_URL") + TEACHERID
  
// CONSTANTS
//set colors
const YELLOW = "#fce8b2"
const RED = "#f4c7c3"
const GREEN = "#b7e1cd"

// status statements
//shared with ET/bounded
//Course status / Billing status
const NOCOURSEVALUE = "Kurs nicht gestartet"
const COURSESTARTEDVALUE = "Kurs läuft"
const DEREGISTEREDVALUE = "Abgemeldet"
const COURSEFINISHEDVALUE = "Kurs abgeschlossen"
const BEEINGCREATEDVALUE = "Wird erstellt"

//Messages
const SELECTSTUDENTSMESSAGE = "Bitte SchülerInnen auswählen."
const CANCELMESSAGE = "Voragang abgebrochen."
const CREATECOURSEMESSAGE = "Soll der Abrechnungsprozess für den/die folgende/n SchülerInnen wirklich eingeleitet werden? \n Dieser Prozess kann nur vom Büroservice rückgängig gemacht werden.\n\n"
const DELETESTUDENTMESSAGE = "Folgenge SchülerInnen werden aus der Schülerliste entgültig entfernt:\n\n"

// constants
const NOCOURSELOCATION = "Keine Zweigstelle"
const NOCONTACT = "Noch offen"
const ACTIVECIÒNTACT = "Aktiv"

//course types
const COURSETYPE_BASIC = "BASIC"
const COURSETYPE_PLUS = "PLUS"
const COURSETYPE_QV = "QV"
const COURSETYPE_PLUSQV = "PLUS/QV"

//ROWS AND COLS
const STU_COLNAMEROW = 5

const STU_CHECKBOXCOL = 1
const STU_FIRSTNAMECOL = 2
const STU_LASTNAMECOL = 3
const STU_BILLINGSTATUS = 4
const STU_CONTACTSTATUSCOL = 5
const STU_CKECKEDDATACHECKBOX = 6
const STU_COURSETYPECOL = 7
const STU_COURSENUMCOL = 8
const STU_COURSELOCATION = 10
const STU_BILLINGNAMECOL = 19 
const STU_IDCOL = 30

const ATT_HEADERROW = 3
const ATT_FIRSTNAMECOL = 1
const ATT_LASTNAMECOL = 2
const ATT_BILLINGHOURSCOL = 33
const ATT_CONTROLCOL = 34

const BILSTU_HEADERROW = 4
const BILSTU_IDCOL = 1

const BILCOU_TOTSTUDENTCOUNTCOL = 8
const BILCOU_TOTSTUDENTCOUNTROW = 20

const BILCOU_MAZSTUDENTCOUNTCOL = 8
const BILCOU_VOMSTUDENTCOUNTCOL = 9
const BILCOU_STUDENTCOUNTROW = 3  //for count of MAZ or VÖM

function printMetadata()
{
  console.log(SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()[0].getValue())
  console.log(SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()[1].getValue())
}