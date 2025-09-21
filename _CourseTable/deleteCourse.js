function deleteCourses(data) {
  var course_ids = data["KursIDs"]

  for (var course_id of course_ids)
  {
    //delete from Kursübersicht
    var course_row = UTLS.findValueInCol(COURSESHEET, COURSEIDCOL, course_id)  

    if (course_row != 0)
    {
      try {
        UTLS.lockSheet(COURSESHEET)
        COURSESHEET.deleteRow(course_row)
      } catch (e) {
        throw e
      } finally {
        UTLS.releaseSheetLock(COURSESHEET)
      }
    }else
    {
      console.warn("Course ID " + course_id + " not found when trying to delete course from course sheet")
    }

    //delete from Kursverrechnung  
    var course_billing_row = UTLS.findValueInCol(COURSEBILLINGSHEET, COURSEIDCOL, course_id)  
    
    if (course_billing_row != 0)
    {
      try {
        UTLS.lockSheet(COURSEBILLINGSHEET)
        COURSEBILLINGSHEET.deleteRow(course_billing_row)
      } catch (e) {
        throw e
      } finally {
        UTLS.releaseSheetLock(COURSEBILLINGSHEET)
      }
    }else
    {
      console.warn("Course ID " + course_id + " not found when trying to delete course from course billing sheet")
    }
    console.log("[CT] deleted course with id " + course_id + " from course and course billing tables")
  }
}