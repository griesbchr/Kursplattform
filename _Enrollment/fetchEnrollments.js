function updateEnrollments()
{
  Logger.log("[ET]Started fetching new enrollment mails")
  let student_dicts =  MAIL.fetchNewMails()
  for(let student of student_dicts)
  {
    addStudent(student)
  }
  
  Logger.log("[ET]Added "+student_dicts.length+ " students to ET")
  return student_dicts.length
}


function getNumberOfEnrollments()
{
  let message;
  let num_of_students = MAIL.getNumberOfNewEnrollments()
  if (num_of_students > 0)
  {
    message = "Es wurden " + num_of_students + " neue Anmeldungen gefunden."
  } else
  {
    message = "Es wurden keine neuen Anmeldungen gefunden"
  }
  SPREADSHEET.toast(message, "", 20)
}
