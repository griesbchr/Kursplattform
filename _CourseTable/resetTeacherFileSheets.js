function resetAllStuduentLists()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()

  //insert confirmation prompt
  var ui = SpreadsheetApp.getUi(); // Get the UI instance for the SpreadsheetApp
  var response = ui.alert(
    'Aktion bestätigen',            // Title of the dialog
    'Sollen die Statusfelder der Schülerlisten in den Lehrerdateien wirklich zurückgesetzt werden? Der Inhalt dabei wird permanent GELÖSCHT!.',  // Message inside the dialog
    ui.ButtonSet.YES_NO        // Set the buttons to Yes and No
  );
  
  // Handle the user's response
  if (response == ui.Button.YES) {
    ss.toast("Schülerliste Statusfelder zurücksetzen gestartet..","",20)
    TF.resetAllStuduentLists()
    ss.toast("Schülerliste Statusfelder zurücksetzen gestartet..","",20)
  } else {
    ui.alert('Aktion abgebrochen.');
  }
}

function resetTeacherFileSheets() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()

  //insert confirmation prompt
  var ui = SpreadsheetApp.getUi(); // Get the UI instance for the SpreadsheetApp
  var response = ui.alert(
    'Aktion bestätigen',            // Title of the dialog
    'Sollen die Lehrerblätter wirklich zurückgesetzt werden? Der Inhalt dabei wird permanent GELÖSCHT!. Die Lehrerdateien sollen deshalb davor unbedingt archiviert werden.',  // Message inside the dialog
    ui.ButtonSet.YES_NO        // Set the buttons to Yes and No
  );
  
  // Handle the user's response
  if (response == ui.Button.YES) {
    ss.toast("Lehrerdateien reset gestartet..","",20)
    var teacherfile_ids = TF.getAllTeacherFileIds()
    teacherfile_ids.sort()
    
    var mid = Math.floor(teacherfile_ids.length / 2);
    var firstHalf = teacherfile_ids.slice(0, mid);
    var secondHalf = teacherfile_ids.slice(mid);
    teacherfile_ids = secondHalf
    
    //overwrite for debug
    //teacherfile_ids = ["1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"]

    var const_payload = {}
    var split_payload = {};

    console.log("sending teacherfile ids" + teacherfile_ids)
    split_payload["teacherfile_ids"] = teacherfile_ids
    var num_threads = 25
    API.postThreadedTFApi("reset_teacherfile_sheets", const_payload, split_payload, num_threads)

    ss.toast("Lehrerdateien reset abgeschlossen..","",20)
  } else {
    ui.alert('Aktion abgebrochen.');
  }
}