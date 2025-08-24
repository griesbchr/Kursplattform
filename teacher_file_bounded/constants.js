const CLICKTIME = new Date().getTime(); // Get current time in milliseconds

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
//read metadat
var metadata_list = SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()
var metadata = {}
for (metadata_item of metadata_list)
{
  metadata[metadata_item.getKey()] = metadata_item.getValue()
}
const TEACHERFILESURL = metadata["TF_WEBAPP_URL"]
const ADDSTUDENTURL = metadata["TF_ADDSTU_URL"]
  
// CONSTANTS
//set colors
const YELLOW = "#fce8b2"
const RED = "#f4c7c3"
const GREEN = "#b7e1cd"

const COOLDOWNPERIOD = 7;   //5 seconds between button clicks
// status statements
//shared with ET/bounded
//Course status / Billing status
const NOCOURSEVALUE = "Kurs nicht gestartet"
const COURSESTARTEDVALUE = "Kurs läuft"
const DEREGISTEREDVALUE = "Abgemeldet"
const COURSEFINISHEDVALUE = "Kurs abgeschlossen"
const BEEINGCREATEDVALUE = "Wird erstellt"

const NOPAYMENTDUEVALUE = "nicht verrechnet"
//Messages
const SELECTSTUDENTSMESSAGE = "Bitte SchülerInnen auswählen."
const CANCELMESSAGE = "Voragang abgebrochen."
const CREATECOURSEMESSAGE = "Soll der Abrechnungsprozess für den/die folgende/n SchülerInnen wirklich eingeleitet werden?\n\n"
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
const COURSETYPE_PREMIUM = "PREMIUM"
const COURSETYPE_INTENSIV = "INTENSIV"

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
const STU_STUDENTIDCOL = 30
const STU_COURSEIDCOL = 31
const STU_COURSEPARAMSTARTINGCOL = 7;
const STU_COURSEPARAMLENGTH = 4;

const ATT_HEADERROW = 3
const ATT_FIRSTNAMECOL = 1
const ATT_LASTNAMECOL = 2
const ATT_CURRENTHOURSCOL = 35
const ATT_COURSEIDCOL = 36

const BILSTU_HEADERROW = 4
const BILSTU_IDCOL = 1
const BILSTU_COURSEIDCOL = 1
const BILSTU_FIRSTNAMECOL = 2
const BILSTU_LASTNAMECOL = 3
const BILSTU_PAYMENT1DUECOL = 21
const BILSTU_PAYMENT2DUECOL = 24
const BILSTU_PAYMENT3DUECOL = 27
const BILSTU_PAYMENT4DUECOL = 31
const BILSTU_PAYMENT5DUECOL = 35

const BILCOU_TOTSTUDENTCOUNTCOL = 8
const BILCOU_TOTSTUDENTCOUNTROW = 20

const BILCOU_MAZSTUDENTCOUNTCOL = 8
const BILCOU_VOMSTUDENTCOUNTCOL = 9
const BILCOU_STUDENTCOUNTROW = 3  //for count of MAZ or VÖM

const FOR_TEACHERINFOROW = 51
const FOR_TEACHERNAMECOL = 1
const FOR_TEACHERIDCOL = 2

const MAXSTUDENTS = 8     //8 courses with 2 courses per worker = max 4 workers per teacher (out of ~15 workers reserved for course starts)
const MAX_DEREG_STUDENTS = 3  //max 3 students to prevent timeout
const MAX_RETURN_STUDENTS = 3
function printMetadata()
{
  console.log(SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()[0].getValue())
  console.log(SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()[1].getValue())
}