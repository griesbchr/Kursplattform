function addCourseToAttendancelist(course) {
  let file = getTeacherFile(course["LehrerID"]);

  let date_only_rule = SpreadsheetApp.newDataValidation().requireDate().build();
  let attendance_rule = SpreadsheetApp.newDataValidation().requireValueInList(DATA.getAttendanceValues()).build();

  try {
    var spreadsheet = SpreadsheetApp.openById(file.getId());
    var sheet = spreadsheet.getSheets().filter((e) => e.getName() === ATTENDANCESHEETNAME)[0];
    UTLS.lockSheet(sheet);

    var upper_row = appendCleanRows(sheet, 2);
    var lower_row = upper_row + 1;
    //insert first name and last name cols
    sheet.getRange(upper_row, ATT_FIRSTNAMECOL, 2, 1).merge();
    sheet.getRange(upper_row, ATT_LASTNAMECOL, 2, 1).merge();
    sheet
      .getRange(upper_row, ATT_FIRSTNAMECOL, 1, 2)
      .setValues([[course["S_Vorname"], course["S_Nachname"]]])
      .setVerticalAlignments([["middle", "middle"]])
      .setHorizontalAlignments([["left", "left"]]);
    //set course id to last one after last row with white font
    sheet.getRange(upper_row, ATT_COURSEIDCOL).setValue(course["KursID"]).setFontColor("white");

    sheet
      .getRange(upper_row, ATT_FIRSTNAMECOL, 2, 2)
      .setBorder(true, true, true, true, true, false, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
      .setBorder(null, null, null, null, true, false, null, SpreadsheetApp.BorderStyle.SOLID);

    //set fields for all course lessons the teacher can hold. Max is the lessins stated in the contract
    let att_hours_range_upper = sheet.getRange(upper_row, ATT_LASTNAMECOL + 1, 1, course["Vertrag_Einheiten"]);
    let att_hours_range_lower = sheet.getRange(lower_row, ATT_LASTNAMECOL + 1, 1, course["Vertrag_Einheiten"]);
    att_hours_range_lower.setDataValidations([Array(att_hours_range_upper.getNumColumns()).fill(attendance_rule)]);
    att_hours_range_upper.setNumberFormats([Array(att_hours_range_upper.getNumColumns()).fill("dd.mm.")]);
    att_hours_range_upper.setDataValidations([Array(att_hours_range_upper.getNumColumns()).fill(date_only_rule)]);
    sheet
      .getRange(upper_row, ATT_LASTNAMECOL + 1, 2, course["Vertrag_Einheiten"])
      .setBorder(true, true, true, true, true, true, null, SpreadsheetApp.BorderStyle.SOLID);
    sheet
      .getRange(upper_row, ATT_LASTNAMECOL + 1, 2, MAXLESSONS)
      .setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    //prohibit teacher from adding more hours than stated in the contract
    if (ATT_NOCOURSELOCATIONHOURSCOL - ATT_LASTNAMECOL - course["Vertrag_Einheiten"] - 1 > 0) {
      //33 - 2 - 30/29/28/27 - 1 = 0/1/2/3
      var protection = sheet
        .getRange(
          upper_row,
          ATT_LASTNAMECOL + course["Vertrag_Einheiten"] + 1,
          2,
          ATT_NOCOURSELOCATIONHOURSCOL - ATT_LASTNAMECOL - course["Vertrag_Einheiten"] - 1
        )
        .protect();
      protection.removeEditors(protection.getEditors()).addEditors(EDITORSMAILLIST).setDescription("not allowed units");
    }

    //set last 3 cols
    sheet.getRange(upper_row, ATT_NOCOURSELOCATIONHOURSCOL, 2).merge();
    sheet.getRange(upper_row, ATT_EXPECTEDHOURSCOL, 2).merge();
    sheet
      .getRange(upper_row, ATT_ACTUALHOURSCOL, 2)
      .merge()
      .setFormula("=COUNTA(C" + lower_row + ":AF" + lower_row + ")"); //=COUNTA(D33:AG33)
    sheet
      .getRange(upper_row, ATT_NOCOURSELOCATIONHOURSCOL, 2, 3)
      .setBorder(true, true, true, true, true, false, null, SpreadsheetApp.BorderStyle.SOLID)
      .setBorder(true, true, true, true, null, false, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    course["attendance_url"] = createRowUrl(sheet, upper_row, upper_row + 1);
    course["attendancesheet_row"] = upper_row;

    //set yellow when empty rule
    var rules = sheet.getConditionalFormatRules();

    var emptyrule_lessons = SpreadsheetApp.newConditionalFormatRule()
      .whenCellEmpty()
      .setBackground(YELLOW)
      .setRanges([sheet.getRange(upper_row, ATT_LASTNAMECOL + 1, 2, course["Vertrag_Einheiten"])]);
    var emptyrule_lessons_sum = SpreadsheetApp.newConditionalFormatRule()
      .whenCellEmpty()
      .setBackground(YELLOW)
      .setRanges([sheet.getRange(upper_row, ATT_NOCOURSELOCATIONHOURSCOL, 2, 2)]);

    rules.push(emptyrule_lessons, emptyrule_lessons_sum);
    sheet.setConditionalFormatRules(rules);

    // data validation rules
    var expected_hours_less_than_max_lessons_rule = SpreadsheetApp.newDataValidation()
      .requireNumberLessThanOrEqualTo(course["Vertrag_Einheiten"])
      .setAllowInvalid(false)
      .setHelpText(
        "Anzahl der voraussichtlichen Kurseinheiten darf die Anzahl der im Kursvertrag festgelegten Kurseinheiten nicht überschreiten."
      )
      .build();
    sheet.getRange(upper_row, ATT_EXPECTEDHOURSCOL, 2, 2).setDataValidation(expected_hours_less_than_max_lessons_rule);

    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of course table");
    throw e;
  } finally {
    UTLS.releaseSheetLock(sheet);
  }
  return course;
}
