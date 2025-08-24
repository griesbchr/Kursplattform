function setInvoiceSourceFileID(file_id) 
{
  var script_props = PropertiesService.getScriptProperties()

  script_props.setProperty(SOURCEFILEID_KEY, file_id)
  return
}

function getInvoiceSourceFileLink()
{
  var script_props = PropertiesService.getScriptProperties()
  if (script_props.getProperty(SOURCEFILEID_KEY) == null)
  {
    return "Keine Datenquelle ausgewählt."
  }else
  {
    return "https://docs.google.com/spreadsheets/d/"+script_props.getProperty(SOURCEFILEID_KEY)+"/edit?gid=0#gid=0"
  }
}
