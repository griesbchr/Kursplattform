function registerPayment(matches, payment_string) 
{
  //unpack matches into teacher_id:[[courseid1, values], [courseid2, values], .. ] dict where values=[amount, date, ref]
  let teacherids_dict = {}

  var match_iter = matches.entries()
  let match = match_iter.next();
  var course_id, teacher_id
  while (!match.done)
  {
    [[course_id, teacher_id], values] = match.value
    if (teacher_id in teacherids_dict)
    {
      teacherids_dict[teacher_id] = teacherids_dict[teacher_id].concat([[course_id, values]])
    }else
    {
      teacherids_dict[teacher_id] = [[course_id, values]]
    }
    match = match_iter.next();
  }
  //get cols where to insert the payments
  let payment_col;
  switch(payment_string)
  {
    case "payment1":
    payment_col = PAYMENT1PAIDCOL
    break;
    case "payment2":
    payment_col = PAYMENT2PAIDCOL
    break;
    case "payment3":
    payment_col = PAYMENT3PAIDCOL
    break;
    case "payment4":
    payment_col = PAYMENT4PAIDCOL
    break;
    case "saldo":
    payment_col = SALDOPAYMENTPAIDCOL
    break;
  }
  var ss, sheet, course_id, amount, date, ref, row;
  let keys_not_found = []
  for (let [teacher_id, course_infos] of Object.entries(teacherids_dict))
  {
    ss = SpreadsheetApp.openById(getTeacherFile(teacher_id).getId())
    sheet = ss.getSheetByName(BILLINGSTUDENTSHEETNAME)
    for (let course_info of course_infos)
    {
      //Logger.log(course_info[0])
      row = UTLS.findValueInCol(sheet, BILSTU_COURSEIDCOL, course_info[0])
      if (row == 0){
        keys_not_found.push(course_id, teacher_id)
        continue;
        }
      sheet.getRange(row, payment_col).setValue(course_info[1][0]).setNumberFormat("[$€]#,##0.00")
      sheet.getRange(row, payment_col+1).setValue(course_info[1][1])
    }
  }
  return keys_not_found
}
