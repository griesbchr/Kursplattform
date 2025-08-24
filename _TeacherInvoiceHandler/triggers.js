//
function registerInvoiceTrigger()
{
  var script_props = PropertiesService.getScriptProperties()
  
  //check if source folder is set
  if (script_props.getProperty(TEACHER_ID_QUEUE_KEY) == null || script_props.getProperty(TEACHER_ID_DONE_KEY) == null)
  {
    throw new Error("Could not set up trigger because teacher id lists are missing.")
  }
  
  if (script_props.getProperty(TRIGGER_ID_KEY) != null)
  {
    throw new Error("Teacher Invoice trigger already in place. Please delete trigger before creating new trigger.")
  }
  Logger.log("Invoice Trigger wird installiert")
  var trigger_id = ScriptApp.newTrigger("createNextInvoices")
  .timeBased()
  .everyMinutes(TRIGGER_INTERVAL)
  .create()
  .getUniqueId();

  script_props.setProperty(TRIGGER_ID_KEY, trigger_id)
}

function cleanUpInvoiceTrigger()
{
  var script_props = PropertiesService.getScriptProperties()
  if (script_props.getProperty(TRIGGER_ID_KEY) == null)
  {
    throw new Error("Could not clean up trigger because no trigger id is registered.")
  }
  var trigger_id = script_props.getProperty(TRIGGER_ID_KEY)
  var project_trigger_list = ScriptApp.getProjectTriggers()
  for (var project_trigger of project_trigger_list)
  {
    if (project_trigger.getUniqueId() == trigger_id)
    {
      ScriptApp.deleteTrigger(project_trigger)
    }
  }
  script_props.deleteProperty(TRIGGER_ID_KEY)
}

