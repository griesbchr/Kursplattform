function getTeachersWithStartingCourses()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacher_list = []

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    file_id = teacherfile.getId()
    var teacherfile_ss =  SpreadsheetApp.openById(file_id)
    var students_sheet = teacherfile_ss.getSheetByName(STUDENTSSHEETNAME)
    var coursestatus_data = students_sheet.getRange(1, STU_BILLINGSTATUS, students_sheet.getLastRow()).getValues().flat()
    if (coursestatus_data.indexOf(COURSESTARTINGVALUE) != -1)
    {
      teacher_list.push(teacherfile_ss.getName())
    }
  }
  if (teacher_list.length > 0)
  {
      console.log(teacher_list)
    MAIL.sentMail("christoph.griesbacher@kursplattform.at", "Fehler bei Kursstart", "Fehler bei Kursstart bei den folgenden Lehrern: "+ String(teacher_list))
  }
}

function checkDoubleCourses()
{
  var duplicate_list = []
  
  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    var teacherfile_id = teacherfile.getId()
    //teacherfile_id = "1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8" 
    var teacherfile_ss = SpreadsheetApp.openById(teacherfile_id)
    var att_sheet = teacherfile_ss.getSheetByName(ATTENDANCESHEETNAME)

    var last_row = att_sheet.getLastRow()
    if (last_row == ATT_HEADERROW){continue;}
    var firstnames = att_sheet.getRange(ATT_HEADERROW+1, ATT_FIRSTNAMECOL, last_row-ATT_HEADERROW).getValues().flat()
    var lastnames = att_sheet.getRange(ATT_HEADERROW+1, ATT_LASTNAMECOL, last_row-ATT_HEADERROW).getValues().flat()
    
    var full_names = firstnames.map((value, index) => [value + " "+ lastnames[index]]);

    full_names = full_names.flat()

    full_names = full_names.filter(v => v.trim() != "")

    let has_duplicates = new Set(full_names).size !== full_names.length;

    if (has_duplicates)
    {
      duplicate_list.push(teacherfile.getName())
    }
  }
  console.log(duplicate_list)
  return
}

function checkRoomBillingReferences()
{
    
  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    var teacherfile = file_iter.next()
    console.log("Starting teacher file " + teacherfile.getName())
    var teacherfile_id = teacherfile.getId()
    //var teacherfile_id = "1m0piEuzI7GtrOy-Yy6b0gB3JP_rAhf7bMcqGM6msMSg"

    var teacherfile_ss = SpreadsheetApp.openById(teacherfile_id)

    var att_sheet = teacherfile_ss.getSheetByName(ATTENDANCESHEETNAME)

    var last_row = att_sheet.getLastRow()
    if (last_row == ATT_HEADERROW){continue;}

    var firstnames = att_sheet.getRange(ATT_HEADERROW+1, ATT_FIRSTNAMECOL, last_row-ATT_HEADERROW).getValues().flat()
    var lastnames = att_sheet.getRange(ATT_HEADERROW+1, ATT_LASTNAMECOL, last_row-ATT_HEADERROW).getValues().flat()
    var full_names = firstnames.map((value, index) => [value + " "+ lastnames[index]]);

    var expected_hours = att_sheet.getRange(ATT_HEADERROW+1,ATT_EXPECTEDHOURSCOL, last_row-ATT_HEADERROW).getValues().flat()
    var no_room_hours = att_sheet.getRange(ATT_HEADERROW+1,ATT_NOCOURSELOCATIONHOURSCOL, last_row-ATT_HEADERROW).getValues().flat()


    full_names = full_names.flat()
    
    var full_names_dict = {}

    for (var i=0; i < full_names.length; i++)
    {
      if (no_room_hours[i] != 0)
      {
        var expected_hours_val = expected_hours[i] - no_room_hours[i]
      }else{
        var expected_hours_val = expected_hours[i]
      }
      if (full_names[i] in full_names_dict) //name in dict, just append
      {
        full_names_dict[full_names[i]].push(expected_hours_val)
      }else{
        full_names_dict[full_names[i]] = [expected_hours_val]
      }
    }
    delete full_names_dict[""];


    var teabil_sheet = teacherfile_ss.getSheetByName(BILLINGCOURSESHEETNAME)
    var names_bil = teabil_sheet.getRange(BILTEA_ROOMBILLING_FIRSTROW, BILTEA_ROOMBILLING_FIRSTCOL+1, BILTEA_ROOMBILLING_LASTROW-BILTEA_ROOMBILLING_FIRSTROW).getValues().flat()

    var expected_hours_bil = teabil_sheet.getRange(BILTEA_ROOMBILLING_FIRSTROW, BILTEA_ROOMBILLING_FIRSTCOL+4, BILTEA_ROOMBILLING_LASTROW-BILTEA_ROOMBILLING_FIRSTROW).getValues().flat()

    
    var value_bil = teabil_sheet.getRange(BILTEA_ROOMBILLING_FIRSTROW, BILTEA_ROOMBILLING_FIRSTCOL+5, BILTEA_ROOMBILLING_LASTROW-BILTEA_ROOMBILLING_FIRSTROW).getValues().flat()

    for (var i=0; i < names_bil.length; i++)
    {
      var cur_name = names_bil[i] 
      if (cur_name === ""){continue}
      var cur_hours = expected_hours_bil[i]
      var cur_val = value_bil[i]

      if (! (cur_name in full_names_dict))
      {
        console.log("Student " + cur_name + " from room billing not found in attendance list")
        continue;
      }
      var val_index = full_names_dict[cur_name].indexOf(cur_hours)
      if (val_index !== -1)
      {
        full_names_dict[cur_name].splice(val_index,1)
        if (full_names_dict[cur_name].length == 0)
        {
          delete full_names_dict[cur_name]
        }
      } else{
        if (cur_val == 0) //wrong hours dont matter as there is no money
        {

        }else if(full_names_dict[cur_name].length == 1){   //curr value is not 0 that means we have to fix it. Check if there is only one value for that name in att list, then we can juse that value
          
          //ONLY PRINT 
          console.log("Student " + cur_name + " from room billing found in attendance list, but cur_hours " + cur_hours + " dont match with dict entries "+ JSON.stringify(Object.values(full_names_dict  [cur_name])))  

          //OR OPTIONALLY FIX 
          //var cur_row = i + BILTEA_ROOMBILLING_FIRSTROW
          //console.log("TEACHER "+  teacherfile.getName() +": Student "+cur_name+" Overwriting value " + cur_hours + " for value " + full_names_dict[cur_name][0] + " in TeacherBil row " + cur_row)
          //teabil_sheet.getRange(cur_row, 5).setValue(full_names_dict[cur_name][0])
        }else{
        console.log("Student " + cur_name + " from room billing found in attendance list, but cur_hours " + cur_hours + " dont match with dict entries "+ JSON.stringify(Object.values(full_names_dict[cur_name])))
        }
      }
    }

  }
    return

}
