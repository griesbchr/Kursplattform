function updateLastModified() 
{
  var date_dict = TF_GET.getLastUpdated()
  var last_row = TEACHERSHEET.getLastRow()
  var id_col = TEACHERSHEET.getRange(HEADINGROWS+1, IDCOL, last_row).getValues().flat()
  var last_mod_col = Array(last_row).fill([""])
  id_col.forEach((val, idx) => (val in date_dict) ?  last_mod_col[idx] = [date_dict[val]] : [""])
  var col_format = Array(last_row).fill(["dd.mm.yy, hh:mm"]) 
  TEACHERSHEET.getRange(HEADINGROWS+1, LASTMODDATECOL, last_row).setValues(last_mod_col).setNumberFormats(col_format)
  TEACHERSS.toast("Zuletzt bearbeitet Datum wurde aktualisiert.")
}
