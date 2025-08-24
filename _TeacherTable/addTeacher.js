function addTeacher()
{
  let last_row = TEACHERSHEET.getLastRow()
  let id_array = TEACHERSHEET.getRange(HEADINGROWS+1,IDCOL, last_row-HEADINGROWS).getValues().flat()
  var new_teacher_id;
  if (id_array.len == 0) {new_teacher_id=1}else
  { new_teacher_id = Math.max.apply(Math, id_array)+1}
  let new_number_id = String(new_teacher_id)
  let missing_zeros = IDLEN - new_number_id.length
  let id_string = "0".repeat(missing_zeros) + new_number_id
  let row = last_row + 1
  TEACHERSHEET.getRange(row, IDCOL).setRichTextValue(SpreadsheetApp.newRichTextValue().setText(id_string).build())
  TEACHERSHEET.getRange(row, DRIVESTATUSCOL).insertCheckboxes()
}
