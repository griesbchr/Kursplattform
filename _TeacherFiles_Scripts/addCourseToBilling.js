function getUnevenRules(row, sheet, left_col_list)
{
  var rule_list = []
  //If uneven, set both fields to red, dont do that if the payment cell is not filled out yet or the payment is not due yet.
  for (let col of left_col_list)
  {
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied('=AND(NOT(EQ('+LEFTCELL+';"'+PAYMENTSTATUSNOTDUE+'"));NOT(EQ('+THISCELL+';'+LEFTCELL+'));NOT(ISBLANK('+THISCELL+')))')
                        .setBackground(RED)
                        .setRanges([sheet.getRange(row,col+1)]))
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied('=AND(NOT(EQ('+THISCELL+';"'+PAYMENTSTATUSNOTDUE+'"));NOT(EQ('+THISCELL+';'+RIGHTCELL+'));NOT(ISBLANK('+RIGHTCELL+')))')
                        .setBackground(RED)
                        .setRanges([sheet.getRange(row,col)]))
  }
  return rule_list
}

function getPaybackRules(row, sheet, left_col_list)
{
  var rule_list = []

  var letter_saldo = UTLS.getColLetters(SALDOAMOUNTCOL)
  var letter_billingstatus = UTLS.getColLetters(STU_BILLINGSTATUS)
  //When course billing is done: if the current amount due is zero, then set color to white as nothing is due, even if the individual payments are not equal
  for (let col of left_col_list)
  {
    var formula = '=AND(LT(ABS('+letter_saldo+row+');0,1);EQ("'+BILLINGDONESTATUS+'";'+letter_billingstatus+row+'))'
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied(formula) 
                        .setBackground(WHITE)
                        .setRanges([sheet.getRange(row,col)]))

    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied(formula) 
                        .setBackground(WHITE)
                        .setRanges([sheet.getRange(row,col+1)]))
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied(formula) 
                        .setBackground(WHITE)
                        .setRanges([sheet.getRange(row,col+2)]))
  }
  return rule_list
}

function getEmptyRule(row, sheet, left_col_list)
{
  var rule_list = []
  //make field yellow if amout due is set and field is empty, indicating that this field needs an entry.
  for (let col of left_col_list)
  {
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied('=AND(ISBLANK('+THISCELL+');NOT(EQ('+LEFTCELL+';"'+PAYMENTSTATUSNOTDUE+'")))') 
                        .setBackground(YELLOW)
                        .setRanges([sheet.getRange(row,col+1)]))

    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied('=AND(ISBLANK('+THISCELL+');NOT(EQ('+LEFTCELL2+';"'+PAYMENTSTATUSNOTDUE+'")))') 
                        .setBackground(YELLOW)
                        .setRanges([sheet.getRange(row,col+2)]))
  }
  
  return rule_list
}

function getNoDateRules(row, sheet, right_list)
{
  var rule_list = []
  //make field yellow if amout due is set and field is empty, indicating that this field needs an entry.
  for (let col of right_list)
  {
    rule_list.push(SpreadsheetApp.newConditionalFormatRule()
                        .whenFormulaSatisfied('=AND(NOT(ISBLANK('+LEFTCELL+'));ISBLANK('+THISCELL+'))') 
                        .setBackground(RED)
                        .setRanges([sheet.getRange(row,col)]))
  }
  
  return rule_list
}

function getContractLessonsFormula(row)
{
  //=IF(D24=10;Formeln!$I$2;Formeln!$J$2)-I24
  return "=IF(D"+row+"=10;Formeln!$J$2;Formeln!$I$2)-I"+row
}
function getBillingMinutesFormula(row)
{
  return "D"+row
}
// hardcode course number 40 as lookup for course numbr 10
function getPartialPaymentFormula(row)
{
  return "=IF(D"+row+"=10;INDEX(Formeln!G44:G47;MATCH(40;Formeln!A44:A47));INDEX(Formeln!G26:G39;MATCH(K"+row+";Formeln!A26:A39)))"
}
// hardcode course number 40 as lookup for course numbr 10
function getPricePerLessonFormula(row)
{
  return "=IF(D"+row+"=10;INDEX(Formeln!H44:H47;MATCH(40;Formeln!A44:A47))/J"+row+";INDEX(Formeln!H26:H39;MATCH(K"+row+";Formeln!A26:A39))/J"+row+")"
}

function getExpectedAmountFormula(row)
{
  return "=N"+row+"*M"+row
}

function getExpectedSaldoFormula(row)
{
  return "=O"+row+"-S"+row+"+AD"+row
}

function getTeacherAmountFormula(row)
{
  return "=M"+row+"*Q"+row
}
function getStudentAmountFormula(row)
{
  return "=V"+row+"+Y"+row+"+AB"+row+"+AF"+row+"+AJ"+row
}
function getSaldoAmountFormula(row)
{
  return "=R"+row+"-S"+row+"+AH"+row+"+AD"+row
}
function getClassMinutesFormua(bilstu_row)
{
  //+40 is to get from course number 10 to 50 course minutes
  return "=IF('"+BILLINGSTUDENTSHEETNAME+"'!D"+bilstu_row+"=10;INDEX(Formeln!B17:B22;MATCH('"+BILLINGSTUDENTSHEETNAME+"'!E"+bilstu_row+";Formeln!A17:A22;0))+40;INDEX(Formeln!B17:B22;MATCH('"+BILLINGSTUDENTSHEETNAME+"'!E"+bilstu_row+";Formeln!A17:A22;0))*-1+'"+BILLINGSTUDENTSHEETNAME+"'!D"+bilstu_row+")"
}
function getRoomRentUnitsFormula(bilstu_row)
{
  return "='"+BILLINGSTUDENTSHEETNAME+"'!I"+bilstu_row
}
function getCurrentLessonsFormula(att_row)
{
  return '=if(NOT(ISBLANK(Anwesenheitsliste!AH'+att_row+'));Anwesenheitsliste!AH'+att_row+'-Anwesenheitsliste!AG'+att_row+';"voraussichtl. Kurseinheiten nicht eingetragen")'
  //return "="+ATTENDANCESHEETNAME+"!AH"+att_row+"-"+ATTENDANCESHEETNAME+"!AG"+att_row
}
function getRoomRentAmountFormula(row)
{
  return '=if(NOT(E'+row+'="voraussichtl. Kurseinheiten nicht eingetragen");if(E'+row+'<=3;0;C'+row+'*D'+row+'*E'+row+'*Formeln!$L$2);"")'
  //return "=C"+row+"*D"+row+"*E"+row+"*Formeln!$L$2"
}

function addCourseToBillinglist(course)
{
  let file = getTeacherFile(course["LehrerID"])
  let spreadsheet = SpreadsheetApp.openById(file.getId())
  let billing_stu_sheet = spreadsheet.getSheetByName(BILLINGSTUDENTSHEETNAME)
  try {
    var sheet_id = billing_stu_sheet.getSheetId()
    UTLS.lockSheet(sheet_id)

    var row =  appendCleanRow(billing_stu_sheet)
    billing_stu_sheet.getRange(row,1).setValue(course["KursID"])

    var bilstu_row = row

    var att_sheet = spreadsheet.getSheetByName(ATTENDANCESHEETNAME)
    course["attendancesheet_row"] = UTLS.findValueInCol(att_sheet, ATT_COURSEIDCOL, course["KursID"])

    //"S_Vorname":                
    billing_stu_sheet.getRange(row,2).setValue(course["S_Vorname"])
    //"S_Nachname":               
    billing_stu_sheet.getRange(row,3).setValue(course["S_Nachname"])
    //"Kursnummer":               
    billing_stu_sheet.getRange(row,4).setValue(course["Kursnummer"])
    //"Kursart":                 
    billing_stu_sheet.getRange(row,5).setValue(course["Kursart"])
    //"Kursmodus":                
    billing_stu_sheet.getRange(row,6).setValue(course["Kursmodus"])
    //"Zweigstelle":            
    billing_stu_sheet.getRange(row,7).setValue(course["Zweigstelle"])
    //"Verein":                 	
    billing_stu_sheet.getRange(row,8).setValue(course["Verein"])
    //"Raumbenutzung_Einheiten":  
    billing_stu_sheet.getRange(row,9).setValue(course["Raumbenutzung_Einheiten"])
    //"Einheiten laut Vertrag":   
    billing_stu_sheet.getRange(row,10).setValue(course["Vertrag_Einheiten"])
    //"Verrechnungsminuten":      
    billing_stu_sheet.getRange(row,11).setFormula(getBillingMinutesFormula(row))
    //"Teilzahlung":              
    billing_stu_sheet.getRange(row,12).setFormula(getPartialPaymentFormula(row)).setNumberFormat("##0.00 €")
    //"Preis pro Einheit":        
    billing_stu_sheet.getRange(row,13).setFormula(getPricePerLessonFormula(row)).setNumberFormat("##0.0000 €")
    //"voraussichtl.  Einheiten": 
    billing_stu_sheet.getRange(row,14).setFormula("="+ATTENDANCESHEETNAME+"!AH"+course["attendancesheet_row"])
    //"voraussichtl.  Betrag":   
    billing_stu_sheet.getRange(row,15).setFormula(getExpectedAmountFormula(row)).setNumberFormat("##0.00 €")
    //"voraussichtl.  Saldo":     
    billing_stu_sheet.getRange(row,16).setFormula(getExpectedSaldoFormula(row)).setNumberFormat("##0.00 €")
    //"momentane Einheiten":      
    billing_stu_sheet.getRange(row,17).setFormula("="+ATTENDANCESHEETNAME+"!AI"+course["attendancesheet_row"])
    //"Gesamtbetrag Unterricht":  
    billing_stu_sheet.getRange(row,18).setFormula(getTeacherAmountFormula(row)).setNumberFormat("##0.00 €")     
    //"Gesamter bezahlter Betrag":
    billing_stu_sheet.getRange(row,19).setFormula(getStudentAmountFormula(row)).setNumberFormat("##0.00 €")
    //"momentan fälliger Betrag": 
    billing_stu_sheet.getRange(row,20).setFormula(getSaldoAmountFormula(row)).setNumberFormat("##0.00 €")
    //"TZ1 fälliger Betrag":      
    billing_stu_sheet.getRange(row,21).setValue(PAYMENTSTATUSNOTDUE)
    //"TZ1 bezahlter Betrag":     
    billing_stu_sheet.getRange(row,22).setValue("").setNumberFormat("##0.00 €")//.setBackground(RED),
    //"TZ1 Datum":                
    billing_stu_sheet.getRange(row,23).setValue("").setNumberFormat("dd.mm.yy")
    //"TZ2 fälliger Betrag":      
    billing_stu_sheet.getRange(row,24).setValue(PAYMENTSTATUSNOTDUE),
    //"TZ2 bezahlter Betrag":     
    billing_stu_sheet.getRange(row,25).setValue("").setNumberFormat("##0.00 €")//.setBackground(RED),
    //"TZ2 Datum":                
    billing_stu_sheet.getRange(row,26).setValue("").setNumberFormat("dd.mm.yy")
    //"TZ3 fälliger Betrag":      
    billing_stu_sheet.getRange(row,27).setValue(PAYMENTSTATUSNOTDUE),
    //"TZ3 bezahlter Betrag":     
    billing_stu_sheet.getRange(row,28).setValue("").setNumberFormat("##0.00 €")//.setBackground(RED),
    //"TZ3 Datum":                
    billing_stu_sheet.getRange(row,29).setValue("").setNumberFormat("dd.mm.yy")
    //"InfraBeitrag":             
    billing_stu_sheet.getRange(row,30).setValue("0,00").setNumberFormat("##0.00 €")
    //"TZ4 fälliger Betrag":      
    billing_stu_sheet.getRange(row,31).setValue(PAYMENTSTATUSNOTDUE)
    //"TZ4 bezahlter Betrag":     
    billing_stu_sheet.getRange(row,32).setValue("").setNumberFormat("##0.00 €")//.setBackground(RED),
    //"TZ4 Datum":               
     billing_stu_sheet.getRange(row,33).setValue("").setNumberFormat("dd.mm.yy")
    //"Saldo Mahngebühren":       
    billing_stu_sheet.getRange(row,34).setValue("0,00").setNumberFormat("##0.00 €")
    //"Saldo fälliger Betrag":   
    billing_stu_sheet.getRange(row,35).setValue(PAYMENTSTATUSNOTDUE)
    //"Saldo bezahlter Betrag":  
     billing_stu_sheet.getRange(row,36).setValue("").setNumberFormat("##0.00 €")//.setBackground(RED),
    //"Saldo Datum":              
    billing_stu_sheet.getRange(row,37).setValue("").setNumberFormat("dd.mm.yy")
    //"Verrechnungsstatus":       
    billing_stu_sheet.getRange(row,38).setValue(BILLINGNOTDONESTATUS).setFontColor(CANNOTCHANGECOLOR)
  
  //add borders
  //Schülerinformationen
  setGroupBorder(billing_stu_sheet.getRange(row, BILSTU_COURSEIDCOL, 1, 3)) 
  //Kursinformationen
  setGroupBorder(billing_stu_sheet.getRange(row, 4, 1, 10))
  //Calculations
  setGroupBorder(billing_stu_sheet.getRange(row, 14, 1, 7))
  //TZ1
  setGroupBorder(billing_stu_sheet.getRange(row, 21, 1, 3))
  //TZ2
  setGroupBorder(billing_stu_sheet.getRange(row, 24, 1, 3))
  //TZ3
  setGroupBorder(billing_stu_sheet.getRange(row, 27, 1, 3))
  //TZ4
  setGroupBorder(billing_stu_sheet.getRange(row, 30, 1, 4))
  //TZ5
  setGroupBorder(billing_stu_sheet.getRange(row, 34, 1, 4))
  //Verrechnungsstatus
   billing_stu_sheet.getRange(row,38)
    .setBorder(true, true, true, true, null, null, null, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

  //update Conditional format rules
  var emptyrule = getEmptyRule(row, billing_stu_sheet, [PAYMENT1DUECOL, PAYMENT2DUECOL, PAYMENT3DUECOL, PAYMENT4DUECOL, SALDOPAYMENTDUECOL])
  var unevenrules = getUnevenRules(row, billing_stu_sheet, [PAYMENT1DUECOL, PAYMENT2DUECOL, PAYMENT3DUECOL, PAYMENT4DUECOL, SALDOPAYMENTDUECOL])
  var paybackrules = getPaybackRules(row, billing_stu_sheet,[PAYMENT1DUECOL, PAYMENT2DUECOL, PAYMENT3DUECOL, PAYMENT4DUECOL, SALDOPAYMENTDUECOL])
  var nodaterules = getNoDateRules(row, billing_stu_sheet, [PAYMENT1DATECOL, PAYMENT2DATECOL, PAYMENT3DATECOL, PAYMENT4DATECOL, SALDOPAYMENTDATECOL])
 
  var rules = billing_stu_sheet.getConditionalFormatRules()
  rules = rules.concat(paybackrules)  //payback rules first (as they should overrule the uneven rules)
  rules = rules.concat(nodaterules)   //nodate rule second
  rules = rules.concat(unevenrules)   //uneven rules third
  rules = rules.concat(emptyrule) 
  billing_stu_sheet.setConditionalFormatRules(rules)

  //allow only numbers in paid cols
  let number_only_rule = SpreadsheetApp.newDataValidation()
                                       .requireFormulaSatisfied('=AND(ISNUMBER(INDIRECT(ADDRESS(ROW();COLUMN())));NOT(ISDATE(INDIRECT(ADDRESS(ROW();COLUMN())))))')
                                       .setHelpText("Bitte Zahl mit Dezimaltrennzeichen Komma eingeben. Beispiel: 12,34 €")
                                       .setAllowInvalid(false)
                                       .build()
  billing_stu_sheet.getRange(row,PAYMENT1PAIDCOL).setDataValidation(number_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT2PAIDCOL).setDataValidation(number_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT3PAIDCOL).setDataValidation(number_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT4PAIDCOL).setDataValidation(number_only_rule)
  billing_stu_sheet.getRange(row,SALDOPAYMENTPAIDCOL).setDataValidation(number_only_rule)

  //allow date only 
  let date_only_rule = SpreadsheetApp.newDataValidation()
                                       .requireDate()
                                       .setHelpText("Bitte ein Datum eingeben. Beispiel: 20.02.2002")
                                       .setAllowInvalid(false)
                                       .build()
  billing_stu_sheet.getRange(row,PAYMENT1DATECOL).setDataValidation(date_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT2DATECOL).setDataValidation(date_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT3DATECOL).setDataValidation(date_only_rule)
  billing_stu_sheet.getRange(row,PAYMENT4DATECOL).setDataValidation(date_only_rule)
  billing_stu_sheet.getRange(row,SALDOPAYMENTDATECOL).setDataValidation(date_only_rule)

  course["bilstu_url"] = createRowUrl(billing_stu_sheet,row)
    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of course table")
    throw e
  } finally {
    UTLS.releaseSheetLock(sheet_id)
  }
  //-------------------------course billing-----------------------------------------
  try {
    var billing_course_sheet = spreadsheet.getSheetByName(BILLINGCOURSESHEETNAME)
    var sheet_id = billing_course_sheet.getSheetId()
    UTLS.lockSheet(sheet_id)

  //check if district is already in list
  let curr_dist = billing_course_sheet.getRange(BILCOU_HEADERROW,BILCOU_ROOM_DISTCOL,LEN_DISTRICTLIST).getValues().flat()
  if (!curr_dist.includes(course["Zweigstelle"]))
  {

    var room_payment_row = UTLS.getNextFreeDataCellDownwards(billing_course_sheet.getRange(BILCOU_HEADERROW, BILCOU_PAY_DISTCOL)).getRow()

    billing_course_sheet.getRange(room_payment_row,BILCOU_PAY_RECCOL).setValue(DATA.getPaymentName(course["Zweigstelle"]))
    billing_course_sheet.getRange(room_payment_row,BILCOU_PAY_REFCOL).setValue(ROOMPAYMENTREFERENCE)
    billing_course_sheet.getRange(room_payment_row,BILCOU_PAY_IBANCOL).setValue(DATA.getPaymentIban(course["Zweigstelle"]))

    var room_due;
    if (CT.getDuePayments().includes("room")){
      room_due = "Ja"
      }else{
      room_due = "Nein" 
    }

    billing_course_sheet.getRange(room_payment_row,BILCOU_ROOMPAYMENTDUECOL).setValue(room_due)
  }


    var room_row = UTLS.getNextFreeDataCellDownwards(billing_course_sheet.getRange(BILCOU_HEADERROW, BILCOU_ROOM_DISTCOL)).getRow()

    //add course to room billing
    billing_course_sheet.getRange(room_row,1).setValue(course["Zweigstelle"])
    billing_course_sheet.getRange(room_row,2).setValue(course["S_Vorname"]+" "+course["S_Nachname"])
    billing_course_sheet.getRange(room_row,3).setFormula(getClassMinutesFormua(bilstu_row))
    billing_course_sheet.getRange(room_row,4).setFormula(getRoomRentUnitsFormula(bilstu_row))
    billing_course_sheet.getRange(room_row,5).setFormula(getCurrentLessonsFormula(course["attendancesheet_row"]))
    billing_course_sheet.getRange(room_row,6).setFormula(getRoomRentAmountFormula(room_row))


    SpreadsheetApp.flush();
  } catch (e) {
    console.log("error in catch of course table")
    throw e
  } finally {
    UTLS.releaseSheetLock(sheet_id)
  }


  return course
}