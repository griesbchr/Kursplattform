function deleteStudentRow(student) 
{
  Logger.log("[TF]returning student wit id " + student["SchuelerID"] + " from teacher with id " + student["LehrerID"] + " to enrollment table")
  let file = getTeacherFile(student["LehrerID"])
  let file_id = file.getId()
  let sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME)
  let row = UTLS.findValueInCol(sheet, STU_IDCOL, student["SchuelerID"])
  if (row == 0){
    Logger.log("[TF][ERROR] when deleting student: id " + student["SchuelerID"] + "not found in teacherfile from teacher_id " + student["LehrerID"])
    return
    }
  sheet.deleteRow(row)
}
