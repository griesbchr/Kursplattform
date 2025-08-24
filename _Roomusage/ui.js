function onOpenInstallable()
{
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Raumbenützungslisten verwalten")
    .addItem("Raumbenützungslisten aktualisieren", "updateData")
    .addToUi();
}