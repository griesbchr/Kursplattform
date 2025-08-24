function testReset()
{
  //var teacherfile = DriveApp.getFileById("1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8")
  //archiveTeacherFiles(false)
  var teacherfile_id_list = ["1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"]

  resetStudentList(teacherfile_id_list)
}

function resetAllStuduentLists()
{
  var student_id_list = getAllTeacherFileIds()
  student_id_list.sort()
  resetStudentList(student_id_list)
}

function resetStudentList(teacherfile_ids) 
{
    for (var teacherfile_id of teacherfile_ids)
    {
      var spreadsheet = SpreadsheetApp.openById(teacherfile_id);
      
      console.log("[TF] starting to reset student sheet "+spreadsheet.getName())

      // Get student sheet
      var student_sheet = spreadsheet.getSheetByName(STUDENTSSHEETNAME);
      
      //get number of student rows
      var last_row = student_sheet.getLastRow()


      //remove all protections that start with "K" (meaning KXXXX or Kurs nicht gestartet)
      var protections = student_sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
      for (var j = 0; j < protections.length; j++) {
        var protection = protections[j];
        if (protection.getDescription().startsWith('K')) {
          protection.remove();
          //Logger.log('Removed protection: ' + protection.getDescription() + ' from sheet: ' + student_sheet.getName());
        }
      }

      var num_rows = last_row - STU_COLNAMEROW;

      if (num_rows == 0)
      {
        continue
      }
      //reset color of course infos
      student_sheet.getRange(STU_COLNAMEROW+1, STU_COURSEPARAMSTARTINGCOL, num_rows, STU_COURSEPARAMLENGTH).setFontColor("black");

      //reset fill color of "Verrechnungsstatus"
      student_sheet.getRange(STU_COLNAMEROW+1, STU_BILLINGSTATUS, num_rows).setBackground("white")
      
      //reset "Verrechnungs status"	Kontaktstatus	"Eltern verständigt  und Daten überprüft"
      var status_values = Array(num_rows).fill([NOCOURSEVALUE, NOCONTACTSTATUS, false])
      student_sheet.getRange(STU_COLNAMEROW+1, STU_BILLINGSTATUS, num_rows, STU_STATUSFIELDLENGTH).setValues(status_values);
      
      // reset Anmeldungen	Voranmeldung
      status_values = Array(num_rows).fill([NOCONTRACTSTATUS, NOPREREGSTATUS])
      student_sheet.getRange(STU_COLNAMEROW+1, STU_REGISTRATIONSTATUSCOL, num_rows, STU_REGISTRATIONSTATUSLENGTH).setValues(status_values);

      // reset course id 
      status_values = Array(num_rows).fill([NOCOURSEVALUE])
      student_sheet.getRange(STU_COLNAMEROW+1, STU_COURSEIDCOL, num_rows, 1).setValues(status_values);

      // reset Anmerkungen
      student_sheet.getRange(STU_COLNAMEROW+1, STU_COMMENTSCOL, num_rows).clearContent()


      console.log(teacherfile_id + " done")
    }
}

function resetTeacherFilesSheets(data)
{
  var teacherfile_ids = data["teacherfile_ids"]
  //load template sheets
  var copy_sheet_names = [ATTENDANCESHEETNAME, 
  BILLINGSTUDENTSHEETNAME, 
  BILLINGCOURSESHEETNAME, 
  ROOMUSAGESHEETNAME, 
  FORMULASSHEETNAME]

  var template_ss = SpreadsheetApp.openById(TEMPLATEFILEID)

  var template_sheets = copy_sheet_names.map(sheet_name => template_ss.getSheetByName(sheet_name));

  //loop over teacher files
  //teacherfile_ids = ["1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"]
  
  var teacherfile_ss;
  var i = 0;
  for (var teacherfile_id of teacherfile_ids)
  {
    teacherfile_ss = SpreadsheetApp.openById(teacherfile_id)
    console.log("[TF][Progress: "+i+"/"+teacherfile_ids.length+" ] starting to reset teacherfile "+teacherfile_ss.getName())
    duplicateSheetWithProtections(teacherfile_ss, template_sheets)
    i=i+1;
    console.log("[TF][Progress: "+i+"/"+teacherfile_ids.length+" ] finished to reset teacherfile "+teacherfile_ss.getName())

  }
  console.log("[TF] worker finished")
}

function duplicateSheetWithProtections(teacherfile_ss, template_sheets) {
  var target_sheets = []
  for (var template_sheet of template_sheets)
  {
    var sheet_name = template_sheet.getName()
    var delete_sheet = teacherfile_ss.getSheetByName(sheet_name)
    if (delete_sheet != null) {
      teacherfile_ss.deleteSheet(delete_sheet)
    }else {
      console.warn("[TF] Sheet '" + sheet_name + "' was not found in teacherfile "+teacherfile_ss.getName())
    }
    var target_sheet = template_sheet.copyTo(teacherfile_ss).setName(sheet_name);
    //copy range protections
    var protections = template_sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var i = 0; i < protections.length; i++) {
      var p = protections[i];
      var rangeNotation = p.getRange().getA1Notation();
      var p2 = target_sheet.getRange(rangeNotation).protect();
      p2.setDescription(p.getDescription());
      p2.setWarningOnly(p.isWarningOnly());
      if (!p.isWarningOnly()) {
        p2.removeEditors(p2.getEditors());
        p2.addEditors(EDITORSMAILLIST);
      }
    }
    //copy sheet protections
    var sheetProtections = template_sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    sheetProtections.forEach(function(p) {
      var copiedSheetProtection = target_sheet.protect();
      copiedSheetProtection.setDescription(p.getDescription());
      copiedSheetProtection.setWarningOnly(p.isWarningOnly());

      if (!p.isWarningOnly()) {
        copiedSheetProtection.removeEditors(p.getEditors());
        copiedSheetProtection.addEditors(EDITORSMAILLIST);
      }
  });
  //copy hide status
  if (template_sheet.isSheetHidden()) {
    target_sheet.hideSheet();
  } else {
    target_sheet.showSheet();
  }
  target_sheets.push(target_sheet)
  }
  //refresh all formulas after replacing sheets
  for (var target_sheet of target_sheets)
  {
    refreshFormulas(target_sheet)
  }
  SpreadsheetApp.flush()
}

function refreshFormulas(sheet) {
  var range = sheet.getDataRange();
  var formulas = range.getFormulas();

  // Iterate through all formulas
  for (var row = 0; row < formulas.length; row++) {
    for (var col = 0; col < formulas[row].length; col++) {
      var formula = formulas[row][col];
      
      // Check if the formula contains #REF! error
      if (formula.startsWith("=")) {
        // Reapply the formula to refresh it
        // Set the formula back to the cell
        sheet.getRange(row + 1, col + 1).setFormula(formula);
      }
    }
  }
}
