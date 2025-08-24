function sentApiMessage(action_string, dict) {
  dict["LehrerID"] = SpreadsheetApp.getActiveSpreadsheet().getName().split("_")[0]
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(dict)
  };
  try {
    UrlFetchApp.fetch(TEACHERFILESURL + "?request_type=" + action_string, options);
  } catch (e) {
    Browser.msgBox("An error occured when trying to post a message: " + e.message)
  }
}

function postCourseToTeacherFiles(course) { sentApiMessage("create_course", course) }
function postCoursesToTeacherFiles(courses) { sentApiMessage("create_courses", courses) }
function postCoursesToTeacherFilesMultithreaded(courses) { sentApiMessage("create_courses_multithreaded", courses) }
function returnStudentToEnrollment(student) { sentApiMessage("return_student", student) }
function derollStudent(course) { sentApiMessage("deroll_student", course) }
function sentCourseContract(course) { sentApiMessage("sent_course_contract", course) }
function sentTestMessage() { sentApiMessage("log_test", {}) }
function addEmptyStudent(data) {sentApiMessage("add_empty_student", data)}
