function setSingleTeacherPaymentsDue(payment_string, course_status_dicts, teacher_ids)
{
  Logger.log("[TF]Starting setting single teacher payment " + payment_string + " for teacher " + teacher_id + " due")
  for (let i = 0; i < teacher_ids.length; i++) 
  {
    var teacher_id = teacher_ids[i]
    var course_status_dict = course_status_dicts[i]

    var teacher_file = getTeacherFile(teacher_id)
    
    if (payment_string == "ass" | payment_string == "room" | payment_string ==  "office")
    {
      setCoursePaymentDue(SpreadsheetApp.openById(teacher_file.getId()), payment_string)
    } else  //bil stu payments
    {
      setStudentPaymentDue(SpreadsheetApp.openById(teacher_file.getId()),payment_string, course_status_dict)
    }   
    
    Logger.log("[TF]Finished setting single teacher payment " + payment_string + " due")
  }
}

function setPaymentsDue(payment_string, course_status_dict) {
  Logger.log("[TF]Starting setting payment " + payment_string + " due")

  let tf_iter = TEACHERFILESFOLDER.getFiles()
  var key_not_found = []
  var keys = [];
  if (payment_string == "ass" | payment_string == "room" | payment_string ==  "office")
  {
    while (tf_iter.hasNext()) 
      {
        var ss = SpreadsheetApp.openById(tf_iter.next().getId())
        console.log(ss.getName())
        setCoursePaymentDue(ss, payment_string)
      }
  } else  //bil stu payments
  {
    while (tf_iter.hasNext()) 
    {
      var ss = SpreadsheetApp.openById(tf_iter.next().getId())
      console.log(ss.getName())
      ret = setStudentPaymentDue(ss,payment_string, course_status_dict)
      payment_string = ret[0]
      course_status_dict = ret[1]
      keys = ret[2]
      key_not_found.concat(keys)
    }   
  }
  Logger.log("[TF]Finished setting payment " + payment_string + " due")
  return [course_status_dict, key_not_found]
}

function setStudentPaymentDue(ss, payment_string, course_status_dict)
{
  console.log("starting " + ss.getName())
  sheet = ss.getSheetByName(BILLINGSTUDENTSHEETNAME)
  var last_row = sheet.getLastRow()
  if (last_row == BILSTU_HEADERROW){ return [payment_string, course_status_dict]}   //no courses from this teacher -> nothing to bill
  let course_ids = sheet.getRange(BILSTU_HEADERROW+1, BILSTU_COURSEIDCOL, last_row-BILSTU_HEADERROW).getValues().flat()
  var course_status;
  var amount;
  var row = BILSTU_HEADERROW;
  var to_col, from_col,add_col
  var key_not_found = []
  //Logger.log("following course ids foung for teacherfile "+sheet.getParent().getName()+": "+course_ids)
  for (var id of course_ids)
  {
    //Logger.log("course payment for id "+id+ " and "+payment_string)

    row = row + 1
    if (!(id in course_status_dict))
    {
      //Logger.log("id not found in dict, continuing")
      //Logger.log("current dict keys are"+Object.keys(course_status_dict))
      key_not_found.push(id)
    }
    course_status = course_status_dict[id]
    //Logger.log("course status from course dict is "+course_status)
    delete course_status_dict[id]
    //find the right to_col and enter default from_col
    switch(payment_string)
    {
      case "payment1":
        to_col = PAYMENT1DUECOL
        from_col = PARTIALPAYMENTAMOUNTCOL
        break;
      case "payment2":
        to_col = PAYMENT2DUECOL
        from_col = PARTIALPAYMENTAMOUNTCOL
        break;
      case "payment3":
        to_col = PAYMENT3DUECOL
        from_col = PARTIALPAYMENTAMOUNTCOL
        break;
      case "payment4":
        to_col = PAYMENT4DUECOL
        add_col = PAYMENT4PAIDCOL
        from_col = EXPECTEDSALDOCOL
        break;
      case "saldo":
        to_col = SALDOPAYMENTDUECOL
        add_col = SALDOPAYMENTPAIDCOL
        from_col = SALDOAMOUNTCOL
        break;
    }

    //find the right amount
    if (course_status == COURSESTARTEDVALUE)  //default case
    {

      //Logger.log("default case, course already started")
      amount = sheet.getRange(row, from_col).getValue()
      
      //because these are salso payments, add the current value of the field to include already paid amounts in the calculation
      if (payment_string == "saldo" |payment_string == "payment4") {
        var add_amound = sheet.getRange(row, add_col).getValue()
        if (typeof(add_amound) === typeof(1))   //aka add_amount is a number (empty field is not a number)
        {
          amount = amount + add_amound
        }
      }

      amount = Math.round(amount*100)/100
      sheet.getRange(row, to_col).setValue(amount).setNumberFormat("##0.00 €")

      //setting billing status to complete if saldo amount is entered
      if (payment_string == "saldo") {
        //Logger.log("entered saldo payment regularly -> setting billing status to completed")
        sheet.getRange(row, BILLINGSTATUSCOL).setValue(BILLINGDONESTATUS)
      }
    }else //course is completed 
    {
      var billing_status = sheet.getRange(row, BILLINGSTATUSCOL).getValue()
      //Logger.log("course is already completed status, thus checking billing status which is " + billing_status)
      if (billing_status == BILLINGDONESTATUS){
        //Logger.log("billing status is completed, thus continuing")
        continue
        }
      else{ //course if done but payment is not completed -> complete payment
        //Logger.log("billing status is not completed, thus setting salso amount and setting billing status to completed")
        amount =  sheet.getRange(row, SALDOAMOUNTCOL).getValue()
        if (payment_string == "saldo" |payment_string == "payment4") {
          var add_amound = sheet.getRange(row, add_col).getValue()
          if (typeof(add_amound) === typeof(1))   //aka add_amount is a number (empty field is not a number)
          {
            amount = amount + add_amound
          }
        }
        amount = Math.round(amount*100)/100
        sheet.getRange(row, to_col).setValue(amount).setNumberFormat("##0.00 €")
        //set payment done
        sheet.getRange(row, BILLINGSTATUSCOL).setValue(BILLINGDONESTATUS)
      }
    }
  }   

  //TODO check if we can do this or if everything gets too slow
  //lock ranges so that teachers cant change billing hours afterwards
  if (payment_string == "payment4")
  {
    var attsheet = ss.getSheetByName(ATTENDANCESHEETNAME)
    //lock attendance col
    var last_row = att_sheet.getLastRow()
    if(last_row != ATT_HEADERROW)
    {
      var range = attsheet.getRange(ATT_HEADERROW+1, ATT_EXPECTEDHOURSCOL, last_row - ATT_HEADERROW)
      lock_range(range, "payment4 locked")
    }
  }
  //lock whole attendence sheet
  if (payment_string == "payment5")
  {
    var attsheet = ss.getSheetByName(ATTENDANCESHEETNAME)
    //lock attendance col
    var last_row = att_sheet.getLastRow()
    if(last_row != ATT_HEADERROW)
    {
      var range = attsheet.getRange(ATT_HEADERROW+1, ATT_LASTNAMECOL+1, last_row - ATT_HEADERROW, ATT_NOCOURSELOCATIONHOURSCOL - ATT_LASTNAMECOL - 1)
      lock_range(range, "payment5 locked")
    }
  }
  //SpreadsheetApp.flush()    //dont flush, thats super slow
  return [payment_string, course_status_dict, key_not_found]
}

//dict needs to be: {teacherid1:[courseid1, courseid2], teacherid2:[courseid1], etc}
function setAdditionalPayments(teacherid_courseids_dict, payment_string)
{
  let courseids_not_found = []
  var sheet;
  var ids_not_found;
  for (let [teacher_id, course_ids] of Object.entries(teacherid_courseids_dict))
  {
    sheet = SpreadsheetApp.openById(getTeacherFile(teacher_id).getId()).getSheetByName(BILLINGSTUDENTSHEETNAME)
    ids_not_found = setAdditionalPayment(sheet, course_ids, payment_string)
    courseids_not_found.push(ids_not_found)
  }
  return courseids_not_found.flat()
}

function setAdditionalPayment(sheet, course_ids, payment_string)
{
  var not_found = []
  var fee_col, from_col, to_col, add_col, formula, check_due_col;
  //set target cell and value
  switch(payment_string)
  {
    case "reminder":
      fee_col = REMINDERFEECOL
      formula = "=Formeln!N2"

      from_col = SALDOAMOUNTCOL
      check_due_col = SALDOPAYMENTDUECOL
      to_col = SALDOPAYMENTDUECOL
      add_col = SALDOPAYMENTPAIDCOL
      break;

    case "infra":
      fee_col = INFRAFEECOL
      formula = "=Formeln!M2"

      from_col = EXPECTEDSALDOCOL
      check_due_col = PAYMENT4DUECOL
      to_col = PAYMENT4DUECOL
      add_col = PAYMENT4PAIDCOL
      break;
  }

  var row;
  for (let id of course_ids)
  {
    row = UTLS.findValueInCol(sheet, BILSTU_COURSEIDCOL,id)
    if (row==0){
      not_found.push(id)
      continue;
    }else{
      sheet.getRange(row, fee_col).setFormula(formula).setNumberFormat("##0.00 €")   //set field 
      //if payment already due -> need to 1) 
      if (typeof(sheet.getRange(row, check_due_col).getValue()) === typeof(1))   //check if payment is already due by checking due col if number
      {
        //get new amount with added payment
        amount =  sheet.getRange(row, from_col).getValue()
    
        //check if there is already an amount entered
        var add_amound = sheet.getRange(row, add_col).getValue()
        if (typeof(add_amound) === typeof(1))   //aka add_amount is a number (empty field is not a number)
        { 
          amount = amount + add_amound
        }
        amount = Math.round(amount*100)/100
        sheet.getRange(row, to_col).setValue(amount).setNumberFormat("##0.00 €")

      }
    }
  }
  return not_found
}

function setCoursePaymentDue(ss, payment_string)
{
  var sheet
  switch(payment_string)
  {
    case "ass":
      ss.getSheetByName(BILLINGCOURSESHEETNAME).getRange(ASSROW, COURSEDUECOL,2).setValue("Ja")
      break;
    case "room":
      sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)
      let last_row = UTLS.getNextFreeDataCellDownwards(sheet.getRange(ROOMROW,COURSEDUECOL)).getRow()-1
      if (last_row - ROOMROW + 1 > 0){ //rooms to bill
      sheet.getRange(ROOMROW,COURSEDUECOL,last_row - ROOMROW + 1).setValue("Ja")
      }
      break;
    case "office":
      sheet = ss.getSheetByName(BILLINGCOURSESHEETNAME)
      sheet.getRange(OFFICEROW, COURSEDUECOL).setValue("Ja")
      // fix number of students 
      var num_students_range = sheet.getRange(BILCOU_NUMSTUDENTSROW, BILCOU_NUMSTUDENTSCOL)
      num_students_range.copyTo(num_students_range, SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
      var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy");
      var note_text = "Anzahl der SchülerInnen am " + formattedDate;
      num_students_range.setNote(note_text);
      break;
  }
  //SpreadsheetApp.flush()        //dont flush, thats super slow
  return 
}

function test_setCoursePaymentDue()
{
  var ss = SpreadsheetApp.openById("1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8")
  var payment_string = "office"
  setCoursePaymentDue(ss, payment_string)
}

function lock_range(range, description)
{
  if (description == "undefined")
  {
    description = "locked"
  }
  var protection = range
    .setFontColor(CANNOTCHANGECOLOR)
    .protect();
  protection
    .setDescription("abc")
    .removeEditors(protection.getEditors())
    .addEditors(EDITORSMAILLIST);
}

function test_loc_range()
{
  var ss = SpreadsheetApp.openById("1ip4u0xfeWqrk14OtOvw8NiDu-00KhDsN_D3BrCrsHE8")
  var sheet = ss.getSheetByName("Anwesenheitsliste")
  var last_row =  sheet.getLastRow()
  if (last_row == ATT_HEADERROW)
  {
    return
  }
  //var range = sheet.getRange(ATT_HEADERROW+1, ATT_EXPECTEDHOURSCOL, sheet.getLastRow() - ATT_HEADERROW)
  var range = sheet.getRange(ATT_HEADERROW+1, ATT_LASTNAMECOL+1,last_row - ATT_HEADERROW, ATT_NOCOURSELOCATIONHOURSCOL - ATT_LASTNAMECOL - 1)
  console.log(range.getA1Notation())
  lock_range(range)
}
