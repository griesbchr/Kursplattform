function shareTFLib(teacher_mail, notify=false) {
var request = Drive.Permissions.insert(
  {
    'role': 'reader',
    'type': 'user',
    'value': teacher_mail
  },
  TEACHERFILES_BOUNDED_LIB_ID,
  {
    'sendNotificationEmails': notify
  }
);
}

function addMissingMailsToTFLib()
{
  //var missing_mails = ["christoph.griesbacher@student.tugraz.at"]
  var missing_mails = getTeacherFilesScriptsMissingMails()

  missing_mails = missing_mails.filter(element => element !== "");

  var no_google_acct = 0;
  for (var mail of missing_mails)
  {
    try{
      shareTFLib(mail)
    }catch (e) {
      // pray that google doesnt change this error message here
      if (e.message.includes('Bad Request.'))
      { 
        //continue, this email doesnt have a google account and thus is not used to edit the google sheet
        no_google_acct = no_google_acct + 1
        continue
      }
      console.error("Could not share TFLib with email address "+mail+" due to error: "+e.message)
    }
  }
  console.log("Number of emails without google account: " + no_google_acct)
  return
}

function getTeacherFilesScriptsMissingMails()
{
  var teacherfile_mail_set = getAllTeacherFileEmailsAsSet()

  var lib_mail_set = new Set();

  var tf_lib_file = DriveApp.getFileById(TEACHERFILES_BOUNDED_LIB_ID);
  var editors = tf_lib_file.getEditors()
  editors.forEach(element => lib_mail_set.add(element.getEmail()));

  var viewers = tf_lib_file.getViewers()
  viewers.forEach(element => lib_mail_set.add(element.getEmail()));

  //find editors of teacherfiles that cannot acces the Lib file
  var missing_mails = teacherfile_mail_set.difference(lib_mail_set)

  Logger.log("[TF] Found "+missing_mails.size+" missing email addresses in TF bounded lib.")
  return [...missing_mails]
}


function getAllTeacherFileEmailsAsSet()
{
  var file_iter = TEACHERFILESFOLDER.getFiles()

  var mail_set =  new Set();

  while (file_iter.hasNext())
  {
    var file = file_iter.next()
    var editors = file.getEditors()
    editors.forEach(element => mail_set.add(element.getEmail()));
  }

  return mail_set
}
