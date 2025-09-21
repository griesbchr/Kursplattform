//Url to add students
const ADDSTU_BASEURL = "https://script.google.com/a/macros/kursplattform.at/s/AKfycbyW-KuOy6LFZN76Vc30HZ1D8s-mC_5XGJcsLyOdkyUjKXngs2_Azoe8j2OD3nyXH9UkCQ/exec?id="

//always insert new deployment id below, when making changes, change to the newest version in "manage deployments!" (url ll stay the same)
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzixZZxNOTyKnmJrrAka_SmyCbqp2jT4gKfwPJ4-QiPxV0mjCKxAjyS6ClcklsTRwxE_w/exec"

function updateWebappUrl()
{
  //set new link in template
  SpreadsheetApp.openById(TEMPLATEFILE.getId()).getDeveloperMetadata()[0].setValue(WEBAPP_URL)    
  
  //set new link in _APIs    
  API.setScriptProperty("TF_POST_URL", WEBAPP_URL)

  //set new link in all teacher files
  let file_iter = TEACHERFILESFOLDER.getFiles()
  while (file_iter.hasNext()) 
  {
    SpreadsheetApp.openById(file_iter.next().getId()).getDeveloperMetadata()[0].setValue(WEBAPP_URL)
  }
}
 

function doPost(e)
{
  switch(e.parameter["request_type"])
  {
  case("create_course"):
    //return          //this is to deactivate course starts from now on, deactivate this later!
    var course = JSON.parse(e.postData.contents)
    createCourse(course)
    break;
  case("create_courses"):
    //return          //this is to deactivate course starts from now on, deactivate this later!
    var courses = JSON.parse(e.postData.contents)
    createCourses(courses)
    break;
  case("create_courses_multithreaded"):
    //return          //this is to deactivate course starts from now on, deactivate this later!
    var courses = JSON.parse(e.postData.contents)
    createCoursesMultithreaded(courses)
    break;
  case("create_courses_no_preprocessing"):
    //return          //this is to deactivate course starts from now on, deactivate this later!
    var courses = JSON.parse(e.postData.contents)
    createCoursesNoPreprocessing(courses)
    break;
  case("share_teacher_file"):
    var data = JSON.parse(e.postData.contents)
    shareTeacherFile(data["ID"], data["email"])
    break;

  case("fetch_mails"):
    var data = JSON.parse(e.postData.contents)
    fetch_mails(data)
    break;
  
  case("return_student"):
    var student = JSON.parse(e.postData.contents)
    ET.returnStudent(student)
    deleteStudentRow(student)
    break;

  case("deroll_student"):
    var course = JSON.parse(e.postData.contents)
    endCourse(course)
    break;  

  case("generate_course_contract"):
    var course = JSON.parse(e.postData.contents)
    generateCourseContract(course)
    break;

  case("create_teacher_file"):
    var data = JSON.parse(e.postData.contents)
    createTeacherFile(data["ID"])
    break;

  case("add_empty_student"):
    var data = JSON.parse(e.postData.contents)
    addEmptyStudentToContactlist(data)
    break;

  case("add_student"):
    var data = JSON.parse(e.postData.contents)
    addStudentToContactlist(data)
    break;
  case("archive_teacherfile"):
    var data = JSON.parse(e.postData.contents)
    archiveTeacherFilesFromAPI(data)
    break;
  case("reset_teacherfile_sheets"):
    var data = JSON.parse(e.postData.contents)
    resetTeacherFilesSheets(data)
    break;
  case("delete_courses"):
    var data = JSON.parse(e.postData.contents)
    deleteCourses(data)
    CT.deleteCourses(data)
    break;
  case("log_test"):
    Logger.log("test message was received in new version")
    break;
  case("sleep"):
    Utilities.sleep(1000*10);
    break;

  default:
    throw(new Error("action string '"+e.parameter["request_type"]+"' could not be matched in file TeacherFiles"))    
  }
}

function fetch_mails(data)
{
  ET.updateEnrollments()
}
