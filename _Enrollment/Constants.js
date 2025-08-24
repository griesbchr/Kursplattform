//Logger.log("Load ET")

//NAMES AND SHEETS
const ENROLLMENTFILENAME = "Anmeldeliste"
const ENROLLMENTFILE = UTLS.getFile(ENROLLMENTFILENAME)
const ENROLLMENTSHEET = ENROLLMENTFILE.getSheetByName("Anmeldeliste")
const PREREGSHEET = ENROLLMENTFILE.getSheetByName("Wiederanmeldungen")
const CONTACTSTATUSSHEET = ENROLLMENTFILE.getSheetByName("Statistik_Formeln")

//CONSTANTS
//set colors
const YELLOW = "#fce8b2"
const RED = "#f4c7c3"
const GREEN = "#b7e1cd"

//STATUS STATMENTS
const NOTEACHERVALUE = "Kein Lehrer"
const NODISTRICTVALUE = "Keine Zweigstelle"

//shared with TF
const NOCOURSEVALUE = "Kein Kurs"
const COURSESTARTEDVALUE = "Kurs läuft"
const DEREGISTEREDVALUE = "Abgemeldet"

//shared with MAIL
const NOTSHAREDVALUE = "Kein Lehrer zugeteilt"

//Contact status
const NOCONTACT = "Noch offen"
const ACTIVECONTACT = "Aktiv"

//PREREGSTATUS
const ONLINEPREREGSTATUS = "formlose Voranmeldung"

//ROWS AND COLS
const HEADERROWS = 1
const FIRSTDATAROW = 2
const COLNAMEROW = 1
const SELECTCOL = 1
const SHARECHECKBOXCOL = 2
const HANDLINGDONECOL = 3
const NOTESCOL = 4
const CONTACTSTATUSCOL = 5
const COURSESTATUSCOL = 6
const TEACHERCOL = 7
const DISTRICTCOL = 8
const COURSECONTRACTSTATUSCOL = 9
const PREREGISTRATIONCOL = 10
const COMMENTSCOL = 19;
const MAILCOL = 25
const STUDENTIDCOL = 34
const SCRIPTINFOCOL = 35
