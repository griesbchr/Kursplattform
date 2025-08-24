// This project contains the code that runs the button callbacks from the teacher table as well as high level functions which run the 
// button callback functions.
function onOpenInstallable()
{
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Lehrer verwalten")
    .addItem("Neue Lehrer anlegen", "addTeachers")
    .addItem("Lehrer entfernen", "deleteTeacher")
    .addSeparator()
    .addItem("Lehrerdatei freigeben", "shareTeacherFile")
    .addItem("Fehlende Lehrerdateien erstellen", "createMissingTeacherDrives")
    .addToUi();
  ui.createMenu("Tabelle aktualisieren")
    .addItem("Lehrerdateien Status aktualisieren", "updateTeacherDrives")
    .addItem("Zuletzt Bearbeitet aktualisieren", "updateLastModified")
    .addItem("Lehrerdateien FileIDs aktualisieren", "setAllTeacherFileIDs")
    .addToUi();
  updateTeacherDrives()
  updateLastModified()

  return
}

function updateTeacherDrives()
{
  //TEACHERSS.toast("Tabelle wird aktualisiert", "", 2)
  let res = getMissingAndUnwantedDrives()
  let missing_drives = res[0]
  let unwanted_drives = res[1]
  var message;
  if (missing_drives.length == 0 && unwanted_drives.length == 0)
  {
    message = "Alle Drives aktuell."
  }else{
    message = "Fehlende Drives: " + missing_drives + ".            Folgende Drives existieren, sind jedoch nicht erwünscht: " + unwanted_drives + "."
  }
  TEACHERSS.toast(message,"",20)
  return
}

function addTeachers()
{
  var num_teachers_string = Browser.inputBox("Wieviele Lehrer sollen angelegt werden?")
  num_teachers = Number(num_teachers_string)
  for (let i=0; i < num_teachers; i++) 
  {
    addTeacher()
  }
  TEACHERSS.toast("Es wurden " + String(num_teachers) + " neue Lehrer hinzugefügt.")
}
