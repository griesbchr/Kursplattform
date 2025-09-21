//This file acts as API to the data storage folder "publicdata". It contains simple get functions to access the data
//Logger.log("loading DATA")
const DISTRICTSFILENAME = "Zweigstellenliste"
const COURSENUMBERFILENAME = "Kursnummerliste"
const STUDENTIDFILENAME = "latest_student_id"
const COURSEIDFILENAME = "latest_course_id"
const COURSETYPESFILENAME = "Kursartenliste"
const COURSEMODESFILENAME = "Kursmodilliste"
const COURSECONTRACTFILENAME = "Anmeldungen"
const CONTACTSTATUSFILENAME = "Kontaktstatus"
const ATTENDANCEVALUESFILENAME = "Anwesenheitwahlmöglichkeiten"
const PAYMENTSTATUSFILENAME = "Teilzahlungsstatus"
const PREREGISTRATIONSTATUSFILENAME = "Voranmeldungstatus"
const BILLINGPOSTSFILENAME = "Vereinsabrechnungsstellen"
const COURSEPARAMETERSFILENAME = "Kursparameter"
const COURSEENDEFILENAME = "Kursende"
const YEARFILENAME = "Schuljahrkuerzel"
const ADMINFEEFILENAME = "Regiebeitrag"


const COURSEIDLENGTH = 4
const COURSEIDINITIALLETTER = "K"
const STUDENTIDLENGTH = 4
const STUDDENTIDINITIALLETTER = "S"

function getDistricts(){ return getFileColContent(DISTRICTSFILENAME,1)}
function getCoursenumbers(){ return getFileContent(COURSENUMBERFILENAME)}
function getCoursetypes(){ return getFileContent(COURSETYPESFILENAME)}
function getCoursemodes(){ return getFileContent(COURSEMODESFILENAME)}
function getCourseContractStatus(){ return getFileContent(COURSECONTRACTFILENAME)}
function getContactStatus(){ return getFileContent(CONTACTSTATUSFILENAME)}
function getAttendanceValues() {return getFileContent(ATTENDANCEVALUESFILENAME)}
function getPaymentStatus() {return getFileContent(PAYMENTSTATUSFILENAME)}
function getPreregistrationStatus() {return getFileContent(PREREGISTRATIONSTATUSFILENAME)}
function getBillingPosts() {return getFileContent(BILLINGPOSTSFILENAME)}  //für Vereinsabrechnung eg. Schnupperstunden
function getCourseParameterDict() {return getColContentAsDict(COURSEPARAMETERSFILENAME, 2)}
function getCourseEnd() { return getFileContent(COURSEENDEFILENAME)}
function getYear(){return getFileContent(YEARFILENAME)[0][0]}
function getAdminFee(){return getFileContent(ADMINFEEFILENAME)[0][0]}


function getFileContent(filename)
{
  let file_ID = DriveApp.getFilesByName(filename).next().getId()
  let file = SpreadsheetApp.openById(file_ID)
  let sheet = file.setActiveSheet(file.getSheets()[0])
  let len = sheet.getLastRow()
  return sheet.getRange(1,1,len).getValues()
}

function getFileColContent(filename, col)
{
  let file_ID = DriveApp.getFilesByName(filename).next().getId()
  let file = SpreadsheetApp.openById(file_ID)
  let sheet = file.setActiveSheet(file.getSheets()[0])
  let len = sheet.getLastRow()
  return sheet.getRange(1,col,len).getValues().flat()
}

//get content of col as dict with the first col
function getColContentAsDict(filename, col)
{
  let col1 = getFileColContent(filename, 1)
  let col2 = getFileColContent(filename, col)
  dct = {}
  for (let i=0; i<col1.length;i=i+1)
  {
    dct[col1[i]] = col2[i]
  }
  return dct
}

function getNewStudentID()
{
  let year = getYear()

  let file_ID = DriveApp.getFilesByName(STUDENTIDFILENAME).next().getId()
  let file = SpreadsheetApp.openById(file_ID)
  let sheet = file.setActiveSheet(file.getSheets()[0])
  
  //start lock
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // wait 30 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    console.error('Could not obtain lock for new course id.');
    return
  }
  let range = sheet.getRange(1,1)
  let old_id = Number(range.getValue())
  let new_id = old_id + 1
  let new_number_id = String(new_id)
  range.setValue(new_id)
  SpreadsheetApp.flush()

  //release lock
  lock.releaseLock();

  let missing_zeros = STUDENTIDLENGTH - new_number_id.length
  return (STUDDENTIDINITIALLETTER + year + "0".repeat(missing_zeros) + new_id)
}

function getNewCourseID()
{
  let year = getYear()
  let file_ID = DriveApp.getFilesByName(COURSEIDFILENAME).next().getId()
  let file = SpreadsheetApp.openById(file_ID)
  let sheet = file.setActiveSheet(file.getSheets()[0])
  
  //start lock
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // wait 10 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    console.error('Could not obtain lock for new course id.');
    return
  }
  let range = sheet.getRange(1,1)
  let old_id = Number(range.getValue())
  let new_id = old_id + 1
  let new_number_id = String(new_id)
  range.setValue(new_id)
  SpreadsheetApp.flush()

  //release lock
  lock.releaseLock();

  let missing_zeros = COURSEIDLENGTH - new_number_id.length
  return (COURSEIDINITIALLETTER + year + "0".repeat(missing_zeros) + new_id)
}

function getRoomRent(district)
{
  let post_row =  getFileColContent(DISTRICTSFILENAME, 1).indexOf(district)
  if (post_row == -1)
  {
    throw new Error("Course location not found in data files: " + district)
  }
  return getFileColContent(DISTRICTSFILENAME, 2)[post_row]
}

function getAssociation(district)
{
  let post_row =  getFileColContent(DISTRICTSFILENAME, 1).indexOf(district)
  return getFileColContent(DISTRICTSFILENAME, 3)[post_row]
}

function getPaymentName(district)
{
  let post_row =  getFileColContent(DISTRICTSFILENAME, 1).indexOf(district)
  return getFileColContent(DISTRICTSFILENAME, 4)[post_row]
}

function getPaymentIban(district)
{
  let post_row =  getFileColContent(DISTRICTSFILENAME, 1).indexOf(district)
  return getFileColContent(DISTRICTSFILENAME, 5)[post_row]
}



