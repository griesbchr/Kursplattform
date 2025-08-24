function sentCourseContract(course, teacher, pdffile_id)
{
  var to_parents = course["Rechnungs_Mail"]
  var to_teacher = teacher["Email"]
  var subject = "Musikkurs Anmeldung"
  var from_alias = 1  //anmeldungen@kursplattform.at
  var replyTo = "griesbacher@kursplattform.at"
  var name = "Kursplattform"
  var cc = "info@kursplattform.at"

  var attachmentFile = DriveApp.getFileById(pdffile_id);
  var attachments =  [attachmentFile.getAs(MimeType.PDF)]

  var html_body_parents = CONTRACT_PARENTS_TEMPLATE.getBody().getText()
  var html_body_teacher = CONTRACT_TEACHER_TEMPLATE.getBody().getText()

  //replace placeholder fields
  html_body_teacher = html_body_teacher.replace("<<S_Vorname>>", course["S_Vorname"])
  html_body_teacher = html_body_teacher.replace("<<S_Nachname>>", course["S_Nachname"])
  html_body_parents = html_body_parents.replace(/<<teacher_mail>>/g, teacher["Email"])  // /string/g is to replace all occs instead of just the first 
  html_body_parents = html_body_parents.replace("<<teacher_name>>", teacher["Vorname"] + " " + teacher['Nachname'])  
  html_body_parents = html_body_parents.replace("<<teacher_phone>>", teacher["Tel"])  

  sendHTMLMailWithAttachment(to=to_parents, subject=subject, html_body=html_body_parents, from_alias=from_alias, replyTo=replyTo, name=name, cc=cc, attachments=attachments)
  sendHTMLMailWithAttachment(to=to_teacher, subject=subject, html_body=html_body_teacher, from_alias=from_alias, replyTo=replyTo, name=name, cc=null, attachments=attachments)

}

function test()
{
  console.log(CONTRACT_TEACHER_TEMPLATE.getBody().getText())
    var html_body_teacher = CONTRACT_TEACHER_TEMPLATE.getBody().getText()
  html_body_teacher = html_body_teacher.replace("<<S_Vorname>>", "Hanna")
  html_body_teacher = html_body_teacher.replace("<<S_Nachname>>", "Schubert")
  console.log(html_body_teacher)

}