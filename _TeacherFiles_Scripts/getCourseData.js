function getCourseData(course_id, teacher_id) 
{
  var teacher_file = getTeacherFile(teacher_id)
  let spreadsheet =  SpreadsheetApp.openById(teacher_file.getId())
  let sheet = spreadsheet.getSheetByName(STUDENTSSHEETNAME)
  let row = UTLS.findValueInCol(sheet, STU_COURSEIDCOL, course_id)
  if (row == 0)
  {
    throw Error("Course id '"+course_id+"' was not found in teacher file '" + teacher_file.getName()+"'. Make sure the Course ID is in the correct col("+STU_COURSEIDCOL+")")
  }
  
  var last_col = sheet.getLastColumn()
  var name_array = sheet.getRange(STU_COLNAMEROW, 1, 1, last_col).getValues().flat()
  var value_array = sheet.getRange(row, 1, 1, last_col).getValues().flat()

  var data_dict = arraysToObject(name_array, value_array)
  data_dict["Vertrag_Einheiten"] = getCourseHours(data_dict)

  return data_dict

}


function arraysToObject(names, values) {
  if (names.length !== values.length) {
    throw new Error("Names and values arrays must have the same length");
  }

  var result = {};

  for (var i = 0; i < names.length; i++) {
    name = names[i].replace(/\n/g, '');
    result[name] = values[i];
  }

  return result;
}

function test_getcoursedata()
{
  var course_id = "K230872"
  var teacher_id = "206"

  var startTime = new Date();
  var data_dict = getCourseData(course_id, teacher_id)
  var endTime = new Date();

  var executionTime = (endTime - startTime) / 1000; // Convert to seconds
  
  Logger.log("Function execution time: " + executionTime + " seconds");
  console.log(data_dict)
}