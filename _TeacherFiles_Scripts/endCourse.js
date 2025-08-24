function endCourse(course) {
  //get sheet and row
  let file = getTeacherFile(course["LehrerID"]);
  let file_id = file.getId();
  let sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME);
  let row = UTLS.findValueInCol(sheet, STU_IDCOL, course["SchuelerID"]);

  //change font and protection status of course parameters as a new course can be started with that student
  sheet.getRange(row, STU_COURSEPARAMSTARTINGCOL, 1, STU_COURSEPARAMLENGTH).setFontColor("black");
  let protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  let rem_protections = protections.filter((e) => e.getDescription() == course["KursID"]);
  if (rem_protections.length > 0) {
    rem_protections[0].remove();
  }

  //lock attendance sheet row and change color
  // TODO: delete if 0 course hours
  let att_sheet = SpreadsheetApp.openById(file_id).getSheetByName(ATTENDANCESHEETNAME);
  let att_sheet_row = UTLS.findValueInCol(att_sheet, ATT_COURSEIDCOL, course["KursID"]);
  
  var protection = att_sheet
    .getRange(att_sheet_row, 1, 2, att_sheet.getLastColumn() - 1)
    .setFontColor(CANNOTCHANGECOLOR)
    .protect();
  protection
    .removeEditors(protection.getEditors())
    .addEditors(EDITORSMAILLIST);

  //change color of name in stu_bil sheet
  // TODO: delete if 0 course hours
  let bil_stu_sheet = SpreadsheetApp.openById(file_id).getSheetByName(BILLINGSTUDENTSHEETNAME);
  let bil_stu_sheet_row = UTLS.findValueInCol(bil_stu_sheet, BILSTU_COURSEIDCOL, course["KursID"]);
  bil_stu_sheet.getRange(bil_stu_sheet_row, 1, 1, 3).setFontColor(CANNOTCHANGECOLOR);

  //set expected hours to current hours (for room billing)
  var course_hours = att_sheet.getRange(att_sheet_row, ATT_ACTUALHOURSCOL).getValue();
  att_sheet.getRange(att_sheet_row, ATT_EXPECTEDHOURSCOL).setValue(course_hours);

  //TODO: return if 0 course hours

  //set price per hours
  var price_per_hour = bil_stu_sheet.getRange(bil_stu_sheet_row, BILSTU_PRICEPERHOURCOL).getValue();

  //set date string
  var date_string = att_sheet
    .getRange(att_sheet_row, ATT_COURSESTARTDATECOL, 1, ATT_COURSEFIELDSLEN)
    .getValues()
    .flat();
  date_string = date_string.filter((e) => e != "");
  try{
    date_string = date_string.map((e) => e.toLocaleDateString("de-DE"));
  }catch(e)
  {
  }
  date_string = date_string.join(", ");

  //check if this course was a trial
  if (course_hours <= TRIALLESSONS && course_hours > 0) {
    //set lessons in billing sheet to zero
    let stu_bill_sheet = SpreadsheetApp.openById(file_id).getSheetByName(BILLINGSTUDENTSHEETNAME);
    let row = UTLS.findValueInCol(stu_bill_sheet, BILSTU_COURSEIDCOL, course["KursID"]);
    stu_bill_sheet.getRange(row, BILSTU_ACTUALHOURSCOL).setValue(0);
    stu_bill_sheet.getRange(row, BILSTU_INTENDEDHOURSCOL).setValue(0);

    let stu_course_sheet = SpreadsheetApp.openById(file_id).getSheetByName(BILLINGCOURSESHEETNAME);
    addTrialToAssocServices(stu_course_sheet, course_hours, course);
    var billing_number = NOCOURSEBILLINGNUMBER;
  } else {
    //if course is not trial, then set current hours to expected hours for the room billing
    att_sheet.getRange(att_sheet_row, ATT_EXPECTEDHOURSCOL).setValue(course_hours);
    var billing_number = TT.incrementBillingNumber(course["LehrerID"]);
  }

  //change status in other files
  ET.setCourseStatus(course["SchuelerID"], DEREGISTEREDVALUE);
  CT.setCourseEnded(course["KursID"], course_hours, price_per_hour, date_string, billing_number);

  //set course status to deregistered
  sheet.getRange(row, STU_BILLINGSTATUS).setValue(DEREGISTEREDVALUE);

  //uncheck selection box
  sheet.getRange(row, STU_CHECKBOXCOL).uncheck();

  Logger.log(
    "[TF]Ended course " +
      course["KursID"] +
      " of student " +
      course["SchuelerID"] +
      " and teacher " +
      course["LehrerID"]
  );
}

function addTrialToAssocServices(sheet, hours, course) {
  //add lessons to associations services table
  let cell = UTLS.getNextFreeDataCellDownwards(
    sheet.getRange(BILCOU_ASSOCSERVICESHEADERROW + 1, BILCOU_ASSOCSERVICESKINDCOL)
  );
  let cells = sheet.getRange(cell.getRow(), BILCOU_ASSOCSERVICESKINDCOL, 1, BILCOU_ASSOCSERVICESWRITECOLLEN);
  cells.clearDataValidations();
  
  let assc = DATA.getAssociation(course["Zweigstelle"]);
  var protection = cells
    .setValues([
      [TRIALNAME, course["Kursnummer"], assc, Number(hours), course["S_Vorname"] + " " + course["S_Nachname"]],
    ])
    .protect();
  protection
    .removeEditors(protection.getEditors())
    .addEditors(EDITORSMAILLIST);
}
