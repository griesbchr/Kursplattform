function createCourseCallback() {

  var allow_start_ids = ["174", "189"]
  var teacher_id = TEACHERSPREADSHEET.getName().split("_")[0]

  if (!allow_start_ids.includes(teacher_id))
  {
    Browser.msgBox("Kursstart noch nicht möglich.")
    return 
  }

  if (preventDoubleStart()){return}

  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started creating course")

  //required fields need to be filled

  //set active sheet
  SpreadsheetApp.setActiveSheet(STUDENTSSHEET)
  var rows = getCheckedRows(STUDENTSSHEET, STU_CHECKBOXCOL)

  //-----------------------------------check if course already started---------------------------------------
  var del_rows = []
  for (var row of rows) {
    var billing_status = STUDENTSSHEET.getRange(row, STU_BILLINGSTATUS).getValue()
    if (!(billing_status == NOCOURSEVALUE || billing_status == DEREGISTEREDVALUE)) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Kurs für SchülerInnen in Reihe " + del_rows + " wurde bereits gestartet.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------------------check if required field are set------------------------------------
  var del_rows = []
  for (var row of rows) {
    var course_vals = STUDENTSSHEET.getRange(row, STU_COURSETYPECOL, 1, 3).getValues().flat()
    if (course_vals.some(e => e == "")) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Kursinformationsfelder (Spalten G,H,I) für SchülerInnen in Reihe " + del_rows + " müssen ausgefüllt werden.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

    //-------------------------------check if data is checked------------------------------------
  var del_rows = []
  for (var row of rows) {
    if (!STUDENTSSHEET.getRange(row, STU_CKECKEDDATACHECKBOX).isChecked()) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Checkbox 'Eltern verständigt und Daten überprüft' (Spalte F) für SchülerInnen in Reihe " + del_rows + " müssen angekreuzt werden.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------------------check if course location is set------------------------------------
  var del_rows = []
  for (var row of rows) {
    var location = STUDENTSSHEET.getRange(row, STU_COURSELOCATION,).getValue()
    if (location == NOCOURSELOCATION) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    +
    SpreadsheetApp.getActiveSpreadsheet().toast("Zweigstelle (Spalte J) für SchülerInnen in Reihe " + del_rows + " muss ausgewählt werden.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------------------check if billing information is filled out------------------------------------
  var del_rows = []
  for (var row of rows) {
    var billing_vals = STUDENTSSHEET.getRange(row, STU_BILLINGNAMECOL, 1, 5).getValues().flat()
    if (billing_vals.some(e => e == "") || !STUDENTSSHEET.getRange(row, STU_CKECKEDDATACHECKBOX).isChecked()) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Rechnungsinformationen (Spalten S,T,U,V,W) für SchülerInnen in Reihe " + del_rows + " müssen ausgefüllt werden.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))
  //-----------------------------------dont allow if course started---------------------------------------
  var del_rows = []
  for (var row of rows) {
    if (STUDENTSSHEET.getRange(row, STU_BILLINGSTATUS).getValue() == COURSESTARTEDVALUE) {
      STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
      del_rows.push(row);
    }
  }
  if (del_rows.length > 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Für SchülerInnen in Reihe " + del_rows + " konnten kein Kurs gestartet werden da bereits ein Kurs läuft.", null, 30)
    return
  }
  rows = rows.filter(e => !del_rows.includes(e))

  //-------------------check if student selected---------------------------------------
  if (rows.length == 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Bitte unter 'Auswählen' SchülerInnen auswählen.")
    return 
    }

  //-------------------check if less than 15 student selected-------------------------
  if (rows.length > MAXSTUDENTS) 
  {
    SpreadsheetApp.getActiveSpreadsheet().toast("Es können maximal "+MAXSTUDENTS+" Kurse gleichzeitig gestartet werden. Bitte wählen Sie weniger Kurse aus. Die verbleibenden Kurse können durch eine zweite Aktion gestartet werden.", null, 30)
    return 
  }

  //----------------------check if course numbers are valid--------------------------------
  var invalid_rows = []

  for (var row of rows) {

    var course_type = STUDENTSSHEET.getRange(row, STU_COURSETYPECOL).getValue()
    var course_number = parseInt(STUDENTSSHEET.getRange(row, STU_COURSENUMCOL).getValue())


    switch(course_type){
      case COURSETYPE_BASIC:
      if (course_number >= 60)
      {
        invalid_rows.push(row)
      }
      break

      case COURSETYPE_PLUS:
      if (course_number == 15 || course_number >= 70 ||course_number == 35 || course_number == 45 || course_number == 55  )
      {
        invalid_rows.push(row)
      }
      break
      case COURSETYPE_PLUSQV:
      if (course_number == 15 || course_number >= 70 ||course_number == 35 || course_number == 45 || course_number == 55 )
      {
        invalid_rows.push(row)
      }      
      break
      case COURSETYPE_QV:
      if (course_number == 15 || course_number == 20 ||  course_number == 25 || course_number >= 80 ||course_number == 35 || course_number == 45 || course_number == 55 )
      {
        invalid_rows.push(row)
      }      
      break
      case COURSETYPE_INTENSIV:
      if (course_number == 15 || course_number == 20 ||  course_number == 25 || course_number >= 80 ||course_number == 35 || course_number == 45 || course_number == 55 )
      {
        invalid_rows.push(row)
      }      
      break
      case COURSETYPE_PREMIUM:
      if (course_number == 15 || course_number == 20 ||  course_number == 25 ||  course_number == 30 || course_number >= 90)
      {
        invalid_rows.push(row)
      }      
      break
    }
  }

  if (invalid_rows.length > 0)
  {
    SpreadsheetApp.getActiveSpreadsheet().toast("Für SchülerInnen in Reihe " + invalid_rows + " entsprechen die Kursnummern nicht den laut Kursvertrag möglichen Kursnummern.", null, 30)
    return
  }
  
  //------------------------create message box--------------------------------------
  let first_names = getColValues(STUDENTSSHEET, STU_FIRSTNAMECOL, rows)
  let last_names = getColValues(STUDENTSSHEET, STU_LASTNAMECOL, rows)
  let name_string = ""
  for (let i = 0; i < first_names.length; i = i + 1) {
    name_string = name_string + first_names[i] + " " + last_names[i] + "\n"
  }
  var result = SpreadsheetApp.getUi().alert(CREATECOURSEMESSAGE + name_string, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)

  //messagebox results
  if (result == "OK") {
    var exp_runtime;
    switch (rows.length)
    {
      case 1:
        exp_runtime = 2;
        break;
      case 2: 
        exp_runtime = 3;
        break
      default:
      exp_runtime = 5;
    }
    SpreadsheetApp.getActiveSpreadsheet().toast("Der Verrechnungsprozess wird mit dem Verschwinden der Häkchen gestartet. Bitte keinesfalls auf 'Abbrechen' drücken!","Voraussichtl. Laufzeit: "+exp_runtime+" Min",exp_runtime*60)
    //uncheck rows
    //for (let row of rows) {
    //  STUDENTSSHEET.getRange(row, STU_CHECKBOXCOL).uncheck()
    //}

    var course_list = []
    //new course for each student
    for (let row of rows) {
      //Set contact status to active if not filled out yet
      if (STUDENTSSHEET.getRange(row, STU_CONTACTSTATUSCOL).getValue() == NOCONTACT) {
        STUDENTSSHEET.getRange(row, STU_CONTACTSTATUSCOL).setValue(ACTIVECIÒNTACT)
      }
      let course = getCourseData(row)
      course_list.push(course)
    }
    courses = {}
    courses["course_list"] = course_list
    courses["ss_id"] = TEACHERSPREADSHEET.getId()
    courses["studentsheet_rows"] = rows

    if (course_list.length > 2)
    {
      postCoursesToTeacherFilesMultithreaded(courses)
    }else
    {
      postCoursesToTeacherFiles(courses)
    }
        

  } else {
    Browser.msgBox(CANCELMESSAGE)
    return
  }
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " finished creating course")
  
  SpreadsheetApp.getActiveSpreadsheet().toast("Kurs(e) erfolgreich gestartet!", null, 7)

  return
}

function getCourseData(row) {
  let course = {}
  let lastCol = STUDENTSSHEET.getLastColumn()
  //fetch all attributes of student list
  for (let col = 2; col <= lastCol; col = col + 1) {
    course[STUDENTSSHEET.getRange(STU_COLNAMEROW, col).getValue()] = STUDENTSSHEET.getRange(row, col).getValue()
  }

  //add some attributes
  course["LehrerID"] = STUDENTSSHEET.getParent().getName().split("_")[0]
  course["studentlist_url"] = STUDENTSSHEETURL + "&range=" + row + ":" + row

  //Logger.log("from tf_bounded" + course["Schuelerlistelink"])

  return course
}
