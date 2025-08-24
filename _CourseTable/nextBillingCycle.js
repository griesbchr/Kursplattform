function setNewBillingCycle()
{
  let curr_cycle = DATESSHEET.getRange(DATES_BILLCYCLEROW,1).getValue()
  DATESSHEET.getRange(DATES_BILLCYCLEROW,1).setValue(curr_cycle+1)
  
  DATESSHEET.getRange(1,1,DATES_OFFICEDATEROW).clearContent()

  //TODO set new billing cycle date to all TF if they are not recreated at the beginning of each billing cycle (creating ll to that too)
}

function archiveAndCleanTeacherFiles() {
  
}

function archiveAndCleanCourseTable() {
  
}


function archiveAndCleanCourseBillingTable() {
  
}


function archiveAndCleanTeacherBillingTable() {
  
}
