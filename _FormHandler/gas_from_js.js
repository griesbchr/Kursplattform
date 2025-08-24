//include files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

//sent mail
function processMailForm(formObject){ 
  recipient = formObject.email
  teacher_id = formObject.teacher_id
  form_url = formObject.form_url
  Logger.log("[FH]Sending form invitation to "+recipient + " with teacher id " + teacher_id + " with form url " + form_url)
  sentFormInvitation(recipient, teacher_id, form_url)
}
