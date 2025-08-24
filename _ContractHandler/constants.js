const TEMPLATECONTRACTFILENAME = "Anmeldeformular_Template"
const TEMPLATECONTRACTFILE = DriveApp.getFilesByName(TEMPLATECONTRACTFILENAME).next()

const CONTRACTFILEFOLDERNAME = "Anmeldeformulare"
const CONTRACTFILEFOLDER = DriveApp.getFoldersByName(CONTRACTFILEFOLDERNAME).next()

const DATAFILENAME = "Anmeldung_Daten"
const DATASHEETNAME = "Anmeldung_Daten"
const DATAFILE = DriveApp.getFilesByName(DATAFILENAME).next()

const PARAMROW = 1
const BASICROW = 6
const PLUSQVROW = 10
const QVROW = 14
const INTENSIVROW = 18
const PREMIUMROW = 22

const COURSENUMBERCOL = 1
const COURSEPARIALPAYMENTCOL = 7
const COURSESTARTINGROW = 43
const COURSEROWLEN = 14

const GROUPCOURSEROW = 61
const GROUPCOURSENR = 10

const BASIC = "BASIC"
const PLUS = "PLUS"
const QV = "QV"
const PLUSQV = "PLUS/QV"
const INTENSIV = "INTENSIV"
const PREMIUM = "PREMIUM"

const ATSTUDENT = "Bei Schueler"
const ATTEACHER = "Bei Lehrer"
const ATCOURSELOC = "Am Kursort"