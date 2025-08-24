function createTeacherFile(teacher_id)
{
  Logger.log("[TF]creating teacher file "+ teacher_id)
  // copy and rename template file
  let teacher_filename = teacher_id + "_" + TT.getTeacherLastName(teacher_id)
  let file = TEMPLATEFILE.makeCopy()
      .setName(teacher_filename)
      .moveTo(TEACHERFILESFOLDER)
      .setShareableByEditors(false)
      //.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.EDIT)   //DELETE
    
  //set permissions to editors, when copyin all additional editors besides the owner are removed.
  setPermissions(file)
  
  //set link to TF
  let ss = SpreadsheetApp.openById(file.getId())
  var metadatas = ss.getDeveloperMetadata()
  for (var metadata of metadatas)
  {
    metadata.remove()
  }
  ss.addDeveloperMetadata("TF_WEBAPP_URL", WEBAPP_URL)
  ss.addDeveloperMetadata("TF_ADDSTU_URL", ADDSTU_BASEURL + teacher_id)

  let mail = TT.getTeacherMail(teacher_id)
  try{
    shareTFLib(mail, notify=false)
  } catch(e)
  {
    if (e.message.includes('Since there is no Google account associated with this email address, you must check the "Notify people" box to invite this recipient.'))
    { 
      console.log("[TF] No Google account associated with email address '" + mail + "'.")
    }
  }

  //set registration url to studentssheet
  let students_sheet = ss.getSheetByName(STUDENTSSHEETNAME)
  students_sheet.getRange(REGISTRATIONLINKROW, REGISTRATIONLINKCOL)
    .setFormula('=HYPERLINK("'+REGFORM.getPersonalizedRegistrationUrl(teacher_id)+'";"'+REGISTRATIONLINKTEXT+'" )')
    .setFontColor(HYPERLINKCOLOR)

  //set teacher data
  let formulas_sheet = ss.getSheetByName(FORMULASSHEETNAME)
  let missing_zeros = 3 - String(teacher_id).length
  let teacher_id_string = "0".repeat(missing_zeros) + teacher_id
  formulas_sheet.getRange(FOR_TEACHERINFOROW, FOR_TEACHERNAMECOL).setValue(TT.getTeacherFullName(teacher_id))
  formulas_sheet.getRange(FOR_TEACHERINFOROW, FOR_TEACHERIDCOL).setValue(teacher_id_string)
  formulas_sheet.getRange(FOR_TEACHERINFOROW, FOR_BILLCYCLE).setValue(DATA.getYear())

  //share file with teacher if he has a mail adress
  if(mail.length > 1)
  {
    //sentInstructionMail(mail)
    file.addEditor(mail)
  } else
  {
  SpreadsheetApp.getActiveSpreadsheet().toast("Es konnte keine Einladung für die Lehrerdatei an Lehrer "+TT.getTeacherFullName(teacher_id)+ " gesendet werden da für diesen Lehrer keine Mail Adresse eingetragen ist.")
  }

  //some payments might already be due when the course is created, thus getting the due payments and setting paymentDue cells accordingly
  let due_payments = CT.getDuePayments()
  for (let payment_string of due_payments)
  {
    setCoursePaymentDue(ss, payment_string)
  }

  //set all course parameters to the the new teacher file
  updateTeacherFile(SpreadsheetApp.openById(file.getId()))
  
  //add teacher to TeacherBilling
  let course_sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)
  let teacher_data = TT.getTeacherDataById(teacher_id)
  teacher_data["teacherfile_coursesheet_url"] = "https://docs.google.com/spreadsheets/d/"+file.getId()+"/edit#gid="+course_sheet.getSheetId()
  CT.addTeacherToTeacherBillingTable(teacher_data)
  Logger.log("[TF]successfuly finnished creating teacherfile " + file.getName())
  return file
}

function sentTestInstructionMail()
{
  sentInstructionMail("christoph.griesbacher@gmail.com")
}

function sentInstructionMail(mail_address)
{
  var subject = "Kursplattform - Anleitung Verrechnung"
  var text = "Hier Anleitung einfügen bla bla bla"
  //MAIL.sentMail(mail_address, subject, text, fromalias=2,replyTo="office@kursplattform.at", name="Kursplattform", )
  MAIL.sentMail(mail_address, subject, text)

}

function setPermissions(file)
{
  var ss = SpreadsheetApp.openById(file.getId())
  var protection_types = [SpreadsheetApp.ProtectionType.RANGE, SpreadsheetApp.ProtectionType.SHEET]
  //var protec_list = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE)
  for (protection_type of protection_types)
  {
    var protec_list = ss.getProtections(protection_type)
    for (var protec of protec_list)
    {
      protec.removeEditors(protec.getEditors())
      protec.addEditors(EDITORSMAILLIST)
    }
  }
}
