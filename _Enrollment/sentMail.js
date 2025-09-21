//OPEN THE FORM IN SIDEBAR 
function showFormInSidebar() {      
  //var form = HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Contact Details');

  //This is super slow
  //let row = UTLS.getCheckedRows(ENROLLMENTSHEET, SELECTCOL)[0]

  let row = SpreadsheetApp.getActiveRange().getRow()
  let teacher_id = ENROLLMENTSHEET.getRange(row, TEACHERCOL).getValue().split("_")[0]

  const mail = ENROLLMENTSHEET.getRange(row, MAILCOL).getValue()
  const subject = "Schüler werden"
  const first_paragraph = "Vielen Dank, wir freuen uns über Ihre Anfrage! \nHiermit sende ich Ihnen die aktuellen Kontaktdaten für den Musikunterricht zu:"
  var teacher_contact
  try
  {
    teacher_contact = TT.getTeacherContactInformation(teacher_id)
  }
  catch{
    teacher_contact = ""
  }
  const second_paragraph = "Wenn keine Unterrichtszeit gefunden worden ist bitte ich um eine kurze Rückmeldung."
  const ending = "Mit lebenswerten Grüßen \nAndreas Griesbacher"

  var template = HtmlService.createTemplateFromFile('Index').getRawContent()
  template = template.replace("mail_default", mail)
  template = template.replace("subject_default", subject)
  template = template.replace("first_paragraph_default ", first_paragraph)
  template = template.replace("teacher_contact_default ", teacher_contact)
  template = template.replace("second_paragraph_default ", second_paragraph)
  template = template.replace("ending_default ", ending)
  var form = HtmlService.createTemplate(template).evaluate().setTitle('Mail versenden');

  SpreadsheetApp.getUi().showSidebar(form);
}

//PROCESS FORM
function processForm(formObject){ 
  var sheet = SpreadsheetApp.getActiveSheet();
  var mail_text = formObject.first_paragraph + "\n\n"+ formObject.teacher_contact +"\n\n"+formObject.second_paragraph+"\n\n"+formObject.ending
  //Browser.msgBox(mail_text.replace("\n","\\n"))
  //sheet.getRange(10,1).setValue(mail_text)
  MAIL.sentMail(formObject.email, formObject.subject, mail_text, fromalias=1)
}

//GET ROW
function getCurrentRow()
{
  return SpreadsheetApp.getActiveRange().getRow()
}

//TEACHER CONTEACT
function getTeacherContact(row){
  //var row = 3
  //let row = getCheckedRows(ENROLLMENTSHEET, SELECTCOL)[0]
  let teacher_id = ENROLLMENTSHEET.getRange(row, TEACHERCOL).getValue().split("_")[0]
  var teacher_contact
  try
  {
    teacher_contact = TT.getTeacherContactInformation(teacher_id)
  }
  catch{
    teacher_contact = "Reihe " + row + " konnte nicht geladen werden"
  }
  return teacher_contact
}
//STUDENT MAIL
function getMail(row){
  //let row = getCheckedRows(ENROLLMENTSHEET, SELECTCOL)[0]
  return ENROLLMENTSHEET.getRange(row, MAILCOL).getValue()
}

//INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

