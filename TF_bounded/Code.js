function myFunction() {
  SpreadsheetApp.getActiveRange().setValue("1")
}

function onOpenLib()
{
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Kurse verwalten")
    .addItem("Kurse starten", "TF_bounded.createCourseCallback")
    .addItem("Kurse beenden", "TF_bounded.deregCallback")
    .addToUi();
  ui.createMenu("SchülerInnen verwalten")
    .addItem("SchülerIn hinzufügen", "TF_bounded.addStudentCallback")
  //  .addItem("mehrere Schüler hinzufügen (für Testen)", "addStudentsCallback")
    .addItem("SchülerIn an ivi rücksenden", "TF_bounded.deleteCallback")
    .addToUi();
  ui.createMenu("Autorisierung ")
  .addItem("Autorisierung starten", "TF_bounded.startAuth")
  .addToUi()
  return
}


function startAuth()
{
  UrlFetchApp.fetch("https://www.google.com")
  SpreadsheetApp.getUi().alert("Sie sind bereits autorisiert(lib).")
}