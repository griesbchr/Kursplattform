function getAllContactStatus() 
{
  Logger.log("[ET]Updating contact status diagram")
  let lastRow = CONTACTSTATUSSHEET.getLastRow()
  CONTACTSTATUSSHEET.getRange(2,1,lastRow,6).clear()
  var teacher_file_ids = API.getTFApi("get_teacherfile_fileids")
  var student_info_dict = API.getThreadedTFApi("get_studentinfos_thread", teacher_file_ids)
  var value_array = []
  for (const [id, status_dict] of Object.entries(student_info_dict)) 
  {
    if (id.startsWith("K")){continue}   //old teacher file format, dont need these ones
    const new_row = new Array(6);
    
    new_row[0] = id   
    new_row[1] = status_dict["teacher_id"]
    new_row[2] = status_dict["teacher_name"]
    new_row[3] = status_dict["student_name"]
    new_row[4] = status_dict["contact_status"]
    new_row[5] = status_dict["course_status"]
    value_array.push(new_row)
  }
  CONTACTSTATUSSHEET.getRange(2,1,value_array.length,6).setValues(value_array)
  Logger.log("[ET]Finished updating contact status diagram")
}
