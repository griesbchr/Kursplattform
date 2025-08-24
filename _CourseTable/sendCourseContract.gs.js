function sendCourseContract()
{
  var course_id;

  while (true) {
    course_id = Browser.inputBox("Bitte 'Kurs' ID eingeben (siebenstellig, zB 'K239999')");
    
    if (validateCourseId(course_id)) {
      break; // Exit the loop if the input is valid
    } else {
      Browser.msgBox("Unültige Kurs ID. Bitte Kurs ID eingeben (siebenstellig, zB 'K239999')");
    }
  }
  var row = getCourseRow(course_id)
  console.log("teacher row " + row)
  if (row == 0)
  {
    Browser.msgBox("Kurs ID "+String(course_id)+" konnte nicht in Kursliste gefunden werden.");
    return
  }
  var teacher_id = COURSESHEET.getRange(row, TEACHERIDCOL).getValue()
  console.log("teacher id "+teacher_id)
  console.log("course id "+course_id )
  TF.sentContractMailByIds(course_id, teacher_id)

  SpreadsheetApp.getActiveSpreadsheet().toast("Anmeldung gesendet.", "", 100)
}

function validateCourseId(input) {
  if (typeof input !== 'string') {
    console.log("1")
    return false;
  }

  if (input.length !== 7) {
    console.log("2")
    return false;
  }

  if (input.charAt(0) !== 'K') {
    console.log("3")
    return false;
  }

  for (let i = 1; i < input.length; i++) {
    if (i === 1 && !(/[0-9]/).test(input.charAt(i))) {
      return false;
    } else if (i > 1 && !(/[0-9]/).test(input.charAt(i))) {
      return false;
    }
  }
  return true;
}
