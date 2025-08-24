function sentContractMailByIds(course_id, teacher_id) 
{
  var result = generateCourseContractByIds(course_id, teacher_id)
  MAIL.sentCourseContract(result.course, result.teacher, result.pdffile_id)
}

function sentContractMailByCourseDict(course) 
{
  var result = generateCourseContractByCourseDict(course)
  MAIL.sentCourseContract(result.course, result.teacher, result.pdffile_id)
}

function generateCourseContractByIds(course_id, teacher_id)
{
  var teacher = TT.getTeacherDataById(teacher_id)
  var course = getCourseData(course_id ,teacher_id)
  var pdffile_id = CONTRACT.createContactForm(course, teacher)
  return {
    course: course, 
    teacher: teacher, 
    pdffile_id: pdffile_id
  }
}

function generateCourseContractByCourseDict(course)
{
  teacher_id = course["LehrerID"]
  var teacher = TT.getTeacherDataById(teacher_id)
  var pdffile_id = CONTRACT.createContactForm(course, teacher)
  return {
    course: course, 
    teacher: teacher, 
    pdffile_id: pdffile_id
  }
}



function test_sentContractMailByIds()
{
  var course_id = "K230870"
  var teacher_id = "202"

  sentContractMailByIds(course_id, teacher_id)

}

