//Logger.log("Load TF_get")

const TEACHERSFOLDERNAME = "Lehrerdateien";
const TEACHERFILESFOLDER = DriveApp.getFoldersByName(TEACHERSFOLDERNAME).next();
const STUDENTSSHEETNAME = "Schülerliste";
const TEACHERBILLINGSHEETNAME = "Lehrerabrechnung";
const ROOMUSAGESHEETNAME = "Raumbenutzungsliste";
const FORMULASSHEETNAME = "Formeln";
const BILLINGSTUDENTSHEETNAME = "Schülerabrechnung";

const STU_COLNAMEROW = 5;
const STU_CHECKBOXCOL = 1;
const STU_FIRSTNAMECOL = 2;
const STU_LASTNAMECOL = 3;
const STU_BILLINGSTATUS = 4;
const STU_CONTACTSTATUSCOL = 5;
const STU_CKECKEDDATACHECKBOX = 6;
const STU_IDCOL = 30;
const STU_COURSEIDCOL = 31;
const STU_COURSEPARAMSTARTINGCOL = 7;
const STU_COURSEPARAMLENGTH = 4;

// Billing student sheet constants
const BILSTU_HEADERROW = 4;

// Payment column constants
const PAYMENT1DUECOL = 21;
const PAYMENT1PAIDCOL = 22;
const PAYMENT2DUECOL = 24;
const PAYMENT2PAIDCOL = 25;
const PAYMENT3DUECOL = 27;
const PAYMENT3PAIDCOL = 28;
const PAYMENT4DUECOL = 31;
const PAYMENT4PAIDCOL = 32;
const SALDOPAYMENTDUECOL = 35;
const SALDOPAYMENTPAIDCOL = 36;

const STU_INSTRUMENT = 11;
const STU_ANMELDUNG = 12;
const STU_EMAIL = 15;
const STU_TELEFONMOBIL = 16;
const STU_TELEFONVORMITTAG = 17;
const STU_RECHNUNGSNAME = 19;
const STU_RECHNUNGSADRESSE = 20;
const STU_RECHNUNGSORT = 21;
const STU_RECHNUNGSPLZ = 22;
const STU_RECHNUNGSMAIL = 23;
const STU_WOHNGEMEINDE = 24;
const STU_GEBURTSDATUM = 25;
const STU_SCHULEKLASSE = 26;

const BILTEA_ROOMBILLINGDETAIL_FIRSTROW = 37;
const BILTEA_ROOMBILLINGDETAIL_LASTROW = 126;
const BILTEA_ROOMBILLINGDETAIL_FIRSTCOL = 1;
const BILTEA_ROOMBILLINGDETAIL_LASTCOL = 6;

const BILTEA_ROOMBILLINGOVERVIEW_FIRSTROW = 37;
const BILTEA_ROOMBILLINGOVERVIEW_LASTROW = 51;
const BILTEA_ROOMBILLINGOVERVIEW_FIRSTCOL = 8;
const BILTEA_ROOMBILLINGOVERVIEW_LASTCOL = 16;
const ROOM_HEADERROW = 4;

const FORMULA_VALUEROW = 2;
const FORMULA_ROOMBILLINGFACTORCOL = 12;

const PAYMENTSTATUSNOTDUE = "nicht verrechnet";

function getTeacherFile(id) {
  var file_iter = TEACHERFILESFOLDER.getFiles();
  var filename, file, file_id;
  while (file_iter.hasNext()) {
    file = file_iter.next();
    filename = file.getName();
    file_id = filename.split("_")[0];
    if (file_id === id) {
      return file;
    }
  }
  throw new Error("Teacherfile with id " + id + " was not found in Teacherfiles Folder from TF_Getter.");
}

function getTeacherFileLink(id) {
  return getTeacherFile(id).getUrl();
}

function getTeacherFileIdentifier(id) {
  return getTeacherFile(id).getId();
}

function getTeacherFileId(teacher_id) {
  return getTeacherFile(teacher_id).getId();
}

function getAllTeacherFileNames() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let file_ids = [];
  while (file_iter.hasNext()) {
    file_ids.push(file_iter.next().getName());
  }
  return file_ids;
}

function getTeacherFileIDs() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let file_ids = [];
  while (file_iter.hasNext()) {
    let file_name = file_iter.next().getName();
    file_ids.push(file_name.split("_")[0]);
  }
  return file_ids;
}

function getTeacherFileFileIDs() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let file_ids = [];
  while (file_iter.hasNext()) {
    file_ids.push(file_iter.next().getId());
  }
  return file_ids;
}

//returns dict of kind { student_id : [student_contact_status, student_name, teacher_id, teacher_name]}
//takes about 1s per teacherfile
function getAllContactStatus() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let student_dict = {};
  while (file_iter.hasNext()) {
    //get student sheet
    var file = file_iter.next();
    var file_id = file.getId();
    var student_sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME);

    //get all valid cols
    var id_values = student_sheet
      .getRange(STU_COLNAMEROW + 1, STU_IDCOL, student_sheet.getLastRow())
      .getValues()
      .flat()
      .filter(String);
    var last_row = id_values.length + STU_COLNAMEROW;
    var teacher_array = student_sheet.getParent().getName().split("_");
    var teacher_id = teacher_array[0];
    var teacher_name = teacher_array[1];

    if (last_row >= STU_COLNAMEROW + 1) {
      //no students in file
      var contact_status = student_sheet
        .getRange(STU_COLNAMEROW + 1, STU_CONTACTSTATUSCOL, last_row - STU_COLNAMEROW)
        .getValues()
        .flat();
      var course_status = student_sheet
        .getRange(STU_COLNAMEROW + 1, STU_BILLINGSTATUS, last_row - STU_COLNAMEROW)
        .getValues()
        .flat();
      var student_fist_name = student_sheet
        .getRange(STU_COLNAMEROW + 1, STU_FIRSTNAMECOL, last_row - STU_COLNAMEROW)
        .getValues()
        .flat();
      var student_last_name = student_sheet
        .getRange(STU_COLNAMEROW + 1, STU_LASTNAMECOL, last_row - STU_COLNAMEROW)
        .getValues()
        .flat();
      id_values.forEach(
        (key, i) =>
          (student_dict[key] = [
            contact_status[i],
            student_fist_name[i] + " " + student_last_name[i],
            teacher_id,
            teacher_name,
            course_status,
          ])
      );
    }
  }
  return student_dict;
}

function getAllContactStatus_mod() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let student_dict = {};

  while (file_iter.hasNext()) {
    //get student sheet
    try {
      var file = file_iter.next();
      var file_id = file.getId();
      var student_sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME);

      var last_row = student_sheet.getLastRow();
      if (last_row == STU_COLNAMEROW) {
        continue;
      } //no students in file

      var teacher_array = student_sheet.getParent().getName().split("_");
      var teacher_id = teacher_array[0];
      var teacher_name = teacher_array[1];

      //get all valid cols
      var data_range = student_sheet.getRange(STU_COLNAMEROW + 1, 1, last_row - STU_COLNAMEROW, STU_IDCOL);
      var data_values = data_range.getValues();

      for (var i = 0; i < data_values.length; i++) {
        var row = data_values[i];
        var id = row[STU_IDCOL - 1];
        var contact_status = row[STU_CONTACTSTATUSCOL - 1];
        var first_name = row[STU_FIRSTNAMECOL - 1];
        var last_name = row[STU_LASTNAMECOL - 1];
        var course_status = row[STU_BILLINGSTATUS - 1];

        if (id) {
          student_dict[id] = {
            contact_status: contact_status,
            student_name: first_name + " " + last_name,
            teacher_id: teacher_id,
            teacher_name: teacher_name,
            course_status: course_status,
          };
        }
      }
    } catch (e) {
      console.warn("[TF_GET]Error when trying go get Infos from teacherfile. Error code: " + e.message);
      continue;
    }
  }
  return student_dict;
}

function getLastUpdated() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let date_dict = {};
  while (file_iter.hasNext()) {
    //get student sheet
    var file = file_iter.next();
    var filename = file.getName().split("_")[0];
    var last_modified_date = file.getLastUpdated().toLocaleString("de-DE");
    date_dict[filename] = last_modified_date;
  }

  return date_dict;
}

function getCourseIDs(file_id_list) {
  let course_ids = [];
  for (var file_id of file_id_list) {
  }
  return student_dict;
}

function getStudentInfos(file_id_list) {
  let student_dict = {};

  for (var file_id of file_id_list) {
    try {
      //get student sheet
      var student_sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME);
      //Logger.log(student_sheet.getParent().getName())

      var last_row = student_sheet.getLastRow();
      if (last_row == STU_COLNAMEROW) {
        continue;
      } //no students in file

      var teacher_array = student_sheet.getParent().getName().split("_");
      var teacher_id = teacher_array[0];
      var teacher_name = teacher_array[1];

      //get all valid cols
      var data_range = student_sheet.getRange(STU_COLNAMEROW + 1, 1, last_row - STU_COLNAMEROW, STU_IDCOL);
      var data_values = data_range.getValues();

      for (var i = 0; i < data_values.length; i++) {
        var row = data_values[i];
        var id = row[STU_IDCOL - 1];
        var first_name = row[STU_FIRSTNAMECOL - 1];
        var last_name = row[STU_LASTNAMECOL - 1];

        if (id) {
          if (student_dict.hasOwnProperty(id)) {
            //only add Instrument
            student_dict[id]["Instrument"][teacher_id] = row[STU_INSTRUMENT - 1];
          } //new entry
          else {
            student_dict[id] = {
              contact_status: row[STU_CONTACTSTATUSCOL - 1],
              student_name: first_name + " " + last_name,
              teacher_id: teacher_id,
              teacher_name: teacher_name,
              course_status: row[STU_BILLINGSTATUS - 1],
              Instrument: { [teacher_id]: row[STU_INSTRUMENT - 1] },
              Anmeldungen: row[STU_ANMELDUNG - 1],
              EMail: row[STU_EMAIL - 1],
              Telefon_mobil: row[STU_TELEFONMOBIL - 1],
              Telefon_Vormittag: row[STU_TELEFONVORMITTAG - 1],
              Rechnungsname: row[STU_RECHNUNGSNAME - 1],
              Rechnungsadresse: row[STU_RECHNUNGSADRESSE - 1],
              Rechnungsort: row[STU_RECHNUNGSORT - 1],
              Rechnungs_PLZ: row[STU_RECHNUNGSPLZ - 1],
              Rechnungs_Mail: row[STU_RECHNUNGSMAIL - 1],
              Wohngemeinde: row[STU_WOHNGEMEINDE - 1],
              Geburtsdatum: row[STU_GEBURTSDATUM - 1],
              Schule_Klasse: row[STU_SCHULEKLASSE - 1],
            };
          }
        }
      }
    } catch (e) {
      console.warn("[TF_GET]Error when trying go get Infos from teacherfile. Error code: " + e.message);
      continue;
    }
  }
  return student_dict;
}

//returns list of objects, each object contains key value pairs where key is the header and value is a single row in the room usage table
function getRoomUsageData() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  var room_data = [];
  while (file_iter.hasNext()) {
    var file_id = file_iter.next().getId();
    var teacherfile_ss = SpreadsheetApp.openById(file_id);
    var roomusage_sheet = teacherfile_ss.getSheetByName(ROOMUSAGESHEETNAME);

    var teacher_id = teacherfile_ss.getName().split("_")[0];

    var num_cols = roomusage_sheet.getLastColumn();
    var last_row = roomusage_sheet.getLastRow();
    var num_data_rows = last_row - ROOM_HEADERROW;
    if (num_data_rows == 0) {
      continue;
    }
    var room_data_teacher_headers = roomusage_sheet.getRange(ROOM_HEADERROW, 1, 1, num_cols).getValues().flat();
    var room_data_teacher = roomusage_sheet.getRange(ROOM_HEADERROW + 1, 1, num_data_rows, num_cols).getDisplayValues();

    for (var row of room_data_teacher) {
      row.push(teacher_id);
      row_obj = Object.assign(...room_data_teacher_headers.map((k, i) => ({ [k]: row[i] })));
      row_obj["Lehrer_ID"] = teacher_id;
      room_data.push(row_obj);
    }
  }

  return room_data;
}

function getRoomBillingData() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  var overview_data = [];
  var details_data = [];

  while (file_iter.hasNext()) {
    var file_id = file_iter.next().getId();
    //var file_id = "1sTUXGXoXGO3n2i84Y5rci2LcjG2aCXcSI1J-K0-Mv6E"      //DEBUG
    var teacherfile_ss = SpreadsheetApp.openById(file_id);

    var teabillingsheet = teacherfile_ss.getSheetByName(TEACHERBILLINGSHEETNAME);
    var filename_split = teacherfile_ss.getName().split("_");
    var teacher_id = filename_split[0];
    var room_billing_units = teacherfile_ss
      .getSheetByName(FORMULASSHEETNAME)
      .getRange(FORMULA_VALUEROW, FORMULA_ROOMBILLINGFACTORCOL)
      .getValue();
    // ####DETAILS DATA#####
    var details_values = teabillingsheet
      .getRange(
        BILTEA_ROOMBILLINGDETAIL_FIRSTROW,
        BILTEA_ROOMBILLINGDETAIL_FIRSTCOL,
        BILTEA_ROOMBILLINGDETAIL_LASTROW - BILTEA_ROOMBILLINGDETAIL_FIRSTROW + 1,
        BILTEA_ROOMBILLINGDETAIL_LASTCOL - BILTEA_ROOMBILLINGDETAIL_FIRSTCOL + 1
      )
      .getValues();

    //delete rows where student name col is empty
    //that filters out rows where course was deleted (only first col is filled) but keeps cols where no units are entered and courses where amout is 0
    //in edge case where the student name is "", we also keep rows there the last field is not ""
    details_values = details_values.filter((row) => (row[1] !== "") | (row[row.length - 1] !== ""));

    //add teacher_id(beginning) and room billing units(end) to each row
    for (let i = 0; i < details_values.length; i++) {
      details_values[i].unshift(teacher_id);
      details_values[i].push(room_billing_units);
    }

    details_data = details_data.concat(details_values);

    // ####OVERVIEW DATA#####
    var overview_values = teabillingsheet
      .getRange(
        BILTEA_ROOMBILLINGOVERVIEW_FIRSTROW,
        BILTEA_ROOMBILLINGOVERVIEW_FIRSTCOL,
        BILTEA_ROOMBILLINGOVERVIEW_LASTROW - BILTEA_ROOMBILLINGOVERVIEW_FIRSTROW + 1,
        BILTEA_ROOMBILLINGOVERVIEW_LASTCOL - BILTEA_ROOMBILLINGOVERVIEW_FIRSTCOL + 1
      )
      .getValues();

    // keep criteria is that "Zweigstelle" is not empty
    overview_values = overview_values.filter((row) => row[0] !== "");

    //add teacher_id to each row
    for (let i = 0; i < overview_values.length; i++) {
      overview_values[i].unshift(teacher_id);
    }

    overview_data = overview_data.concat(overview_values);

    //return [details_data, overview_data]       //DEBUG
  }
  return [details_data, overview_data];
}

/**
 * Get open payments information for active teachers for a specific payment number
 * @param {Object} active_teachers - Object containing active teacher information (teacher_id as keys)
 * @param {number} payment_number - Payment number to check (1-5, where 1-4 are regular payments, 5 is saldo)
 * @returns {Object} Updated active_teachers object with total_courses and open_payments counts added
 */
function getOpenPayments(active_teachers, payment_number) {
  console.log("[TF_GET] Starting getOpenPayments for payment number: " + payment_number);

  //var active_teachers = {"032": {}}
  //var payment_number = 1
  // Get column numbers based on payment number
  let dueCol, paidCol;
  switch (payment_number) {
    case 1:
      dueCol = PAYMENT1DUECOL;
      paidCol = PAYMENT1PAIDCOL;
      break;
    case 2:
      dueCol = PAYMENT2DUECOL;
      paidCol = PAYMENT2PAIDCOL;
      break;
    case 3:
      dueCol = PAYMENT3DUECOL;
      paidCol = PAYMENT3PAIDCOL;
      break;
    case 4:
      dueCol = PAYMENT4DUECOL;
      paidCol = PAYMENT4PAIDCOL;
      break;
    case 5:
      dueCol = SALDOPAYMENTDUECOL;
      paidCol = SALDOPAYMENTPAIDCOL;
      break;
    default:
      console.error("[TF_GET] Invalid payment number: " + payment_number);
      return active_teachers;
  }

  // Get active teacher IDs from the active_teachers object
  const activeTeacherIds = Object.keys(active_teachers);

  let file_iter = TEACHERFILESFOLDER.getFiles();
  while (file_iter.hasNext()) {
    let file = file_iter.next();
    let fileName = file.getName();
    let teacherId = fileName.split("_")[0];

    // Skip if this teacher is not in our active teachers list
    if (!activeTeacherIds.includes(teacherId)) {
      continue;
    }

    try {
      let teacherFile = SpreadsheetApp.openById(file.getId());
      let billingSheet = teacherFile.getSheetByName(BILLINGSTUDENTSHEETNAME);

      // Check if billing sheet exists
      if (!billingSheet) {
        console.warn("[TF_GET] No billing sheet found for teacher: " + teacherId);
        continue;
      }

      let lastRow = billingSheet.getLastRow();

      // If there's no data beyond the header row, delete from active teacher dict
      if (lastRow <= BILSTU_HEADERROW) {
        delete active_teachers[teacherId];
        continue;
      }

      // Get all course data from the billing sheet
      let dataRows = lastRow - BILSTU_HEADERROW;
      let dueValues = billingSheet
        .getRange(BILSTU_HEADERROW + 1, dueCol, dataRows, 1)
        .getValues()
        .flat();
      let paidValues = billingSheet
        .getRange(BILSTU_HEADERROW + 1, paidCol, dataRows, 1)
        .getValues()
        .flat();

      let totalCourses = 0;
      let openPayments = 0;

      // Count courses and open payments
      for (let i = 0; i < dueValues.length; i++) {
        let dueAmount = dueValues[i];
        let paidAmount = paidValues[i];

        // Skip empty rows (where due amount is empty/blank)
        if (dueAmount === "" || dueAmount == null) {
          continue;
        }

        // Check if course if active
        if (dueAmount == PAYMENTSTATUSNOTDUE) {
          continue;
        }

        totalCourses++;

        // Check if payment is open (due and paid amounts don't match)
        // Handle both numeric and string comparisons, and null/undefined cases
        let dueNum = typeof dueAmount === "number" ? dueAmount : parseFloat(dueAmount) || 0;
        let paidNum = typeof paidAmount === "number" ? paidAmount : parseFloat(paidAmount) || 0;

        if (Math.abs(dueNum - paidNum) > 0.01) {
          // Use small epsilon for floating point comparison
          openPayments++;
        }
      }

      // Delete if no open payments
      if (openPayments === 0) {
        delete active_teachers[teacherId];
        continue;
      }
      // Add the counts to the teacher's data
      active_teachers[teacherId]["total_courses"] = totalCourses;
      active_teachers[teacherId]["open_payments"] = openPayments;

      console.log(
        "[TF_GET] Teacher " + teacherId + ": " + totalCourses + " courses, " + openPayments + " open payments"
      );
    } catch (error) {
      console.error("[TF_GET] Error processing teacher file for " + teacherId + ": " + error.message);
      // Set default values in case of error
      active_teachers[teacherId]["total_courses"] = "Error";
      active_teachers[teacherId]["open_payments"] = "Error";
    }
  }
  console.log(active_teachers);
  console.log("[TF_GET] Completed getOpenPayments for payment number: " + payment_number);
  return active_teachers;
}
