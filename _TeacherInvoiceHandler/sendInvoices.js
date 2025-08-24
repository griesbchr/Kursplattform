function shareAndSentTeachersInvoices()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var script_props = PropertiesService.getScriptProperties()
  var file_id = script_props.getProperty(SOURCEFILEID_KEY)

  //get sheet creation date
  var creationDate = DriveApp.getFileById(file_id).getDateCreated();
  var invoice_folder_name = Utilities.formatDate(creationDate, "Europe/Vienna", 'dd.MM.yyyy');
  var target_folder_id = getOrCreateFolder(TEACHERINVOICESFOLDERID, invoice_folder_name)
  var file_iter = DriveApp.getFolderById(target_folder_id).getFiles()

  var subject = "Gesamt-Abrechnungen"
  var alias = 3
  var replyTo = "griesbacher@kursplattform.at"
  var name = "Kursplattform"
  var cc = "info@kursplattform.at"

  var file;
  var file_id_list = []
  while (file_iter.hasNext())
  {
    file = file_iter.next()
    file_id_list.push(file.getId())
  }

  console.log("Found " + file_id_list.length + " teacher invoice files in folder.")

  for (var file_id of file_id_list)
  {
    file = DriveApp.getFileById(file_id)
    var file_name_split = file.getName().split("_")
    var teacher_id = file_name_split[1]
    teacher_id = teacher_id.padStart(3, "0")
    var teacher_lastname = file_name_split[2]

    console.log("Starting teacher " + teacher_lastname)
    try{ss.toast("Lehrer " + teacher_lastname+ " gestartet")}catch(e){}

    var full_name = TT.getMailName(teacher_id)
    var html_body = getTeacherBillingHTMLBody(full_name)

    sentInvoiceMail(teacher_id, file_id, subject, replyTo, name, cc, alias, html_body)
    var teacher_mail = TT.getTeacherMail(teacher_id)

    shareInvoice(teacher_mail, file_id)
    try{ss.toast("Lehrer " + teacher_lastname + " abgeschlossen")}catch(e){}
    console.log("Finished teacher " + teacher_lastname)
    return
  }
}

function sentInvoiceMail(teacher_id, file_id, subject, replyTo, name, cc, alias, html_body)
{
  var teacher_mail = TT.getTeacherMail(teacher_id)
  console.log("teacher_mail " + teacher_mail)
  //teacher_mail = "christoph.griesbacher@gmail.com"      //DEBUG

  var attachmentFile = DriveApp.getFileById(file_id);
  var attachments =  [attachmentFile.getAs(MimeType.PDF)]

  MAIL.sendHTMLMailWithAttachment(teacher_mail, subject, html_body, alias, replyTo, name, cc, attachments)
}


function shareInvoice(teacher_mail, file_id) 
{
  var file = DriveApp.getFileById(file_id)

  file.addViewer(teacher_mail)
}


function getTeacherBillingHTMLBody(teacher_greeting)
{
  return '<p>Sehr geehrte/r '+teacher_greeting+',</p><p>&nbsp;</p><p>Für eine mögliche Jahresveranlagung lasse ich Ihnen Ihre Gesamt-Abrechnungen für das Schuljahr 2023/2024 zukommen.</p><p>&nbsp;</p><p>Mit freundlichen Grüßen,</p><p>das Büroservice Team</p>'
}

function aliastest()
{
  console.log(MAIL.printAliasOrder())
}