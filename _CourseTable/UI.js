function onOpenInstallable() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu("Datensync.")
    .addItem("Zahlungsstatus synchronisieren (Kurs+Lehrerverrechnung)", "updatePayments")
    .addItem("Schülerinformationen synchronisieren (Kursübersicht)", "updateStudentCourseInfos")
    .addItem("Lehrerdaten synchronisieren (Kursübersicht)", "syncTeacherData")
    .addItem("Kursübersicht und Kursverrechnung vergleichen", "checkCourseIDIntegrity")
    .addSeparator()
    .addItem("Voranmeldungen synchronisieren", "syncPreRegistrations")
    .addSeparator()
    .addItem("Lehrerinformationen in Lehrerverrechning synchronisieren", "syncTeacherBilling")
    .addToUi();

  ui.createMenu("Zahlungen")
    .addItem("Teilzahlung 1 fällig setzen", "setPayment1Due")
    .addItem("Teilzahlung 2 fällig setzen", "setPayment2Due")
    .addItem("Teilzahlung 3 fällig setzen", "setPayment3Due")
    .addItem("Teilzahlung 4 fällig setzen", "setPayment4Due")
    .addItem("Saldozahlung fällig setzen", "setSalsopaymentDue")
    .addSeparator()
    .addItem("Bürogebühr fällig setzen", "setOfficePaymentDue")
    .addItem("Raumbenutzungsgebühr fällig setzen", "setRoomPaymentsDue")
    .addItem("Vereinsbeiträge fällig setzen", "setAssPaymentsDue")
    .addItem("Infrastrukturgebühr eintragen", "setInfraDue")
    .addSeparator()
    .addItem("Zahlung für einzelnen Lehrer fällig setzen", "setSingleTeacherPaymentDue")
    .addSeparator()
    .addItem("Zahlungserinnerung senden", "sentReminder")
    .addSeparator()
    .addItem("Mahnung eintragen", "setReminderDue")
    .addToUi();

  ui.createMenu("Datenexport")
    .addItem("Gesamtdatenquelle erstellen", "createCompleteDataDataSourse")
    .addSeparator()
    .addItem("Datenquelle Teilzahlung 1 erstellen", "createPayment1DataSource")
    .addItem("Datenquelle Teilzahlung 2 erstellen", "createPayment2DataSource")
    .addItem("Datenquelle Teilzahlung 3 erstellen", "createPayment3DataSource")
    .addItem("Datenquelle Teilzahlung 4 erstellen", "createPayment4DataSource")
    .addSeparator()
    .addSubMenu(ui.createMenu("Testdatenquelle Saldozahlung erstellen")
      .addItem("Saldo bezahlt entfernt", "createSaldoPaymentDataSourceTest")
      .addItem("Saldo bezahlt enthalten", "createSaldoPaymentDataSourceIncludeAlreadyPaid"))
    .addSeparator()
    .addItem("Raumabrechnung erstellen", "createRoomBilling")
    //.addItem("Raumbenützung erstellen", "genRoomUsageTable")
    //.addItem("Schülerübersicht Gemeinde erstellen", "genDistrictStudentSummary")
    .addToUi();

  ui.createMenu("Zahlungsimport")
    .addItem("Zahlungen laden", "loadPayment")
    .addSeparator()
    .addItem("Formatierung der Bankdaten entfernen", "deleteFormatting")
    .addItem("Negative Beträge entfernen", "deleteNegativeRows")
    //.addSeparator()
    //.addItem("Zahlungen zuordnen und eintragen", "doStrictAssignment")
    .addSeparator()
    .addItem("Zahlungsreferenz finden", "mapReference")
    .addItem("gefundene Zahlungsreferenzen eintragen", "doAutoAssignment")
    .addSeparator()
    .addItem("Voranmeldungen eintragen", "registerPreRegistrations")
    .addToUi();

  ui.createMenu("Anmeldungen")
    .addItem("Anmeldung versenden", "sendCourseContract")
    .addToUi();

  ui.createMenu("Archivieren")
    .addSubMenu(ui.createMenu("Lehrerdateien archivieren")
        .addItem('mit Lehrer als Betrachter', 'archiveTeacherFilesWithEditorsAsViewers')
        .addItem('ohne Lehrer als Betrachter', 'archiveTeacherFilesWithoutEditorsAsViewers'))
    .addToUi();

  ui.createMenu("Lehrerdateien")
    .addItem("Lehrerdatei Vorlage Zweigstellen und Vereine aktualisieren", "updateTemplateFile")
    .addSeparator()
    .addItem("Schülerliste Statusfelder zurücksetzen", "resetAllStuduentLists")
    .addItem("Lehrerdateiblätter zurücksetzen", "resetTeacherFileSheets")
    .addToUi();

  ui.createMenu("Lehrerabrechnung")
    .addItem("Datenquelle auswählen", "getInvoiceSourceFile")
    .addItem("Aktuelle Datenquelle anzeigen", "checkInvoiceSourceFile")
    .addSeparator()
    .addItem("Lehrerabrechnung erstellen Hilfe anzeigen", "startCreatingInvoicesHelp")
    .addItem("Status abfragen","getInvoiceStatus")
    .addItem("Lehrerabrechnung zusenden", "sentTeacherInvoice")
    .addSeparator()
    .addItem("Officero Invoices erstellen", "startCreatingOfficeInvoices")
    .addItem("Officero Invoices zusenden", "sendOfficeInvoicesHelp")
    .addItem("Officero Invoices Erinerung zusenden", "sendOfficeroInvoiceReminder")
    .addToUi();
}

function sendTestContract() {
  TF.test_sentContractMailByIds();
}
