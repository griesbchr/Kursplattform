//update course parameters in template file
function updateTemplateFile()
{
  //TEMPLATEFILE.makeCopy().setName(TEMPLATEFILE.getName() + new Date).moveTo(ARCHIEVFOLDER)
  updateTeacherFile(SpreadsheetApp.openById(TEMPLATEFILE.getId()))
}

//loop threwal teacher files and update 
//function updateAllTeacherFiles()
//{
//  Logger.log("[TF]Starting updating all teacher files")
// 
//  let tf_iter = TEACHERFILESFOLDER.getFiles()
//  while (tf_iter.hasNext()) 
//    {
//      updateTeacherFile(SpreadsheetApp.openById(tf_iter.next().getId()))
//    }
//
//  Logger.log("[TF]Finished updating all teacher files")
//}

//update course parameters and billing posts in teacherfile
function updateTeacherFile(ss) 
{
  const billingcourse_sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)

  //set billing_posts in course billing list
  let billing_post = DATA.getBillingPosts()
  UTLS.makeDropdown(billingcourse_sheet.getRange(CLUBROW1, CLUBCOL1, CLUBLEN1),billing_post)
  UTLS.makeDropdown(billingcourse_sheet.getRange(CLUBROW2, CLUBCOL2, CLUBLEN2),billing_post)

  var roomuasge_sheet = ss.getSheetByName(ROOMUSAGESHEETNAME)

  var district_list = DATA.getDistricts()
  
  //remove "Keine Zweigstelle"
  var idx = district_list.indexOf(NODOSTRICT)
  if (idx != -1)
  {
    district_list.splice(idx,1)
  }
  district_list.sort()
  UTLS.makeDropdown(roomuasge_sheet.getRange(ROOM_FIRSTROW, ROOM_DISTRICTSCOL, ROOM_LENGTH),district_list)

  //update all course parameters
  updateCourseParameters(ss)
}

function updateCourseParameters(ss)
{
  const formula_sheet = ss.getSheetByName(FORMULASSHEETNAME)

  //update parameters
  let parameter_dict = DATA.getCourseParameterDict()

  //update billing cycle
  formula_sheet.getRange(FOR_TEACHERINFOROW, FOR_BILLCYCLE).setValue(DATA.getYear())


  //"Minutenlohn"
  formula_sheet.getRange(PARAMETERSVALUEROW, 1).setValue(parameter_dict["Minutenlohn"])
  //"Stundenlohn":
  formula_sheet.getRange(PARAMETERSVALUEROW, 2).setValue(parameter_dict["Stundenlohn"])
  //"Vereinsbeitrag MAZ":
  formula_sheet.getRange(PARAMETERSVALUEROW, 3).setValue(parameter_dict["Vereinsbeitrag MAZ"])
  //"Vereinsbeitrag VÖM":           
  formula_sheet.getRange(PARAMETERSVALUEROW, 4).setValue(parameter_dict["Vereinsbeitrag VÖM"])
  //"Zusatzbetrag QV bei MAZ":      
  formula_sheet.getRange(PARAMETERSVALUEROW, 5).setValue(parameter_dict["Zusatzbetrag QV"])
  //"Verein Fixbetrag":             
  formula_sheet.getRange(PARAMETERSVALUEROW, 6).setValue(parameter_dict["Verein Fixbetrag"])
  //"Büroservice":                  
  formula_sheet.getRange(PARAMETERSVALUEROW, 7).setValue(parameter_dict["Büroservice"])
  //"Größe Gruppenkurse":           
  formula_sheet.getRange(PARAMETERSVALUEROW, 8).setValue(parameter_dict["Größe Gruppenkurse"])
  //"Einheiten Einzelkurs":         
  formula_sheet.getRange(PARAMETERSVALUEROW, 9).setValue(parameter_dict["Einheiten Einzelkurs"])
  //"Einheiten Gruppenkurs":        
  formula_sheet.getRange(PARAMETERSVALUEROW, 10).setValue(parameter_dict["Einheiten Gruppenkurs"])
  //"Vereinsarbeiten Stundenlohn":  
  formula_sheet.getRange(PARAMETERSVALUEROW, 11).setValue(parameter_dict["Vereinsarbeiten Stundenlohn"])
  //"Raumverrechnungsfaktor":       
  formula_sheet.getRange(PARAMETERSVALUEROW, 12).setValue(parameter_dict["Raumverrechnungsfaktor"])
  //"Infrastrukturbeitrag":         
  formula_sheet.getRange(PARAMETERSVALUEROW, 13).setValue(parameter_dict["Infrastrukturbeitrag"])
  //"Mahnung":                      
  formula_sheet.getRange(PARAMETERSVALUEROW, 14).setValue(parameter_dict["Mahnung"])
  //"EmpfängerIn_VÖM":              
  formula_sheet.getRange(PARAMETERSVALUEROW, 15).setValue(parameter_dict["EmpfängerIn_VÖM"])
  //"Verwendungszweck_VÖM":         
  formula_sheet.getRange(PARAMETERSVALUEROW, 16).setValue(parameter_dict["Verwendungszweck_VÖM"])
  //"IBAN_VÖM":                     
  formula_sheet.getRange(PARAMETERSVALUEROW, 17).setValue(parameter_dict["IBAN_VÖM"])
  //"EmpfängerIn_MAZ":              
  formula_sheet.getRange(PARAMETERSVALUEROW, 18).setValue(parameter_dict["EmpfängerIn_MAZ"])
  //"Verwendungszweck_MAZ":         
  formula_sheet.getRange(PARAMETERSVALUEROW, 19).setValue(parameter_dict["Verwendungszweck_MAZ"])
  //"IBAN_MAZ":                     
  formula_sheet.getRange(PARAMETERSVALUEROW, 20).setValue(parameter_dict["IBAN_MAZ"])
  //"EmpfängerIn_Bürovervice":      
  formula_sheet.getRange(PARAMETERSVALUEROW, 21).setValue(parameter_dict["EmpfängerIn_Bürovervice"])
  //"Verwendungszweck_Bürovervice": 
  formula_sheet.getRange(PARAMETERSVALUEROW, 22).setValue(parameter_dict["Verwendungszweck_Bürovervice"])
  //"IBAN_Bürovervice":             
  formula_sheet.getRange(PARAMETERSVALUEROW, 23).setValue(parameter_dict["IBAN_Bürovervice"])
}