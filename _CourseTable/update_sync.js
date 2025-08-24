function updatePayments() {
  Logger.log("[CT] Payments are beeing synced");
  let [course_value_dict, teacher_value_dict] = TF.getPaymentValues();

  var last_row = COURSEBILLINGSHEET.getLastRow();

  let course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  //set all student payments
  let course_ids_not_in_tf = [];

  //iterate over all course ids on the course table
  var row = HEADERROW;
  for (let id of course_ids) {
    row = row + 1; //iterate over rows as course_ids is just the col read in
    if (!(id in course_value_dict)) {
      course_ids_not_in_tf.push(id);
      continue;
    }
    course_value_dict[id].shift(); //remove first element as it is just the filename of the teacher file of the course
    COURSEBILLINGSHEET.getRange(row, BIL_P1DUECOL, 1, 3).setValues([course_value_dict[id].splice(0, 3)]);
    COURSEBILLINGSHEET.getRange(row, BIL_P1DUECOL, 1, 2).setNumberFormat("[$€]#,##0.00");

    COURSEBILLINGSHEET.getRange(row, BIL_P2DUECOL, 1, 3).setValues([course_value_dict[id].splice(0, 3)]);
    COURSEBILLINGSHEET.getRange(row, BIL_P2DUECOL, 1, 2).setNumberFormat("[$€]#,##0.00");

    COURSEBILLINGSHEET.getRange(row, BIL_P3DUECOL, 1, 3).setValues([course_value_dict[id].splice(0, 3)]);
    COURSEBILLINGSHEET.getRange(row, BIL_P3DUECOL, 1, 2).setNumberFormat("[$€]#,##0.00");

    COURSEBILLINGSHEET.getRange(row, BIL_P4DUECOL, 1, 3).setValues([course_value_dict[id].splice(0, 3)]);
    COURSEBILLINGSHEET.getRange(row, BIL_P4DUECOL, 1, 2).setNumberFormat("[$€]#,##0.00");

    COURSEBILLINGSHEET.getRange(row, BIL_PSALDODUECOL, 1, 3).setValues([course_value_dict[id].splice(0, 3)]);
    COURSEBILLINGSHEET.getRange(row, BIL_PSALDODUECOL, 1, 2).setNumberFormat("[$€]#,##0.00");

    COURSEBILLINGSHEET.getRange(row, BIL_BILLINGSTATUS).setValue(course_value_dict[id][0]);
    COURSEBILLINGSHEET.getRange(row, BIL_PRICEPERHOUR).setValue(course_value_dict[id][1]);
    COURSEBILLINGSHEET.getRange(row, BIL_EXPECTEDCOURSEHOURS).setValue(course_value_dict[id][2]);
    COURSEBILLINGSHEET.getRange(row, BIL_EXPECTEDTOTALAMOUNTDUE).setValue(course_value_dict[id][3]);
    COURSEBILLINGSHEET.getRange(row, BIL_EXPECTEDSALDOAMOUNTDUE).setValue(course_value_dict[id][4]);
    COURSEBILLINGSHEET.getRange(row, BIL_CURRENTCOURSEHOURS).setValue(course_value_dict[id][5]);
    COURSEBILLINGSHEET.getRange(row, BIL_CURRENTDUEAMOUNT).setValue(course_value_dict[id][6]);
    COURSEBILLINGSHEET.getRange(row, BIL_CURRENTPAIDAMOUNT).setValue(course_value_dict[id][7]);
    COURSEBILLINGSHEET.getRange(row, BIL_CURRENTSALDOAMOUNT).setValue(course_value_dict[id][8]);

    delete course_value_dict[id];
  }
  let course_ids_not_in_courselist = [];
  for (let id of Object.keys(course_value_dict)) {
    course_ids_not_in_courselist.push(String(id) + "(" + course_value_dict[id][0] + ")");
  }

  //teacher billing table
  var last_row = TEACHERBILLINGSHEET.getLastRow();
  let teacher_ids = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_IDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let teacher_ids_not_in_tf = [];

  var row = HEADERROW;
  for (let id of teacher_ids) {
    row = row + 1;
    if (!(id in teacher_value_dict)) {
      teacher_ids_not_in_tf.push(id);
      continue;
    }

    //MAZ
    TEACHERBILLINGSHEET.getRange(row, TEA_MAZDUECOL).setValue(teacher_value_dict[id][0]);
    TEACHERBILLINGSHEET.getRange(row, TEA_MAZDUECOL + 2)
      .setValue(teacher_value_dict[id][1])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_MAZDUECOL + 5)
      .setValue(teacher_value_dict[id][2])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_MAZDUECOL + 6).setValue(teacher_value_dict[id][3]);
    //VÖM
    TEACHERBILLINGSHEET.getRange(row, TEA_VOMDUECOL).setValue(teacher_value_dict[id][4]);
    TEACHERBILLINGSHEET.getRange(row, TEA_VOMDUECOL + 2)
      .setValue(teacher_value_dict[id][5])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_VOMDUECOL + 5)
      .setValue(teacher_value_dict[id][6])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_VOMDUECOL + 6).setValue(teacher_value_dict[id][7]);
    //OFFICE
    TEACHERBILLINGSHEET.getRange(row, TEA_OFFICEISDUECOL).setValue(teacher_value_dict[id][8]);
    TEACHERBILLINGSHEET.getRange(row, TEA_OFFICEISDUECOL + 2)
      .setValue(teacher_value_dict[id][9])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_OFFICEISDUECOL + 6)
      .setValue(teacher_value_dict[id][10])
      .setNumberFormat("[$€]#,##0.00");
    TEACHERBILLINGSHEET.getRange(row, TEA_OFFICEISDUECOL + 7).setValue(teacher_value_dict[id][11]);
    TEACHERBILLINGSHEET.getRange(row, TEA_NUMSTUDENTSCOL).setValue(teacher_value_dict[id][12])
    //ROOM
    TEACHERBILLINGSHEET.getRange(row, TEA_ROOMCOL).setValue(teacher_value_dict[id][13]);

    delete teacher_value_dict[id];
  }

  Logger.log("[CT] Finished syncing payments");
  msg = "Zahlungen aktualisiert.\\n";
  if (course_ids_not_in_tf.length > 0) {
    msg +=
      "----------------------------------------\\n \
    KURSE: \\n";
    msg += "Folgende Kurse aus den Lehrerdateien konnten nicht zugeordnet werden:\\n\\n";
    msg += course_ids_not_in_tf + "\\n";
    Logger.log(
      "[CT] The following course ids from the course billing were not found in the teacher files: " +
        course_ids_not_in_tf
    );
  }

  if (course_ids_not_in_courselist.length > 0) {
    msg += "Folgende Kurse aus der Kursverrechnung wurden nicht in den Lehrerdateien gefunden: \\n\\n";
    msg += course_ids_not_in_courselist + "\\n";
    Logger.log(
      "[CT] The following course ids from the teacher files were not found in the course billing: " +
        course_ids_not_in_courselist
    );
  }

  if (teacher_ids_not_in_tf.length > 0) {
    msg +=
      "----------------------------------------\\n \
    LEHRERABRECHNUNG: \\n \
    Folge Lehrer aus der Lehrerabrechnung wurden nicht in den Lehrerdateien gefunden:\\n\\n \
    ";
    msg += teacher_ids_not_in_tf + "\\n";

    Logger.log(
      "[CT] The following teacher ids from the teacher billing were not found in the teacher files: " +
        teacher_ids_not_in_tf
    );
  }

  Browser.msgBox(msg);
}

function updateStudentCourseInfos() {
  //Browser.msgBox("Funktion momentan deaktiviert")
  Logger.log("[CT] Updating Course Infos");
  var teacher_file_ids = TF.getAllTeacherFileIds();
  //var teacher_file_ids = ["1Voj_ZDafvmRv0S_ojd1sk3tOnNcKU-e_pVlTvZOAiaU"] //Testing
  var student_info_dict = API.getThreadedTFApi("get_studentinfos_thread", teacher_file_ids);
  console.log("Fetched " + Object.keys(student_info_dict).length + " students infos from teacher files");
  var course_data_range = COURSESHEET.getRange(2, 1, COURSESHEET.getLastRow() - 1, COURSESHEET.getLastColumn());
  var course_data = course_data_range.getValues();
  var student_id, student_data, teacher_id, instrument;
  var keys_not_found = [];
  for (var row_data of course_data) {
    //array starting from 2nd row
    student_id = row_data[STUDENTIDCOL-1];
    teacher_id = row_data[TEACHERIDCOL-1]

    if (!student_info_dict.hasOwnProperty(student_id)) {
      if (!(row_data[COU_COURSESTATUSCOL - 1] === DEREGISTEREDVALUE)) {
        //only warn if student is not deregistered
        keys_not_found.push(student_id);
      }
      continue;
    }

    student_data = student_info_dict[student_id];

    instrument = student_data["Instrument"][teacher_id]
    //use first value of instrument dict as fallback
    if (instrument === undefined)
    {
      //Student might be deregistered and this not in teachers list anymore. Keep instrument as is if thats the case 
      instrument = row_data[COU_INSTRUMENT - 1]  //keep current instrument

      // check is course is still running. If yes, the student has to be in the teachers student list and cannot be missing
      if (!(row_data[COU_COURSESTATUSCOL - 1] === DEREGISTEREDVALUE)) {
        console.warn("Warning: There is a problem with the Instrument of student "+ String(student_id)+". No instrument found for teacher id " + String(teacher_id))
      }
    }
    row_data[COU_INSTRUMENT - 1] = instrument;
    row_data[COU_ANMELDUNG - 1] = student_data["Anmeldungen"];
    row_data[COU_EMAIL - 1] = student_data["EMail"];
    row_data[COU_TELEFONMOBIL - 1] = student_data["Telefon_mobil"];
    row_data[COU_TELEFONVORMITTAG - 1] = student_data["Telefon_Vormittag"];
    row_data[COU_RECHNUNGSNAME - 1] = student_data["Rechnungsname"];
    row_data[COU_RECHNUNGSADRESSE - 1] = student_data["Rechnungsadresse"];
    row_data[COU_RECHNUNGSORT - 1] = student_data["Rechnungsort"];
    row_data[COU_RECHNUNGSPLZ - 1] = student_data["Rechnungs_PLZ"];
    row_data[COU_RECHNUNGSMAIL - 1] = student_data["Rechnungs_Mail"];
    row_data[COU_WOHNGEMEINDE - 1] = student_data["Wohngemeinde"];
    row_data[COU_GEBURTSDATUM - 1] = student_data["Geburtsdatum"];
    row_data[COU_SCHULEKLASSE - 1] = student_data["Schule_Klasse"];
  }
  var course_data_slice = course_data.map((row) => row.slice(3));

  var course_data_slice_range = COURSESHEET.getRange(
    2,
    4,
    COURSESHEET.getLastRow() - 1,
    COURSESHEET.getLastColumn() - 3
  );
  course_data_slice_range.setValues(course_data_slice);

  if (keys_not_found.length > 0) {
    Logger.log("[CT] The following student ids were not found while updating the student data: " + keys_not_found);
    Browser.msgBox(
      "Die folgenden SchülerIDs der Kursliste wurden nicht in den Lehrerdateien gefunden: " + keys_not_found
    );
  }

  Logger.log("[CT] Finished updating Course Infos");
}

//check if all the course numbers + student lastnames combination match between course table and course billing.
//tries to detect any overwritten entries.
function checkCourseNumberNameMatch() {
  var last_row_course_billing = COURSEBILLINGSHEET.getLastRow();
  var course_billing_ids = COURSEBILLINGSHEET.getRange(BIL_FIRST_DATAROW, COURSEIDCOL, last_row_course_billing)
    .getValues()
    .flat();
  var course_billing_lastnames = COURSEBILLINGSHEET.getRange(BIL_FIRST_DATAROW, 2, last_row_course_billing)
    .getValues()
    .flat();
  course_billing_ids.filter((e) => e === "");
  course_billing_lastnames.filter((e) => e === "");

  if (course_billing_ids.length != course_billing_lastnames.length) {
    console.log("course billing lengths dont match");
    return;
  }

  var last_row_course_sheet = COURSESHEET.getLastRow();
  var course_sheet_ids = COURSESHEET.getRange(COU_FIRST_DATAROW, COURSEIDCOL, last_row_course_sheet).getValues().flat();
  var course_sheet_lastnames = COURSESHEET.getRange(COU_FIRST_DATAROW, 2, last_row_course_sheet).getValues().flat();

  course_sheet_ids.filter((e) => e === "");
  course_sheet_lastnames.filter((e) => e === "");

  if (course_sheet_ids.length != course_sheet_lastnames.length) {
    console.log("course sheet lengths dont match");
    return;
  }

  var id, name, idx;
  var not_found = [];
  var mismatches = [];
  for (let i = 0; i < course_billing_ids.length; i++) {
    id = course_billing_ids[i];
    name = course_billing_lastnames[i];

    idx = course_sheet_ids.indexOf(id);

    if (idx == -1) {
      not_found.push(idx);
      continue;
    }

    if (course_sheet_lastnames[idx] != name) {
      mismatches.push(id);
    }
  }

  if (not_found.length > 0) {
    console.log("id list mismatch: ", not_found);
  }

  if (mismatches.length > 0) {
    console.log("name mismatches found: ", mismatches);
  }
}

function checkCourseIDIntegrity() {
  Logger.log("[CT] Checking Course ID integrity");

  var last_row_course_billing = COURSEBILLINGSHEET.getLastRow();
  var course_billing_ids = COURSEBILLINGSHEET.getRange(BIL_FIRST_DATAROW, COURSEIDCOL, last_row_course_billing)
    .getValues()
    .flat();
  course_billing_ids.filter((e) => e === "");

  var last_row_course_sheet = COURSESHEET.getLastRow();
  var course_sheet_ids = COURSESHEET.getRange(COU_FIRST_DATAROW, COURSEIDCOL, last_row_course_sheet).getValues().flat();
  course_sheet_ids.filter((e) => e === "");

  keys_not_found_in_course_sheet = [];
  var idx;
  console.log(course_billing_ids.length)
  for (let course_billing_id of course_billing_ids) {
    idx = course_sheet_ids.indexOf(course_billing_id);

    if (idx == -1) {
      keys_not_found_in_course_sheet.push(course_billing_id);
    } else {
      course_sheet_ids.splice(idx, 1);
    }
  }

  if (keys_not_found_in_course_sheet.length > 0) {
    console.warn(
      "[CT] The following course ids from course_billing were not found in course table: " +
        keys_not_found_in_course_sheet
    );
    Browser.msgBox(
      "Die folgenden KursIDs der Kursverrechning wurden nicht in der Kursübersicht gefunden: " +
        keys_not_found_in_course_sheet
    );
  }

  if (course_sheet_ids.length > 0) {
    console.warn(
      "[CT] The following course ids from course_sheet were not found in course_billing: " + course_sheet_ids
    );
    Browser.msgBox(
      "Die folgenden KursIDs der Kursübersicht wurden nicht in der Kursverrechnung gefunden: " + course_sheet_ids
    );
  }

  if (course_sheet_ids.length == 0 && keys_not_found_in_course_sheet.length == 0) {
    console.warn("[CT] Course billing and course sheet are in sync");
    Browser.msgBox("KursIDs der Kursübersicht und Kursverrechnung stimmen überein");
  }
  Logger.log("[CT] Finished checking Course ID integrity");
}

function syncTeacherData() {
  var info_keys = [
    "Email",
    "Verrechnungsservice",
    "Strasse, HausNR, Türe",
    "Plz",
    "Ort",
    "IBAN",
    "BIC",
    "Bank",
    "IBAN_MBS",
    "Tel",
  ];
  var teacher_data_dict = TT.getTeacherData(info_keys);

  var course_data_range = COURSESHEET.getRange(
    2,
    COU_TEACHERMAIL,
    COURSESHEET.getLastRow(),
    COURSESHEET.getLastColumn() - COU_TEACHERMAIL + 1
  );
  var teacher_ids = COURSESHEET.getRange(2, TEACHERIDCOL, COURSESHEET.getLastRow()).getValues().flat();
  var course_data = course_data_range.getValues();

  var keys_not_found = [];
  var i = 0;
  for (var row_data of course_data) {
    //array starting from 2nd row
    var teacher_id = teacher_ids[i];

    if (!teacher_data_dict.hasOwnProperty(teacher_id)) {
      keys_not_found.push(teacher_id);
      continue;
    }
    row_data[COU_TEACHERMAIL - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Email"];
    row_data[COU_TEACHERBILLING - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Verrechnungsservice"];
    row_data[COU_TEACHERADRESS - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Strasse, HausNR, Türe"];
    row_data[COU_TEACHERPLZ - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Plz"];
    row_data[COU_TEACHERORT - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Ort"];
    row_data[COU_TEACHERIBAN - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["IBAN"];
    row_data[COU_TEACHERBIC - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["BIC"];
    row_data[COU_TEACHERBANK - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Bank"];
    row_data[COU_TEACHERIBANMBS - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["IBAN_MBS"];
    row_data[COU_TEACHERTEL - COU_TEACHERMAIL] = teacher_data_dict[teacher_id]["Tel"];

    i = i + 1;
  }
  course_data_range.setValues(course_data);

  if (keys_not_found.length > 0) {
    keys_not_found = Array.from(new Set(keys_not_found));
    Logger.log(
      "[CT] The following teacher ids from the course table were not found in teacher table while updating the teacher mails: " +
        keys_not_found
    );
    Browser.msgBox("Die folgenden LehrerIDs der Kursliste wurden nicht in der Lehrerliste gefunden: " + keys_not_found);
  }
}


// Sync Teacher data in teacher billing 
// Check for missing teacher infos in teacher files and teacher table
// Adds teachers that are missing in teacher billing
function syncTeacherBilling()
{

  var teacherfile_ids = TF_GET.getTeacherFileIDs()
  var last_row = TEACHERBILLINGSHEET.getLastRow();
  let teacherbilling_ids = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_IDCOL, last_row - HEADERROW).getValues().flat()

  // checking for ids that are missing in billing
  var ids_not_in_billing = teacherfile_ids.filter(function(item) {
    return teacherbilling_ids.indexOf(item) === -1;
  });

  // checking for entries in billing that have no teacher file
  var ids_not_in_tf = teacherbilling_ids.filter(function(item) {
    return teacherfile_ids.indexOf(item) === -1;
  });

  var msg = ''
  
  if (ids_not_in_tf.length > 0)
  {
    msg += "Die folgenden LehrerIDs sind in der Kursverrechnung, haben aber keine Lehrerdatei. Bitte löschen: "
    msg += ids_not_in_tf.join(", ")
  }
  
  if (ids_not_in_billing.length > 0)
  {
    msg += "Folgende LehrerIDs werden in die Lehrerverrechning hinzugefügt:  "
    msg += ids_not_in_billing.join(", ")

    //adding missing ids to bottom of billing
    var id_col_format = ids_not_in_billing.map(function(item) {return [item];});
    var last_row = TEACHERBILLINGSHEET.getLastRow()
    TEACHERBILLINGSHEET.getRange(last_row+1, TEA_IDCOL, id_col_format.length).setValues(id_col_format)
    teacherbilling_ids = teacherbilling_ids.concat(ids_not_in_billing)
  }

  if (ids_not_in_billing.length == 0 && ids_not_in_tf.length == 0)
  {
    msg += "IDs stimmen überein, Daten der Lehrerverrechng werden aktualisiert. "
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.toast(msg, "", 30)

  //getting new data form TT 
  var info_keys = [
    "Vorname",
    "Nachname",
    "Email",
    "Tel",
    "Verrechnungsservice"
  ];

  var teacher_data_dict = TT.getTeacherData(info_keys);

  var ids_not_in_teachertable = []
  var data = []


  for (var id of teacherbilling_ids)
  {
    if (!teacher_data_dict.hasOwnProperty(id)) {   
      ids_not_in_teachertable.push(id)
      //insert empty row instead
      data.push(new Array(info_keys.length))
      continue;
    }
    var row_data = []

    for (var key of info_keys)
    {
      row_data.push(teacher_data_dict[id][key])
    }
    data.push(row_data)
  }

  //write new data
  TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_IDCOL+1, data.length, data[0].length).setValues(data)
  
  msg = "Lehrerdaten in Lehrerverrechning aktualisiert. "

  if (ids_not_in_teachertable > 0)
  {
    msg += "Folgende LehrerIDs nicht in Lehrerliste gefunden: "
    msg += ids_not_in_teachertable.join(", ")
  }
  ss.toast(msg, "", 60)

  return
}

