function updateContactStatus() 
{
  Logger.log("[ET]Starting update status fields")
  ENROLLMENTSHEET.getParent().toast("Kontaktstatus wird aktualisiert.","", 10 )
  var teacher_file_ids = API.getTFApi("get_teacherfile_fileids")
  var student_info_dict = API.getThreadedTFApi("get_studentinfos_thread", teacher_file_ids)
  setAllContactStatus(student_info_dict)
}

function setAllContactStatus(tf_student_status_dict)
{
  //get contact status col
  var student_id_col =  ENROLLMENTSHEET.getRange(2, STUDENTIDCOL, ENROLLMENTSHEET.getLastRow()).getValues().flat()
  var contact_status_richtext = ENROLLMENTSHEET.getRange(2, CONTACTSTATUSCOL, ENROLLMENTSHEET.getLastRow()).getRichTextValues().flat()
  var contact_status = contact_status_richtext.map(e => e.getText())

  var idx_update = []
  var new_status = []
  for (var idx = 0; idx < student_id_col.length;idx = idx+1)
  {
    if (student_id_col[idx] in tf_student_status_dict)
    {
      //check if update is required
      if (contact_status[idx] != tf_student_status_dict[student_id_col[idx]]["contact_status"])
      {
        idx_update.push(idx)
        new_status.push(tf_student_status_dict[student_id_col[idx]]["contact_status"])
      }
    }
  }

  //iterate over cells that need update
  for (var i = 0; i < idx_update.length; i=i+1)
  {
    var row = idx_update[i] + HEADERROWS + 1
    var link =  ENROLLMENTSHEET.getRange(row, CONTACTSTATUSCOL).getRichTextValue().getLinkUrl()
    ENROLLMENTSHEET.getRange(row, CONTACTSTATUSCOL).setRichTextValue(SpreadsheetApp.newRichTextValue()
            .setText(new_status[i])
            .setLinkUrl(link)
            .build())
  }
  Logger.log("[ET]Updated "+String(idx_update.length) + " status fields in ET")
}

