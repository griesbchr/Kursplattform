//Logger.log("Load TT")

//FILES AND FILENAMES
const TEACHERTABLEFILENAME = "Lehrerliste";
const TEACHERSS = UTLS.getFile(TEACHERTABLEFILENAME);
const TEACHERSHEET = TEACHERSS.getSheetByName("Lehrertabelle");

//const TEACHERFILESURL = SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata()[0].getValue()
//URLS
const BASEURL =
  "https://docs.google.com/spreadsheets/d/" +
  TEACHERSHEET.getParent().getId() +
  "/edit#gid=" +
  TEACHERSHEET.getSheetId();

//CONSTANTS
//messages
const CREATEMESSAGE = "Sollen Lehrer-Drives für die folgenden Lehrer erstellt werden?";
const NOMISSINGDRIVESMESSAGE = "Es konnten keine fehlenden Lehrerdateien gefunden werden.";

//set colors
const YELLOW = "#fce8b2";
const RED = "#f4c7c3";
const GREEN = "#b7e1cd";

//ROWS AND COLS
const IDLEN = 3;

const IDCOL = 1;
const DRIVESTATUSCOL = 2;
const LASTMODDATECOL = 4;
const ADDRESSINGCOL = 5;
const FIRSTNAMECOL = 6;
const LASTNAMECOL = 7;
const EMAILCOL = 8;
const BILLINGSERVICECOL = 12;
const HEADINGROWS = 1;
const BILLINGNUMBERCOL = 27;
const TEACHERFILEIDCOL = 28;
