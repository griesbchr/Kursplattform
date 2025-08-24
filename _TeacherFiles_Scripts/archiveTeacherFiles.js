
//function archiveTeacherFilesWithEditorsAsViewers()
//{
//  archiveTeacherFiles(true)
//}

//function archiveTeacherFilesWithoutEditorsAsViewers()
//{
//  archiveTeacherFiles(false)
//}

function archiveTeacherFilesFromAPI(data)
{
  var archivefolder_id = data["archive_folder_id"]
  var teacherfile_ids = data["teacherfile_ids"]
  console.log("teacherfile_ids ")
  console.log(teacherfile_ids)
  var with_viewers_as_editors = data["with_viewers_as_editors"]
  var archivefolder = DriveApp.getFolderById(archivefolder_id)

  var teacherfile;
  for (var teacherfile_id of teacherfile_ids)
  {
    teacherfile = DriveApp.getFileById(teacherfile_id)
    
    if (with_viewers_as_editors)
    {
      archiveTeacherFile(teacherfile, archivefolder, true)
    }else
    {
      archiveTeacherFile(teacherfile, archivefolder, false)
    }
  }
  

}
//copy all TeacherFiles into archive
function archiveTeacherFiles(withEditorsAsViewers=false)
{
  //create new archive folder with date
  var mainarchivefolder = DriveApp.getFolderById(ARCHIVEFOLDERID)

  var todaystring = UTLS.getToday()
  var archivefolder = mainarchivefolder.createFolder("Lehrerdateien_"+todaystring)

  //iterate over all teacher files
  let file_iter = TEACHERFILESFOLDER.getFiles()
  while (file_iter.hasNext()) 
  {
    teacherfile = file_iter.next()

    archiveTeacherFile(teacherfile, archivefolder, withEditorsAsViewers)
  }

}

//copy single TeacherFiles into archive
function archiveTeacherFile(teacherfile,archivefolder, withEditorsAsViewers=true)
{
  var fileId = teacherfile.getId()
  teacherfile_ss = SpreadsheetApp.openById(fileId)
  var todaystring = UTLS.getToday(teacherfile_ss)
   
    let teacherfile_copy = teacherfile.makeCopy()
    .setName("Archiv_"+teacherfile.getName()+"_"+todaystring)
    .moveTo(archivefolder)
    .setShareableByEditors(false)

  if (withEditorsAsViewers)
  {
    var teacherfile_copy_ss = SpreadsheetApp.openById(teacherfile_copy.getId())
    //set permissions
    var editors = teacherfile.getEditors();
    for (var i = 0; i < editors.length; i++) {
      var email = editors[i].getEmail();
      console.log(email)
      try{
        teacherfile_copy_ss.addViewer(email);    //use Spreadsheetapp because it doesnt send email notifications
      } catch(e)
      {
        console.log("[TF] Could not send mail to address " + email + " with following exception: " + e.message)
        continue;
      }
    }
  }

  console.log("finished archiving teacher file " + teacherfile_copy.getName())
}

