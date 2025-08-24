function test_getroombilling() {
  var file_id_list = ["1LYLb0661QOHn_fofXsxV3Aa58ZY_RoR_pc9Mh8hAft0", "1WtjGjRkg0gDC731LuFgWkJg0wZDssgQyHFWrDyp0hbE"];
  var room_billing_array = getRoomBillingArray(file_id_list);
  console.log(room_billing_array);
}

function getRoomBillingArray() {
  var file_id_list = getAllTeacherFileIds();
  let room_billing_array = [];
  var temp_array;
  for (var file_id of file_id_list) {
    try {
      temp_array = getRoomBillingPerTeacher(file_id);

      //concat to room_billing_array
      room_billing_array = room_billing_array.concat(temp_array);
    } catch (e) {
      console.warn("[TF_GET]Error when trying go get Infos from teacherfile. Error code: " + e.message);
      continue;
    }
  }
  return room_billing_array;
}

function getRoomBillingPerTeacher(teacherfileid) {
  let teacherfile = SpreadsheetApp.openById(teacherfileid);
  let teacher_id = teacherfile.getName().split("_")[0];
  let sheet = teacherfile.getSheetByName(BILLINGCOURSESHEETNAME);
  console.log("processing teacherfile: " + teacherfile.getName())
  let value_array = sheet
    .getRange(
      BILTEA_ROOMBILLING_FIRSTROW,
      BILTEA_ROOMBILLING_FIRSTCOL,
      BILTEA_ROOMBILLING_LASTROW - BILTEA_ROOMBILLING_FIRSTROW + 1,
      BILTEA_ROOMBILLING_LASTCOL - BILTEA_ROOMBILLING_FIRSTCOL + 1
    )
    .getValues();

  //remove empty rows
  value_array = value_array.filter((row) => row[0] != "");
  //strip each row entry
  value_array = value_array.map((row) => row.map((entry) => entry.toString().trim()));

  //concat row with teacher_id
  value_array.forEach((row) => row.unshift(teacher_id));
  return value_array;
}
