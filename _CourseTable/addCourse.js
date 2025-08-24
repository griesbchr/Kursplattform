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
function addCourseToCourseBillingTable(course) {
  Logger.log("[CT]Adding course with id " + course["KursID"] + " to course billing table");
  
  try {
    var sheet_id = COURSEBILLINGSHEET.getSheetId()
    UTLS.lockSheet(sheet_id)
    var start_time = Math.floor(new Date().getTime() / 1000);

    var row = COURSEBILLINGSHEET.getLastRow() + 1;
    COURSEBILLINGSHEET.getRange(row, 1).setValue(course["KursID"])
    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of coursebilling")
    throw e
  } finally {
    UTLS.releaseSheetLock(sheet_id)
    var end_time = Math.floor(new Date().getTime() / 1000);
    var time_diff = end_time - start_time
    //console.log("[CT] Held billing table lock for " + time_diff + " seconds.")
  }

  //IDs
  COURSEBILLINGSHEET.getRange(row, 1).setRichTextValue(
    SpreadsheetApp.newRichTextValue()
      .setText(course["KursID"])
      //url will be set in coursetable function
      .build()
  );
  COURSEBILLINGSHEET.getRange(row, 2).setRichTextValue(
    SpreadsheetApp.newRichTextValue().setText(course["SchuelerID"]).setLinkUrl(course["bilstu_url"]).build()
  );
  COURSEBILLINGSHEET.getRange(row, 3).setRichTextValue(
    SpreadsheetApp.newRichTextValue()
      .setText(course["LehrerID"])
      .setLinkUrl(TT.getTeacherLink(course["LehrerID"]))
      .build()
  );


  let call_list = {
    //Kursinfo
    "Lehrer Vorname": COURSEBILLINGSHEET.getRange(row, 4).setValue(TT.getTeacherFirstName(course["LehrerID"])),
    "Lehrer Nachname": COURSEBILLINGSHEET.getRange(row, 5).setValue(TT.getTeacherLastName(course["LehrerID"])),
    "Schüler Vorname": COURSEBILLINGSHEET.getRange(row, 6).setValue(course["S_Vorname"]),
    "Schüler Nachname": COURSEBILLINGSHEET.getRange(row, 7).setValue(course["S_Nachname"]),
    Zweigstelle: COURSEBILLINGSHEET.getRange(row, 8).setValue(course["Zweigstelle"]),
    Notizen: COURSEBILLINGSHEET.getRange(row, 9).setValue("         "),
    "Verrechnungsserv.": COURSEBILLINGSHEET.getRange(row, 10).setValue(TT.getBillingServiceStatus(course["LehrerID"])),
    Kursstatus: COURSEBILLINGSHEET.getRange(row, 11).setValue(COURSESTARTEDVALUE),
    //Regiebeitrag
    Status: COURSEBILLINGSHEET.getRange(row, 12).setFormula(getAdminFeeFormula(row)),
    "Betrag erlassen": COURSEBILLINGSHEET.getRange(row, 13).insertCheckboxes(),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 14).setValue(course["KursID"]),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 15).setValue(getAdminFee()).setNumberFormat("[$€]#,##0.00"),
    Betrag: COURSEBILLINGSHEET.getRange(row, 16).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 17).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 18).setValue(""),
    //Teilzahlung 1
    Status: COURSEBILLINGSHEET.getRange(row, 19).setValue(getP1StatusFormula(row)),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 20).setValue(course["KursID"] + "1"),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 21).setValue(PAYMENTSTATUSNOTDUE),
    Betrag: COURSEBILLINGSHEET.getRange(row, 22).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 23).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 24).setValue(""),
    //Teilzahlung 2
    Status: COURSEBILLINGSHEET.getRange(row, 25).setValue(getP2StatusFormula(row)),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 26).setValue(course["KursID"] + "2"),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 27).setValue(PAYMENTSTATUSNOTDUE),
    Betrag: COURSEBILLINGSHEET.getRange(row, 28).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 29).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 30).setValue(""),
    //Teilzahlung 3
    Status: COURSEBILLINGSHEET.getRange(row, 31).setValue(getP3StatusFormula(row)),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 32).setValue(course["KursID"] + "3"),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 33).setValue(PAYMENTSTATUSNOTDUE),
    Betrag: COURSEBILLINGSHEET.getRange(row, 34).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 35).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 36).setValue(""),
    //Teilzahlung 4
    Status: COURSEBILLINGSHEET.getRange(row, 37).setValue(getP4StatusFormula(row)),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 38).setValue(course["KursID"] + "4"),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 39).setValue(PAYMENTSTATUSNOTDUE),
    Betrag: COURSEBILLINGSHEET.getRange(row, 40).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 41).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 42).setValue(""),
    //Mahnung
    "Mahnung ": COURSEBILLINGSHEET.getRange(row, 43).insertCheckboxes(),
    //Infrastrukturbeitrag
    "Infra fällt an": COURSEBILLINGSHEET.getRange(row, 44).insertCheckboxes(),
    //Teilzahlung 5
    Status: COURSEBILLINGSHEET.getRange(row, 45).setValue(getP5StatusFormula(row)),
    Buchungsnummer: COURSEBILLINGSHEET.getRange(row, 46).setValue(course["KursID"] + "5"),
    "fälliger Betrag": COURSEBILLINGSHEET.getRange(row, 47).setValue(PAYMENTSTATUSNOTDUE),
    Betrag: COURSEBILLINGSHEET.getRange(row, 48).setValue(NOTENTEREDSTATUS),
    Datum: COURSEBILLINGSHEET.getRange(row, 49).setValue(""),
    Zweck: COURSEBILLINGSHEET.getRange(row, 50).setValue(""),
    //Verrechnungsstatus
    Verrechnungsstat: COURSEBILLINGSHEET.getRange(row, 51).setValue(BILLINGNOTDONESTATUS),
    Ausstellungsstatus: COURSEBILLINGSHEET.getRange(row, 52).setValue(BILLINGNOTSENT),
    Bezahltstatus: COURSEBILLINGSHEET.getRange(row, 53).setFormula(getPaidStatusFormula(row)),
    //Regiebeitrag Vorausbezahlt
    "Regie Voraus": COURSEBILLINGSHEET.getRange(row, 54).insertCheckboxes(),
  };

  course["coursebilling_url"] = COURSEBILLINGSHEETBASEURL + "&range=" + row + ":" + row;

  return course;
}

function addCourseToCourseTable(course) {
  Logger.log("[CT]Adding course with id " + course["KursID"] + " to course table");

  //add some attributes
  course["course_start"] = Utilities.formatDate(new Date(), COURSETABLESS.getSpreadsheetTimeZone(), "dd.MM.yyyy");
  course["course_end"] = DATA.getCourseEnd();

  try {
    var sheet_id = COURSESHEET.getSheetId()
    UTLS.lockSheet(sheet_id)
    var start_time = Math.floor(new Date().getTime() / 1000);

    var row = COURSESHEET.getLastRow() + 1;

    // Insert rich texts
    COURSESHEET.getRange(row, 1).setValue(course["KursID"])
    SpreadsheetApp.flush();

  } catch (e) {
    console.log("error in catch of course table")
    throw e
  } finally {
    UTLS.releaseSheetLock(sheet_id)
    var end_time = Math.floor(new Date().getTime() / 1000);
    var time_diff = end_time - start_time
    //console.log("[CT] Held course table lock for " + time_diff + " seconds.")
  }
    // Insert rich texts
    COURSESHEET.getRange(row, 1).setRichTextValue(
      SpreadsheetApp.newRichTextValue().setText(course["KursID"]).setLinkUrl(course["coursebilling_url"]).build()
    )
    COURSESHEET.getRange(row, 2).setRichTextValue(
      SpreadsheetApp.newRichTextValue().setText(course["SchuelerID"]).setLinkUrl(course["studentlist_url"]).build()
    )
    COURSESHEET.getRange(row, 3).setRichTextValue(
      SpreadsheetApp.newRichTextValue()
        .setText(course["LehrerID"])
        .setLinkUrl(TT.getTeacherLink(course["LehrerID"]))
        .build()
    )
    //Insert text
    //"Lehrer Vorname":
    COURSESHEET.getRange(row, 4).setValue(TT.getTeacherFirstName(course["LehrerID"])),
    //  "Lehrer Nachname":
    COURSESHEET.getRange(row, 5).setValue(TT.getTeacherLastName(course["LehrerID"])),

  //  "Lehrer Mail":
  COURSESHEET.getRange(row, 6).setValue(TT.getTeacherMail(course["LehrerID"])),
    //  "Schüler Vorname":
    COURSESHEET.getRange(row, 7).setValue(course["S_Vorname"]),
    //  "Schüler Nachname":
    COURSESHEET.getRange(row, 8).setValue(course["S_Nachname"]),
    //  "Zweigstelle":
    COURSESHEET.getRange(row, 9).setValue(course["Zweigstelle"]),
    //  "Verein":
    COURSESHEET.getRange(row, 10).setValue(course["Verein"]),
    //  "Instrument":
    COURSESHEET.getRange(row, 11).setValue(course["Instrument"]),
    //  "Kursart":
    COURSESHEET.getRange(row, 12).setValue(course["Kursart"]),
    //  "Kursnummer":
    COURSESHEET.getRange(row, 13).setValue(course["Kursnummer"]),
    //  "Kursmodus":
    COURSESHEET.getRange(row, 14).setValue(course["Kursmodus"]),
    //  "Kursstatus":
    COURSESHEET.getRange(row, 15).setValue(COURSESTARTEDVALUE),
    //  "Anmeldung":
    COURSESHEET.getRange(row, 16).setValue(course["Anmeldungen"]),
    //  "Kursbegin":
    COURSESHEET.getRange(row, 17).setValue(course["course_start"]),
    //  "Kursende":
    COURSESHEET.getRange(row, 18).setValue(course["course_end"]),
    //  "Notizen":
    COURSESHEET.getRange(row, 19).setValue("         "),
    //  "Tel_mobil":
    COURSESHEET.getRange(row, 20).setNumberFormat("@").setValue(course["Telefon_mobil"]),
    //  "tel_Vormittag":
    COURSESHEET.getRange(row, 21).setNumberFormat("@").setValue(course["Telefon_Vormittag"]),
    //  "SchülerMail":
    COURSESHEET.getRange(row, 22).setValue(course["EMail"]),
    //  "Schule_Klasse":
    COURSESHEET.getRange(row, 23).setValue(course["Geburtsdatum"]),
    //  "Geburtsdatum":
    COURSESHEET.getRange(row, 24).setValue(course["Schule_Klasse"]),
    //  "EMail":
    COURSESHEET.getRange(row, 25).setValue(course["Rechnungs_Mail"]),
    //  "Rechnungsname":
    COURSESHEET.getRange(row, 26).setValue(course["Rechnungsname"]),
    //  "Rechnungsadresse":
    COURSESHEET.getRange(row, 27).setValue(course["Rechnungsadresse"]),
    //  "Rechnungsort":
    COURSESHEET.getRange(row, 28).setValue(course["Rechnungsort"]),
    //  "Rechnungs_PLZ":
    COURSESHEET.getRange(row, 29).setNumberFormat("@").setValue(course["Rechnungs_PLZ"]),
    //  "Wohngemeinde":
    COURSESHEET.getRange(row, 30).setValue(course["Wohngemeinde"]);

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
