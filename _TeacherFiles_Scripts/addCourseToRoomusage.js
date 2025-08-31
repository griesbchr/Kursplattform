function addCourseToRoomusage(course) {
  try {
    let file = getTeacherFile(course["LehrerID"]);
    let spreadsheet = SpreadsheetApp.openById(file.getId());

    var roomsheet_course_sheet = spreadsheet.getSheetByName(ROOMUSAGESHEETNAME);
    var sheet_id = roomsheet_course_sheet.getSheetId();
    UTLS.lockSheet(sheet_id);

    var row = appendCleanRows(roomsheet_course_sheet, 1);
    var course_data = [course["S_Vorname"] + " " + course["S_Nachname"], course["Zweigstelle"], course["Instrument"]];

    roomsheet_course_sheet.getRange(row, ROOM_NAMECOL, 1, course_data.length).setValues([course_data]);

    // Add dropdown for Week days
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(WEEKDAYS, true).setAllowInvalid(false).build();
    roomsheet_course_sheet.getRange(row, ROOM_DAYCOL).setDataValidation(rule);

    // Add colors and borders
    var last_col = roomsheet_course_sheet.getLastColumn();
    var course_range = roomsheet_course_sheet.getRange(row, 1, 1, last_col);
    var can_edit_range = roomsheet_course_sheet.getRange(row, ROOM_DAYCOL, 1, ROOM_ROOMCOL - ROOM_DAYCOL + 1);

    // Medium for vertical fields
    course_range.setBorder(null, null, null, null, true, null, null, SpreadsheetApp.BorderStyle.SOLID);

    // Solid for all borders
    course_range.setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Solid between edit and non edit range
    can_edit_range.setBorder(null, true, null, null, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Set to yellow of editable range when empty
    var emptyrule_lessons = SpreadsheetApp.newConditionalFormatRule()
      .whenCellEmpty()
      .setBackground(YELLOW)
      .setRanges([can_edit_range]);

    // Add empty rule for lessons
    roomsheet_course_sheet.setConditionalFormatRules(
      roomsheet_course_sheet.getConditionalFormatRules().concat(emptyrule_lessons)
    );

    //Sort range after "Zweigstelle" and then "Name"
    var sort_range = roomsheet_course_sheet.getRange(
      ROOM_FIRSTROW,
      1,
      roomsheet_course_sheet.getLastRow() - ROOM_FIRSTROW + 1,
      last_col
    );
    sort_range.sort([
      { column: ROOM_DISTRICTSCOL, ascending: true },
      { column: ROOM_NAMECOL, ascending: true },
    ]);

    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of room usage table");
    throw e;
  } finally {
    UTLS.releaseSheetLock(sheet_id);
  }
}
