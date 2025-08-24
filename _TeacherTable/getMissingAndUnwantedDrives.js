function getMissingAndUnwantedDrives() {
  let teacher_drive_ids = TF_GET.getTeacherFileIDs()
  let checked_rows = UTLS.getCheckedRows(TEACHERSHEET, DRIVESTATUSCOL)
  let checked_teachers_ids = UTLS.getColValues(TEACHERSHEET, IDCOL, checked_rows)
  let missing_drives = []
  let unwanted_drives = []
  for (let drive_id of checked_teachers_ids) {
    if (!(teacher_drive_ids.includes(drive_id))) {
      missing_drives.push(drive_id)
    }
  }
  for (let drive_id of teacher_drive_ids) {
    if (!(checked_teachers_ids.includes(drive_id))) {
      unwanted_drives.push(drive_id)
    }
  }

  let tt_ids = getAllTeacherIds()
  let color_array = tt_ids.map((val) => teacher_drive_ids.includes(val)? GREEN:RED);

  setDriveStatusColors(color_array)
 
  return [missing_drives, unwanted_drives]
}
