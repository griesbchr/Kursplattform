const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxyohLxJD_JnmiZqCgsJEXn_IgHuaoaYukPXKMaXzu8CqydpOuc-7pVPEwFAL_OfAEP/exec"

function updateWebappUrl()
{
  //set new link in _APIs    
  API.setScriptProperty("TF_GET_URL", WEBAPP_URL)
}


function doGet(e) {
  var data;
  switch(e.parameter["request_type"])
  {
  case("get_studentinfos_thread"):
    var fileids_string = e.parameter["arg"]
    var file_id_list = fileids_string.split(",")
    data = getStudentInfos(file_id_list)
    break

  case("get_all_contactstatus"):
    data = getAllContactStatus_mod()
    break

  case("get_teacherfile_link"):
    var id = e.parameter["arg"]
    data = getTeacherFileLink(id)
    break
  case("get_teacherfile_fileid"):
    var id = e.parameter["arg"]
    data = getTeacherFileIdentifier(id)
    break

  case("get_teacherfile_ids"):
    data = getTeacherFileIDs()
    break

  case("get_teacherfile_fileids"):
    data = getTeacherFileFileIDs()
    break

  case("get_all_teacherfile_names"):
    data = getAllTeacherFileNames()
    break
  case("sleep"):
    Utilities.sleep(1000*10)
    data = "slept 10 seconds"
    break;
  case("test_msg"):
    Logger.log("sendint test msg")
    data = "sending test msg"
    break

  default:
    throw(new Error("action string '"+e.parameter["request_type"]+"' could not be matched in file TeacherFiles"))   
  }

  var json_string = JSON.stringify(data);
  var json_out = ContentService.createTextOutput(json_string);
  json_out.setMimeType(ContentService.MimeType.JSON);

  return json_out
}