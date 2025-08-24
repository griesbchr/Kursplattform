const ALLLESSONSENTEREDMESSAGE = "Wurden für die SchülerInnen die abgemeldet werden sollen alle gehaltenen Unterreichtseinheiten in die Anwesenheitsliste eingetragen? Nach der Abmeldung können keine Unterrichtseinheiten mehr eingetragen werden."

const DEREGSTUDENTSMESSAGE = "Sollen die folgenden SchülerInnen wirklich abgemeldet werden?\n\n"

function deregCallback() {
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started deregistering students")

  var rows = getCheckedRows(STUDENTSSHEET, STU_CHECKBOXCOL)
  //-----------------------------------only allow if course started---------------------------------------
  var del_rows = []
  for (var row of rows) {
    if (STUDENTSSHEET.getRange(row, STU_BILLINGSTATUS).getValue() != COURSESTARTEDVALUE) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Bei SchülerInnen in Reihe/n " + del_rows + " konnten der Kurs nicht beendet werden da kein Kurs existiert.", null, 10)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------check if student selected---------------------------------------
  if (rows.length == 0) { SpreadsheetApp.getActiveSpreadsheet().toast("Bitte Schüler auswählen.") }

  //-------------------check if all lessons entered-----------------------------------
  var result = SpreadsheetApp.getUi().alert(ALLLESSONSENTEREDMESSAGE, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)

  if (result == "CANCEL") {
    SpreadsheetApp.getActiveSpreadsheet().toast("Vorgang abgebrochen")
    return
  }

  //--------------------------deregister message--------------------------------------------
  let first_names = getColValues(STUDENTSSHEET, STU_FIRSTNAMECOL, rows)
  let last_names = getColValues(STUDENTSSHEET, STU_LASTNAMECOL, rows)
  let name_string = ""
  for (let i = 0; i < first_names.length; i = i + 1) {
    name_string = name_string + first_names[i] + " " + last_names[i] + "\n"
  }
  var result = SpreadsheetApp.getUi().alert(DEREGSTUDENTSMESSAGE + name_string, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)

  //messagebox results
  if (result == "OK") {
    SpreadsheetApp.getActiveSpreadsheet().toast("Die ausgewählten SchülerInnen werden abgemeldet. Dieser Vorgang kann einige Minuten dauern. Bitte keinesfalls auf 'Abbrechen' drücken!")

    //new course for each student
    for (let row of rows) {
      let course = getCourseData(row)
      course["Notizen"] = "ehem. Lehrer " + STUDENTSSHEET.getParent().getName()
      derollStudent(course)
    }

  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast("Vorgang abgebrochen.")
  }
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " finished deregistering students")

}

