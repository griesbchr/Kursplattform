function getTeacherFilesInOrder() {
  console.log("starting");
  //get dict with key: fileID, value: filename
  let file_dict = {};
  let file_iter = TEACHERFILESFOLDER.getFiles();
  while (file_iter.hasNext()) {
    //get student sheet
    var file = file_iter.next();
    file_dict[file.getId()] = file.getName();
  }
  const sortedDict = Object.entries(file_dict).sort((a, b) => parseInt(a[1].slice(0, 3)) - parseInt(b[1].slice(0, 3)));
  const file_map = new Map(sortedDict);
  console.log(file_map.get("1b1K20DxIISKyLmPdJa_5p6m-uP9byUo7D9zOniwZyII"));
  const element = file_map.entries().next().next().value;
  console.log(element);
  return;
}

function getTeacherIDFileDict() {
  //TODO
}

function getTeacherFile(id) {
  id = id.toString().padStart(3, "0");

  var file_id = TT.getTeacherFileFileId(id);
  if (file_id == -1) {
    throw new Error("Teacherfile with id " + id + " not found in TeacherTable.");
  }
  try {
    var file = DriveApp.getFileById(file_id);
  } catch (e) {
    throw new Error(
      "Could not open Teacherfile for teacher with id " +
        id +
        " and file id + " +
        file_id +
        " due to error " +
        e.message
    );
  }

  return file;
}

function test() {
  console.log(getTeacherFile("005").getName());
}

function getAllTeacherFileNames() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let file_names = [];
  while (file_iter.hasNext()) {
    file_names.push(file_iter.next().getName());
  }
  return file_names;
}

function getAllTeacherFileIds() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let file_ids = [];
  while (file_iter.hasNext()) {
    file_ids.push(file_iter.next().getId());
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

//returns dict of kind { student_id : [student_contact_status, student_name, teacher_id, teacher_name]}
function getAllContactStatus() {
  let file_iter = TEACHERFILESFOLDER.getFiles();
  let student_dict = {};
  while (file_iter.hasNext()) {
    //get student sheet
    var file = file_iter.next();
    var file_id = file.getId();
    var student_sheet = SpreadsheetApp.openById(file_id)
      .getSheets()
      .filter((e) => e.getName() === STUDENTSSHEETNAME)[0];
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

function createRowUrl(sheet, row1, row2 = row1) {
  return (
    "https://docs.google.com/spreadsheets/d/" +
    sheet.getParent().getId() +
    "/edit#gid=" +
    sheet.getSheetId() +
    "&range=" +
    row1 +
    ":" +
    row2
  );
}

function appendCleanRows(sheet, n) {
  //append rows
  let last_row = sheet.getMaxRows();
  sheet.insertRowsAfter(last_row, n);
  let upper_row = last_row + 1;

  //clean rows
  let range = sheet.getRange(upper_row, 1, n, sheet.getMaxColumns());
  range.clearDataValidations();
  range.clearFormat();
  range.clearContent();
  range.clear();
  return upper_row;
}

function appendCleanRow(sheet) {
  //append row
  sheet.appendRow([[]]);
  row = sheet.getMaxRows();

  //clean row
  let range = sheet.getRange(row, 1, 1, sheet.getMaxColumns());
  range.clearDataValidations();
  range.clearFormat();
  range.clearContent();
  range.clear();
  return row;
}

function setGroupBorder(range) {
  range
    .setBorder(null, null, null, null, true, true, null, SpreadsheetApp.BorderStyle.SOLID)
    .setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}
