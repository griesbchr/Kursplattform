function sentOfficeroInvoices(invoice_folder_id, school_year) 
{

  var subject = "Honorarnote Büroservicebeitrag"
  var alias = 2     //[ 1: 'anmeldungen@kursplattform.at', 2: 'noreply@kursplattform.at' ]
  var replyTo = "service@officero.at"
  var name = "Officero Team"
  var cc = "info@kursplattform.at"
  
  var file_iter = DriveApp.getFolderById(invoice_folder_id).getFiles()
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
    var teacher_id = file_name_split[2]
    teacher_id = teacher_id.padStart(3, "0")
    var teacher_lastname = file_name_split[3]

    console.log("Starting teacher " + teacher_lastname)
    try{ss.toast("Lehrer " + teacher_lastname+ " gestartet")}catch(e){}

    var full_name = TT.getMailName(teacher_id)
    var html_body = getOfficeroInvoiceHTMLBody(full_name, school_year)

    sentInvoiceMail(teacher_id, file_id, subject, replyTo, name, cc, alias, html_body)

    try{ss.toast("Lehrer " + teacher_lastname + " abgeschlossen")}catch(e){}
    console.log("Finished teacher " + teacher_lastname)
    //return                             //DEBUG
  }
}

function getOfficeroInvoiceHTMLBody(full_name,school_year)
{
var html_text = "<p>Liebe/r "+ full_name + ",</p><p>anbei senden wir Ihnen die Rechnung für den Büroservicebeitrags des Schuljahres "+school_year+".<br>Sofern Sie die Zahlung noch nicht vorgenommen haben, bitte wir Sie um die Überweisung bis spätestens <strong>"+OFFICEROZAHLUNGSDEADLINE+"</strong>.<br>Für Fragen stehen wir Ihnen gerne zur Verfügung.</p>Mit freundlichen Grüßen,<br>das Büroservice Officero Team</p>"
return html_text
}

function sentOfficeroInvoiceReminders(not_paid_teacher_ids, payment_refs, due_amounts, invoice_folder_id)
{
  //DEBUG
  //var invoice_folder_id = "1mTNNvuT5a9Rg1gOQfzUUHsnvFAb9O5e8"
  //var not_paid_teacher_ids = ["032"]
  //var payment_refs = ["01234"]
  //var due_amounts = ["123"]

  var subject = "Zahlungserinnerung Honorarnote Büroservicebeitrag"
  var alias = 2     //[ 1: 'anmeldungen@kursplattform.at', 2: 'noreply@kursplattform.at' ]
  var replyTo = "service@officero.at"
  var name = "Officero Team"
  var cc = "info@kursplattform.at"

  var billing_date = OFFICERORECHNUNGSDATUM
  var due_date = OFFICEROZAHLUNGSDEADLINE

  var file_iter = DriveApp.getFolderById(invoice_folder_id).getFiles()
  var file, teacher_id;
  var teacher_id_file_id_dict = {}
  while (file_iter.hasNext())
  {
    file = file_iter.next()
    teacher_id = file.getName().split("_")[2]
    teacher_id_file_id_dict[teacher_id] = file.getId()
  }

  for (let i = 0; i < not_paid_teacher_ids.length; i++) 
  {
    var teacher_id = not_paid_teacher_ids[i]
    var due_amount = due_amounts[i]
    var payment_ref = payment_refs[i]
    var file_id = teacher_id_file_id_dict[teacher_id]
    file = DriveApp.getFileById(file_id)
    var file_name_split = file.getName().split("_")
    var teacher_id = file_name_split[2]
    teacher_id = teacher_id.padStart(3, "0")
    var teacher_lastname = file_name_split[3]

    console.log("Starting teacher " + teacher_lastname)
    try{ss.toast("Lehrer " + teacher_lastname+ " gestartet")}catch(e){}

    var full_name = TT.getMailName(teacher_id)
    var html_body = getOfficeroInvoiceReminderHTMLBody(full_name, billing_date, due_amount, due_date, payment_ref)

    sentInvoiceMail(teacher_id, file_id, subject, replyTo, name, cc, alias, html_body)

    try{ss.toast("Lehrer " + teacher_lastname + " abgeschlossen")}catch(e){}
    console.log("Finished teacher " + teacher_lastname)
    //return                        // DEBUG
  }
  return
}

function sentOfficeroInvoiceReminders2(not_paid_teacher_ids, payment_refs, due_amounts, invoice_folder_id)
{
  //DEBUG
  //var invoice_folder_id = "1mTNNvuT5a9Rg1gOQfzUUHsnvFAb9O5e8"
  //var not_paid_teacher_ids = ["032"]
  //var payment_refs = ["01234"]
  //var due_amounts = ["123"]

  var subject = "Zweite Zahlungserinnerung Honorarnote Büroservicebeitrag"
  var alias = 2     //[ 1: 'anmeldungen@kursplattform.at', 2: 'noreply@kursplattform.at' ]
  var replyTo = "service@officero.at"
  var name = "Officero Team"
  var cc = "info@kursplattform.at"

  var billing_date = OFFICERORECHNUNGSDATUM
  var due_date = OFFICEROZAHLUNGSDEADLINE

  var file_iter = DriveApp.getFolderById(invoice_folder_id).getFiles()
  var file, teacher_id;
  var teacher_id_file_id_dict = {}
  while (file_iter.hasNext())
  {
    file = file_iter.next()
    teacher_id = file.getName().split("_")[2]
    teacher_id_file_id_dict[teacher_id] = file.getId()
  }

  for (let i = 0; i < not_paid_teacher_ids.length; i++) 
  {
    var teacher_id = not_paid_teacher_ids[i]
    var due_amount = due_amounts[i]
    var payment_ref = payment_refs[i]
    var file_id = teacher_id_file_id_dict[teacher_id]
    file = DriveApp.getFileById(file_id)
    var file_name_split = file.getName().split("_")
    var teacher_id = file_name_split[2]
    teacher_id = teacher_id.padStart(3, "0")
    var teacher_lastname = file_name_split[3]

    console.log("Starting teacher " + teacher_lastname)
    try{ss.toast("Lehrer " + teacher_lastname+ " gestartet")}catch(e){}

    var full_name = TT.getMailName(teacher_id)
    var html_body = getOfficeroInvoiceReminder2HTMLBody(full_name, billing_date, due_amount, due_date, payment_ref)

    sentInvoiceMail(teacher_id, file_id, subject, replyTo, name, cc, alias, html_body)

    try{ss.toast("Lehrer " + teacher_lastname + " abgeschlossen")}catch(e){}
    console.log("Finished teacher " + teacher_lastname)
    //return                        // DEBUG
  }
  return
}


function getOfficeroInvoiceReminderHTMLBody(full_name, billing_date, due_amount, due_date, payment_ref)
{return `
<p>\
    Liebe/r `+full_name+`,
</p>
<p>
    Wir möchten Sie freundlich an unsere <strong>Honorarnote vom `+billing_date+`</strong> erinnern. Laut unseren Unterlagen ist die Zahlung für den Betrag von <strong>€ `+due_amount+`</strong> noch ausständig. Die ursprüngliche Zahlungsfrist war der<strong> `+due_date+`</strong>.
</p>
<p>
    Wir bitten Sie höflich, die Überweisung des offenen Betrags baldmöglichst zu veranlassen. Zur Vereinfachung finden Sie nachfolgend nochmals die notwendigen Zahlungsinformationen:
</p>
<p>
    <strong>Empfänger</strong>: Officero<br>
    <strong>IBAN</strong>: AT74 1912 0501 1122 8010<br>
    <strong>Zahlungsreferenz</strong>: `+payment_ref+`
</p>
<p>
    Sollten Sie die Zahlung in der Zwischenzeit bereits getätigt haben, betrachten Sie diese E-Mail bitte als gegenstandslos.<br>
    Falls Sie Fragen zur Rechnung haben, zögern Sie bitte nicht, uns unter service@officero.at zu kontaktieren.
    Eine Kopie der Honorarnote finden Sie im Anhang. 
</p>
<p>
    Vielen Dank für Ihre umgehende Erledigung.
</p>
<p>
    Mit freundlichen Grüßen<br>
    das Büroservice Officero Team
</p>`
}

function getOfficeroInvoiceReminder2HTMLBody(full_name, billing_date, due_amount, due_date, payment_ref)
{return `
<p>\
    Liebe/r `+full_name+`,
</p>
<p>
    Ich melde mich noch einmal bezüglich der Honorarnote für den Büroservicebeitrag vom <strong>`+billing_date+`</strong>. Laut unseren Unterlagen ist die Zahlung für den Betrag von <strong>€ `+due_amount+`</strong> noch nicht eingegangen. Die ursprüngliche Zahlungsfrist war der<strong> `+due_date+`</strong>.
</p>
<p>
    Wir bitten Sie daher, die Überweisung des offenen Betrags baldmöglichst vorzunehmen. Zur Vereinfachung finden Sie nachfolgend nochmals die notwendigen Zahlungsinformationen:
</p>
<p>
    <strong>Empfänger</strong>: Officero<br>
    <strong>IBAN</strong>: AT74 1912 0501 1122 8010<br>
    <strong>Zahlungsreferenz</strong>: `+payment_ref+`
</p>
<p>
    Sollten Sie die Zahlung in der Zwischenzeit bereits getätigt haben, betrachten Sie diese E-Mail bitte als gegenstandslos.<br>
    Falls Sie Fragen zur Rechnung haben, zögern Sie bitte nicht, uns unter service@officero.at zu kontaktieren.
    Eine Kopie der Honorarnote finden Sie im Anhang. 
</p>
<p>
    Vielen Dank für Ihre umgehende Erledigung.
</p>
<p>
    Mit freundlichen Grüßen<br>
    das Büroservice Officero Team
</p>`
}