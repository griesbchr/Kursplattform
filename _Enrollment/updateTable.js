function updateDataValidation(range, list)
{ 
  //build new validation from first row
  let new_validation = range.getDataValidations()[0][0].copy().requireValueInList(list).build()
  range.clearDataValidations()
  range.setDataValidations(Array(range.getNumRows()).fill([new_validation]))
}

function updateDropDowns()
{
  let sheet = ENROLLMENTSHEET
  //fetch updated lists
  let teacher_list = API.getTFApi("get_all_teacherfile_names")
  let district_list = DATA.getDistricts()

  //sort lists alphabetically
  teacher_list.sort((a, b) => {
  const nameA = a.split('_')[1];
  const nameB = b.split('_')[1];

  return nameA.localeCompare(nameB);
  });
  district_list.sort()

  //add default choice as first choice
  district_list.unshift(NODISTRICTVALUE)
  teacher_list.unshift(NOTEACHERVALUE)

  //update all rows
  let len = sheet.getLastRow()
  updateDataValidation(sheet.getRange(COLNAMEROW+1, TEACHERCOL,len), teacher_list)
  updateDataValidation(sheet.getRange(COLNAMEROW+1, DISTRICTCOL, len), district_list)
}
