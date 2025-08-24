
function testUpdatePregegStatus()
{
  var student_id_dict = {}
  student_id_dict["S241004"] = "Teststatus 1"
  student_id_dict["S241039"] = "Teststatus 1"
  student_id_dict["S123456"] = "Teststatus 1"
  var comments_dict = {}
  comments_dict["S241039"] = "Comment 1"
  var assigned_ids = updatePregegStatus(student_id_dict, comments_dict)
  console.log(assigned_ids)
}

function updatePregegStatus(student_id_dict, comments_dict={}) 
{
  var teacherfile_id_list = getAllTeacherFileIds()
  teacherfile_id_list.sort()

  //overwrite id list for debugging
  //var teacherfile_id_list = ["1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"]

  //make a separate array for assigned values. Deleting values leads to problem where students have multiple courses
  var assigned_ids = []   
  
  for (var teacherfile_id of teacherfile_id_list)
  {
    teacherfile_ss = SpreadsheetApp.openById(teacherfile_id)
    var student_sheet = teacherfile_ss.getSheetByName(STUDENTSSHEETNAME)
    var last_row = student_sheet.getLastRow()
    var num_rows = last_row - STU_COLNAMEROW;

    if (num_rows == 0)
    {
      continue
    }
    var id_values = student_sheet.getRange(STU_COLNAMEROW+1, STU_IDCOL, num_rows).getValues()
    var preregstatus_values = student_sheet.getRange(STU_COLNAMEROW+1, STU_PREREGISTRATIONSTATUSCOL, num_rows).getValues()
    var comments_values = student_sheet.getRange(STU_COLNAMEROW+1, STU_COMMENTSCOL, num_rows).getValues()
    var id_value;
    for (var i=0; i<id_values.length; i++)
    { 
      id_value = id_values[i]
      if (id_value in student_id_dict)
      {
        preregstatus_values[i] = [student_id_dict[id_value]]
        assigned_ids.push(id_value)

        //additionally update comment if available
        if (id_value in comments_dict && comments_dict[id_value] !== "")
        {
          comments_values[i] = [comments_dict[id_value]]
        }
      }
    }

    //write value array
    student_sheet.getRange(STU_COLNAMEROW+1, STU_PREREGISTRATIONSTATUSCOL, num_rows).setValues(preregstatus_values)
    student_sheet.getRange(STU_COLNAMEROW+1, STU_COMMENTSCOL, num_rows).setValues(comments_values)
    console.log("Finished teacherfile " + teacherfile_ss.getName())
  }

  //make assigned_ids unique
  assigned_ids = [...new Set(assigned_ids)];

  //find ids that didnt get matched
  for (var assigned_id of assigned_ids)
  {
    delete student_id_dict[assigned_id]
  }

  var unassigned_ids = Object.keys(student_id_dict)

  console.log("unassigned_ids " + unassigned_ids)

  return unassigned_ids;

}
