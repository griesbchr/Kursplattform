function updatePreRegistrations() 
{
  var last_row = PREREGSHEET.getLastRow()
  var num_rows = last_row - FIRSTDATAROW + 1
  
  var prereg_student_range = PREREGSHEET.getRange(FIRSTDATAROW, NOTESCOL, num_rows) 
  var prereg_student_ids = prereg_student_range.getValues().flat()
  var comments = PREREGSHEET.getRange(FIRSTDATAROW, COMMENTSCOL, num_rows).getValues().flat()

  var student_id_dict = {}
  var comments_dict = {}

  prereg_student_ids.forEach((key, idx) => {
    student_id_dict[key] = ONLINEPREREGSTATUS;
    comments_dict[key] = comments[idx];
  });

  //TODO add TF lib - we removed it becaues importing it every time is very slow
  var not_found_ids = TF.updatePregegStatus(student_id_dict, comments_dict)

  prereg_student_range.setBackground(GREEN)

  SpreadsheetApp.flush()

  if (not_found_ids.length > 0)
  {
    Browser.msgBox("Für die folgenden SchülerIDs wurde kein Schüler in den Lehrerdateien gefunden:\\n\\n" + not_found_ids);
  }else{
    Browser.msgBox("Voranmeldestatus erfolgreich eingetragen.");
  }
}

function test()
{
  
}