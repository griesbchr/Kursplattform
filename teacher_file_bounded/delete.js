function deleteCallback() {
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started deleting student")
  //set active sheet
  SpreadsheetApp.setActiveSheet(STUDENTSSHEET)
  let rows = getCheckedRows(STUDENTSSHEET, STU_CHECKBOXCOL)
  //-----------------------------------dont allow if course started---------------------------------------
  var del_rows = []
  for (var row of rows) {
    if (STUDENTSSHEET.getRange(row, STU_BILLINGSTATUS).getValue() == COURSESTARTEDVALUE) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("SchülerInnen in Reihe/n " + del_rows + " konnten nicht gelöscht werden da gerade ein Kurs läuft.", null, 10)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------check if student selected---------------------------------------
  if (rows.length == 0) { SpreadsheetApp.getActiveSpreadsheet().toast("Bitte Schüler auswählen.") }

  //-------------------check number of students---------------------------------------
    if (rows.length > MAX_RETURN_STUDENTS) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Es können maximal "+ MAX_RETURN_STUDENTS +" SchülerInnen auf einmal zurückgegeben werden.") 
    return
    }

  //-----------------------create message box--------------------------------------------
  let first_names = getColValues(STUDENTSSHEET, STU_FIRSTNAMECOL, rows)
  let last_names = getColValues(STUDENTSSHEET, STU_LASTNAMECOL, rows)
  let name_string = ""
  for (let i = 0; i < first_names.length; i = i + 1) {
    name_string = name_string + first_names[i] + " " + last_names[i] + "\n"
  }
  var result = SpreadsheetApp.getUi().alert(DELETESTUDENTMESSAGE + name_string, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)

  //messagebox results
  if (result == "OK") {
    SpreadsheetApp.getActiveSpreadsheet().toast("Die ausgewählten SchülerInnen werden an das ivi gesendet. Dieser Vorgang kann einige Minuten dauern. Bitte keinesfalls auf 'Abbrechen' drücken!")
    //new course for each student
    for (let row of rows) {
      deleteStudent(row)
    }

  } else {
    Browser.msgBox(CANCELMESSAGE)
  }
  return
}

function deleteStudent(row) {
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " deleting student in row "+row)
  let student = {}
  let lastCol = STUDENTSSHEET.getLastColumn()
  //fetch all attributes of student list
  for (let col = 2; col <= lastCol; col = col + 1) {
    student[STUDENTSSHEET.getRange(STU_COLNAMEROW, col).getValue()] = STUDENTSSHEET.getRange(row, col).getValue()
  }

  //add some new attributes
  student["Art_Anmeldung"] = "Rückgabe Lehrer"
  student["Notizen"] = "ehem. Lehrer " + STUDENTSSHEET.getParent().getName()
  student["Kursort"] = student["Zweigstelle"]
  returnStudentToEnrollment(student)
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " finished deleting student in row "+row)
}