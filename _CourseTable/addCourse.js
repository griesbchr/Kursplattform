function getPaidStatusFormula(row) {
  return (
    "=if(AND(U" +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AU' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '");"' +
    PAYMENTSTATUSNOTDUE +
    '";if(AY' +
    row +
    '="abgeschlossen";if(AU' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(U' +
    row +
    "=V" +
    row +
    ';"bezahlt";"nicht bezahlt");if(AA' +
    row +
    "=AB" +
    row +
    ';"bezahlt";"nicht bezahlt"));if(AG' +
    row +
    "=AH" +
    row +
    ';"bezahlt";"nicht bezahlt"));if(AM' +
    row +
    "=AN" +
    row +
    ';"bezahlt";"nicht bezahlt"));if(AU' +
    row +
    "=AV" +
    row +
    ';"bezahlt";"nicht bezahlt"));if(AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";if(U' +
    row +
    "=V" +
    row +
    ';"bezahlt";"nicht bezahlt");if(AND(U' +
    row +
    "=V" +
    row +
    ";AA" +
    row +
    "=AB" +
    row +
    ');"bezahlt";"nicht bezahlt"));if(AND(U' +
    row +
    "=V" +
    row +
    ";AA" +
    row +
    "=AB" +
    row +
    ";AG" +
    row +
    "=AH" +
    row +
    ');"bezahlt";"nicht bezahlt"));if(AND(U' +
    row +
    "=V" +
    row +
    ";AA" +
    row +
    "=AB" +
    row +
    ";AG" +
    row +
    "=AH" +
    row +
    ";AM" +
    row +
    "=AN" +
    row +
    ');"bezahlt";"nicht bezahlt"))))'
  );
}
function getAdminFeeFormula(row) {
  return (
    "=if(NOT(OR(M" +
    row +
    "=True;IF(NOT(ISBLANK(BC" +
    row +
    "));BC" +
    row +
    "<" +
    ADMINFEEMINHOURS +
    ")));if(P" +
    row +
    '="nicht eingetragen";P' +
    row +
    ";if(P" +
    row +
    '=0;"nicht bezahlt";if(O' +
    row +
    "=P" +
    row +
    ';"bezahlt & überprüft";"falscher Betrag")));"' +
    PAYMENTSTATUSNOTDUE +
    '")'
  );
}

function getP1StatusFormula(row) {
  return (
    "=if(OR(NOT(AY" +
    row +
    '="abgeschlossen");AND(AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";NOT(U' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '")));if(U' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";U' +
    row +
    ";if(U" +
    row +
    '=0;"keine Kosten";if(U' +
    row +
    "=V" +
    row +
    ';"bezahlt";if(V' +
    row +
    '=0;"nicht bezahlt";"falscher Betrag"))));"' +
    PAYMENTSTATUSNOTDUE +
    '")'
  );
}
function getP2StatusFormula(row) {
  return (
    "=if(OR(NOT(AY" +
    row +
    '="abgeschlossen");AND(AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";NOT(AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '")));if(AA' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AA' +
    row +
    ";if(AA" +
    row +
    '=0;"keine Kosten";if(AA' +
    row +
    "=AB" +
    row +
    ';"bezahlt";if(AB' +
    row +
    '=0;"nicht bezahlt";"falscher Betrag"))));"' +
    PAYMENTSTATUSNOTDUE +
    '")'
  );
}
function getP3StatusFormula(row) {
  return (
    "=if(OR(NOT(AY" +
    row +
    '="abgeschlossen");AND(AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";NOT(AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '")));if(AG' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AG' +
    row +
    ";if(AG" +
    row +
    '=0;"keine Kosten";if(AG' +
    row +
    "=AH" +
    row +
    ';"bezahlt";if(AH' +
    row +
    '=0;"nicht bezahlt";"falscher Betrag"))));"' +
    PAYMENTSTATUSNOTDUE +
    '")'
  );
}
function getP4StatusFormula(row) {
  return (
    "=if(OR(NOT(AY" +
    row +
    '="abgeschlossen");AND(AU' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";NOT(AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '")));if(AM' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";AM' +
    row +
    ";if(AM" +
    row +
    '=0;"keine Kosten";if(AM' +
    row +
    "=AN" +
    row +
    ';"bezahlt";if(AN' +
    row +
    '=0;"nicht bezahlt";"falscher Betrag"))));"' +
    PAYMENTSTATUSNOTDUE +
    '")'
  );
}
function getP5StatusFormula(row) {
  return (
    "=if(AND(AY" +
    row +
    '="abgeschlossen";AZ' +
    row +
    '="bezahlt");"' +
    PAYMENTSTATUSNOTDUE +
    '";if(AU' +
    row +
    '="' +
    PAYMENTSTATUSNOTDUE +
    '";"' +
    PAYMENTSTATUSNOTDUE +
    '";if(AU' +
    row +
    '=0;"keine Kosten"; if(AU' +
    row +
    "=AV" +
    row +
    ';"bezahlt";if(AV' +
    row +
    '=0;"nicht bezahlt";"falscher Betrag")))))'
  );
}

function addCourseToCourseTableAndBilling(course)
{
  var course = addCourseToCourseBillingTable(course)
  course = addCourseToCourseTable(course)

  return course
}

function addCourseToCourseBillingTable(course) {
  Logger.log("[CT]Adding course with id " + course["KursID"] + " to course billing table");
  
  try {
    UTLS.lockSheet(COURSEBILLINGSHEET)
    var start_time = Math.floor(new Date().getTime() / 1000);

    var row = COURSEBILLINGSHEET.getLastRow() + 1;
    COURSEBILLINGSHEET.getRange(row, 1).setValue(course["KursID"])
    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of coursebilling")
    throw e
  } finally {
    UTLS.releaseSheetLock(COURSEBILLINGSHEET)
    var end_time = Math.floor(new Date().getTime() / 1000);
    var time_diff = end_time - start_time
    //console.log("[CT] Held billing table lock for " + time_diff + " seconds.")
  }

  //IDs
  var rich_texts = [[
    SpreadsheetApp.newRichTextValue().setText(course["KursID"]).build(),
    SpreadsheetApp.newRichTextValue().setText(course["SchuelerID"]).setLinkUrl(course["bilstu_url"]).build(),
    SpreadsheetApp.newRichTextValue().setText(course["LehrerID"]).setLinkUrl(TT.getTeacherLink(course["LehrerID"])).build()
  ]]

  COURSEBILLINGSHEET.getRange(row,1,1,3).setRichTextValues(rich_texts)

  //set required number formats
  COURSEBILLINGSHEET.getRange(row, 15).setNumberFormat("[$€]#,##0.00")

  var teacher_data = TT.getTeacherDataById(course["LehrerID"])
  var values = [
    teacher_data["Vorname"],
    teacher_data["Nachname"],
    course["S_Vorname"],
    course["S_Nachname"],
    course["Zweigstelle"],
    teacher_data["Verrechnungsservice"],
    COURSESTARTEDVALUE,
    getAdminFeeFormula(row),
    "",   //checkbox
    course["KursID"],
    getAdminFee(),
    NOTENTEREDSTATUS,
    "",
    "",
    getP1StatusFormula(row),
    course["KursID"] + "1",
    PAYMENTSTATUSNOTDUE,
    NOTENTEREDSTATUS,
    "",
    "",
    getP2StatusFormula(row),
    course["KursID"] + "2",
    PAYMENTSTATUSNOTDUE,
    NOTENTEREDSTATUS,
    "",
    "",
    getP3StatusFormula(row),
    course["KursID"] + "3",
    PAYMENTSTATUSNOTDUE,
    NOTENTEREDSTATUS,
    getP4StatusFormula(row),
    course["KursID"] + "4",
    PAYMENTSTATUSNOTDUE,
    NOTENTEREDSTATUS,
    "",
    "",
    "",   //checkbox
    "",   //checkbox
    getP5StatusFormula(row),
    course["KursID"] + "5",
    PAYMENTSTATUSNOTDUE,
    NOTENTEREDSTATUS,
    "",
    "",
    BILLINGNOTDONESTATUS,
    BILLINGNOTSENT,
    getPaidStatusFormula(row)
  ]

  COURSEBILLINGSHEET.getRange(row, 4,1,values.length).setValues([values])

  var checkbox_cols = [13, 43, 44, 54]
  for (var col of checkbox_cols)
  {
    COURSEBILLINGSHEET.getRange(row, col).insertCheckboxes()
  }

  course["coursebilling_url"] = COURSEBILLINGSHEETBASEURL + "&range=" + row + ":" + row;

  return course;
}

function addCourseToCourseTable(course) {
  Logger.log("[CT]Adding course with id " + course["KursID"] + " to course table");

  //add some attributes
  course["course_start"] = Utilities.formatDate(new Date(), COURSETABLESS.getSpreadsheetTimeZone(), "dd.MM.yyyy");
  course["course_end"] = DATA.getCourseEnd();

  try {
    UTLS.lockSheet(COURSESHEET)
    var start_time = Math.floor(new Date().getTime() / 1000);

    var row = COURSESHEET.getLastRow() + 1;

    // Insert rich texts
    COURSESHEET.getRange(row, 1).setValue(course["KursID"])
    SpreadsheetApp.flush();

  } catch (e) {
    console.log("error in catch of course table")
    throw e
  } finally {
    UTLS.releaseSheetLock(COURSESHEET)
    var end_time = Math.floor(new Date().getTime() / 1000);
    var time_diff = end_time - start_time
    //console.log("[CT] Held course table lock for " + time_diff + " seconds.")
  }
  var rich_texts = [[
    SpreadsheetApp.newRichTextValue().setText(course["KursID"]).setLinkUrl(course["coursebilling_url"]).build(),
    SpreadsheetApp.newRichTextValue().setText(course["SchuelerID"]).setLinkUrl(course["studentlist_url"]).build(),
    SpreadsheetApp.newRichTextValue().setText(course["LehrerID"]).setLinkUrl(TT.getTeacherLink(course["LehrerID"])).build()
    ]]
    // Insert rich texts
    COURSESHEET.getRange(row,1,1,3).setRichTextValues(rich_texts)

  var teacher_data = TT.getTeacherDataById(course["LehrerID"])

  //Insert value fields
  var values = [
    teacher_data["Vorname"],
    teacher_data["Nachname"],
    teacher_data["Email"],
    course["S_Vorname"],
    course["S_Nachname"],
    course["Zweigstelle"],
    course["Verein"],
    course["Instrument"],
    course["Kursart"],
    course["Kursnummer"],
    course["Kursmodus"],
    COURSESTARTEDVALUE,
    course["Anmeldungen"],
    course["course_end"],
    course["course_start"],
    "         ", //Notes
    course["Telefon_mobil"],
    course["Telefon_Vormittag"],
    course["EMail"],
    course["Geburtsdatum"],
    course["Schule_Klasse"],
    course["Rechnungs_Mail"],
    course["Rechnungsname"],
    course["Rechnungsadresse"],
    course["Rechnungsort"],
    course["Rechnungs_PLZ"],
    course["Wohngemeinde"]
    ]

  //set required formats
  var set_number_format_cols = [20, 21, 29]
  for (var col of set_number_format_cols)
  {
    COURSESHEET.getRange(row,col).setNumberFormat("@")
  }

  //set values
  COURSESHEET.getRange(row,4,1,values.length).setValues([values])
  

  let url = COURSESHEETBASEURL + "&range=" + row + ":" + row;

  //get rich text from other sheet and copy it with new url set
  let rich_text = COURSEBILLINGSHEET.getRange(getCourseBillingRow(course["KursID"]), COURSEIDCOL)
    .getRichTextValue()
    .copy()
    .setLinkUrl(url)
    .build();

  //set newly created rich text to other sheet
  COURSEBILLINGSHEET.getRange(getCourseBillingRow(course["KursID"]), COURSEIDCOL).setRichTextValue(rich_text);

  return course;
}

