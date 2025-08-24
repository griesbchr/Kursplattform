function makeColorOnValueFormat(spreadsheet, range, value, color)
{
  let color_rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(value)
    .setBackground(color)
    .setRanges([range])
    .build();
  //Formatting rules
  let rules = spreadsheet.getConditionalFormatRules();
  rules.push(color_rule);
  spreadsheet.setConditionalFormatRules(rules);
}

function makeColorOnEmptyFormat(spreadsheet, range, color)
{
  let color_rule = SpreadsheetApp.newConditionalFormatRule()
    .whenCellEmpty()
    .setBackground(color)
    .setRanges([range])
    .build();
  //Formatting rules
  let rules = spreadsheet.getConditionalFormatRules();
  rules.push(color_rule);
  spreadsheet.setConditionalFormatRules(rules);
}
function addEmptyStudents_(num_students)
{
  for (let student=0; student < num_students; student=student+1)
  {
    var row = addStudent(getEmptyStudent())
  }
}

function getEmptyStudent()
{
 return  {
  "Art_Anmeldung": "",
  "S_Vorname": "",
  "S_Nachname": "",
  "Instrument": "",
  "Kursort": "",
  "Rechnungsname":"",
  "Rechnungsadresse": "",
  "Rechnungsadresszusatz":"",
  "Rechnungsort": "",
  "Rechnungs_PLZ":"",
  "Wohngemeinde": "",
  "Telefon_mobil": "",
  "Telefon_Vormittag":"",
  "EMail": "",
  "Geburtsdatum": "",
  "Schule_Klasse": "",
  "Wunschlehrer": "",
  "Zahlung_Mail": "",
  "Wunschtermine":"",
  "Nicht_Moeglich":"",
  "Nachmittagsbetreuung": "",
  "Anmerkunen": "",
  "Kontaktstatus" : "Kein Lehrer zugeteilt",
  "ScriptInfo" : "Manuell hinzugefügt"
  }
}


function addStudent(student_dict, has_id)
{
  Logger.log("[ET]Starting add student to enrollment table")
  
  // student has student ID if "Art der Anmeldung" contains "Wiederanmeldung"
  if (student_dict["Art_Anmeldung"].includes("Wiederanmeldung"))
  {
    has_id = true
    var sheet = PREREGSHEET  
  } else
  {
    var sheet = ENROLLMENTSHEET
  }

  //start lock
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(60000); // wait 60 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    console.error('Could not obtain lock in enrollment table to add student.');
    return
  }
  
  //inserting new row
  sheet.insertRows(FIRSTDATAROW,1)
  let row = FIRSTDATAROW
 
  //clear formatting of new row
  sheet.getRange(row, 1,1, sheet.getLastColumn()).setBackground(null).setFontColor(null)

  //Copy data from dict to the spreadsheet
  //District Cell
  //let district_list = DATA.getDistricts()
  //district_list.unshift(NODISTRICTVALUE)

  //Teacher Cell
  //let teacher_list = API.getTFApi("get_all_teacherfile_names")
  //teacher_list.unshift(NOTEACHERVALUE)

  //Contracts status
  let contractstatus_list = DATA.getCourseContractStatus()

  //Contracts status
  let preregstatus_list = DATA.getPreregistrationStatus()

  //contact status teacher
  //Logger.log("student dict")
  //Logger.log(Object.entries(student_dict))
  var contact_status_text = student_dict["Kontaktstatus"]
  let contact_status_richtext = SpreadsheetApp.newRichTextValue().setText(contact_status_text).build()
  if (!(has_id === true)){student_dict["SchuelerID"] = DATA.getNewStudentID()}


  call_list = 
  {
    "Reihe auswählen":        sheet.getRange(row, 1).insertCheckboxes(),
    "Lehrer freigeben":       sheet.getRange(row, 2).insertCheckboxes(),
    "Bearbeitung abgeschl.":  sheet.getRange(row, 3).insertCheckboxes(), 
    "Notizen":                sheet.getRange(row, 4).setNumberFormat("@").setValue(student_dict["Notizen"]),
    "Kontaktstatus":          sheet.getRange(row, 5).setRichTextValue(contact_status_richtext),
    "Kursstatus":             sheet.getRange(row, 6).setValue(NOCOURSEVALUE).setBackground(RED), 
    "Lehrer":                 sheet.getRange(row, 7).setValue(NOTEACHERVALUE), 
    "Zweigstelle":            sheet.getRange(row, 8).setValue("Zweigstelle" in student_dict ? student_dict["Zweigstelle"] : NODISTRICTVALUE),
    "Anmeldungen":            UTLS.makeDropdown(sheet.getRange(row, 9), contractstatus_list),
    "Voranmeldung":           UTLS.makeDropdown(sheet.getRange(row, 10), preregstatus_list, "Voranmeldung" in student_dict ? student_dict["Voranmeldung"] : ""), 
    "S_Vorname" :             sheet.getRange(row, 11).setNumberFormat("@").setValue(student_dict["S_Vorname"]),
    "S_Nachname" :            sheet.getRange(row, 12).setNumberFormat("@").setValue(student_dict["S_Nachname"]),
    "Instrument" :            sheet.getRange(row, 13).setNumberFormat("@").setValue(student_dict["Instrument"]),
    "Wunschlehrer" :          sheet.getRange(row, 14).setNumberFormat("@").setValue(student_dict["Wunschlehrer"]),
    "Kursort" :               sheet.getRange(row, 15).setNumberFormat("@").setValue(student_dict["Kursort"]),
    "Schule_Klasse" :         sheet.getRange(row, 16).setNumberFormat("@").setValue(student_dict["Schule_Klasse"]),
    "Wunschtermine" :         sheet.getRange(row, 17).setNumberFormat("@").setValue(student_dict["Wunschtermine"]),
    "Telefon_mobil" :         sheet.getRange(row, 18).setNumberFormat("@").setValue(student_dict["Telefon_mobil"]),
    "Anmerkungen" :           sheet.getRange(row, 19).setNumberFormat("@").setValue(student_dict["Anmerkungen"]),
    "Nicht_Moeglich" :        sheet.getRange(row, 20).setNumberFormat("@").setValue(student_dict["Nicht_Moeglich"]),
    "Nachmittagsbetreuung" :  sheet.getRange(row, 21).setNumberFormat("@").setValue(student_dict["Nachmittagsbetreuung"]),
    "Geburtsdatum" :          sheet.getRange(row, 22).setNumberFormat("@").setValue(student_dict["Geburtsdatum"]),
    "Art_Anmeldung" :         sheet.getRange(row, 23).setNumberFormat("@").setValue(student_dict["Art_Anmeldung"]),
    "Telefon_Vormittag" :     sheet.getRange(row, 24).setNumberFormat("@").setValue(student_dict["Telefon_Vormittag"]),
    "EMail" :                 sheet.getRange(row, 25).setNumberFormat("@").setValue(student_dict["EMail"]),
    "Rechnungs_Mail" :        sheet.getRange(row, 26).setNumberFormat("@").setValue(student_dict["Rechnungs_Mail"]),
    "Rechnungsname" :         sheet.getRange(row, 27).setNumberFormat("@").setValue(student_dict["Rechnungsname"]),
    "Rechnungsadresse" :      sheet.getRange(row, 28).setNumberFormat("@").setValue(student_dict["Rechnungsadresse"]),
    "Rechnungsadresszusatz" : sheet.getRange(row, 29).setNumberFormat("@").setValue(student_dict["Rechnungsadresszusatz"]),
    "Rechnungsort" :          sheet.getRange(row, 30).setNumberFormat("@").setValue(student_dict["Rechnungsort"]),
    "Rechnungs_PLZ" :         sheet.getRange(row, 31).setNumberFormat("@").setValue(student_dict["Rechnungs_PLZ"]),
    "Wohngemeinde" :          sheet.getRange(row, 32).setNumberFormat("@").setValue(student_dict["Wohngemeinde"]),
    "MailLink" :              sheet.getRange(row, 33).setNumberFormat("@").setValue(""),
    "SchuelerID" :            sheet.getRange(row, 34).setNumberFormat("@").setValue(student_dict["SchuelerID"]),
    "ScriptInfo" :            sheet.getRange(row, 35).setNumberFormat("@").setValue(student_dict["ScriptInfo"]),
    "Datum":                  sheet.getRange(row, 36).setNumberFormat("@").setValue(UTLS.getToday()),

  }

  SpreadsheetApp.flush()

  //release lock
  lock.releaseLock();

  //Bearbeitet
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,HANDLINGDONECOL), "FALSE", RED)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,HANDLINGDONECOL), "TRUE", GREEN)

  //Kontaktstatus
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,CONTACTSTATUSCOL), NOCONTACT, YELLOW)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,CONTACTSTATUSCOL), ACTIVECONTACT, GREEN)
  ////makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,CONTACTSTATUSCOL), NOTSHAREDVALUE, RED)

  //Kursstatus
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,COURSESTATUSCOL), COURSESTARTEDVALUE, GREEN)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,COURSESTATUSCOL), NOCOURSEVALUE, YELLOW)

  //Lehrer, Zweigstelle
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,TEACHERCOL), NOTEACHERVALUE, YELLOW)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,DISTRICTCOL), NODISTRICTVALUE, YELLOW)

  //Kursvertrag, Voranmeldung
  //makeColorOnEmptyFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,8), YELLOW)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,8), NOCONTRACTVALUE, RED)
  //makeColorOnValueFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,8), CONTRACTVALUE, GREEN)
  //makeColorOnEmptyFormat(ENROLLMENTSHEET, ENROLLMENTSHEET.getRange(row,9), YELLOW)
  
  Logger.log("[ET]Finished add student " + student_dict["SchuelerID"] + " to enrollment table")


  return row
}
