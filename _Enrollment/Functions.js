function setContactStatus(student_id, status)
{
  let row = UTLS.findValueInCol(ENROLLMENTSHEET, STUDENTIDCOL, student_id)
  if (row == 0){return -1}
  let link = ENROLLMENTSHEET.getRange(row, CONTACTSTATUSCOL).getRichTextValue().getLinkUrl()
  ENROLLMENTSHEET.getRange(row, CONTACTSTATUSCOL).setRichTextValue(SpreadsheetApp.newRichTextValue()
          .setText(status)
          .setLinkUrl(link)
          .build())
}

function setCourseStatus(student_id, status)
{
  let row = UTLS.findValueInCol(ENROLLMENTSHEET, STUDENTIDCOL, student_id)
  if (row == 0){return -1}
  ENROLLMENTSHEET.getRange(row, COURSESTATUSCOL).setValue(status)
}

function fineNameDuplicates()
{
  var firstname_col = 11
  var lastname_col = 12

  var last_row = ENROLLMENTSHEET.getLastRow()
  var firstnames = ENROLLMENTSHEET.getRange(2, firstname_col, last_row-1).getValues().flat()
  var lastnames = ENROLLMENTSHEET.getRange(2, lastname_col, last_row-1).getValues().flat()

  var names = firstnames.map((item, index) => item + " " + lastnames[index]);
  var duplicates = findDuplicates(names)
  console.log(duplicates.length)
  Browser.msgBox("Die folgenden Namen kommen doppelt vor: \n\r"+duplicates)
}

//from all the students that have paid the admin fee, filter out the ones that have a match according to a certain criteria
function fineAdminFeePaidDuplicates()
{
  var adminfee_paid_col =  37
  var student_id_col = 34

  var firstname_col = 11
  var lastname_col = 12

  var last_row = ENROLLMENTSHEET.getLastRow()
  var firstnames = ENROLLMENTSHEET.getRange(2, firstname_col, last_row-1).getValues().flat()
  var lastnames = ENROLLMENTSHEET.getRange(2, lastname_col, last_row-1).getValues().flat()
  var names = firstnames.map((item, index) => item + " " + lastnames[index]);

  var student_ids = ENROLLMENTSHEET.getRange(2, student_id_col, last_row-1).getValues().flat()
  var adminfee_paid_raw = ENROLLMENTSHEET.getRange(2, adminfee_paid_col, last_row-1).getValues().flat()

  var adminfee_paid = adminfee_paid_raw.map(x => x !== "")


  var duplicate_dict = {}; // Initialize an empty dictionary

  for (var i = 0; i < student_ids.length; i++) {
    var studentID = student_ids[i];

    // Assign a value of 1 to the student ID key if admin fee is paid, otherwise assign 0
    if (adminfee_paid[i])
    {
      duplicate_dict[studentID] = 1;
    }
  }

  var names = firstnames.map((item, index) => item + " " + lastnames[index]);
  var duplicates = findDuplicates(names)
  console.log(duplicates.length)
  Browser.msgBox("Die folgenden Namen kommen doppelt vor: \n\r"+duplicates)
}

function validateMail()
{

  const options = {
    method: 'get',
    headers: {
    'X-RapidAPI-Key': 'd665bd5fc4mshae329eab239eeb3p19ac14jsn70ccba78b940',
    'X-RapidAPI-Host': 'ipqualityscore-ipq-proxy-detection-v1.p.rapidapi.com'
    }
  };
  url =  'https://www.ipqualityscore.com/api/json/email/C8ZyVMlTP0LNweoQtYEIyCyEX5JCjkR7/christoph.griesbacher@gmail.com'
  try {
    const response = UrlFetchApp.fetch(url, options);

    console.log(response.getContentText());
  } catch (error) {
    console.error(error);
  }
}


function getAdminFeePaidStudentIDs()
{
  var adminfee_paid_col =  37
  var student_id_col = 34

  var last_row = ENROLLMENTSHEET.getLastRow()

  var student_ids = ENROLLMENTSHEET.getRange(2, student_id_col, last_row-1).getValues().flat()
  var adminfee_paid = ENROLLMENTSHEET.getRange(2, adminfee_paid_col, last_row-1).getValues().flat()

  var studentDict = {}; // Initialize an empty dictionary

  for (var i = 0; i < student_ids.length; i++) {
    var studentID = student_ids[i];

    // Assign a value of 1 to the student ID key if admin fee is paid, otherwise assign 0
    if (adminfee_paid[i] !== "")
    {
      studentDict[studentID] = 1;
    }
  }
  console.log(Object.keys(studentDict).length)

  return studentDict

}

function findDuplicates(arr) {
  const seen = {}; // An object to keep track of elements we've seen
  const duplicates = [];

  for (const item of arr) {
    if (seen[item]) {
      // If the item is already in the 'seen' object, it's a duplicate
      duplicates.push(item);
    } else {
      // Otherwise, mark it as seen
      seen[item] = true;
    }
  }

  return duplicates;
}
