function shareStudent(row)
{
  Logger.log("[ET]Started sharing student row " + row)

  let lastCol = ENROLLMENTSHEET.getLastColumn()
  
  var student = {}
  var keys = ENROLLMENTSHEET.getRange(COLNAMEROW, 1, 1, lastCol).getValues().flat() 
  var values = ENROLLMENTSHEET.getRange(row, 1, 1, lastCol).getValues().flat() 
  keys.forEach((key, i) => student[key] = values[i]);

  try {
    API.postTFApi("add_student", student)
  } catch(e){
    Browser("Aktion fehlgeschlagen:", e.message)
  }
  
  ENROLLMENTSHEET.getRange(row, SHARECHECKBOXCOL).uncheck().setBackground(GREEN)
  ENROLLMENTSHEET.getRange(row, SHARECHECKBOXCOL).protect().setWarningOnly(true)
  ENROLLMENTSHEET.getRange(row, CONTACTSTATUSCOL).setRichTextValue(SpreadsheetApp.newRichTextValue()
            .setText("Noch offen")
            .setLinkUrl(API.getTFApi("get_teacherfile_link", student["Lehrer"].split("_")[0]))
            .build())
  Logger.log("[ET]Finished sharing student "+ student["SchuelerID"] +" to teacher " + student["Lehrer"])
}

function shareCheckedStudents()
{
  let checked_rows = UTLS.getCheckedRows(ENROLLMENTSHEET, SHARECHECKBOXCOL) 
  //uncheck all rows
  for (let row of checked_rows)
  {
    ENROLLMENTSHEET.getRange(row, SHARECHECKBOXCOL).uncheck()
    ENROLLMENTSHEET.getRange(row, SHARECHECKBOXCOL).setBackground(YELLOW)
  }
  //share rows
  let shared_rows = [] 
  for (let row of checked_rows)
  {
    ENROLLMENTSHEET.getParent().toast("Schüler in Reihe " + row + " wird freigegeben." ,"", 25)
    //check required fields
    if (ENROLLMENTSHEET.getRange(row, TEACHERCOL).getValue() == NOTEACHERVALUE | ENROLLMENTSHEET.getRange(row, DISTRICTCOL).getValue() == NODISTRICTVALUE)
    {
      ENROLLMENTSHEET.getParent().toast("Für Schüler in der Reihe " + row + " ist ein zumindest ein Plfichtfeld nicht ausgefüllt.", 15)
      continue;
    }
    shareStudent(row)
    shared_rows.push(row)
  }
  return shared_rows
}
