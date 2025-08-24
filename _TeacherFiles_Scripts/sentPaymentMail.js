
function getPaymentMailTextTemplate(payment_nr, date_string) {
return '<p>[TEACHER_GREETING],</p><p>Bitte stellen Sie zeitnah die Einzahlungsdaten f&uuml;r die '+payment_nr+'. Teilzahlung bereit, damit die Aussendung der '+(payment_nr+1)+'. Teilzahlung erfolgen kann!<br />Aus diesem Grund senden wir Ihnen den Link (Google Sheets) zu Ihrer digitalen Sch&uuml;lerliste zu. Bitte tragen Sie das Einzahlungsdatum und den Betrag der '+payment_nr+'. Teilzahlung in die daf&uuml;r vorgesehenen gelben Felder ein.</p><p><a href="[COL_LINK]" target="_blank">Link direkt zu den Feldern f&uuml;r das Eintragen der '+payment_nr+'. Teilzahlung</a></p><p>Bitte stellen Sie sicher, dass alle Daten bis <strong>'+date_string+'</strong>&nbsp;eingetragen sind.<br />Wir bitten Sie, diesen Termin unaufgefordert einzuhalten.<br />Vielen Dank!<br /><br />Mit freundlichen Gr&uuml;&szlig;en,<br />Die Administration der Kursplattform</p>'
}


function sentRegisterPaymentReminderMail()
{
  payment_nr = 2
  date_string = "Samstag 17. Februar um 22:00 Uhr"
  //payment_colrange = "AB4:AC"   //payment 3
  payment_colrange = "Y4:Z"   //payment 2
  // TODO: only sent to teachers that need to selfreport!!!!!
  

  key_list = ["Email", "Anrede", "Vorname", "Nachname", "FileID", "Lehrer aktiv"]
  var data_dict = TT.getTeacherData(key_list)

  for (let teacher_id in data_dict)
  {
    //var teacher_id = 142;
    var teacher_data = data_dict[teacher_id];

    if (!teacher_data["Lehrer aktiv"])
    {
      console.log("Skipping teacher with id " + teacher_id)
      continue;
    }

    var teacher_fileid = teacher_data["FileID"]
    var teacher_anrede = teacher_data["Anrede"]
    var teacher_firstname = teacher_data["Vorname"]
    var teacher_lastname = teacher_data["Nachname"]
    var teacher_mail = teacher_data["Email"]
    
    console.log("starting teacher " + teacher_firstname + " " + teacher_lastname)

    var teacher_greeting = "Liebe/r " + teacher_anrede + " " + teacher_firstname + " " + teacher_lastname
    
    var billing_sheet = SpreadsheetApp.openById(teacher_fileid).getSheetByName(BILLINGSTUDENTSHEETNAME)
    file_link = billing_sheet.getParent().getUrl()+"#gid="+billing_sheet.getSheetId()
    col_link = file_link+"#gid="+billing_sheet.getSheetId()+"&range="+payment_colrange

    //mail text
    mail_text_template = getPaymentMailTextTemplate(payment_nr, date_string)

    //insertions
    var mail_text_html = mail_text_template.replace("[TEACHER_GREETING]", teacher_greeting)
                                      .replace("[COL_LINK]", col_link)

    MAIL.sendHTMLMail(teacher_mail, "iVi Einzahlungsdaten der "+payment_nr+". Teilzahlung","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")    
  }
}

