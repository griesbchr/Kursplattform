function writeFormulaToCell()
{
  //var formula = '=IF(I3*Formeln!F2>I12;I12;I3*Formeln!F2)'
  //var target_row = 13
  //var target_col = 9
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,sheet, file_id;
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    file_id = teacherfile.getId()
    sheet = SpreadsheetApp.openById(file_id).getSheetByName("Lehrerabrechnung")
    sheet.getRange(30, 8).setFormula('=COUNTIFS(\'Schülerabrechnung\'!N:N;">=7")')
  }
}

function writeTeacherNamesAndIDsToFormulas()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,sheet, file_id;
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    //teacherfile = DriveApp.getFileById("1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8")
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    var file_id = teacherfile.getId()
    var ss = SpreadsheetApp.openById(file_id)
    var sheet =  ss.getSheetByName("Formeln")
    var filename = ss.getName()
    var filename_split = filename.split("_")
    var teacher_id = filename_split[0]
    var teacher_name = filename_split[1]

    sheet.getRange(51, 1).setValue(teacher_name)
    sheet.getRange(51, 2).setValue(teacher_id)
  }
}

function lock_ranges()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,sheet, file_id;
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    //teacherfile = DriveApp.getFileById("1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8")
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    var file_id = teacherfile.getId()
    var ss = SpreadsheetApp.openById(file_id)
    var sheet = ss.getSheetByName("Anwesenheitsliste")
    var last_row = sheet.getLastRow()
    if (last_row != ATT_HEADERROW)
    {
      var range = sheet.getRange(ATT_HEADERROW+1, ATT_EXPECTEDHOURSCOL, last_row - ATT_HEADERROW)
      lock_range(range, "payment4 locked")
    }
   
  }
}
function getStudentListDescription()
{
  return 'Kurse, die bearbeitet werden sollen, müssen zuerst mittels der Auswahlbox ganz links in der Spalte A bei "Auswählen" mit einem Häkchen markiert werden.\nAnschließend können Sie folgende Aktionen am PC (nicht am Handy oder Tablett) durch die 2 Menüpunkte "Kurse verwalten" und "SchülerInnen verwalten" ganz oben rechts (hinter "Datei", "Bearbeiten", "Ansicht" etc.) durchführen:\nKurse starten: Startet den Kurs für die/den ausgewählte/n SchülerIn. Der Kurs wird dann automatisch in der Anwesenheitsliste und der Lehrerabrechnung angelegt. Achtung: Alle Daten (Name, Intrument etc.) können nach Starten des Kurses nicht mehr geändert werden.\nKurse beenden: Momentan laufende Kurse können mit dieser Aktion beendet werden. Alle Kurse werden am Kursende (Ende des Schuljahres) automatisch beendet.\Kurs löschen: Kurse ohne eingetragene Anwesenheiten oder fälligen Zahlungen werden mit dieser Aktion restlos aus Anwesenheitsliste und Schülerabrechnung gelöscht. Versehentlich oder falsch gestartete Kurse können so beendet werden.\nSchülerIn hinzufügen: Klicken Sie hier, werden Sie weitergeleitet, um die SchülerInnen-Daten auszufüllen. Die Daten können Sie selbst eingeben, oder Sie können einen Einladungslink per Mail an Eltern verschicken, damit diese die Daten ausfüllen.\nSchülerIn an ivi rücksenden: Mit dieser Aktion wird die/der SchülerIn aus Ihrer Schülerliste entfernt. Die entfernten SchülerInnen werden an das ivi übergeben, um diese eventuell anderen Lehrenden weiterzuvermitteln.\nKursänderung: Nach der 7. Einheit kann die Kursnummer geändert werden. Bitte den Kurs mit der alten Kursnummer beenden und einen Kurs mit der neuen Kursnummern starten. Die Kurse werden dann getrennt abgerechnet.'
}

function getAttendanceRichTextDescriptionFromTemplate()
{
    var template_att = SpreadsheetApp.openById(TEMPLATEFILEID).getSheetByName(ATTENDANCESHEETNAME)
    return template_att.getRange(1,3).getRichTextValue()
}

function writeValueToCell(sheetname, cell_row, cell_col, cell_value)
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,sheet, file_id;
  //var richtext = getAttendanceRichTextDescriptionFromTemplate()
  while (file_iter.hasNext()) 
  {
    //var teacherfile_id =  "1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"  //debug
    //var teacherfile = DriveApp.getFileById(teacherfile_id)     //debug
    teacherfile = file_iter.next()
    file_id = teacherfile.getId()
    console.log("starting teacherfile " + teacherfile.getName())

    sheet = SpreadsheetApp.openById(file_id).getSheetByName(sheetname)
    sheet.getRange(cell_row, cell_col).setValue(cell_value)
    //sheet.getRange(cell_row, cell_col).setRichTextValue(richtext)
    //return      //debug
  }
}


function updateBankInfos()
{
  var sheetname = "Formeln"
  var row = 2
  var col = 23
  var new_iban = "AT74 1912 0501 1122 8010"

  writeValueToCell(sheetname, row, col, new_iban)
}



function removeArchiveAccess()
{
  var curr_archive_folder = DriveApp.getFoldersByName("2022_2023").next()
  let file_iter = curr_archive_folder.getFiles()
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    users = teacherfile.getViewers()
    for (let user of users)
    {
      teacherfile.removeEditor(user)

    }
  }
}

function startCourses1() 
{ 
  let starting_time_s = new Date().getTime()/1000
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,student_sheet, file_id, start_payment_values;
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    file_id = teacherfile.getId()
    student_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === STUDENTSSHEETNAME)[0]

    // activate fields according to first payment
    start_payment_values = student_sheet.getRange(6, 17, student_sheet.getLastRow()-5).getValues().flat()
    console.log(start_payment_values)
    course_rows = start_payment_values.map((x, i) => (x=='1')?([i+6]):([""])).filter(x => x!="")      //6 cause 5 header + 1 for array to rownr
    console.log(course_rows.flat())
    
    //start courses
    for (let row of course_rows)
    {
      console.log("creating course of row"+row)
      createCourseCustom(row, student_sheet)
      student_sheet.getRange(row, 17).setValue("vor "+student_sheet.getRange(row, 17).getValue() + " TZ gestartet")

      if ((new Date().getTime()/1000) - starting_time_s > 1750)
      {
        console.log("returned with running time " + String((new Date().getTime()/1000) - starting_time_s) + ", finished row "+String(row))
        return
      }
    }
  }  
}

function startCourses2() 
{ 
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacherfile ,student_sheet, file_id, start_payment_values;
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    file_id = teacherfile.getId()
    student_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === STUDENTSSHEETNAME)[0]

    // activate fields according to first payment
    start_payment_values = student_sheet.getRange(6, 17, student_sheet.getLastRow()-5).getValues().flat()
    console.log(start_payment_values)
    course_rows = start_payment_values.map((x, i) => (x=='2')?([i+6]):([""])).filter(x => x!="")      //6 cause 5 header + 1 for array to rownr
    console.log(course_rows.flat())
    
    //start courses
    for (let row of course_rows)
    {
      console.log("creating course of row"+row)
      createCourseCustom(row, student_sheet)
      student_sheet.getRange(row, 17).setValue("vor "+student_sheet.getRange(row, 17).getValue() + " TZ gestartet")

    }
  }  
}

function createCourseCustom(row, sheet)
{
  let course = {}
  let lastCol = sheet.getLastColumn()
  //fetch all attributes of student list
  for (let col = 2; col <= lastCol; col = col + 1) {
    course[sheet.getRange(5, col).getValue()] = sheet.getRange(row, col).getValue()
  }

  //add some attributes
  course["LehrerID"] = sheet.getParent().getName().split("_")[0]
  course["studentlist_url"] = sheet.getParent().getUrl()
  createCourse(course)
}

function insertFirstPayment()
{

  let file_iter = TEACHERFILESFOLDER.getFiles()
  var ids, file_id, teacherfile, billing_sheet, payment_infos, last_row, keys, values, payment1dict, number_formats
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get billing sheet
    file_id = teacherfile.getId()
    student_sheet = SpreadsheetApp.openById(file_id).getSheetByName(STUDENTSSHEETNAME)
    last_row = student_sheet.getLastRow()
    keys = student_sheet.getRange(6, STU_COURSEIDCOL, last_row).getValues().flat()
    values = student_sheet.getRange(6, 27, last_row, 2).getValues()
    payment1dict = {};
    keys.forEach((key, i) => payment1dict[key] = values[i]);
    
    billing_sheet = SpreadsheetApp.openById(file_id).getSheetByName(BILLINGSTUDENTSHEETNAME)
    last_row = billing_sheet.getLastRow()
    if(last_row > 5)
    {
    ids = billing_sheet.getRange(5, 1, last_row-4).getValues().flat()
    payment_infos = ids.map(x => payment1dict[x])
    payment_infos.forEach(x => x[0] = x[0]==""?"":Number(x[0]))
    number_formats = Array(payment_infos.length).fill(["[$€]#,##0.00", "dd.mm.yyyy"])

    //write to file
    billing_sheet.getRange(5, PAYMENT1PAIDCOL, last_row-4, 2).setValues(payment_infos).setNumberFormats(number_formats)
    }

    }

}

function sentInviteMail()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var mail_text_html ,teacher_email, teacher_id, teacherfile ,billing_sheet, file_id, file_link, col_link
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get billing sheet
    file_id = teacherfile.getId()
    billing_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === BILLINGSTUDENTSHEETNAME)[0]

    teacher_id = teacherfile.getName().split("_")[0]
    teacher_greeting = TT.getMailGreeting(teacher_id)
    teacher_email = TT.getTeacherMail(teacher_id)

    //get insertion values
    file_link = billing_sheet.getParent().getUrl()+"#gid="+billing_sheet.getSheetId()
    col_link = file_link+"#gid="+billing_sheet.getSheetId()+"&range=Y4:Z"+String(billing_sheet.getLastRow())

    //mail text
    mail_text_template = getInvMailHTMLTextTemplate()

    //insertions
    mail_text_html = mail_text_template.replace("[Insert Teacher Greeting]", teacher_greeting)
                                  .replace("[insert filelink here]", file_link)
                                  .replace("[insert collink here]", col_link)

    //givePermission(teacher_email, file_id)
    //teacherfile.addEditor(teacher_email)
    MAIL.sendHTMLMail(teacher_email, "iVi Einzahlungsdaten","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")
  }

}


function updateFilePermissions()
{
  //DONT USE THIS, revokes access of all protections  only to admin editors
  var i;
  i = 131;   //thats the index where we start iterating the file id array
  //get all file_ids in alphabetical order
  let file_iter = TEACHERFILESFOLDER.getFiles()
  file_ids = []
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    file_ids.push(teacherfile.getId())
  }
  file_ids.sort()
  
  //remove indicex which are already done
  file_ids.splice(0, i)

  //update permissions for each id, index trecks the progress in case of timeout
  for (let file_id of file_ids)
  {
    teacherfile = DriveApp.getFileById(file_id)
    setPermissions(teacherfile)
    i = i + 1
    console.log(file_id)
    console.log(i)
  }
}


function getPayment4MailHTMLTextTemplate() {
return '[Insert Teacher Greeting],<br><br>um Kosten zu sparen (Kontokosten der Lehrenden), unterstütze ich das Büroservice, damit die Einzahlungsdaten der Eltern rechtzeitig für die Aussendung der 4. Teilzahlung bereitgestellt werden können. Aus diesem Grund sende ich Ihnen einen Link (Google Sheets) zur neuen digitalen Schülerliste im bekannten Format. Bitte tragen Sie wie gewohnt das Einzahlungsdatum für die jeweilige Teilzahlung in die vorgesehenen gelben Feld ein.<br><b>Der Betrag ist nicht diesmal nicht als fälliger Betrag angeführt!</b><br><a href="[insert collink here]">Link direkt zu den Feldern für das Eintragen der 4. Teilzahlung</a><br>Bitte stellen Sie sicher, dass alle Daten bis <b>Freitag, 15. Juli um 22:00 Uhr</b> eingetragen sind.<br>Wir bitten Sie, diesen Termin unaufgefordert einzuhalten.<br>Vielen Dank!<br><br>Mit freundlichen Grüßen,<br>Andreas Griesbacher'
}

function getAttnMailHTMLTextTemplate() {
return '<p>[Insert Teacher Greeting]</p><p>Erstmalig ist es f&uuml;r 50 Lehrende m&ouml;glich, uns die Anwesenheitsliste auch digital zu &uuml;bermitteln, welche f&uuml;r die Verrechnung der letzten Teilzahlung verwendet wird. Die Liste wird zus&auml;tzlich wie gewohnt morgen auch per Brief zugesendet, wenn es in dieser Form nicht m&ouml;glich ist.</p><p><a href="[insert collink here]">Link zur digitalen Anwesenheitsliste</a></p><p>Bis 05.04 2023 sind dann folgende Punkte zu erledigen:</p><ul><li><strong><u>Spalte AH: voraussichtliche Kurseinheiten f&uuml;r das Schuljahr 2022/2023</u></strong>:<br />	Hier erfassen Sie die Anzahl der Unterrichtseinheiten, welche der Sch&uuml;ler &quot;voraussichtlich&quot; im gesamten Schuljahr 2022/2023 in Anspruch nehmen wird bzw. bis jetzt schon in Anspruch genommen hat (bei einem Ausstieg oder Kursunterbrechung).</li><li><strong><u>Anwesenheitsfelder in der Anwesenheitsliste</u></strong>:<br />Hier kann im Dropdown-Feld (kleines Dreieck) eingetragen werden, ob der Sch&uuml;ler in der entsprechenden Kurseinheit anwesend (anw.), entschuldigt abwesend (ent.) oder unentschuldigt abwesend (abw.) war. Das Datum kann oberhalb vom Dropdown-Feld eingetragen werden.</li><li>Die <strong>tats&auml;chlichen Kurseinheiten (Spalte AI) werden automatisch mit jeder gehaltenen Stunde</strong> mitgeschrieben sobald diese im Dropdown-Feld eingetragen sind. Die Anwesenheitsliste kann dann gerne digital weitergef&uuml;hrt werden, wenn alle Einheiten vom Schuljahr nachgetragen werden. &Uuml;ber diesen Link ist die Anwesenheitsliste immer erreichbar!</li><li>Alle Eintragungen werden immer automatisch abgespeichert!</li><li>Fehlende Sch&uuml;ler werden von mir in den n&auml;chsten Tagen nachgetragen wenn sie dem B&uuml;roservice gemeldet wurden.</li></ul><p>Da den Eltern eine &quot;minutengenaue Abrechnung&quot; angeboten wird, sind die Angaben zu den <strong>voraussichtlichen Unterrichtseinheiten verbindlich.</strong> Sollten Sie doch mehr Einheiten halten, k&ouml;nnen diese nachtr&auml;glich nicht mehr verrechnet werden (Ausnahme: Kursverl&auml;ngerung &ndash; genauere Informationen werden von mir per E-Mail zugesendet).</p><p>Anmerkung: Zwei Vorspielstunden pro Schuljahr (inkl. Generalproben) k&ouml;nnen nach Ermessen der Lehrkraft als eine Unterrichtseinheit gewertet werden.</p><p>Die gesamten voraussichtlichen Einheiten (laut Anmeldeformular) werden in den Anwesenheitsfelder der Anwesenheitsliste erst mit den gehaltenen Unterrichtseinheiten bis zum Schulende aufgef&uuml;llt, wobei in der letzten Einheit als &quot;normale gehaltene Einheit&quot; die beiden Vorspielstunden deklariert werden k&ouml;nnen.</p><p>Vielen Dank!</p><p>F&uuml;r offene Fragen antworten Sie dieser Mail oder unter:<br />T: 0699/10436330<br />M: <a href="mailto:griesbacher@kursplattform.at" target="_blank">griesbacher@kursplattform.at</a></p><p>Mit besten Gr&uuml;&szlig;en,<br />Andreas Griesbacher</p><p>&nbsp;</p>'
}

function getPayment3HTMLTextTemplate() {
return '<p>[Insert Teacher Greeting],</p><p>um Kosten zu sparen (Kontokosten der Lehrenden), unterst&uuml;tze ich das B&uuml;roservice, damit die Einzahlungsdaten der Eltern rechtzeitig f&uuml;r die Aussendung der 4. Teilzahlung bereitgestellt werden k&ouml;nnen. Aus diesem Grund sende ich Ihnen einen Link (Google Sheets) zur neuen digitalen Sch&uuml;lerliste im bekannten Format. Bitte tragen Sie wie gewohnt das Einzahlungsdatum f&uuml;r die jeweilige Teilzahlung in die vorgesehenen gelben Feld ein.</p><p><a href="[insert collink here]" target="_blank">Link direkt zu den Feldern f&uuml;r das Eintragen der 3. Teilzahlung</a></p><p>Bitte stellen Sie sicher, dass alle Daten bis&nbsp;<strong>Freitag., 21. April. um 22:00 Uhr</strong>&nbsp;eingetragen sind.<br />Wir bitten Sie, diesen Termin unaufgefordert einzuhalten.<br />Vielen Dank!<br /><br />Mit freundlichen Gr&uuml;&szlig;en,<br />Andreas Griesbacher</p><p>&nbsp;</p>'
}

function sentPayment3Mail()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var mail_text_html ,teacher_email, teacher_id, teacherfile ,billing_sheet, file_id, file_link, col_link
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get billing sheet
    file_id = teacherfile.getId()
    billing_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === BILLINGSTUDENTSHEETNAME)[0]

    teacher_id = teacherfile.getName().split("_")[0]
    teacher_greeting = TT.getMailGreeting(teacher_id)
    teacher_email = TT.getTeacherMail(teacher_id)

    if (teacher_email === "")
    {
      console.log("No mail for teacher " + teacher_email + ". Skipping teacher")
      continue
    }

    //get insertion values
    file_link = billing_sheet.getParent().getUrl()+"#gid="+billing_sheet.getSheetId()
    col_link = file_link+"#gid="+billing_sheet.getSheetId()+"&range=AB:AC"

    //mail text
    mail_text_template = getPayment3HTMLTextTemplate()

    //insertions
    mail_text_html = mail_text_template.replace("[Insert Teacher Greeting]", teacher_greeting)
                                  .replace("[insert collink here]", col_link)

    MAIL.sendHTMLMail(teacher_email, "iVi Einzahlungsdaten der 3. Teilzahlung","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")
  }
}

function clear_col_content_all_tf()
{
  var starting_col = 31
  var num_cols = 1

  var starting_row = 5  //inclusive
  var last_row;

  let file_iter = TEACHERFILESFOLDER.getFiles()

  var file_id;

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get billing sheet
    file_id = teacherfile.getId()
    sheet = SpreadsheetApp.openById(file_id).getSheetByName(BILLINGSTUDENTSHEETNAME)
    last_row = sheet.getLastRow()
    if (starting_row == last_row+1){continue}
    sheet.getRange(starting_row, starting_col, last_row - starting_row + 1, num_cols).clearContent()
  }
}

function sentAttendanceSheetMail()
{
  let missing_list = ["003","006","009","011","015","034","038","042","052", "019"]

  let file_iter = TEACHERFILESFOLDER.getFiles()
  var mail_text_html ,teacher_email, teacher_id, teacherfile ,att_sheet, file_id, file_link 
  var drafts = GmailApp.getDrafts()
  mail_text_template = drafts[0].getMessage().getBody();

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    file_id = teacherfile.getId()
    att_sheet = SpreadsheetApp.openById(file_id).getSheetByName(ATTENDANCESHEETNAME)

    teacher_id = teacherfile.getName().split("_")[0]
    if (!missing_list.includes(teacher_id) ){continue}

    teacher_greeting = TT.getMailGreeting(teacher_id)
    teacher_email = TT.getTeacherMail(teacher_id)

    //get insertion values
    file_link = att_sheet.getParent().getUrl()+"#gid="+att_sheet.getSheetId()

    //get text template
    mail_text_template = getAttnMailHTMLTextTemplate()

    //insertions
    mail_text_html = mail_text_template.replace("[Insert Teacher Greeting]", teacher_greeting)
                                  .replace("[insert collink here]", file_link)

    //givePermission(teacher_email, file_id)
    //teacherfile.addEditor(teacher_email)
    MAIL.sendHTMLMail(teacher_email, "iVi: Abfrage der voraussichtlichen Kurseinheiten für das Schuljahr 2022/2023","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")
  }
}

function testMail()
{
  console.log(MailApp.getRemainingDailyQuota())
  //MAIL.sendHTMLMail("andreas.griesbacher@gmx.at", "iVi Einzahlungsdaten","", "Test Mail", 0)
MailApp.sendEmail({
to: "andreas.griesbacher@gmx.at",
subject: "Test mail",
htmlBody: "test mail",

});

  console.log(MailApp.getRemainingDailyQuota())
}

function load_drafts()
{
  var drafts = GmailApp.getDrafts()
  content = drafts[0].getMessage().getBody();
  MAIL.sendHTMLMail("christoph.griesbacher@gmail.com", "iVi Einzahlungsdaten","", content, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")

}

function print_mail_quota()
{
  console.log(MailApp.getRemainingDailyQuota())
}


function iter_teacher()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    //get student sheet
    file_id = teacherfile.getId()

    //call action function with file_id
    remove_protection(file_id)
  }
}

function remove_protection(file_id)
{
  //let file_id = "1_L2jlw5GKl2ROqzivPmUWmL9gSXEq_PpaWkRUdt_8Hg"
  let sheet = SpreadsheetApp.openById(file_id)
  var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
  var rem_arr

  rem_arr = protections.filter(e=>e.getRange().getA1Notation().startsWith("AD"))
  rem_arr.forEach(element => element.remove());
  rem_arr = protections.filter(e=>e.getRange().getA1Notation().startsWith("AE"))
  rem_arr.forEach(element => element.remove());
  rem_arr = protections.filter(e=>e.getRange().getA1Notation().startsWith("AF"))
  rem_arr.forEach(element => element.remove());
  rem_arr = protections.filter(e=>e.getRange().getA1Notation().startsWith("AC"))
  rem_arr.forEach(element => element.remove());
  
  protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
}

function rename_sheets()
{
  var name_bill_stu = "Schülerabrechnung"
  var name_bill_tea = "Lehrerabrechnung"
  let file_iter = TEACHERFILESFOLDER.getFiles()

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log("starting teacherfile " + teacherfile.getName())
    
    var file_id = teacherfile.getId()
    var student_bill_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === "Abrechnung_Schüler")[0]
    var teacher_bill_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === "Abrechnung_Kurs")[0]
    student_bill_sheet.setName(name_bill_stu)
    teacher_bill_sheet.setName(name_bill_tea)
  }
}
//TODO check first if all teacherfiles are in table
function sentPayment4Mail()
{
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var mail_text_html ,teacher_email, teacher_id, teacherfile ,billing_sheet, file_id, file_link, col_link
  var skip_teacher = ["009","029","061","055","023","015","013","043","011","010","014","034","038","052","028","008","030","012","026","003","001","033","119","050","025","020","035","049","059","044","004"]
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()

    console.log("starting teacherfile " + teacherfile.getName())
    
    //get billing sheet
    file_id = teacherfile.getId()
    billing_sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === BILLINGSTUDENTSHEETNAME)[0]

    teacher_id = teacherfile.getName().split("_")[0]
    if (skip_teacher.includes(teacher_id) ){continue}

    teacher_greeting = TT.getMailGreeting(teacher_id)
    teacher_email = TT.getTeacherMail(teacher_id)

    if (teacher_email === "")
    {
      console.log("No mail for teacher " + teacher_email + ". Skipping teacher")
      continue
    }

    //get insertion values
    file_link = billing_sheet.getParent().getUrl()+"#gid="+billing_sheet.getSheetId()
    col_link = file_link+"#gid="+billing_sheet.getSheetId()+"&range=AF:AG"

    //mail text
    mail_text_template = getPayment4MailHTMLTextTemplate()

    //insertions
    mail_text_html = mail_text_template.replace("[Insert Teacher Greeting]", teacher_greeting)
                                  .replace("[insert collink here]", col_link)

    MAIL.sendHTMLMail(teacher_email, "iVi Einzahlungsdaten der 4. Teilzahlung","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")
  }
}


function getBankAccountOkTextTemplate() {
return '<p style="text-align:start;"><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">Liebe/r [TEACHER_FIRSTNAME] [TEACHER_LASTNAME],</span></p><p style="text-align:start;"><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">ich bitte um die Überprüfung der Kontodaten!</span></p><p style="text-align:start;"><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">IBAN: [IBAN]</span><br><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">BIC: [BIC]</span><br><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">Bitte um Rückmeldung falls es sicht nicht um die aktuellen Kontodaten handelt.&nbsp;</span><br><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">Liebe Grüße</span></p><p style="text-align:start;"><span style="background-color:#ffffff;color:#222222;font-family:Calibri,sans-serif;font-size:11pt;">Andreas Griesbacher</span></p>'
}

function getEnterPaymentReminderTest() 
{
return '<p style="margin-left:0px;">Liebe Lehrende,</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">die Google Sheets werden bald archiviert. Bitte tragt daher alle fehlenden Einzahlungen der Eltern (Betrag, Datum) oder alle Rückzahlungen (als Minus-Beitrag, z.B. -38 €) an die Eltern bis zum <strong>22. September</strong> in die 5. Teilzahlungsspalte (Saldo) ein. Ihr könnt das archivierte Google Sheet auf der <a target="_blank" rel="noopener noreferrer" href="https://sheets.google.com">Google Sheets Homepage</a> mit der Suchfunktion (Nach “Archiv” suchen) finden. Anschließend könnt Ihr im Google Sheet unter „Datei→Download“ das Sheet als Excel- oder PDF-Datei herunterladen und für eure eigene Buchhaltung verwenden.</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">Vielen Dank!</p><p style="margin-left:0px;">&nbsp;</p>'
}


function sentEnterPaymentReminder()
{
  key_list = ["Email", "Anrede", "Vorname", "Nachname", "FileID", "Lehrer aktiv", "Verrechnungsservice"]
  var data_dict = TT.getTeacherData(key_list)

  for (let teacher_id in data_dict)
  {
    //teacher_id = 142
    var teacher_data = data_dict[teacher_id]

    var teacher_mail = teacher_data["Email"]
    console.log("starting teacher " + teacher_mail)

    if (teacher_data["Lehrer aktiv"] == false || teacher_data["Verrechnungsservice"] != "2A")
    {
      continue;
    }

    mail_text_template = getEnterPaymentReminderTest()

    MAIL.sendHTMLMail(teacher_mail, "Eintragung der 5. Teilzahlung","", mail_text_template, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")    
    //return
  }
}
function sentBankAccountOkMail()
{
  key_list = ["IBAN", "BIC", "Email", "Vorname", "Nachname", "Lehrer aktiv"]

  var data_dict = TT.getTeacherData(key_list)

  var mail_text_html ,teacher_email, teacher_id, teacherfile , file_id, teacher_iban

  for (let teacher_id in data_dict)
  {
    var teacher_data = data_dict[teacher_id]

    if (!teacher_data["Lehrer aktiv"])
    {
      continue;
    }
    var teacher_iban = teacher_data["IBAN"]
    var teacher_BIC = teacher_data["BIC"]
    var teacher_firstname = teacher_data["Vorname"]
    var teacher_lastname = teacher_data["Nachname"]
    var teacher_mail = teacher_data["Email"]
    
    console.log("starting teacher " + teacher_firstname + " " + teacher_lastname)

    
    //mail text
    mail_text_template = getBankAccountOkTextTemplate()

    //insertions
    mail_text_html = mail_text_template.replaceAll("[TEACHER_MAIL]", teacher_mail)
                                      .replace("[IBAN]", teacher_iban)
                                      .replace("[BIC]", teacher_BIC)
                                      .replace("[TEACHER_FIRSTNAME]", teacher_firstname)
                                      .replace("[TEACHER_LASTNAME]", teacher_lastname)

    MAIL.sendHTMLMail(teacher_mail, "Überprüfen der Kontonummer","", mail_text_html, 2, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")    
  }
}


function getPaymentMailTextTemplate(payment_nr, date_string) {
return '<p>[TEACHER_GREETING],</p><p>Bitte stellen Sie zeitnah die Einzahlungsdaten f&uuml;r die '+payment_nr+'. Teilzahlung bereit, damit die Aussendung der '+(payment_nr+1)+'. Teilzahlung erfolgen kann!<br />Aus diesem Grund senden wir Ihnen den Link (Google Sheets) zu Ihrer digitalen Sch&uuml;lerliste zu. Bitte tragen Sie das Einzahlungsdatum und den Betrag der '+payment_nr+'. Teilzahlung in die daf&uuml;r vorgesehenen gelben Felder ein.</p><p><a href="[COL_LINK]" target="_blank">Link direkt zu den Feldern f&uuml;r das Eintragen der '+payment_nr+'. Teilzahlung</a></p><p>Bitte stellen Sie sicher, dass alle Daten bis <strong>'+date_string+'</strong>&nbsp; eingetragen sind.<br />Wir bitten Sie, diesen Termin unaufgefordert einzuhalten.<br />Vielen Dank!<br /><br />Mit freundlichen Gr&uuml;&szlig;en,<br />Die Administration der Kursplattform</p>'
}

function printAlias()
{
  console.log(MAIL.printAliasOrder())
}

function sentPaymentMail()
{
  //****change****
  var test = false;
  payment_nr = 3
  date_string = "Montag 28. April um 22:00 Uhr"
  payment_colrange = "AB4:AC"
  //****change****    
  var alias = 2

  key_list = ["Email", "Anrede", "Vorname", "Nachname", "FileID", "Lehrer aktiv", "Verrechnungsservice"]
  var data_dict = TT.getTeacherData(key_list)

  var mail_text_html ,teacher_email, teacher_id, teacherfile , file_id, teacher_iban

  for (let teacher_id in data_dict)
  {
    if (test){teacher_id = 142;}
    var teacher_data = data_dict[teacher_id];

    if (teacher_data["Lehrer aktiv"] == false || teacher_data["Verrechnungsservice"] != "2A")
    {
      //return
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
    mail_text_html = mail_text_template.replace("[TEACHER_GREETING]", teacher_greeting)
                                      .replace("[COL_LINK]", col_link)

    MAIL.sendHTMLMail(teacher_mail, "iVi Einzahlungsdaten der "+payment_nr+". Teilzahlung","", mail_text_html, alias, "griesbacher@kursplattform.at", "Kursplattform", "info@kursplattform.at")    

    if (test){return}
  }
}



function getTeachersWithStartedCourseAndNoId()
{
  var file_id;// = "129KiDJcZ66V4eY8gzIvplrvu4CeSoaprKbyStoV3otY"
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacher_list = []

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log(teacherfile.getName())
  file_id = teacherfile.getId()
  //file_id = "1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8"
  var teacherfile_ss =  SpreadsheetApp.openById(file_id)
  var students_sheet = teacherfile_ss.getSheetByName(STUDENTSSHEETNAME)
  var coursestatus_data = students_sheet.getRange(1, STU_BILLINGSTATUS, students_sheet.getLastRow()).getValues().flat()
  var course_ids = students_sheet.getRange(1, STU_COURSEIDCOL, students_sheet.getLastRow()).getValues().flat()
  
  for (var row=0; row < coursestatus_data.length; row++)
  {
    if (coursestatus_data[row] == COURSESTARTEDVALUE)
    {
      if (course_ids[row] == NOCOURSEVALUE)
      {
        teacher_list.push(teacherfile_ss.getName())
      }
    }
  }

  }
  console.log(teacher_list)
  return
}


function getTeachersWithFailedTrialLessons()
{
  var file_id;// = "129KiDJcZ66V4eY8gzIvplrvu4CeSoaprKbyStoV3otY"
  let file_iter = TEACHERFILESFOLDER.getFiles()
  var teacher_list = []

  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()
    console.log(teacherfile.getName())
  file_id = teacherfile.getId()
  //file_id = "1YDI1Rn7ajcuAHTgKEI18MHMAXJ1fgLpepw_GTZjle94"      //debug
  var teacherfile_ss =  SpreadsheetApp.openById(file_id)
  var students_sheet = teacherfile_ss.getSheetByName(BILLINGCOURSESHEETNAME)
  var type_data = students_sheet.getRange(4, 1, 15).getValues().flat()
  var count_data = students_sheet.getRange(4, 4, 15).getValues().flat()
  
  for (var row=0; row < type_data.length; row++)
  {
    if (type_data[row] == "Schnupperkurs" && count_data[row] == "")
    {
        teacher_list.push(teacherfile_ss.getName())
        break;
    }
  }
  //console.log(teacher_list) //debug
  //return                    //debug
  }
  console.log(teacher_list)
  return
}

