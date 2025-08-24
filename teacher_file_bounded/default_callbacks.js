function onOpenLib() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Kurse verwalten")
    .addItem("Kurse starten", "Kursplattform_LehrerInnenblatt_Funktionen.createCourseCallback")
    .addItem("Kurse beenden", "Kursplattform_LehrerInnenblatt_Funktionen.deregCallback")
    .addItem("Kurse löschen", "Kursplattform_LehrerInnenblatt_Funktionen.deleteCourse")
    .addToUi();
  ui.createMenu("SchülerInnen verwalten")
    .addItem("SchülerIn hinzufügen", "Kursplattform_LehrerInnenblatt_Funktionen.addStudentCallback")
  //  .addItem("mehrere Schüler hinzufügen (für Testen)", "addStudentsCallback")
    .addItem("SchülerIn an ivi rücksenden", "Kursplattform_LehrerInnenblatt_Funktionen.deleteCallback")
    .addToUi();
  ui.createMenu("Autorisierung ")
  .addItem("Autorisierung starten", "Kursplattform_LehrerInnenblatt_Funktionen.startAuth")
  .addToUi()
}


function onEditLib(e) {
  if (e.range.getColumn() == STU_CHECKBOXCOL && e.range.getSheet().getName() == STUDENTSSHEETNAME) {
    let rows = getCheckedRows(STUDENTSSHEET, STU_CHECKBOXCOL)
    let last_col = STUDENTSSHEET.getLastColumn()
    var range_list = rows.map(x => STUDENTSSHEET.getRange(x, 1, 1, last_col).getA1Notation())
    STUDENTSSHEET.getRangeList(range_list).activate()
  }
}

function startAuth()
{
  let ui = SpreadsheetApp.getUi();
  UrlFetchApp.fetch("https://www.google.com")
  ui.alert("Sie sind bereits autorisiert.")
}

function preventDoubleStart()
{
  var lock = LockService.getScriptLock()
  lock.tryLock(5000)
  try
  {
    if (!checkClickTime())
    {
      let ui = SpreadsheetApp.getActiveSpreadsheet();
      ui.toast("Kurse wurden vor Kurzem bereits gestartet.")
      return true;
    }
    setClickTime()
  } catch (e)
  {
    throw e
  }finally
  {
    lock.releaseLock()
  }
  return false
}

function setClickTime()
{
  var properties = PropertiesService.getDocumentProperties();
  properties.setProperty('lastClickTime', CLICKTIME.toString());
}

function checkClickTime()
{
  var properties = PropertiesService.getDocumentProperties();
  var lastClickTime = properties.getProperty('lastClickTime');
  var cooldownPeriod = 5000; // 5 seconds cooldown (5000 ms)
  if (lastClickTime && (CLICKTIME - lastClickTime) < cooldownPeriod) 
  {
    return false
  }
  return true
}