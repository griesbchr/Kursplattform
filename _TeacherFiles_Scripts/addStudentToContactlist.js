function addEmptyStudentToContactlist(data) {
  var student = ET.getEmptyStudent()
  student["Lehrer"] = data["teacher_drive_name"]
  student["Kursvertragsstatus"] = "Vertrag nicht vorhanden"
  student["Zweigstelle"] = "Keine Zweigstelle"
  student["Voranmeldung"] = "keine Voranmeldung"
  student["SchuelerID"] = DATA.getNewStudentID()
  addStudentToContactlist(student)
  Logger.log("[TF]Added empty student " + student["SchuelerID"] +" to teacher " + student["Lehrer"])

}

function addStudentToContactlist(student)
{
  let file = getTeacherFile(student["Lehrer"].split("_")[0])
  let file_id = file.getId()
  let sheet = SpreadsheetApp.openById(file_id).getSheets().filter(e => e.getName() === STUDENTSSHEETNAME)[0]

  student["teachersheet_link"] = file.getUrl()
  student["Verein"] = DATA.getAssociation(student["Zweigstelle"])
  

  //FIRST insert text fields
  var len = 31
  var row_data = Array(len).fill("")
  var row_format = Array(len).fill("@")
  var row_fontcolor = Array(len).fill(null)

  //Auswählen
    //"1 Checkbox"           
    row_format[0] = ""      
    //sheet.getRange(row, 1).insertCheckboxes()
  //Schülername
    //"2 Vorname"
    row_data[1] = student["S_Vorname"]
    //"3 Nachname"
    row_data[2] = student["S_Nachname"]
  //Statusfelder
    //"4 Verechnungsstatus":        
    row_data[3] = NOCOURSEVALUE
    row_fontcolor[3] = CANNOTCHANGECOLOR
    //"5 Kontaktstatus":            
    //"6 Daten überprüft":          
    row_format[5] = ""      
  //Kursinformationen
    //"7 Kursart":                  
    //"8 Kursnummer":               
    //"Kursmodus":                
    //"Zweigstelle":              
    //"Instrument":
    row_data[10] = student["Instrument"]   
    //"Kursvertragsstatus":       
    //"Voranmeldung":             
    row_data[12] = student["Voranmeldung"]   
    row_data[13] = student["Anmerkungen"]   

  //Kontaktinformationen
    //"EMail":           
    row_data[14] = student["EMail"]            
    //"Telefon_mobil":            
    row_data[15] = student["Telefon_mobil"]            
    //"Telefon_Vormittag":        
    row_data[16] = student["Telefon_Vormittag"]            
    //"Notizen":
    //row_data[16] = student["ErsteTZ"]                     //DELETE                     
  //Rechnungsinformationen
    //"Rechnungsname":            
    row_data[18] = student["Rechnungsname"]            
    //"Rechnungsadresse":         
    row_data[19] = student["Rechnungsadresse"]            
    //"Rechnungsort":    
    row_data[20] = student["Rechnungsort"]            
    //"Rechnungs_PLZ":            
    row_data[21] = student["Rechnungs_PLZ"]            
    //"Rechnungs_Mail":            
    row_data[22] = student["Rechnungs_Mail"]          
  //Zusatzinformationen
    //"Wohngemeinde":             
    row_data[23] = student["Wohngemeinde"]            
    //"Geburtsdatum":             
    row_data[24] = student["Geburtsdatum"]            
    //"Schule_Klasse":            
    row_data[25] = student["Schule_Klasse"]            
    //"Wunschtermine":            
    row_data[26] = student["Wunschtermine"]            
    //"Nicht_Moeglich":           
    row_data[27] = student["Nicht_Moeglich"]            
    //"Nachmittagsbetreuung":     
    row_data[28] = student["Nachmittagsbetreuung"]            
    //"SchuelerID":              
    row_data[29] = student["SchuelerID"]   
    row_fontcolor[29] = CANNOTCHANGECOLOR         
    //"KursID":                   
    row_data[30] = NOCOURSEVALUE         
    row_fontcolor[30] = CANNOTCHANGECOLOR

  try {
    var sheet_id = sheet.getSheetId()
    UTLS.lockSheet(sheet_id)

    var row = appendCleanRow(sheet)
    sheet.getRange(row, 1, 1, len).setValues([row_data]).setNumberFormats([row_format]).setFontColors([row_fontcolor])


    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of course table")
    throw e
  } finally {
    UTLS.releaseSheetLock(sheet_id)
  }

  
  //SECOND insert dropdowns
    len = 6
    value_lists = Array(len).fill(null)
    default_options = Array(len).fill("")
    
    value_lists[0] = DATA.getContactStatus()
    default_options[0] = "Noch offen"
    //Kursinformationen
    //"Kursart": 
    value_lists[2] = DATA.getCoursetypes()
    default_options[2] = student["Kursart"]                  //DELETE
    //"Kursnummer":               
    value_lists[3] = DATA.getCoursenumbers()
    default_options[3] = student["Kursnummer"]           //DELETE
    //"Kursmodus":                
    value_lists[4] = DATA.getCoursemodes()
    default_options[4] = student["Kursmodus"]                 //DELETE
    //"Zweigstelle":              
    value_lists[5] = DATA.getDistricts()
    default_options[5] = student["Zweigstelle"]            
  UTLS.makeDropdowns(sheet.getRange(row, 5, 1, 6), value_lists, default_options)
  var course_contract_options = DATA.getCourseContractStatus()
  UTLS.makeDropdowns(sheet.getRange(row, 12), [course_contract_options],  [student["Anmeldungen"]], true) //allow invalid=true 
 
  
  //LAST insert check boxes (they get overwritten by dropdowns!)
    //"Checkbox"                 
    sheet.getRange(row, 1).insertCheckboxes()
    
    //"Daten überprüft":          
    sheet.getRange(row, 6).insertCheckboxes().setBackground(YELLOW)

  //Set borders
  //Auswählen
  setGroupBorder(sheet.getRange(row, 1))
  //Schülername
  setGroupBorder(sheet.getRange(row, 2, 1, 2))
  //Statusfelder
  setGroupBorder(sheet.getRange(row, 4, 1, 3)) 
  //Kursinformationen
  setGroupBorder(sheet.getRange(row, 7, 1, 8)) 
  //Kontaktinformationen
  setGroupBorder(sheet.getRange(row, 15, 1, 4)) 
  //Rechnungsinformationen
  setGroupBorder(sheet.getRange(row, 19, 1, 5)) 
  //Zusatzinformationen
  setGroupBorder(sheet.getRange(row, 24, 1, 8)) 

  //update Conditional format rules
  //set contact status red per default
  sheet.getRange(row, 5, 1).setBackground(RED)

  var rules = sheet.getConditionalFormatRules()
  //contact status field
  var nocontactrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Noch offen")
                        .setBackground(YELLOW)
                        .setRanges([sheet.getRange(row,5)])
  var contactrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Aktiv")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,5)])
  //for empty course parameter fields
  var emptyrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenCellEmpty()
                        .setBackground(YELLOW)
                        .setRanges([
                          sheet.getRange(row,7),
                          sheet.getRange(row,8), 
                          sheet.getRange(row,9),
                          sheet.getRange(row,12),
                          sheet.getRange(row,19),
                          sheet.getRange(row,20),
                          sheet.getRange(row,21),
                          sheet.getRange(row,22),
                          sheet.getRange(row,23)])
  //billing status
  var coursestartedrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains(COURSESTARTEDVALUE)
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,4)])
  var deregrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains(DEREGISTEREDVALUE)
                        .setBackground(RED)
                        .setRanges([sheet.getRange(row,4)])
  //data checked
  var datacheckedrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("TRUE")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,6)])
  //course location
  var nodistrictrule = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Keine Zweigstelle")
                        .setBackground(YELLOW)
                        .setRanges([sheet.getRange(row,10)]) 
  //course contract rules
  var validcontractteacher = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Anmeldung beim Lehrenden vorhanden")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,12)]) 
  var validcontractoffice = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Anmeldung im iVi Büro vorhanden")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,12)]) 
  var nocontract = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("Anmeldung nicht vorhanden")
                        .setBackground(RED)
                        .setRanges([sheet.getRange(row,12)]) 
  //preregistration rules
  var prereg1 = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("formlose Voranmeldung")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,13)]) 
  var prereg2 = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("durch Regiebeitrag")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,13)]) 
  var prereg3 = SpreadsheetApp.newConditionalFormatRule()
                        .whenTextContains("durch Anmeldung")
                        .setBackground(GREEN)
                        .setRanges([sheet.getRange(row,13)]) 

  rules.push(emptyrule ,nocontactrule, contactrule, coursestartedrule, deregrule, datacheckedrule, nodistrictrule, validcontractteacher, validcontractoffice, nocontract, prereg1, prereg2, prereg3)
  sheet.setConditionalFormatRules(rules)
  
  Logger.log("[TF]Added student " + student["SchuelerID"] +" to teacher " + student["Lehrer"])
  return student
}
