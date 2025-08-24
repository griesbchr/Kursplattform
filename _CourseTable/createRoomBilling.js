function createRoomBilling() {
  var room_billing_array = TF.getRoomBillingArray();
  //write array to new sheet
  var year = Number(DATA.getYear());
  var sheet_name =
    "Raumabrechnung_20" +
    String(year) +
    "_20" +
    String(year - 1) +
    "_" +
    Utilities.formatDate(new Date(), "GMT+1", "dd.MM.yyyy'_'HH:mm");
  var ss = SpreadsheetApp.create(sheet_name);
  var file = DriveApp.getFileById(ss.getId());
  var folder = DriveApp.getFoldersByName(DATASOURCESFOLDERNAME).next();
  file.moveTo(folder);
  var data_course_sheet = ss.getSheets()[0];
  data_course_sheet.setName("Raumabrechnung");

  var data_list = ["Vorname", "Nachname"];
  var teacher_id_name_dict = TT.getTeacherData(data_list);

  //concat firstname and lastname of object+
  for (const [key, value] of Object.entries(teacher_id_name_dict)) {
    teacher_id_name_dict[key] = value["Vorname"] + " " + value["Nachname"];
  }

  //write header
  var headers = [
    "LehrerIn_Name",
    "Zweigstelle",
    "SchuelerIn_Name",
    "Unterrichtsminuten",
    "Raumbenützungseinheiten",
    "Kurseinheiten",
    "Wert",
  ];

  //change teacher_id to teacher_name
  room_billing_array.forEach((row) => (row[0] = teacher_id_name_dict[row[0]]));

  data_course_sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  data_course_sheet.getRange(2, 1, room_billing_array.length, headers.length).setValues(room_billing_array);

  //formatting
  data_course_sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  data_course_sheet
    .getRange(1, 1, room_billing_array.length + 1, headers.length)
    .setBorder(true, true, true, true, true, true);
  data_course_sheet.autoResizeColumns(1, headers.length);
  data_course_sheet.setFrozenRows(1);

  //add filter
  data_course_sheet.getRange(1, 1, room_billing_array.length + 1, headers.length).createFilter();

  return;
}
