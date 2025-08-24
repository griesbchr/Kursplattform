function createContactForm(course, teacher) {
  Logger.log("[CH]Creating contract form for course " + course['KursID'])
  var filename = "Anmeldung"+'_'+course['KursID']
  var docfile = TEMPLATECONTRACTFILE
                .makeCopy()
                .setName(filename)

  var doc_id = docfile.getId()
  var doc = DocumentApp.openById(doc_id)
  
  //replace text
  replaceCommonInfos(doc, course)
  replaceTeacherInfo(doc, teacher)
  replaceCourseInfo(doc, course)

  if (doc.getBody().getText().indexOf("<<") !== -1)
  {
    Logger.log("[CH]Warning when creating a contract form: text still contains '<<' after text replacement")
  }

  // Save the modified Google Docs file
  doc_id = doc.getId();
  doc.saveAndClose()
  
  doc_file = DriveApp.getFileById(doc_id);
  doc_file.moveTo(CONTRACTFILEFOLDER)

  var pdfContent = doc_file.getBlob().getAs('application/pdf');
  var pdfFile = CONTRACTFILEFOLDER.createFile(pdfContent).setName(filename + '.pdf');
  
  Logger.log("[CH]Finished creating contract form for course " + course['KursID'])

  return pdfFile.getId()

}

function replaceCommonInfos(doc, course)
{
  var docBody = doc.getBody();


  var data_file_id = DATAFILE.getId();
  var data_ss = SpreadsheetApp.openById(data_file_id);
  var data_sheet = data_ss.getSheetByName(DATASHEETNAME)
  var data_range = data_sheet.getDataRange()
  var data_rangedata = data_range.getValues()

  var parameters = {}
  for (var i=1; i <= data_range.getNumColumns(); i=i+1)
  {
    parameters[data_rangedata[PARAMROW-1][i-1]] = data_rangedata[PARAMROW+1-1][i-1]
  }

  var coursenumbers_row;
  switch (course["Kursart"]){
    case BASIC:
      coursenumbers_row = BASICROW
      break
    case PLUS:
      coursenumbers_row = PLUSQVROW
      break
    case QV:
      coursenumbers_row = QVROW
      break
    case PLUSQV:  
      coursenumbers_row = PLUSQVROW
      break
    case PREMIUM:  
      coursenumbers_row = PREMIUMROW
      break
    case INTENSIV:  
      coursenumbers_row = INTENSIVROW
      break
    
    default:
      console.error("[COURSEHANDLER] Coursetype not found in switch case!")
  }

  var regie_text;
  var regie_red;
  var regie_voll;
  if (course["Kursart"] == PLUSQV)
  {
    regie_text = parameters["Regie_Text_Plusqv"]
    regie_red = ""
    regie_voll = ""
  }else
  {
    regie_text = parameters["Regie_Text"]
  }


  coursenumbers = {}    //contains the map between fields and course numbers
  for (var col=1; col < data_range.getNumColumns(); col=col+1)
  {
    coursenumbers[data_rangedata[coursenumbers_row-1][col-1]] = data_rangedata[coursenumbers_row+1-1][col-1];
  }

  course_payments = {}    //contains the map between course numbers and partial payments
  for (var row=COURSESTARTINGROW; row < COURSESTARTINGROW+COURSEROWLEN; row=row+1)
  {
    course_payments[data_rangedata[row-1][COURSENUMBERCOL-1]] = format_currency(data_rangedata[row-1][COURSEPARIALPAYMENTCOL-1]);
  }

  groupcourse_payments = {}
  groupcourse_payments[GROUPCOURSENR] = format_currency(data_rangedata[GROUPCOURSEROW-1][COURSEPARIALPAYMENTCOL-1])
  
  //console.log("parameters")
  //console.log(parameters)
  //console.log("coursenumbers")
  //console.log(coursenumbers)
  //console.log("course_payments")
  //console.log(course_payments)
  //console.log("groupcourse_payments")
  //console.log(groupcourse_payments)
  
  docBody.replaceText('<<Regie_Text>>', regie_text);  
  docBody.replaceText('<<Regie_voll>>',format_currency(parameters["Regie"]));  
  docBody.replaceText('<<Regie_red>>',format_currency(parameters["Regie_Red"]));  

  docBody.replaceText('<<Regie>>',format_currency(parameters["Regie"]));  

  docBody.replaceText('<<Infra>>',format_currency(parameters["Infra"]));  
  docBody.replaceText('<<Schuljahr>>',parameters["Schuljahr"]);  
  docBody.replaceText('<<TZ1_Datum>>',parameters["TZ1_Datum"]);  
  docBody.replaceText('<<TZ2_Datum>>',parameters["TZ2_Datum"]);  
  docBody.replaceText('<<TZ3_Datum>>',parameters["TZ3_Datum"]);  
  docBody.replaceText('<<TZ4_Datum>>',parameters["TZ4_Datum"]);  

  
  docBody.replaceText('<<KnEK1>>',"Kurs Nr. " + coursenumbers["KnEK1"]);  
  docBody.replaceText('<<KnEK2>>',"Kurs Nr. " + coursenumbers["KnEK2"]);  
  docBody.replaceText('<<KnEK3>>',"Kurs Nr. " + coursenumbers["KnEK3"]);  
  docBody.replaceText('<<BtrEK1>>',course_payments[coursenumbers["KnEK1"]]);  
  docBody.replaceText('<<BtrEK2>>',course_payments[coursenumbers["KnEK2"]]);  
  docBody.replaceText('<<BtrEK3>>',course_payments[coursenumbers["KnEK3"]]); 

  docBody.replaceText('<<KnGK1>>',"Kurs Nr. " + coursenumbers["KnGK1"]);  
  docBody.replaceText('<<KnGK2>>',"Kurs Nr. " + coursenumbers["KnGK2"]);  
  docBody.replaceText('<<KnGK3>>',"Kurs Nr. " + coursenumbers["KnGK3"]);  
  docBody.replaceText('<<BtrGK1>>',course_payments[coursenumbers["KnGK1"]]);  
  docBody.replaceText('<<BtrGK2>>',course_payments[coursenumbers["KnGK2"]]);  
  docBody.replaceText('<<BtrGK3>>',course_payments[coursenumbers["KnGK3"]]); 

  docBody.replaceText('<<KnEM1>>', "Kurs Nr. " + GROUPCOURSENR);  
  docBody.replaceText('<<BtrEM1>>',groupcourse_payments[GROUPCOURSENR]); 

}

function replaceTeacherInfo(doc, teacher){
  var docBody = doc.getBody();

  docBody.replaceText('<<Leher_Vorname>>',teacher["Vorname"]);  
  docBody.replaceText('<<Leher_Nachname>>',teacher["Nachname"]);  
  docBody.replaceText('<<Lehrer_Adresse>>',teacher["Strasse, HausNR, Türe"]);  
  docBody.replaceText('<<Lehrer_PLZ>>',teacher["Plz"]);  
  docBody.replaceText('<<Lehrer_Ort>>',teacher["Ort"]);  
  docBody.replaceText('<<Lehrer_Email>>',teacher["Email"]);  
  docBody.replaceText('<<Lehrer_Tel>>',teacher["Tel"]);    
}

function replaceCourseInfo(doc, course){
  var docBody = doc.getBody();

  docBody.replaceText('<<S_Vorname>>',course["S_Vorname"]);
  docBody.replaceText('<<S_Nachname>>',course["S_Nachname"]);  
  docBody.replaceText('<<S_Adresse>>',course["Rechnungsadresse"]);  
  docBody.replaceText('<<PLZ>>',course["Rechnungs_PLZ"]);  
  docBody.replaceText('<<Ort>>',course["Rechnungsort"]);  
  docBody.replaceText('<<Wohngemeinde>>',course["Wohngemeinde"]);
  docBody.replaceText('<<Geburtsdatum>>',parseCustomDate(course["Geburtsdatum"]));  
  docBody.replaceText('<<Schule_Klasse>>',course["Schule_Klasse"]);  
  docBody.replaceText('<<EMail_Schueler>>',course["EMail"]);  
  docBody.replaceText('<<EMail_Rechnung>>',course["Rechnungs_Mail"]);  
  docBody.replaceText('<<Rechnungsname>>',course["Rechnungsname"]);  
  docBody.replaceText('<<Rechnungsadresse>>',course["Rechnungsadresse"]);  
  docBody.replaceText('<<Rechnungs_PLZ>>',course["Rechnungs_PLZ"]);  
  docBody.replaceText('<<Rechnungsort>>',course["Rechnungsort"]);  
  docBody.replaceText('<<Telefon_Vormittag>>',course["Telefon_Vormittag"]);  
  docBody.replaceText('<<Telefon_mobil>>',course["Telefon_mobil"]);  
  docBody.replaceText('<<Schuljahr>>',course["S_Nachname"]);  
  docBody.replaceText('<<Kursnummer>>',course["Kursnummer"]);  
  docBody.replaceText('<<Kursnummer>>',course["Kursnummer"]);  
  docBody.replaceText('<<Instrument>>',course["Instrument"]);  
  docBody.replaceText('<<Kursart>>',course["Kursart"]);  
  docBody.replaceText('<<Zweigstelle>>',course["Zweigstelle"]);  
  docBody.replaceText('<<Anz_Einheiten>>', parseInt(course["Vertrag_Einheiten"]));  

  var courselocation;
  switch (course["Kursmodus"])
  {
    case ATCOURSELOC:
      courselocation = ""
      break;
    case ATSTUDENT:
      courselocation = "(Hausbesuch)"
      break;
    case ATTEACHER:
      courselocation = "(bei der Lehrperson)"
      break;
  }
  docBody.replaceText('<<Kursmodus>>', courselocation)

}

function format_currency(numberstr)
{
  const options = { style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return "€ "+parseFloat(numberstr).toLocaleString("de-AT",options)
}



function parseCustomDate(dateString) {
  if (dateString.includes('.')) {
    var parts = dateString.split('.');
    if (parts.length !== 3) {
      return dateString;
    }
    
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
      return dateString;
    }
    
    var parsedDate = new Date(year, month - 1, day); // Adjust month to 0-based index
    if (isValidDate(parsedDate, year, month - 1, day)) {
      return parsedDate.toLocaleDateString("de-AT");
    } else {
      return dateString;
    }
  } else {
    var parsedDate = new Date(dateString);
    if (!isNaN(parsedDate) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate.toLocaleDateString("de-AT");
    } else {
      return dateString;
    }
  }
}

function isValidDate(date, year, month, day) {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}
