function setCourseEnded(course_id, course_hours, price_per_lesson, datesstring, teacher_billingnumber) {
  let course_row = getCourseRow(course_id);
  let course_billing_row = getCourseBillingRow(course_id);
  //set course status
  COURSESHEET.getRange(course_row, COU_COURSESTATUSCOL).setValue(DEREGISTEREDVALUE);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_COURSESTATUSCOL).setValue(DEREGISTEREDVALUE);
  //set course end date
  end_date = UTLS.getToday(COURSETABLESS);

  if (course_hours <= TRIALLESSONS) {
    var saldo_sent_status = NOCOURSEBILLINGNEEDED;
  } else {
    var saldo_sent_status = BILLINGNOTSENT;
  }

  COURSESHEET.getRange(course_row, COU_COURSEENDDATECOL).setValue(end_date);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_SALSOSENTSTATUSCOL).setValue(saldo_sent_status);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_FINALCOURSEHOURS).setValue(course_hours);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_PRICEPERHOUR).setValue(price_per_lesson);
  //COURSEBILLINGSHEET.getRange(course_billing_row, BIL_TOTALLESSONSAMOUNT).setValue(price_per_lesson*course_hours);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_DATESSTRING).setValue(datesstring);
  COURSEBILLINGSHEET.getRange(course_billing_row, BIL_TEACHERPAYMENTNUMNER).setValue(teacher_billingnumber);
}

function initializeBillingNumbers() {
  let last_row = COURSEBILLINGSHEET.getLastRow();
  let teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let course_status = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_COURSESTATUSCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let billing_numbers = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_TEACHERPAYMENTNUMNER, last_row - HEADERROW)
    .getValues()
    .flat();
  let course_units = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_FINALCOURSEHOURS, last_row - HEADERROW)
    .getValues()
    .flat();

  var min_course_units = 4;
  var course_ended_rows = course_status.map((e, i) => (e == DEREGISTEREDVALUE ? i : "")).filter(String);

  for (let i = 0; i < course_ended_rows.length; i++) {
    let row = course_ended_rows[i];
    let teacher_id = teacher_ids[row];
    console.log("setting billing number for teacher " + teacher_id + " with idx " + row);
    if (course_units[row] < min_course_units) {
      billing_numbers[row] = NOCOURSEBILLINGNUMBER;
      continue;
    }
    let billing_number = String(TT.incrementBillingNumber(teacher_id));
    billing_numbers[row] = billing_number;
  }
  COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_TEACHERPAYMENTNUMNER, last_row - HEADERROW, 1).setValues(
    billing_numbers.map((e) => [e])
  );
}

function getCourseRow(course_id) {
  return UTLS.findValueInCol(COURSESHEET, COURSEIDCOL, course_id);
}

function getCourseBillingRow(course_id) {
  return UTLS.findValueInCol(COURSEBILLINGSHEET, COURSEIDCOL, course_id);
}

function getTeacherRow(teacher_id) {
  return UTLS.findValueInCol(TEACHERBILLINGSHEET, TEACHERIDCOL, teacher_id);
}

function getCourseStatusDict() {
  let last_row = COURSEBILLINGSHEET.getLastRow();
  let course_nums = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let course_status = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_COURSESTATUSCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  var course_status_dict = {};
  course_nums.forEach((key, i) => (course_status_dict[key] = course_status[i]));
  return course_status_dict;
}

function getTeacherCourseStatusDict(teacher_id) {
  let last_row = COURSEBILLINGSHEET.getLastRow();

  var teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let course_nums = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row - HEADERROW)
    .getValues()
    .flat();
  let course_status = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_COURSESTATUSCOL, last_row - HEADERROW)
    .getValues()
    .flat();

  let course_nums_filteres = course_nums.filter((value, idx) => teacher_id == teacher_ids[idx]);
  let course_status_filtered = course_status.filter((value, idx) => teacher_id == teacher_ids[idx]);
  var course_status_dict = {};
  course_nums_filteres.forEach((key, i) => (course_status_dict[key] = course_status_filtered[i]));
  return course_status_dict;
}

function getDuePayments() {
  let due_payments = [];
  //ass
  if (!DATESSHEET.getRange(DATES_ASSDATEROW, 1).isBlank()) {
    due_payments.push("ass");
  }
  //room
  if (!DATESSHEET.getRange(DATES_ROOMDATEROW, 1).isBlank()) {
    due_payments.push("room");
  }
  //office
  if (!DATESSHEET.getRange(DATES_OFFICEDATEROW, 1).isBlank()) {
    due_payments.push("office");
  }

  return due_payments;
}

function getCheckedRows(sheet, col) {
  let lastRow = sheet.getLastRow();
  let checked_array = sheet.getRange(1, col, lastRow).getValues();

  return checked_array.map((e, i) => (e[0] == true ? i + 1 : "")).filter(String);
}

function getCurrentBillingCycle() {
  return DATESSHEET.getRange(DATES_BILLCYCLEROW, 1).getValue();
}

function getAdminFee() {
  var isDue = DATESSHEET.getRange(DATES_ADMINFEEROW, 1).getValue();

  if (isDue !== "") {
    return DATA.getAdminFee();
  } else {
    return PAYMENTSTATUSNOTDUE;
  }
}

function addPrepaidAdminFeed() {
  var prepaid_sheet = COURSETABLESS.getSheetByName("Regiebeitrag Vorausbezahlt");

  var last_row = prepaid_sheet.getLastRow();
  var prepaid_student_ids = prepaid_sheet.getRange(2, 1, last_row).getValues().flat();

  var bil_last_row = COURSEBILLINGSHEET.getLastRow();
  var bil_student_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, STUDENTIDCOL, bil_last_row)
    .getValues()
    .flat();
  var not_found = [];
  for (let i = 0; i < prepaid_student_ids.length; i++) {
    prepaid_id = prepaid_student_ids[i];
    var bil_idx = bil_student_ids.indexOf(prepaid_id);
    if (bil_idx == -1) {
      prepaid_sheet.getRange(i + 1 + 1, 1).setBackground(RED);
      not_found.push(prepaid_id);
    }
    COURSEBILLINGSHEET.getRange(bil_idx + HEADERROW + 1, BIL_ADMINADMOUNTCOL, 1, 3).setValues([
      [35, "2022/23", "Vorausbezahlt"],
    ]);
    COURSEBILLINGSHEET.getRange(bil_idx + HEADERROW + 1, BIL_ADMINADMOUNTCOL).setNumberFormat("[$€]#,##0.00");
  }
  console.log(
    "Die folgenden IDs haben vorausbezahlt, es wurde jedoch kein passender Schüler dazu gefunden:\r\n" + not_found
  );
  Browser.msgBox(
    "Die folgenden IDs haben vorausbezahlt, es wurde jedoch kein passender Schüler dazu gefunden:\r\n" + not_found
  );
}


function fixDateStrings()
{
  var date_string_col = COURSEBILLINGSHEET.getRange(6, BIL_DATESSTRING, 2000).getValues()
  for (var idx=0; idx<date_string_col.length; idx++)
  {
    var date_string = date_string_col[idx][0]

    if (!date_string.includes("Central European Summer Time"))
    {
      continue
    }
    var date_string_split = date_string.split(",")
    var out_date_array = []
    for (var i=0; i<date_string_split.length; i++)
    {
      date_string_split[i] = date_string_split[i].replace(",", ".").trim()
      var temp_date_string = new Date(date_string_split[i]).toLocaleDateString("de-DE")
      if (temp_date_string != "Invalid Date")
      {
        out_date_array.push(temp_date_string)
      }else
      {
        out_date_array.push(date_string_split[i])
      }
    }
    var out_date_string = out_date_array.join(", ")
    date_string_col[idx][0] = out_date_string
  }
  COURSEBILLINGSHEET.getRange(6, 75, 2000).setValues(date_string_col)
}