function fixPermissions()
{
  var atten_unprotect_list = ["C:AH"]
  var bilstu_unprotect_list = ["V:W", "AB:AC", "AJ:AK", "Y:Z", "AF:AG"]
  var biltea_unprotec_list = ["A21:E30", "A4:E18", "H55:P64", "L30:M30", "L22:M23", "L37:M51"]
  var roomusage_unprotec_list = ["A5:G26"]

  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    var teacherfile = file_iter.next()
    var file_id = teacherfile.getId()
    //var file_id = "1KLsvhiBiRUVXHrRvWUiHarr9Rwi8CvIMeOP5ek0qt_I"
    var teacherfile_ss =  SpreadsheetApp.openById(file_id)
    console.log("Teacher File: "  + teacherfile_ss.getName())
    var protection_type = SpreadsheetApp.ProtectionType.SHEET

    var protec_list = teacherfile_ss.getProtections(protection_type)
    for (var protec of protec_list)
    {
      var sheet = teacherfile_ss.getSheetByName(protec.getRange().getSheet().getName())
      switch(protec.getRange().getSheet().getName()){
      case ATTENDANCESHEETNAME:
      var add_ranges = atten_unprotect_list
      break;
      case BILLINGSTUDENTSHEETNAME:
      var add_ranges = bilstu_unprotect_list
      break;
      case BILLINGCOURSESHEETNAME:
      var add_ranges = biltea_unprotec_list
      break;
      case ROOMUSAGESHEETNAME:
      var add_ranges = roomusage_unprotec_list
      break;
      default:
      continue;
      }
      var ranges = []
      add_ranges.forEach(v => ranges.push(sheet.getRange(v)))
      protec.setUnprotectedRanges(ranges);
    }
  }
}


function fixReferences() 
{
  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    var teacherfile = file_iter.next()
    var file_id = teacherfile.getId()
    //var file_id = "1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"      //debug
    //var file_id = "13ibW_UR8RjP0_eOt65y0MdCmE_l6SfAjp_bKeqYfMS0"
    var teacherfile_ss =  SpreadsheetApp.openById(file_id)
    console.log("Startin teacher " + teacherfile_ss.getName())
    var att_sheet = teacherfile_ss.getSheetByName(ATTENDANCESHEETNAME)
    var bil_sheet = teacherfile_ss.getSheetByName(BILLINGSTUDENTSHEETNAME)

    //create map with rows and ids
    var att_row_id_map = {} 
    var att_course_id_vals = att_sheet.getRange(1, ATT_COURSEIDCOL, att_sheet.getLastRow()).getValues().flat()
    att_course_id_vals.forEach((v, i) => {
      if (v != "") 
      { att_row_id_map[v] = i+1 }
    })

    //check if the dict matches the ids from the student billing sheet
    if (bil_sheet.getLastRow() == 4){continue}
    var bil_id_values = bil_sheet.getRange(5, BILSTU_COURSEIDCOL, bil_sheet.getLastRow() - 5 + 1).getValues().flat()
    
    var exp_lessons_values = bil_sheet.getRange(5, BILSTU_INTENDEDHOURSCOL, bil_sheet.getLastRow() - 5 + 1).getFormulas().flat()

    var ref_col_values = exp_lessons_values.map((v, i) => 
    {
      if (v != "")
      {
        return  v.match(/\d+$/)[0];
      }else {   //no formula means that either something is wrong or course ended
        return "-1"   //means that course ended
      }
    })

    //check consistency
    for (var i=0; i < bil_id_values.length; i++)
    {
      var bil_course_id = bil_id_values[i]

      var real_att_row = att_row_id_map[bil_course_id]

      if (!real_att_row)
      {
        continue
      }
      if (real_att_row != ref_col_values[i] &&  ref_col_values[i] != "-1" )
      {
        console.log(teacherfile_ss.getName() + ": missmatch for stubil row " + (i+1+4))

        //fix value
        //var exp_formula = "=Anwesenheitsliste!AH" + real_att_row
        //var current_formula = "=Anwesenheitsliste!AI" + real_att_row

        //bil_sheet.getRange(i+1+4, BILSTU_INTENDEDHOURSCOL).setFormula(exp_formula)
        //bil_sheet.getRange(i+1+4, BILSTU_ACTUALHOURSCOL).setFormula(current_formula)


      }

    }
  }
  return
}
