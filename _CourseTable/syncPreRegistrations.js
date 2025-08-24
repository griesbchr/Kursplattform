function syncPreRegistrations() 
{
  var last_row = COURSEBILLINGSHEET.getLastRow()
  var num_rows = last_row - BIL_FIRST_DATAROW + 1

  //read data from sheet
  var student_id_range = COURSEBILLINGSHEET.getRange(BIL_FIRST_DATAROW, STUDENTIDCOL, num_rows)
  var student_ids = student_id_range.getValues().flat()
  var preregs = COURSEBILLINGSHEET.getRange(BIL_FIRST_DATAROW, BIL_PREREGCOL, num_rows).getValues().flat()

  var prereg_student_id = student_ids.filter((_, index) => preregs[index]);

  var student_id_dict = {}

  prereg_student_id.forEach((id, index) => {
    student_id_dict[id] = PREREGWITHADMINFEE;  
  });

  var not_found_ids = TF.updatePregegStatus(student_id_dict)

  SpreadsheetApp.flush()
  
  if (not_found_ids.length > 0)
  {
    Browser.msgBox("Für die folgenden SchülerIDs wurde kein Schüler in den Lehrerdateien gefunden:\\n\\n" + not_found_ids);
  }else{
    Browser.msgBox("Voranmeldestatus erfolgreich eingetragen.");
  }
}
