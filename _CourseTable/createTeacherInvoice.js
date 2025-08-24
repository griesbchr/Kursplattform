function startCreatingInvoicesHelp() {

Browser.msgBox("Der Erstellungsprozess kann mehrere Stunden dauern.\\nZum Starten des Erstellungsprozesses bitte die folgenden Schritte ausführen:\\n0. Datenquelle auswählen und überprüfen.\\n1. Die Datei '_TeacherInvoiceHandler' in Google Drive suchen und öffnen.\\n2. In dieser Datei, links unter 'Dateien' auf 'createInvoices.gs' klicken.\\n3. In der oberen Leiste (rechts neben 'Ausführen' und 'Fehlerbehebung') kontrollieren ob 'startCreatingInvoices' ausgewählt ist.\\n4. Wenn das richtige Script ausgewählt ist, auf 'Ausführen' klicken.\\nDas Ausführen sollte maximal eine Minute dauern. Danach kann der Status 'Status abfragen' angezeigt werden.")
}


function getInvoiceStatus()
{
  TI.printProgressStatement()
}

function checkInvoiceSourceFile()
{
  var link = TI.getInvoiceSourceFileLink()
  if (link.startsWith("http"))
  {
    var htmlOutput = HtmlService
    .createHtmlOutput('Link zur aktuellen Datenquelle:\n <a href="'+link+'" target="_blank">'+link+'</a>')
    .setWidth(350) //optional
    .setHeight(100); //optional
SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Aktuelle Datenquelle');
  }else
  {
    Browser.msgBox("Link zur aktuell ausgewählten Datenquelle:\\n"+link)
  }
}


function getInvoiceSourceFile()
{
  var file_name = Browser.inputBox(
    "Bitte gib den Dateinamen der Datenquelle an.\\nBeispielname: 'Kursdaten_JJJJ_JJJJ_Datenquelle_ DD.MM.JJJJ_hh:mm'"
  );

  var file_iter = DriveApp.getFilesByName(file_name)

  if (!file_iter.hasNext())
  {
    Browser.msgBox("Es wurde keine Datei mit dem Namen '"+file_name+"' gefunden. Bitte erneut versuchen.")
    return
  }

  var file_id = file_iter.next().getId()

  TI.setInvoiceSourceFileID(file_id)

  SpreadsheetApp.getActiveSpreadsheet().toast("Quelldatei wurde erfolgreich ausgewählt.")
}


function sentTeacherInvoice()
{
  const choice = Browser.msgBox('Sollen alle in "Lehrerabrechnung/XX.XX.XXX" befindlichen Dateien für den Lehrer freigegeben und per Email zugesendet werden?\\n Bitte beachten Sie, dass alle Email-Adressen in der Lehrerdatei auffindbar sind!' , Browser.Buttons.YES_NO_CANCEL);
  if (choice == "yes")
  {
    TI.shareAndSentTeachersInvoices()
  }
}
