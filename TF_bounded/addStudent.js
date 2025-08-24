function addStudentsCallback()
{
  var num_students_string = Browser.inputBox("Wieviele Schüler sollen angelegt werden?")
  num_students = Number(num_students_string)
  for (var i = 0; i <num_students; i=i+1)
  {
    addStudentCallback(num_students)
  }
  TEACHERSPREADSHEET.toast("Es wurden " + String(num_students) + " leere Schüler hinzugefügt.")
}
function addStudentCallback() 
{
  //var data = {}
  //data["teacher_drive_name"] = STUDENTSSHEET.getParent().getName()
  //addEmptyStudent(data)
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " started adding student UI")

  var html = HtmlService.createHtmlOutput('<!DOCTYPE html><html><script>'
  +'window.close = function(){window.setTimeout(function(){},9)};'
  +'var a = document.createElement("a"); a.href="'+ADDSTUDENTURL+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +';'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;"><a href="'+ADDSTUDENTURL+'" target="_blank" onclick="window.close()">Klicken Sie hier falls die automatische Weiterleitung fehlgeschlagen ist</a>.</body>'
  +'<script>google.script.host.setHeight(55);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  SpreadsheetApp.getUi().showModalDialog( html, "Wird geöffnet ...",);
  Logger.log("[INFO]" + TEACHERSPREADSHEET.getName() + " finished adding student UI")
}
