const DELETECOURSEMESSAGE = "Sollen die ausgewählten Kurse wirklich gelöscht werden?"

function deleteCourse() {
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started deleting course")

  //set active sheet
  SpreadsheetApp.setActiveSheet(STUDENTSSHEET)
  var rows_stu = getCheckedRows(STUDENTSSHEET, STU_CHECKBOXCOL)

  //-----------------------------------check if course is started---------------------------------------
  var del_rows = []
  for (var row of rows_stu) {
    if (STUDENTSSHEET.getRange(row, STU_BILLINGSTATUS).getValue() != COURSESTARTEDVALUE) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Kurs für SchülerInnen in Reihe " + del_rows + " wurden nicht gestartet.", null, 30)
    return
  }
  rows_stu = rows_stu.filter(e => !del_rows.includes(e))

  //-------------------check if student selected---------------------------------------
  if (rows_stu.length == 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Bitte unter 'Auswählen' SchülerInnen auswählen.")
    return 
  }

  //get course ids
  var course_ids_stu = STUDENTSSHEET.getRange(1, STU_COURSEIDCOL, STUDENTSSHEET.getLastRow()).getValues().flat()
  course_ids_stu = rows_stu.map(i => course_ids_stu[i-1]).filter(v => v !== undefined);

  //-------------------check if courses have any hours registered---------------------------------------
  var att_last_row = ATTENDANCESHEET.getLastRow()
  //get rows in attendance sheet
  var course_ids_att = ATTENDANCESHEET.getRange(1, ATT_COURSEIDCOL, att_last_row).getValues().flat()

  //get rows of interest in id col
  var rows_idx_att = course_ids_att.map((value, index) => course_ids_stu.includes(value) ? index : -1).filter(index => index !== -1);

  //check if any of the selected course ids have attendance hours
  var course_hours_att = ATTENDANCESHEET.getRange(1, ATT_CURRENTHOURSCOL, att_last_row).getValues().flat()

  //filter for the correct ids
  course_hours_att = course_hours_att.filter((_,i) => rows_idx_att.includes(i))

  if (course_hours_att.some(value => value !== 0)) {
  SpreadsheetApp.getActiveSpreadsheet().toast("Bitte Anwesenheit der betreffenden Kurse löschen.", null, 30)
  return
  }

  //-------------------check if any payments are due for that course---------------------------------------
  var bilstu_last_row = BILLINGSTUDENTSHEET.getLastRow()
  
  //get rows in attendance sheet
  var course_ids_bilstu = BILLINGSTUDENTSHEET.getRange(1, BILSTU_COURSEIDCOL, bilstu_last_row).getValues().flat()

  //get rows of interest from id col
  var rows_idx_bilstu = course_ids_bilstu.map((value, index) => course_ids_stu.includes(value) ? index : -1).filter(index => index !== -1);

  //get payment value array
  var payment_values = BILLINGSTUDENTSHEET.getDataRange().getValues()

  //reduce to rows of interest
  var payment_values_red = payment_values.filter((_,i) => rows_idx_bilstu.includes(i))

  var name_col_ids = [BILSTU_FIRSTNAMECOL-1, BILSTU_LASTNAMECOL-1]
  var student_names = payment_values_red.map((row_val, row_id) => row_val.filter((v,i) =>name_col_ids .includes(i)))

  student_names = student_names.map(v => v[0] + " " + v[1])

  //reduce to cols of interest
  var payment_col_ids = [BILSTU_PAYMENT1DUECOL-1, BILSTU_PAYMENT2DUECOL-1, BILSTU_PAYMENT3DUECOL-1, BILSTU_PAYMENT4DUECOL-1, BILSTU_PAYMENT5DUECOL-1]
  payment_values_red = payment_values_red.map((row_val, row_id) => row_val.filter((v,i) =>payment_col_ids .includes(i)))

  var is_unvalid_row = payment_values_red.map((row) => row.some(v => v !== NOPAYMENTDUEVALUE))
  var is_unvalid = is_unvalid_row.some(row => row)

  if (is_unvalid) {
  SpreadsheetApp.getActiveSpreadsheet().toast("Kurse mit bereits fälligen Zahlungen können nicht gelöscht werden.", null, 30)
  return
  }
  SpreadsheetApp.flush()

  //-------------------check if all lessons entered-----------------------------------
  var result = SpreadsheetApp.getUi().alert(DELETECOURSEMESSAGE, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)

  if (result == "CANCEL") {
    SpreadsheetApp.getActiveSpreadsheet().toast("Vorgang abgebrochen")
    return
  }
  //-------------------delete course from spreadsheet and course table-------------------
  data = {}
  data["KursIDs"] = course_ids_stu
  data["spreadsheet_id"] = TEACHERSPREADSHEET.getId()
  data["rows_idx_att"] = rows_idx_att
  data["rows_idx_bilstu"] = rows_idx_bilstu
  data["student_names"] = student_names
  data["course_ids_stu"] = course_ids_stu
  sentApiMessage("delete_courses", data)
  
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started deleting course(s) " + course_ids_stu )

}

