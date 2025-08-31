function doTeacherFilePreprocessing(courses) {
  //check server load
  //var num_triggers = ScriptApp.getProjectTriggers().length
  //if (num_triggers > 12){throw Error("Zu viele Lehrkräfte versuchen momentan Kurse zu starten. Bitte versuchen Sie es später erneut.")}

  var ss_id = courses["ss_id"];
  var studentsheet_rows = courses["studentsheet_rows"];

  var teacherfile_ss = SpreadsheetApp.openById(ss_id);
  var student_sheet = teacherfile_ss.getSheetByName(STUDENTSSHEETNAME);

  //setting courses to status Kurs wird gestartet
  var last_row = student_sheet.getLastRow();
  var status_col_range = student_sheet.getRange(1, STU_BILLINGSTATUS, last_row);
  var status_col_vals = status_col_range.getValues();
  var status_col_colors = status_col_range.getBackgrounds();
  var checkbox_col_range = student_sheet.getRange(ATT_HEADERROW, STU_CHECKBOXCOL, last_row - ATT_HEADERROW);
  var checkbox_col_vals = checkbox_col_range.getValues();

  //change vals for rows
  for (var row of studentsheet_rows) {
    status_col_vals[row - 1] = [COURSESTARTINGVALUE];
    status_col_colors[row - 1] = [YELLOW];
    checkbox_col_vals[row - 1 - checkbox_col_range] = [false];
  }

  status_col_range.setValues(status_col_vals);
  status_col_range.setBackgrounds(status_col_colors);
  try {
    //checkbox_col_range.setValues(checkbox_col_vals)
  } catch (e) {
    console.log(e.message);
  }
}

function createCourses(courses) {
  doTeacherFilePreprocessing(courses);

  var course_list = courses["course_list"];
  for (var course of course_list) {
    //console.log("started async course call for "+courses.length+" courses")
    //Utilities.sleep(1000) //sleep for two seconds to prevent overwrites in teacherfiles
    //Async.call('createCourses', courses);
    createCourse(course);
  }
  return;
}

function createCoursesNoPreprocessing(courses) {
  var course_list = courses["course_list"];
  for (var course of course_list) {
    //console.log("started async course call for "+courses.length+" courses")
    //Utilities.sleep(1000) //sleep for two seconds to prevent overwrites in teacherfiles
    //Async.call('createCourses', courses);
    createCourse(course);
  }
  return;
}

function createCoursesMultithreaded(courses) {
  var max_courses_per_worker = 2;
  var num_processes = Math.ceil(courses["course_list"].length / max_courses_per_worker);

  doTeacherFilePreprocessing(courses);
  SpreadsheetApp.flush();

  //split into static and splitable objects
  var static_obj = { ss_id: courses["ss_id"] };
  delete courses["ss_id"];
  var split_obj = { course_list: courses["course_list"], studentsheet_rows: courses["studentsheet_rows"] };
  API.postThreadedTFApi("create_courses_no_preprocessing", static_obj, split_obj, num_processes);
  return;
}

function createCourse(course) {
  Logger.log("[TF]Starting adding course");

  //add some new attributes
  course["KursID"] = DATA.getNewCourseID();

  //set contract lessons and room rent
  course["Vertrag_Einheiten"] = getCourseHours(course);
  course["Raumbenutzung_Einheiten"] = getRoomRent(course);

  course["Freigabedatum"] = new Date();
  course["Verein"] = DATA.getAssociation(course["Zweigstelle"]);

  //add to other tabs
  course = addCourseToAttendancelist(course);
  course = addCourseToBillinglist(course);
  addCourseToRoomusage(course);

  //add course to administration lists
  course = CT.addCourseToCourseBillingTable(course);
  SpreadsheetApp.flush();
  course = CT.addCourseToCourseTable(course);
  SpreadsheetApp.flush();
  //set enrollment status
  ET.setCourseStatus(course["SchuelerID"], COURSESTARTEDVALUE);

  //sent mail to teacher and parent
  if (course["Anmeldungen"] == NOCONTRACTSTATUS || course["Anmeldungen"] == "") {
    try {
      sentContractMailByCourseDict(course);
    } catch (e) {
      console.warn("[TF][ERROR]The following error occured when trying to sent the course contract mail:" + e.message);
    }
  }
  console.log("[" + course["KursID"] + "] Sent Contract");

  //check billing checkbox, lock course parameter and set course id
  changeStudentSheet(course);
  Logger.log(
    "[TF]Added course " + course["KursID"] + " of student " + course["SchuelerID"] + " to teacher " + course["LehrerID"]
  );
}

function getCourseHours(course) {
  var course_hours;
  //set contract lessons and room rent
  if (course["Kursmodus"] == ROOMRENTATCOURSELOCATIONNAME) {
    // am Kursort
    course_hours = 30 - DATA.getRoomRent(course["Zweigstelle"]);
  } else if (course["Kursmodus"] == ROOMRENTATSTUDENTNAME) {
    // bei Schüler
    course_hours = 30 - ROOMRENTATSTUDENT;
  } // bei Lehrer
  else {
    course_hours = 30 - DATA.getRoomRent(course["Zweigstelle"]); //teacher gets same rent as school would get
  }

  //overwrite if group course
  if (course["Kursnummer"] == 10) {
    course_hours = GROUPLESSONS;
  }

  return course_hours;
}

function getRoomRent(course) {
  var room_rent;
  //set contract lessons and room rent
  if (course["Kursmodus"] == ROOMRENTATCOURSELOCATIONNAME) {
    // am Kursort
    room_rent = DATA.getRoomRent(course["Zweigstelle"]);
  } else if (course["Kursmodus"] == ROOMRENTATSTUDENTNAME) {
    // bei Schüler
    room_rent = 0;
  } // bei Lehrer
  else {
    room_rent = 0;
  }

  //overwrite if group course
  if (course["Kursnummer"] == 10) {
    room_rent = 0;
  }

  return room_rent;
}

function changeStudentSheet(course) {
  //get student sheet
  let file = getTeacherFile(course["LehrerID"]);
  let file_id = file.getId();
  let student_sheet = SpreadsheetApp.openById(file_id)
    .getSheets()
    .filter((e) => e.getName() === STUDENTSSHEETNAME)[0];
  let row = UTLS.findValueInCol(student_sheet, STU_IDCOL, course["SchuelerID"]);
  //change course status to course is in progress
  student_sheet.getRange(row, STU_BILLINGSTATUS).setValue(COURSESTARTEDVALUE);
  //reset color of status field
  student_sheet.getRange(row, STU_BILLINGSTATUS).setBackground(null);
  //set course ID
  student_sheet.getRange(row, STU_COURSEIDCOL).setValue(course["KursID"]);
  //set protection to course parameters
  var protection = student_sheet
    .getRange(row, STU_COURSEPARAMSTARTINGCOL, 1, STU_COURSEPARAMLENGTH)
    .setFontColor(CANNOTCHANGECOLOR)
    .protect();
  protection.removeEditors(protection.getEditors()).addEditors(EDITORSMAILLIST).setDescription(course["KursID"]);

  //undo row selection
  student_sheet.getRange(row, STU_CHECKBOXCOL).uncheck();
}
