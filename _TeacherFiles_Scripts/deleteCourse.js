function deleteCourses(data) 
{
  var ss_id = data["spreadsheet_id"]
  var rows_idx_att = data["rows_idx_att"]
  var rows_idx_bilstu = data["rows_idx_bilstu"]
  var student_names = data["student_names"]
  var course_ids_stu = data["course_ids_stu"]

  var ss = SpreadsheetApp.openById(ss_id)

  var stu_sheet = ss.getSheetByName(STUDENTSSHEETNAME)
  var att_sheet = ss.getSheetByName(ATTENDANCESHEETNAME)
  var bilstu_sheet = ss.getSheetByName(BILLINGSTUDENTSHEETNAME)
  var bilcou_sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)


  //var course_ids = data["KursIDs"]


  //-------------------delete course from attendance sheet-------------------
  rows_idx_att.sort((a, b) => b - a); //sort in reverse order, bottom rows first
  var row_att;
  for (var row_idx_att of rows_idx_att)
  {
    row_att = row_idx_att + 1;
    att_sheet.deleteRows(row_att, 2)
  }

  //-------------------delete course from student billing sheet-------------------
  rows_idx_bilstu.sort((a, b) => b - a); //sort in reverse order, bottom rows first
  var row_stubil;
  for (var row_idx_bilstu of rows_idx_bilstu)
  {
    row_stubil = row_idx_bilstu + 1;
    bilstu_sheet.deleteRow(row_stubil)
  }

  //-------------------delete course from room billing-------------------
  //find student name in room billing
  for (var student_name of student_names)
  {
    var room_billing_row = UTLS.findValueInCol(bilcou_sheet, BILCOU_ROOMBILLINGSTUDENTNAMECOL, student_name)
    
    if (room_billing_row == -1){throw new Error("Name '"+student_name+"' not found in course billing table.")}

    //leave name of district because deleting it would mess up the room payment overview!
    bilcou_sheet.getRange(room_billing_row, BILCOU_ROOMBILLINGSTARTINGCOL+1, 1, BILCOU_ROOMBILLINGCOLCOUNT).clearContent()
    
  }

  //-------------------reset course status, colors, permissions, in student sheet-------------------

  var row;
  for (var course_id_stu of course_ids_stu)
  {    
    row = UTLS.findValueInCol(stu_sheet, STU_COURSEIDCOL, course_id_stu)
    
    //reset color
    stu_sheet.getRange(row, STU_COURSEPARAMSTARTINGCOL, 1, STU_COURSEPARAMLENGTH).setFontColor("black");
    
    //reset protections
    let protections = stu_sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    let rem_protections = protections.filter((e) => e.getDescription() == course_id_stu);
    if (rem_protections != null && rem_protections.length > 0) {
      rem_protections[0].remove();
    }

    //reset status
    stu_sheet.getRange(row, STU_COURSEIDCOL).setValue(NOCOURSEVALUE);
    stu_sheet.getRange(row, STU_BILLINGSTATUS).setValue(NOCOURSEVALUE);
    stu_sheet.getRange(row, STU_BILLINGSTATUS).setBackground(null)

    //remove tick
    stu_sheet.getRange(row, STU_CHECKBOXCOL).setValue(false);
  }

}

function testfkt()
{
  var ss = SpreadsheetApp.openById("1vAVDaHVO2a6VaBn79vIPk50FRflm-n3vqcJbXt1k5Rc")
  var bilcou_sheet = ss.getSheetByName("Lehrerabrechnung") 
  console.log( UTLS.findValueInCol(bilcou_sheet, BILCOU_ROOMBILLINGSTUDENTNAMECOL, "AA g"))
}
