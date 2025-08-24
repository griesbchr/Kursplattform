function createMissingTeacherDrives() {
  // get missing drives
  Logger.log("started creating missing drives")
  let [missing_drives, unwanted_drives] = getMissingAndUnwantedDrives()
  
  let message
  
  if (missing_drives.length > 0)
  {
    message = CREATEMESSAGE+ "\n\n" + getTeacherDriveNames(missing_drives).join(", ")
  } else
  {
    message = NOMISSINGDRIVESMESSAGE
    TEACHERSS.toast(message,null, 10)
    Logger.log(NOMISSINGDRIVESMESSAGE)
    return
  }

  //check if it does the right thing
  var result = SpreadsheetApp.getUi().alert(message, SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)
  if (result == "CANCEL")
  {
    TEACHERSS.toast("Vorgang abgebrochen")
    Logger.log("Vorgang abgebrochen")
    return
  }  else
  {
    TEACHERSS.toast("Lehrer-Drives werden erstellt. ")
    Logger.log("Lehrer-Drives werden erstellt. ")
  }

  var failed = false; 
  var failed_message = ""
  var successful_drives = []

  for (let id of missing_drives)
  {
    Logger.log("starting to create teacher drive with id " + id)

    //check if first name and last name are filled out
    var row = UTLS.findValueInCol(TEACHERSHEET, IDCOL, id)
    var name_arr =  TEACHERSHEET.getRange(row, FIRSTNAMECOL, 1, 2).getValues().flat()
    if (name_arr.includes(""))
    {
      failed = true
      failed_message = failed_message + "Lehrer mit ID " + id + " konnte nicht erstellt werden da Vorname oder Nachname nicht ausgefüllt sind.\\n"
      continue;
    }

    //check if teacher with the same name already exists within the active teachers
    var active_teachernames = getAllActiveTeacherFullNames()
    var teachername = name_arr.join(" ")
    if (active_teachernames.includes(teachername))
    {
      failed = true
      failed_message = failed_message + "Lehrer " + teachername + " (id " + id + ") konnte nicht erstellt werden da bereits ein Lehrer mit dem gleichen Namen existiert.\\n"
      continue;
    }

    //check if email address is inserted
    var email_address = TEACHERSHEET.getRange(row, EMAILCOL).getValue()
    if (email_address == "")
    {
      var result = SpreadsheetApp.getUi().alert("Keine Email Addresse bei "+teachername+" eingetrage. Bitte Email eintragen!", SpreadsheetApp.getUi().ButtonSet.OK_CANCEL)
      if (result == "CANCEL") {
        failed=true
        failed_message ="Vorgang abgebrochen"
        continue
      }
      return
    }

    //replace nachname field with striped version of itself (otherwise mismatching contract form choices)
    var last_name_range = TEACHERSHEET.getRange(row, LASTNAMECOL)
    last_name_range.setValue(last_name_range.getValue().trim())
    SpreadsheetApp.flush();

    //create teacherfile
    createTeacherFile(id)
    Logger.log("[TT]Finished creating teacher drive with id " + id)

    Utilities.sleep(1)
    //TODO: add error handling if creation failed

    //set link and color in teachertable
    setDriveStatusColor(id, GREEN)
    setDriveLink(id, API.getTFApi("get_teacherfile_link", id))
    successful_drives.push(id)

    //set teacher file id
    TEACHERSHEET.getRange(row, TEACHERFILEIDCOL).setValue(API.getTFApi("get_teacherfile_fileid", id))

    //set billing number
    TEACHERSHEET.getRange(row, BILLINGNUMBERCOL).setValue(0)
  }

  Logger.log("[TT]Created drives: "+missing_drives)
  if(failed)
  {
    Browser.msgBox(failed_message)
  }
  if (unwanted_drives.length > 0)
  {
    Browser.msgBox("Erstellte Drives: " + successful_drives + ". \\n Folgende Drives existieren, sind jedoch nicht erwünscht: " + unwanted_drives + ".\\n\\n Nicht vergessen die Projektnummer 802167359539 einzutragen!" )
  }else{
    Browser.msgBox("Erstellte Drives: " + successful_drives + ".\\n\\n Nicht vergessen die Projektnummer 802167359539 einzutragen!")
  }
}