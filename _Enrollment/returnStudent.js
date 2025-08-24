function returnStudent(student) 
{
  student["Art_Anmeldung"] = "Rückgabe von Lehrer"
  var row = UTLS.findValueInCol(ENROLLMENTSHEET, STUDENTIDCOL, student["SchuelerID"])
  if (row == 0) //the student was not found in the table
  {
    student["ScriptInfo"] = "Von Lehrer zurückgegeben, jedoch nicht in Tabelle gefunden"
    row = addStudent(student, true)   //Set has_id to true to prevent overwriting ID
  }else //the student already is in the table
  {
    //delete old row
    ENROLLMENTSHEET.deleteRow(row)
    student["ScriptInfo"] = "Von Lehrer zurückgegeben, jedoch nicht in Tabelle gefunden"
    row = addStudent(student, true)   //Set has_id to true to prevent overwriting ID

    setContactStatus(student["SchuelerID"], student["Kontaktstatus"])
  }
  //set background color to red
  ENROLLMENTSHEET.getRange(row, SHARECHECKBOXCOL).setBackground(RED)
  
}

