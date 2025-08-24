function getMailHtml(form_url, teacher_id)
{
 var htmlBody  = HtmlService.createHtmlOutputFromFile('FormMailHTML').getContent()
      .replace("replace_with_url", form_url)
      .replace("replace_with_teacher_name", TT.getTeacherFullName(teacher_id))
  return htmlBody
}

function sentFormInvitation(email, teacher_id, form_url)
{
  var subject = "Datenerhebung zur Kursanmeldung"
  var text_body = "text_body"
  var html_body = getMailHtml(form_url, teacher_id)

  //fromalias = 1: anmeldungen@kursplattforma.at
  MAIL.sendHTMLMail(email, subject, text_body, html_body, 1)
}

