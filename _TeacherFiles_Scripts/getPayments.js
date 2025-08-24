function getCoursePaymentById(teacher_id)
{
  let ss  = SpreadsheetApp.openById(getTeacherFile(teacher_id).getId())
  return getCoursePaymentValuesFromFile(ss)[teacher_id] //undo dict
}

function getPaymentValues() {

  let tf_iter = TEACHERFILESFOLDER.getFiles()
  var course_value_dict = {}
  var teacher_value_dict = {}
  var new_values
  //var start_time = new Date().getTime()
  while (tf_iter.hasNext()) 
    {
      //var time = new Date().getTime()
      //console.log("time: " + (time - start_time)/1000)
      //start_time = time
      var ss = SpreadsheetApp.openById(tf_iter.next().getId())
      //console.log(ss.getName())
      new_values = getStudentPaymentValuesFromFile(ss)
      course_value_dict = Object.assign(course_value_dict, new_values)
      new_values = getCoursePaymentValuesFromFile(ss)
      teacher_value_dict = Object.assign(teacher_value_dict, new_values)
    }
  return [course_value_dict, teacher_value_dict]
}

//returns a course_value_dict as follows:
// {course_id:[ss_name, TZ1_due_value, TZ1_paid_value, TZ1_date, ...., TZSaldo_due_value, TZSaldo_paid_value, TZSaldo_date, billing_status, current_hours]}
function getStudentPaymentValuesFromFile(ss)
{
  //student sheet 
  var sheet = ss.getSheetByName(BILLINGSTUDENTSHEETNAME)
  let course_value_dict = {}
  //check if there are rows in the file
  let last_row = sheet.getLastRow()
  if (last_row == BILSTU_HEADERROW){ return course_value_dict}   //no courses from this teacher -> nothing to bill
  
  let course_ids = sheet.getRange(BILSTU_HEADERROW+1, BILSTU_COURSEIDCOL, last_row-BILSTU_HEADERROW).getValues().flat()

  var row = BILSTU_HEADERROW;
  for (let id of course_ids)
  {
    row = row + 1
    let values = sheet.getRange(row, PAYMENT1DUECOL, 1,BILLINGSTATUSCOL - PAYMENT1DUECOL + 1).getValues().flat()
    values.splice(REMINDERFEECOL-PAYMENT1DUECOL,1)  //remove reminder  //remove reminder first to keep infra col at same position in array
    values.splice(INFRAFEECOL-PAYMENT1DUECOL,1) //remove infra   // inplace
    values.unshift(ss.getName())  //add ss_name
    //get row content
    //var row_content = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues().flat()
    values.push(sheet.getRange(row, BILSTU_PRICEPERHOURCOL).getValue())
    values.push(sheet.getRange(row, BILSTU_INTENDEDHOURSCOL).getValue())
    values.push(sheet.getRange(row, BILSTU_EXPECTEDAMOUNTDUECOL).getValue())
    values.push(sheet.getRange(row, BILSTU_EXPECTEDSALDODUECOL).getValue())
    values.push(sheet.getRange(row, BILSTU_ACTUALHOURSCOL).getValue())
    values.push(sheet.getRange(row, BILSTU_CURRENTTOTALDUEAMOUNTCOL).getValue())
    values.push(sheet.getRange(row, BILSTU_CURRENTTOTALPAIDAMOUNTCOL).getValue())
    values.push(sheet.getRange(row, BILSTU_CURRENTSALDOAMOUNTCOL).getValue())
    course_value_dict[id] = values
  }
  return course_value_dict
}

function getCoursePaymentValuesFromFile(ss)
{
  var sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)
  let dict = {}
  let teacher_id = ss.getName().split("_")[0]
  let rows = [ASSROW, ASSROW+1, OFFICEROW]
  var values;
  let value_list = []
  for (let row of rows)
  {
    if (sheet.getRange(row, COURSEDUECOL).getValue() == "Nein")
    {
      value_list = value_list.concat([PAYMENTSTATUSNOTDUE,"", "", ""])
    }else
    {
      values = sheet.getRange(row, COURSEDUECOL+1,1,3).getValues().flat()
      values.unshift(PAYMENTSTATUSDUE)
      value_list = value_list.concat(values)
    }    
  }

  // add some additional information that is needed for billing
  value_list = value_list.concat(sheet.getRange(BILCOU_NUMSTUDENTSROW, BILCOU_NUMSTUDENTSCOL, 1, 1).getValues().flat())

  //calculate room payment status
  let status
  let last_row = UTLS.getNextFreeDataCellDownwards(sheet.getRange(ROOMROW-1, COURSEDUECOL)).getRow()-1
  if (last_row == ROOMROW-1)
  {
    status = "keine Räume"
  }else if(sheet.getRange(ROOMROW, COURSEDUECOL).getValue() == "Nein")
  {
    status = PAYMENTSTATUSNOTDUE
  }else{
    let due_values = sheet.getRange(ROOMROW,COURSEDUECOL+1,last_row-ROOMROW+1).getValues().flat()
    let paid_values = sheet.getRange(ROOMROW,COURSEDUECOL+2,last_row-ROOMROW+1).getValues().flat()
    let due_values_sum = due_values.reduce((partialSum, a) => partialSum + a, 0)
    let paid_values_sum = paid_values.reduce((partialSum, a) => partialSum + a, 0)
    if (due_values_sum == 0)
    {
      status = "keine Raumkosten"
    }else if (paid_values_sum == due_values_sum){
      status = "bezahlt"
    }else{
      status = "nicht bezahlt"
    }
  }
  value_list.push(status)
  dict[teacher_id] = value_list
  return dict
}
