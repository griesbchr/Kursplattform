function setDriveStatusColor(id, color) {
  let row = getTeacherRow(id);
  let cell = TEACHERSHEET.getRange(row, DRIVESTATUSCOL);
  cell.setBackground(color);
}

//colors correspond start at first line and end at last line
function setDriveStatusColors(colors) {
  TEACHERSHEET.getRange(HEADINGROWS + 1, DRIVESTATUSCOL, TEACHERSHEET.getLastRow() - HEADINGROWS).setBackgrounds(
    colors.map((val) => [val])
  );
}

function setDriveLink(id, link) {
  let row = getTeacherRow(id);
  let cell = TEACHERSHEET.getRange(row, IDCOL);
  cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(id).setLinkUrl(link).build());
}

function setBillingNumber(id, number) {
  let row = getTeacherRow(id);
  let cell = TEACHERSHEET.getRange(row, BILLINGNUMBERCOL);
  cell.setValue(number);
}

function setAllTeacherFileIDs()
{
  var teacher_ids = TF_GET.getTeacherFileIDs()
  for (let teacher_id of teacher_ids)
  {
    var row = getTeacherRow(teacher_id)
    var file_id = TF_GET.getTeacherFileId(teacher_id)
    TEACHERSHEET.getRange(row, TEACHERFILEIDCOL).setValue(file_id)
  }
  
}

