function doGet(e) {
  switch(e.parameter["request_type"]){
  case("course_id"):
    return ContentService.createTextOutput(getNewCourseID())
    break;
  case("room_rent"):
    return ContentService.createTextOutput(getRoomRent(e.parameter["billing_post"]))
    break
  case("attendance_values"):
    return ContentService.createTextOutput(JSON.stringify(getAttendanceValues()))
    break
  default:
    return ContentService.createTextOutput("No keyword match")
  }
}

function doPost(e)
{
  
}
