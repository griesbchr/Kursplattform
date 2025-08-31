//Logger.log("Load TF")
//DriveApp.addFile("") //Uncomment this if authorization is needed!
//----------------------------SCRIPT IDS-----------------------------
TEACHERFILES_BOUNDED_LIB_ID = "1akJt9TwlpTUi-_hljndKoPAKbD-ifUxwHH-nVBocY3hA6lqLP7_hyYHI";

//----------------------------TEACHERDRIVES-----------------------------
const TEMPLATEFILENAME = "Lehrernummer_Name";
const TEMPLATEFILEID = "1xICz83nMoSDBHo__WAczzq-PRf-UPPnmUO2pgws4Kbg";
const TEMPLATEFILE = DriveApp.getFilesByName(TEMPLATEFILENAME).next();

const TEACHERSFOLDERNAME = "Lehrerdateien";
const TEACHERFILESFOLDER = DriveApp.getFoldersByName(TEACHERSFOLDERNAME).next();
function getTeacherFilesFolder() {
  return TEACHERFILESFOLDER;
}

const ARCHIEVFOLDERNAME = "Archiv";
const ARCHIEVFOLDER = DriveApp.getFoldersByName(ARCHIEVFOLDERNAME).next();
const ARCHIVEFOLDERID = "1_kLXIfPRkGY1i7uxNAcVmPS0M9SxFju5";

const COURSECONTRACTTEMPLATEFILENAME = "Anmeldeformular_Template";
const COURSECONTRACTTEMPLATEFILE = DriveApp.getFilesByName(COURSECONTRACTTEMPLATEFILENAME).next();

//---------------------------TEACHERFILES--------------------------------
const EDITORSMAILLIST = [
  "griesbacher@kursplattform.at",
  "stefan.schusteritsch@aon.at",
  "info@mazgraz.at",
  "daniel.muhr93@gmail.com",
];
const ROOMPAYMENTREFERENCE = "Raumbenutzungsgebühr Musikunterricht";

//shared with ET/bounded
//Course status / Billing status
const NOCOURSEVALUE = "Kurs nicht gestartet";
const COURSESTARTINGVALUE = "Kurs wird gestartet";
const COURSESTARTEDVALUE = "Kurs läuft";
const DEREGISTEREDVALUE = "Abgemeldet";
const COURSEFINISHEDVALUE = "Kurs abgeschlossen";

const NOCONTACTSTATUS = "Noch offen";

//set colors
const WHITE = "#ffffff";
const YELLOW = "#fce8b2";
const RED = "#f4c7c3";
const GREEN = "#b7e1cd";
const CANNOTCHANGECOLOR = "#999999"; //dark grey 2
const HYPERLINKCOLOR = "#4285f4";

//Copy from teacherfiles_bounded
//use names of sheets to find them to allow reordering of sheets
const STUDENTSSHEETNAME = "Schülerliste";
const ATTENDANCESHEETNAME = "Anwesenheitsliste";
const BILLINGSTUDENTSHEETNAME = "Schülerabrechnung";
const BILLINGCOURSESHEETNAME = "Lehrerabrechnung";
const ROOMUSAGESHEETNAME = "Raumbenutzungsliste";
const FORMULASSHEETNAME = "Formeln";

const REGISTRATIONLINKTEXT = "Klicken Sie hier um SchülerInnen hinzuzufügen";
const REGISTRATIONLINKROW = 2;
const REGISTRATIONLINKCOL = 2;

const TRIALLESSONS = 3;
const TRIALNAME = "Schnupperkurs";

const NOCOURSEBILLINGNUMBER = "-";

//indirect cell addressing strings
const THISCELL = "INDIRECT(ADDRESS(ROW();COLUMN()))";
const LEFTCELL = "INDIRECT(ADDRESS(ROW();COLUMN()-1))";
const LEFTCELL2 = "INDIRECT(ADDRESS(ROW();COLUMN()-2))";
const RIGHTCELL = "INDIRECT(ADDRESS(ROW();COLUMN()+1))";

//amount that still counts as equal
const LIMITAMOUNT = 10;

//maxlessons
const MAXLESSONS = 30;

const GROUPLESSONS = 21;

//update Teacher File
//update billing sheet parameters
const COURSENUMBERCOL = 2;
const COURSENUMBERROW = 4;
const COURSENUMBERLEN = 15;

const CLUBCOL1 = 3;
const CLUBROW1 = 4;
const CLUBLEN1 = 15;
const CLUBCOL2 = 2;
const CLUBROW2 = 21;
const CLUBLEN2 = 10;

const DISTROW = 3;
const DISTCOL = 1;
const DISTLEN = 17;

const PARAMETERSNAMEROW = 1;
const PARAMETERSVALUEROW = 2;

// ---------------------------------------Billing cols and rows------------------------------
const ROOMRENTATSTUDENTNAME = "Bei Schueler";
const ROOMRENTATSTUDENT = 3;
const ROOMRENTATTEACHERNAME = "Bei Lehrer";
const ROOMRENTATTEACHER = 0;
const ROOMRENTATCOURSELOCATIONNAME = "Am Kursort";

const BILLINGNOTDONESTATUS = "nicht abgeschlossen";
const BILLINGDONESTATUS = "abgeschlossen";

const PAYMENTSTATUSNOTDUE = "nicht verrechnet";
const PAYMENTSTATUSDUE = "fällig";

const NOCONTRACTSTATUS = "Anmeldung nicht vorhanden";

const NOPREREGSTATUS = "keine Voranmeldung";

const NODOSTRICT = "Keine Zweigstelle";

const PAYMENT1DUECOL = 21;
const PAYMENT1PAIDCOL = 22;
const PAYMENT1DATECOL = 23;

const PAYMENT2DUECOL = 24;
const PAYMENT2PAIDCOL = 25;
const PAYMENT2DATECOL = 26;

const PAYMENT3DUECOL = 27;
const PAYMENT3PAIDCOL = 28;
const PAYMENT3DATECOL = 29;

const INFRAFEECOL = 30;
const PAYMENT4DUECOL = 31;
const PAYMENT4PAIDCOL = 32;
const PAYMENT4DATECOL = 33;

const REMINDERFEECOL = 34;
const SALDOPAYMENTDUECOL = 35;
const SALDOPAYMENTPAIDCOL = 36;
const SALDOPAYMENTDATECOL = 37;

const BILLINGSTATUSCOL = 38;
const PARTIALPAYMENTAMOUNTCOL = 12;
const EXPECTEDAMOUNTCOL = 15;
const EXPECTEDSALDOCOL = 16;
const SALDOAMOUNTCOL = 20;

const COURSEDUECOL = 10;
const ASSROW = 22;
const OFFICEROW = 30;
const ROOMROW = 37;

const BILTEA_ROOMBILLING_FIRSTROW = 37;
const BILTEA_ROOMBILLING_LASTROW = 126;
const BILTEA_ROOMBILLING_FIRSTCOL = 1;
const BILTEA_ROOMBILLING_LASTCOL = 6;
//-----------------------------------------Copied from teacherfiles_bounded-------------------------------------------------------------
//shared with bounded
const STU_COLNAMEROW = 5;

const STU_STATUSFIELDLENGTH = 3;
const STU_COURSEPARAMLENGTH = 4;
const STU_REGISTRATIONSTATUSLENGTH = 2;

const STU_CHECKBOXCOL = 1;
const STU_FIRSTNAMECOL = 2;
const STU_LASTNAMECOL = 3;
const STU_BILLINGSTATUS = 4;
const STU_CONTACTSTATUSCOL = 5;
const STU_CKECKEDDATACHECKBOX = 6;
const STU_REGISTRATIONSTATUSCOL = 12;
const STU_PREREGISTRATIONSTATUSCOL = 13;
const STU_COMMENTSCOL = 14;
const STU_IDCOL = 30;
const STU_COURSEIDCOL = 31;
const STU_COURSEPARAMSTARTINGCOL = 7;

const ATT_HEADERROW = 5;
const ATT_FIRSTNAMECOL = 1;
const ATT_LASTNAMECOL = 2;
const ATT_COURSESTARTDATECOL = 3;
const ATT_COURSEFIELDSLEN = 30;
const ATT_NOCOURSELOCATIONHOURSCOL = 33;
const ATT_EXPECTEDHOURSCOL = 34;
const ATT_ACTUALHOURSCOL = 35;
const ATT_COURSEIDCOL = 36;

const BILSTU_HEADERROW = 4;
const BILSTU_COURSEIDCOL = 1;
const BILSTU_PRICEPERHOURCOL = 13;
const BILSTU_INTENDEDHOURSCOL = 14;
const BILSTU_EXPECTEDAMOUNTDUECOL = 15;
const BILSTU_EXPECTEDSALDODUECOL = 16;
const BILSTU_ACTUALHOURSCOL = 17;
const BILSTU_CURRENTTOTALDUEAMOUNTCOL = 18;
const BILSTU_CURRENTTOTALPAIDAMOUNTCOL = 19;
const BILSTU_CURRENTSALDOAMOUNTCOL = 20;
const BILSTU_BILLINGSTATUSCOL = 48;
const LEN_DISTRICTLIST = 90;

const BILCOU_HEADERROW = 36;
const BILCOU_ROOM_DISTCOL = 1;
const BILCOU_PAY_DISTCOL = 8;
const BILCOU_ROOMPAYMENTDUECOL = 10;
const BILCOU_PAY_RECCOL = 14;
const BILCOU_PAY_REFCOL = 15;
const BILCOU_PAY_IBANCOL = 16;
const BILCOU_ASSOCSERVICESKINDCOL = 1;
const BILCOU_ASSOCSERVICESHEADERROW = 3;
const BILCOU_ASSOCSERVICESWRITECOLLEN = 5;

const BILCOU_ROOMBILLINGSTUDENTNAMECOL = 2;
const BILCOU_ROOMBILLINGSTARTINGCOL = 1;
const BILCOU_ROOMBILLINGCOLCOUNT = 6;

const BILCOU_NUMSTUDENTSCOL = 8;
const BILCOU_NUMSTUDENTSROW = 30;

const FOR_TEACHERINFOROW = 51;
const FOR_TEACHERNAMECOL = 1;
const FOR_TEACHERIDCOL = 2;
const FOR_BILLCYCLE = 3;

// ----------------------------------------- Roomusage ------------------------------------------
const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const ROOM_FIRSTROW = 5;
const ROOM_NAMECOL = 1;
const ROOM_DISTRICTSCOL = 2;
const ROOM_INSTRUMENTCOL = 3;
const ROOM_DAYCOL = 4;
const ROOM_ROOMCOL = 8;
