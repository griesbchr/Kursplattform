function archiveTeacherFilesWithEditorsAsViewers()
{
  archiveTeacherFiles(true)
}

function archiveTeacherFilesWithoutEditorsAsViewers()
{
  archiveTeacherFiles(false)
}

function archiveTeacherFiles(with_editors_as_viewers=false) 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.toast("Archivierung gestartet..","",20)
  var teacherfile_ids = TF.getAllTeacherFileIds()
  teacherfile_ids.sort()

  //create new archive folder with date
  var mainarchivefolder = DriveApp.getFolderById(ARCHIVEFOLDERID)

  var todaystring = UTLS.getToday()
  var archivefolder_id = mainarchivefolder.createFolder("Lehrerdateien_"+todaystring).getId()

  var const_payload = {}
  var split_payload = {};
  const_payload["archive_folder_id"] = archivefolder_id;
  const_payload["with_viewers_as_editors"] = with_editors_as_viewers

  split_payload["teacherfile_ids"] = teacherfile_ids
  API.postThreadedTFApi("archive_teacherfile", const_payload, split_payload)

  ss.toast("Archivierung abgeschlossen..","",20)
}
