function getStatusMAZFormula(row)
{
  return '=if(I'+row+'="'+PAYMENTSTATUSNOTDUE+'";I'+row+';if(K'+row+'=0;"keine Kosten";if(K'+row+'=L'+row+';"bezahlt & überprüft";if(AND(NOT(L'+row+'="nicht eingetragen");NOT(K'+row+'=L'+row+'));"falscher Betrag überwiesen";if(K'+row+'=O'+row+';"als bezahlt markiert";if(O'+row+'>0;"falscher Betrag eingetragen";"nicht bezahlt"))))))'
}
function getStatusVOMFormula(row)
{
  return '=if(R'+row+'="'+PAYMENTSTATUSNOTDUE+'";R'+row+';if(T'+row+'=0;"keine Kosten";if(T'+row+'=U'+row+';"bezahlt & überprüft";if(AND(NOT(U'+row+'="nicht eingetragen");NOT(T'+row+'=U'+row+'));"falscher Betrag überwiesen";if(T'+row+'=X'+row+';"als bezahlt markiert";if(X'+row+'>0;"falscher Betrag eingetragen";"nicht bezahlt"))))))'
}
function getStatusOfficeFormula(row)
{
  return '=if(AA'+row+'="'+PAYMENTSTATUSNOTDUE+'";AA'+row+';if(AC'+row+'=0;"keine Kosten";if(AC'+row+'=AD'+row+';"bezahlt & überprüft";if(AND(NOT(AD'+row+'="nicht eingetragen");NOT(AC'+row+'=AD'+row+'));"falscher Betrag überwiesen";if(AC'+row+'=AG'+row+';"als bezahlt markiert";if(AG'+row+'>0;"falscher Betrag eingetragen";"nicht bezahlt"))))))'
}

function addTeacherToTeacherBillingTable(teacher) 
{
  Logger.log("[CT]Adding teacher with id " + teacher["LehrerID"] + " to billing table")

  let row = TEACHERBILLINGSHEET.getLastRow()+1
  let course_payments = TF.getCoursePaymentById(teacher["LehrerID"])

  let call_list = 
  {
  "LehrerID":         TEACHERBILLINGSHEET.getRange(row,1).setRichTextValue(SpreadsheetApp.newRichTextValue()
                                                                    .setText(teacher["LehrerID"])
                                                                    .setLinkUrl(teacher["teacherfile_coursesheet_url"])
                                                                    .build()),
  "Vorname":          TEACHERBILLINGSHEET.getRange(row,2).setValue(teacher["Vorname"]),
  "Nachname":         TEACHERBILLINGSHEET.getRange(row,3).setValue(teacher["Nachname"]),
  "Email":            TEACHERBILLINGSHEET.getRange(row,4).setValue(teacher["Email"]),
  "Tel":              TEACHERBILLINGSHEET.getRange(row,5).setNumberFormat("@").setValue(teacher["Tel"]),
  "Verrechnungsserv.":TEACHERBILLINGSHEET.getRange(row,6).setValue(teacher["Verrechnungsservice"]),
  "Notizen":          TEACHERBILLINGSHEET.getRange(row,7).setValue("         "),
  //MAZ
  "Status":           TEACHERBILLINGSHEET.getRange(row,8).setFormula(getStatusMAZFormula(row)),
  "Fällig":           TEACHERBILLINGSHEET.getRange(row,9).setValue(course_payments[0]),
  "Buchungsnummer":   TEACHERBILLINGSHEET.getRange(row,10).setValue(teacher["LehrerID"]+getCurrentBillingCycle()+"1"),
  "fälliger Betrag":  TEACHERBILLINGSHEET.getRange(row,11).setValue(course_payments[1]).setNumberFormat("[$€]#,##0.00"),
  "Konto Betrag":     TEACHERBILLINGSHEET.getRange(row,12).setValue(NOTENTEREDSTATUS),
  "Konto Datum":      TEACHERBILLINGSHEET.getRange(row,13).setValue(""),
  "Konto Verwezwck":  TEACHERBILLINGSHEET.getRange(row,14).setValue(""),
  "Lehrer Betrag":    TEACHERBILLINGSHEET.getRange(row,15).setValue(course_payments[2]).setNumberFormat("[$€]#,##0.00"),
  "Lehrer Datum":     TEACHERBILLINGSHEET.getRange(row,16).setValue(course_payments[3]),
  //VÖM
  "Status":           TEACHERBILLINGSHEET.getRange(row,17).setFormula(getStatusVOMFormula(row)),
  "Fällig":           TEACHERBILLINGSHEET.getRange(row,18).setValue(course_payments[4]),
  "Buchungsnummer":   TEACHERBILLINGSHEET.getRange(row,19).setValue(teacher["LehrerID"]+getCurrentBillingCycle()+"2"),
  "fälliger Betrag":  TEACHERBILLINGSHEET.getRange(row,20).setValue(course_payments[5]).setNumberFormat("[$€]#,##0.00"),
  "Konto Betrag":     TEACHERBILLINGSHEET.getRange(row,21).setValue(NOTENTEREDSTATUS),
  "Konto Datum":      TEACHERBILLINGSHEET.getRange(row,22).setValue(""),
  "Konto Verwezwck":  TEACHERBILLINGSHEET.getRange(row,23).setValue(""),
  "Lehrer Betrag":    TEACHERBILLINGSHEET.getRange(row,24).setValue(course_payments[6]).setNumberFormat("[$€]#,##0.00"),
  "Lehrer Datum":     TEACHERBILLINGSHEET.getRange(row,25).setValue(course_payments[7]),
  //Büroservice
  "Status":           TEACHERBILLINGSHEET.getRange(row,26).setFormula(getStatusOfficeFormula(row)),
  "Fällig":           TEACHERBILLINGSHEET.getRange(row,27).setValue(course_payments[8]),
  "Buchungsnummer":   TEACHERBILLINGSHEET.getRange(row,28).setValue(teacher["LehrerID"]+getCurrentBillingCycle()+"3"),
  "fälliger Betrag":  TEACHERBILLINGSHEET.getRange(row,29).setValue(course_payments[9]).setNumberFormat("[$€]#,##0.00"),
  "Konto Betrag":     TEACHERBILLINGSHEET.getRange(row,30).setValue(NOTENTEREDSTATUS),
  "Konto Datum":      TEACHERBILLINGSHEET.getRange(row,31).setValue(""),
  "Konto Verwezwck":  TEACHERBILLINGSHEET.getRange(row,32).setValue(""),
  "Lehrer Betrag":    TEACHERBILLINGSHEET.getRange(row,33).setValue(course_payments[10]).setNumberFormat("[$€]#,##0.00"),
  "Lehrer Datum":     TEACHERBILLINGSHEET.getRange(row,34).setValue(course_payments[11]),
  //Raummiete
  "Status":           TEACHERBILLINGSHEET.getRange(row,35).setValue(course_payments[12]),
  }
}
