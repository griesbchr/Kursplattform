//Same as function below but for single teacher
function setSingleTeacherPaymentDue() {
  
  var display_name = Browser.inputBox(
    "Bitte wähle eine Zahlung aus. Es gibt folgende Zahlungen: \\nerste Teilzahlung\\n zweite Teilzahlung\\ndritte Teilzahlung\\nvierte Teilzahlung\\nSaldozahlung\\nVereinsbeitrag\\nRaumbenutzungsgebühr\\nBüroservicegebühr"
  );

  switch (display_name) {
    case "erste Teilzahlung":
      payment_string = "payment1";
      break;
    case "zweite Teilzahlung":
      payment_string = "payment2";
      break;
    case "dritte Teilzahlung":
      payment_string = "payment3";
      break;
    case "vierte Teilzahlung":
      payment_string = "payment4";
      break;
    case "Saldozahlung":
      payment_string = "saldo";
      break;
    case "Vereinsbeitrag":
      payment_string = "ass";
      break;
    case "Raumbenutzungsgebühr":
      payment_string = "room";
      break;
    case "Büroservicegebühr":
      payment_string = "office";
      break;
    default:
      Browser.msgBox("Zahlung '" + display_name + "' unbekannt, bitte den richtigen Namen der Zahlung eingeben");
      return;
  }

  //get teacher id
  var teacher_id_input = Browser.inputBox("Bitte Lehrer ID eingeben (dreistellig, zB '047') oder mehrere IDs (001,018,197)");

  //check if single teacher if or list
  var teacher_ids = teacher_id_input.split(",")
  var course_status_dicts = [] 
  for (var teacher_id of teacher_ids)
  {
    var course_status_dict = getTeacherCourseStatusDict(teacher_id);

    if (course_status_dict.length == 0) {
      Browser.msgBox("Keine Kurse für Lehrer mit ID " + teacher_id + " gefunden.");
      return;
    }
    course_status_dicts.push(course_status_dict)
  }
  
  TF.setSingleTeacherPaymentsDue(payment_string, course_status_dicts, teacher_ids);

  Browser.msgBox("Der/Die " + display_name + " wurde erfolgreich fällig gesetzt.");
}

function confirmAction(display_name) {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Bitte bestätigen",
    "Wollen Sie die " + display_name + " wirklich fällig setzen?",
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    return true;
  } else {
    return false;
  }
}

function setPaymentDue(payment_string) {
  var display_name, date_cell;

  let course_status_dict = getCourseStatusDict();

  switch (payment_string) {
    case "payment1":
      display_name = "erste Teilzahlung";
      date_cell = DATESSHEET.getRange(DATES_PAYMENT1DATEROW, 1);
      break;
    case "payment2":
      display_name = "zweite Teilzahlung";
      date_cell = DATESSHEET.getRange(DATES_PAYMENT2DATEROW, 1);
      break;
    case "payment3":
      display_name = "dritte Teilzahlung";
      date_cell = DATESSHEET.getRange(DATES_PAYMENT3DATEROW, 1);
      break;
    case "payment4":
      display_name = "vierte Teilzahlung";
      date_cell = DATESSHEET.getRange(DATES_PAYMENT4DATEROW, 1);
      break;
    case "saldo":
      display_name = "Saldozahlung";
      date_cell = DATESSHEET.getRange(DATES_SALDOPAYMENT, 1);
      break;
    case "ass":
      display_name = "Vereinsbeitrag";
      date_cell = DATESSHEET.getRange(DATES_ASSDATEROW, 1);
      break;
    case "room":
      display_name = "Raumbenutzungsgebühr";
      date_cell = DATESSHEET.getRange(DATES_ROOMDATEROW, 1);
      break;
    case "office":
      display_name = "Büroservicegebühr";
      date_cell = DATESSHEET.getRange(DATES_OFFICEDATEROW, 1);
      break;
  }

  if (!confirmAction(display_name)) {
    return;
  }

  console.log("[CT]Starting set payment " + payment_string + " due");

  //store up payment date
  if (!date_cell.isBlank()) {
    Browser.msgBox("Der/Die " + display_name + " wurde bereits gestartet da ein Fälligkeitsdatum eingetragen ist.");
    return;
  }
  date_cell.setValue(UTLS.getToday(COURSETABLESS));
  SpreadsheetApp.flush();

  let rem_course_status_dict, keys_not_found;
  [rem_course_status_dict, keys_not_found] = TF.setPaymentsDue(payment_string, course_status_dict);

  if ((payment_string == "ass") | (payment_string == "room") | (payment_string == "office")) {
    Browser.msgBox("Der/Die " + display_name + " wurde erfolgreich fällig gesetzt.");
  } else {
    Browser.msgBox(
      "Die " +
        display_name +
        " wurde erfolgreich fällig gesetzt.\\n\\n Die folgenden KursIDs konnten nicht bearbeitet werden da sie in der Kursverrechnung existieren jedoch nicht in den Lehrerdateien:\\n\\n" +
        keys_not_found +
        "\\n\\nDie folgenden KursIDs konnten nicht bearbeitet werden da sie in den Lehrerdateien existieren jedoch nicht in der Kursverrechnungsliste:\\n\\n" +
        Object.keys(rem_course_status_dict)
    );
  }
  //updatePayments();
  console.log("[CT]Successfully set payment " + display_name + " due");
}

function setAdditionalPaymentDue(payment_string) {
  let checkboxcol;
  let display_name;
  switch (payment_string) {
    case "reminder":
      display_name = "Mahnunzahlung der zweiten Mahnung";
      checkboxcol = BIL_REMINDERCHECKBOXCOL;
      break;
    case "infra":
      display_name = "Infrastrukturgebühr";
      checkboxcol = BIL_INFRACHECKBOXCOL;
      break;
  }

  //get checked rows
  let checked_rows = getCheckedRows(COURSEBILLINGSHEET, checkboxcol);

  //get all col values
  let course_ids = COURSEBILLINGSHEET.getRange(1, COURSEIDCOL, COURSEBILLINGSHEET.getLastRow()).getValues().flat();
  let teacher_ids = COURSEBILLINGSHEET.getRange(1, TEACHERIDCOL, COURSEBILLINGSHEET.getLastRow()).getValues().flat();

  //select just the checked rows
  let checked_course_ids = checked_rows.map((e) => course_ids[e - 1]);
  let checked_teacher_ids = checked_rows.map((e) => teacher_ids[e - 1]);

  // select only the unique teacher ids. Done by checking if the index if a new element is the index of the first occuring element, and removes if not.
  let checked_teacher_ids_unique = checked_teacher_ids.filter((e, i, self) => self.indexOf(e) === i);

  //initing a dict keyed on unique teachers and with an empty array as value
  let checked_teacher_course_ids = {};
  checked_teacher_ids_unique.forEach((e) => (checked_teacher_course_ids[e] = []));

  // filling the course IDs to the unique teacherID keys
  for (var idx = 0; idx < checked_course_ids.length; idx = idx + 1) {
    checked_teacher_course_ids[checked_teacher_ids[idx]].push(checked_course_ids[idx]);
  }
  Browser.msgBox(
    "Für die foldenden Lehrer und Kurs IDs wird die " +
      display_name +
      " eingetragen.\\n" +
      Object.entries(checked_teacher_course_ids)
  );
  let keys_not_found = TF.setAdditionalPayments(checked_teacher_course_ids, payment_string);

  Browser.msgBox(
    "Für die foldenden Kurs IDs wurde kein Eintrag in den Lehrer dateien gefunden:\\n\\n" + keys_not_found
  );

  //set color to all remaining checkbox fields
  let set_course_ids = checked_course_ids.filter((e, i, self) => !(e in keys_not_found));

  var row;
  for (let id of keys_not_found) {
    row = UTLS.findValueInCol(COURSEBILLINGSHEET, COURSEIDCOL, id);
    COURSEBILLINGSHEET.getRange(row, checkboxcol).setBackground("red");
  }
  for (let id of set_course_ids) {
    row = UTLS.findValueInCol(COURSEBILLINGSHEET, COURSEIDCOL, id);
    COURSEBILLINGSHEET.getRange(row, checkboxcol).setBackground("green").uncheck();
  }
}

function sentReminder() {
  Browser.msgBox("send reminder callback");
}

function setAdminFeeDue() {
  DATESSHEET.getRange(DATES_ADMINFEEROW, 1).getRange().setValue(UTLS.getToday());

  //find ended courses that ended with less than 2 final hours
}

function setPayment1Due() {
  setPaymentDue("payment1");
}
function setPayment2Due() {
  setPaymentDue("payment2");
}
function setPayment3Due() {
  setPaymentDue("payment3");
}
function setPayment4Due() {
  setPaymentDue("payment4");
}
function setSalsopaymentDue() {
  setPaymentDue("saldo");
}
function setReminderDue() {
  setAdditionalPaymentDue("reminder");
}
function setInfraDue() {
  setAdditionalPaymentDue("infra");
}
function setAssPaymentsDue() {
  setPaymentDue("ass");
}
function setRoomPaymentsDue() {
  setPaymentDue("room");
}
function setOfficePaymentDue() {
  setPaymentDue("office");
}
function setAdminFeeDue() {
  setAdminFeeDue();
}
