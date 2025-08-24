const IMPORT_BANKAMOUNTCOL = 3;
const IMPORT_BANKDATECOL = 4;
const IMPORT_BANKREFCOL = 5;
const IMPORT_BANKSENDER = 6;
const IMPORT_AUTOASSIGNMENTCOL = 1;
const IMPORT_STARTINGCOL = 9;
const IMPORT_STARGINGROW = 3;
const IMPORT_ASSIGNTOCOL = 2;
const IMPORT_ASSIGNTOROW = 3;
const IMPORT_ASSIGNEDELEMENTSROW = 3;
const IMPORT_ASSIGNEDELEMENTSCOL = 4;

const IMPORT_INFOCELL = IMPORTPAYMENTSHEET.getRange(4, 7);

const ADMINFEEPAYMENTSFOLDERID = "0AAY20_kuNn1gUk9PVA";
const PARTIALPAYMENTSFOLDERID = "0AJZRLdlz7Q0OUk9PVA";

function getFileContent(fileId) {
  // Obtain an access token
  var accessToken = ScriptApp.getOAuthToken();

  // Define the URL for fetching file content
  var url = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media";

  // Set up the API headers
  var options = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    muteHttpExceptions: true,
  };

  // Make the API call
  var response = UrlFetchApp.fetch(url, options);

  var name_text = response.getBlob().getName()
  var ending_idx = name_text.lastIndexOf('.')
  var file_type = name_text.substring(ending_idx+1)

  // Check for errors in the response
  if (response.getResponseCode() !== 200) {
    throw new Error("Failed to fetch file content. Response: " + response.getContentText());
  }
  // Return the file content
  var data = {
  "UTF-8":  response.getContentText("UTF-8"),
  "ISO-8859-1": response.getContentText("ISO-8859-1")
  };
  return [data, file_type];

}

function getFilesContentInSharedDrive(file_ids) {
  var files_content = [];
  var file_types = [];
  var counter = 1
  for (let file_id of file_ids) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Datei " + counter + " wird heruntergeladen..", "Status", 5);
    counter = counter + 1;
    var [file_content, file_type] = getFileContent(file_id)
    files_content.push(file_content);
    file_types.push(file_type)
  }
  return [files_content, file_types];
}

//function showDialog(fileOptions) {
//  var htmlOutput = HtmlService.createHtmlOutputFromFile('FilePicker')
//      .setWidth(300)
//      .setHeight(200);
//
//  // Pass the file options to the HTML
//  htmlOutput.userObject = {fileOptions: fileOptions};
//
//  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Select a File');
//}

function loadPayment() {
  var html = HtmlService.createHtmlOutputFromFile("Picker2.html")
    .setWidth(700)
    .setHeight(550)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, "Ordner auswählen");
}

function getOAuthToken() {
  // Show a toast message in Google Sheets for 5 seconds
  SpreadsheetApp.getActiveSpreadsheet().toast("Authorisierung wird angefordert..", "Status", 5);
  DriveApp.getRootFolder();
  var token = ScriptApp.getOAuthToken();
  SpreadsheetApp.getActiveSpreadsheet().toast("Authorisierung erhalten..", "Status", 5);
  return token;
}

//function loadAdminFeePayments() {
//  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
//    .setWidth(600)
//    .setHeight(425)
//    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
//  SpreadsheetApp.getUi().showModalDialog(html, 'Ordner auswählen');
//}

function testGetFileIDs()
{
  var folder = DriveApp.getFolderById("0ADY7FqX4L9nYUk9PVA")
  var file_iter = folder.getFiles()

  console.log(file_iter.next().getId())
}
function proccessSelectedFiles(file_ids) {
  //var file_ids = ["14iAvqXvs7NPgArlo-FpFU72U_JEBEnQX", "1fEV5JslOdhhDU48ZGP7_M6Es_yeHUDu0", "1-ID396o5IrDpOn4EHiVsXN6meAyS_sYd"]
  //var file_ids = ["19EuQVQ1PlCSW6nAIthSS0vHAqMELxL8I"]
  //var file_ids = ["1aoCDlR3aVIsrAtWewRGCHCpZofs8xIMj"]
  // load file content
  var [files, file_types] = getFilesContentInSharedDrive(file_ids);

  //parse file content
  var transactions = [];
  //transactions are [amount, date, payment_ref, sender_name, receiver_name, id]
  var counter = 0;
  for (let file of files) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Datei " + counter + " wird verarbeitet..", "Status", 5);
    var file_type = file_types[counter]

    if (file["ISO-8859-1"].startsWith("<?xml")) {
    //if (file_type.toLowerCase() == "xml"){
      transactions.push(...parseXML(file["UTF-8"]));
    } else if (file_type.toLowerCase() == "csv"){
      transactions.push(...parseCsvNew(file["ISO-8859-1"]));
    }else if (file_type.toLowerCase() == "txt"){
      transactions.push(...parseTxt(file["ISO-8859-1"]));
    } else{
      throw new Error("Can not parse file type '" + file_type + "'")
    }
    counter += 1;
  }

  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  let last_row = IMPORTPAYMENTSHEET.getLastRow();

  IMPORTPAYMENTSHEET.getRange(starting_row, 1, last_row, 8).clearFormat().clearContent();

  IMPORTPAYMENTSHEET.getRange(starting_row, 3, transactions.length, transactions[0].length).setValues(transactions);
  IMPORTPAYMENTSHEET.getRange(starting_row, 3, transactions.length).setNumberFormats(
    Array(transactions.length).fill(["[$€]#,##0.00"])
  );
  IMPORT_INFOCELL.setValue(String(transactions.length) + " Buchungen gefunden.");

  return true;
}

function parseXML(xmlContent) {
  var document = XmlService.parse(Utilities.newBlob(xmlContent, 'ISO-8859-1').getDataAsString('UTF-8'));
  var root = document.getRootElement();

  var namespace = root.getNamespace();

  var bkToCstmrStmt = root.getChild("BkToCstmrStmt", namespace);
  if (!bkToCstmrStmt) {
    Logger.log("BkToCstmrStmt not found");
    return;
  }
  var stmt = bkToCstmrStmt.getChild("Stmt", namespace);
  var ntryElements = stmt.getChildren("Ntry", namespace);
  var transactions = [];

  for (let ntry of ntryElements) {
    var transaction = [];

    var ntryDtls = ntry.getChild("NtryDtls", namespace);
    var txDtls = ntryDtls.getChild("TxDtls", namespace);

    if (Object.is(txDtls, null))
    {
      console.warn("Problem with importing payment xml")
      console.warn(ntry.getAllContent())
      continue;
    }

    // ----AMOUNT----
    var amountElement = ntry.getChild("Amt", namespace);
    transaction.push(parseFloat(Number(amountElement.getText())));

    // ----DATE----
    var dateElement = ntry.getChild("ValDt", namespace);
    if (dateElement) {
      var date = dateElement.getChild("Dt", namespace);
      if (date) {
        transaction.push(Utilities.formatDate(new Date(date.getText()), 'Europe/Vienna', 'dd.MM.yyyy'));
      } else {
        transaction.push("-");
      }
    } else {
      transaction.push("-");
    }

    // ----Reference----
    var rmtInf = txDtls.getChild("RmtInf", namespace);
    if (!rmtInf) {
      transaction.push("-");
    } else {
      var strd = rmtInf.getChild("Strd", namespace);
      if (strd) {
        var cdtrRefInf = strd.getChild("CdtrRefInf", namespace);
        transaction.push(cdtrRefInf.getChild("Ref", namespace).getText());
      } else {
        var ustrd = rmtInf.getChild("Ustrd", namespace);
        if (ustrd) {
          transaction.push(ustrd.getText());
        } else {
          transaction.push("-");
        }
      }
    }

    
    // ----Sender Name----
    var rltdPties = txDtls.getChild("RltdPties", namespace);
    var dbtr = rltdPties.getChild("Dbtr", namespace);
    if (dbtr) {
      transaction.push(dbtr.getChild("Nm", namespace).getText());
    } else {
      transaction.push("-");
    }
    // ----Receiver Name----
    transaction.push("-");

    // ----ID----
    var refs = txDtls.getChild("Refs", namespace);
    if (refs){
    transaction.push(refs.getChild("TxId", namespace).getText());
    } else{
      transaction.push("-")
    }
    transactions.push(transaction);
  }

  return transactions;
}

function parseTxt(csvContent) {
  // Split the content by line breaks to get an array of rows
  var rows = csvContent.split("\n");

  // Map over each row and split it by commas to get an array of columns
  var file_content = rows.map(function (row) {
    return row.split(";");
  });

  var transactions = [];

  for (let row of file_content) {
    var transaction = [];
    row = row.map((element) => element.replace(/^"|"$/g, ""));

    transaction.push(parseFloat(Number(row[7]))); //amount
    transaction.push(row[5]); //date
    transaction.push(row[15] + row[16]); //reference
    transaction.push(row[17]); //Sender name
    transaction.push(row[3]); //receiver name
    transaction.push(row[10]); //ID

    transactions.push(transaction);
  }
  return transactions;
}


function parseCsvNew(csvContent)
{
  // Parse the CSV data into a 2D array.
  var data_array = Utilities.parseCsv(csvContent, ";");
  var transactions = []
  for (var i=1; i<data_array.length; i++) //skip header
  {
    var row = data_array[i]

    var transaction = []
    transaction.push(parseFloat(Number(row[7].replace(",", "."))))    //Betrag
    transaction.push(row[3])    //Validierugnsdatum
    transaction.push(row[18] + " " + row[5])    //Verwendungszweck, Zahlungsreferenz
    transaction.push(row[10]);  //Sender name
    transaction.push(row[0]);   //receiver IBAN
    transaction.push(row[26]); //ID 
    transactions.push(transaction)
  }
  return transactions
}
function parseCsv(csvContent)
{
  // Split the content by line breaks to get an array of rows
  var rows = csvContent.split("\n");

  // Map over each row and split it by commas to get an array of columns
  var file_content = rows.map(function (row) {
    return row.split(";");
  });

  var transactions = [];


  for (let row of file_content) {
    var transaction = [];
    row = row.map((element) => element.replace(/^"|"$/g, ""));
    var date = row[0]
    var field = row[1]

    var field_split = field.substring(14) //get rid of "Auftraggeber: "
    if (field_split.includes(" Zahlungsreferenz: "))
    {
      field_split = field_split.split(" Zahlungsreferenz: ") 
    } else if(field_split.includes(" Verwendungszweck: "))
    {
      field_split = field_split.split(" Verwendungszweck: ") 
    } else{

    }
    var name = field_split[0]
    field_split = field_split[1].split(" IBAN Auftraggeber:")
    var reference = field_split[0]
    field_split = field_split[1].split(" BIC Auftraggeber: ")
    var iban = field_split[0]
    var ref = iban + " " + row[5]
    var amount = parseFloat(row[3])

    transaction.push(amount); //amount
    transaction.push(date); //date
    transaction.push(reference); //reference
    transaction.push(name); //Sender name
    transaction.push(""); //receiver name
    transaction.push(ref); //ID

    transactions.push(transaction);
  }
  return transactions;
}
//preprocessing
function deleteFormatting() {
  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  let last_row = IMPORTPAYMENTSHEET.getLastRow();
  IMPORTPAYMENTSHEET.getRange(starting_row, 1, last_row, 8).clearFormat(); //.setBackground("white")
  IMPORT_INFOCELL.setValue(String(last_row - starting_row + 1) + " Buchungen gefunden.");
}

function deleteNegativeRows() {
  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  let last_row = IMPORTPAYMENTSHEET.getLastRow();
  let values = IMPORTPAYMENTSHEET.getRange(starting_row, IMPORT_BANKAMOUNTCOL, last_row).getValues().flat();
  let remove_idx = [];
  values.forEach((e, i) => {
    if (Number(e) <= 0) {
      remove_idx.push(i + starting_row);
    }
  });
  remove_idx.reverse().forEach((e) => IMPORTPAYMENTSHEET.deleteRow(e));
  IMPORT_INFOCELL.setValue("Es wurden " + remove_idx.length + "Buchungen entfernt.");
}

/**
 * Find a pattern in text that matches the template format SJJXXXX[N].
 * Template must be uppercase, matched text can be either case,
 * but result is always returned in uppercase.
 * Returns empty string if multiple matches are found or no match is found.
 * 
 * @param {string} template - The template string (e.g., 'SJJXXXX' or 'SJJXXXX1')
 * @param {string} text - The input text to search in
 * @returns {string} The matched pattern in uppercase or empty string
 * 
 * @example
 * findPattern("SJJXXXX", "S230858 Regiebeitrag 24/25") // Returns "S230858"
 * findPattern("SJJXXXX", "s230858 Regiebeitrag 24/25") // Returns "S230858"
 * findPattern("KJJXXXX", "K241851 Schüler: Laurenz Pein k241851") // Returns ""
 */
function findPattern(template, text) {
    // Ensure template is uppercase
    if (template !== template.toUpperCase()) {
        throw new Error("Template must be uppercase (e.g., 'SJJXXXX' or 'SJJXXXX1')");
    }
    
    // Extract the first letter and optional last digit from template
    const firstLetter = template[0];
    const hasEndingDigit = /\d/.test(template.slice(-1));
    const endingDigit = hasEndingDigit ? template.slice(-1) : null;
    
    // Build the regex pattern
    let pattern = `\\b[${firstLetter}${firstLetter.toLowerCase()}]`; // Match either case of the letter
    //template is either XXXJJ or JJXXXX
    if (template.slice(1,6) == "XXXJJ")
    {
      pattern += `\\d{3}`; // Next two digits (XXX)
      pattern += `\\d{2}`; // Following four digits (JJ)
    }else{
      pattern += `\\d{2}`; // Next two digits (JJ)
      pattern += `\\d{4}`; // Following four digits (XXXX)
    }
    if (hasEndingDigit) {
        pattern += `${endingDigit}`; // Optional ending digit if specified in template
    }
    pattern += `\\b`;
    
    // Create regex object
    const regex = new RegExp(pattern, 'g');
    
    // Find all matches
    const matches = text.match(regex) || [];
    
    // Return empty string if no matches or multiple matches
    if (matches.length !== 1) {
        return "";
    }
    
    // Return the match converted to uppercase
    return matches[0].toUpperCase();
}

function refFilter(ex, ref) {
  //return empty array if ex is empty string
  if (ex == "") {
    return [""];
  }

  let last_dig = ex.slice(-1);
  ref = ref.replace(/,+/, " ");
  ref = ref.replace(/[\(\)\-\.\/]/g, " "); //replace "(,),-,.,, and /" with nothing
  var split_ref = ref.split(" ");
  split_ref = split_ref.map((e) => e.replace(/^\D+/g, "")); //replace all non-digits with nothing
  split_ref = split_ref.filter((e) => e != ""); //remove empty elements
  split_ref = split_ref.filter((e) => e.length == ex.length - 1); //remove elements with wrong length
  if (last_dig != "X") {
    split_ref = split_ref.filter((e) => e.slice(-1) == last_dig); //remove if last dig is wrong
  }

  if (split_ref.length == 1) {
    //only one possible number left
    return ex.charAt(0) + split_ref[0];
  } else {
    return "";
  }
}

function test_refFilter() {
  let ex = "KJJXXXX";
  let ref = "S240809(Zixuan.Zhou)";
  Logger.log(refFilter(ex, ref));
}

function test_findPattern()
{
  Logger.log(findPattern("SJJXXXX2", "S2408091(Zixuan.Zhou)"));
  Logger.log(findPattern("SJJXXXX2", "S2408092(Zixuan.Zhou)"));//true
  Logger.log(findPattern("SJJXXXX2", "S2408099(Zixuan.Zhou)"));
  Logger.log(findPattern("SJJXXXX2", "S240809(Zixuan.Zhou)"));
  Logger.log(findPattern("SJJXXXX", "S240809(Zixuan.Zhou)")); //true
  Logger.log(findPattern("SJJXXXX", "K240809(Zixuan.Zhou)"));
  Logger.log(findPattern("SJJXXXX", "S240809 S240810 (Zixuan.Zhou)"));
  Logger.log(findPattern("KJJXXXX", "K240809(Zixuan.Zhou)")); //true
  Logger.log(findPattern("KJJXXXX", "S240809(Zixuan.Zhou)"));


}

function mapReference() {
  let [_, ex] = IMPORTPAYMENTSHEET.getRange(IMPORT_ASSIGNTOROW, IMPORT_ASSIGNTOCOL).getValue().split(" ");
  //deleteFormatting();
  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  let last_row = IMPORTPAYMENTSHEET.getLastRow();
  //read and convert to Strings
  let values = IMPORTPAYMENTSHEET.getRange(starting_row, IMPORT_BANKREFCOL, last_row)
    .getValues()
    .flat()
    .map((e) => String(e));

  f = findPattern.bind(this, ex); //binds first argument of function and returns new function
  values = values.map(f);
  values.forEach(function (e, i) {
    if (e != "") {
      IMPORTPAYMENTSHEET.getRange(i + starting_row, 1, 1, 2).setBackground(GREEN);
    }
  });

  var prev_values = IMPORTPAYMENTSHEET.getRange(starting_row, IMPORT_AUTOASSIGNMENTCOL, last_row).getValues().flat();

  // if there is already a value in the autoassignment column, keep it
  values = prev_values.map((e, i) => (e == "" ? [values[i]] : [e]));

  IMPORTPAYMENTSHEET.getRange(starting_row, IMPORT_AUTOASSIGNMENTCOL, last_row).setValues(values);
}

function doAutoAssignment() {
  doAssignment("auto");
}

function doAssignment(mode) {
  let [assign_to_string, ex_number] = IMPORTPAYMENTSHEET.getRange(IMPORT_ASSIGNTOROW, IMPORT_ASSIGNTOCOL)
    .getValue()
    .split(" ");

  //get a map of booking numbers and the associated info where to find them as key
  let booking_nr_arr;
  let booking_map = new Map();
  var last_row;
  var course_ids, teacher_ids;
  var payment_string;
  var payment_ids;
  switch (assign_to_string) {
    case "test":
      payment_string = "test";
      let sheet = COURSETABLESS.getSheetByName("Nummern");
      last_row = sheet.getLastRow();
      booking_nr_arr = sheet.getRange(2, 1, last_row, 3).getValues();
      booking_nr_arr.forEach((e) => booking_map.set(e[0], [e[1], e[2]]));
      break;
    case "Regiebeitrag":
      payment_string = "admin";
      last_row = COURSEBILLINGSHEET.getLastRow();
      if (ex_number.startsWith("S"))    //case import regiebeitrag with student id
      {
        var bookingidcol = STUDENTIDCOL
      }else{
        var bookingidcol = BIL_ADMINBOOKINGCOL
      }
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, bookingidcol, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, i + HEADERROW + 1));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_ADMINFEEPAYMENTID, last_row)
        .getValues()
        .flat();
      break;
    case "erste_Teilzahlung":
      payment_string = "payment1";
      last_row = COURSEBILLINGSHEET.getLastRow();
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_P1BOOKINGCOL, last_row)
        .getValues()
        .flat();
      course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row)
        .getValues()
        .flat();
      teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, [course_ids[i], teacher_ids[i], i + HEADERROW + 1]));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PARTIALPAYMENT1ID, last_row)
        .getValues()
        .flat();

      break;
    case "zweite_Teilzahlung":
      payment_string = "payment2";
      last_row = COURSEBILLINGSHEET.getLastRow();
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_P2BOOKINGCOL, last_row)
        .getValues()
        .flat();
      course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row)
        .getValues()
        .flat();
      teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, [course_ids[i], teacher_ids[i], i + HEADERROW + 1]));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PARTIALPAYMENT2ID, last_row)
        .getValues()
        .flat();

      break;
    case "dritte_Teilzahlung":
      payment_string = "payment3";
      last_row = COURSEBILLINGSHEET.getLastRow();
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_P3BOOKINGCOL, last_row)
        .getValues()
        .flat();
      course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row)
        .getValues()
        .flat();
      teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, [course_ids[i], teacher_ids[i], i + HEADERROW + 1]));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PARTIALPAYMENT3ID, last_row)
        .getValues()
        .flat();

      break;
    case "vierte_Teilzahlung":
      payment_string = "payment4";
      last_row = COURSEBILLINGSHEET.getLastRow();
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_P4BOOKINGCOL, last_row)
        .getValues()
        .flat();
      course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row)
        .getValues()
        .flat();
      teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, [course_ids[i], teacher_ids[i], i + HEADERROW + 1]));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PARTIALPAYMENT4ID, last_row)
        .getValues()
        .flat();
      break;
    case "Saldozahlung":
      payment_string = "saldo";
      last_row = COURSEBILLINGSHEET.getLastRow();
      booking_nr_arr = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PSALDOBOOKINGCOL, last_row)
        .getValues()
        .flat();
      course_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, COURSEIDCOL, last_row)
        .getValues()
        .flat();
      teacher_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, TEACHERIDCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, [course_ids[i], teacher_ids[i], i + HEADERROW + 1]));
      payment_ids = COURSEBILLINGSHEET.getRange(HEADERROW + 1, BIL_PARTIALPAYMENT5ID, last_row)
        .getValues()
        .flat();
      break;
    case "Vereinsbeitrag_VÖM":
      payment_string = "ass_vom";
      last_row = TEACHERBILLINGSHEET.getLastRow();
      booking_nr_arr = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_VOMBOOKINGNUMBERCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, i + HEADERROW + 1));
      payment_ids = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_VOMPAYMENTID, last_row)
        .getValues()
        .flat();
      break;
    case "Vereinsbeitrag_MAZ":
      payment_string = "ass_maz";
      last_row = TEACHERBILLINGSHEET.getLastRow();
      booking_nr_arr = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_MAZBOOKINGNUMBERCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, i + HEADERROW + 1));
      payment_ids = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_MAZPAYMENTID, last_row)
        .getValues()
        .flat();
      break;
    case "Büroservice":
      payment_string = "office";
      last_row = TEACHERBILLINGSHEET.getLastRow();
      booking_nr_arr = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_OFFICEBOOKINGNUMBERCOL, last_row)
        .getValues()
        .flat();
      booking_nr_arr.forEach((e, i) => booking_map.set(e, i + HEADERROW + 1));
      payment_ids = TEACHERBILLINGSHEET.getRange(HEADERROW + 1, TEA_OFFICEPAYMENTID, last_row)
        .getValues()
        .flat();
      break;
  }

  //putting the payments in a map
  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  last_row = IMPORTPAYMENTSHEET.getLastRow();
  if (mode == "strict") {
    var payments_arr = IMPORTPAYMENTSHEET.getRange(
      starting_row,
      IMPORT_BANKAMOUNTCOL,
      last_row - starting_row + 1,
      6
    ).getValues();
    var payments_map = new Map();
    payments_arr.forEach((e, i) => payments_map.set(e[2], [i + starting_row, e[0], e[1], e[2], e[3], (3)[4], e[5]]));
  } else {
    var payments_arr = IMPORTPAYMENTSHEET.getRange(starting_row, 1, last_row, 8).getValues();
    var payments_map = new Map();
    payments_arr.forEach((e, i) => payments_map.set(e[0], [i + starting_row, e[2], e[3], e[4], e[5], e[6], e[7]]));
  }

  //so some cleaning
  payments_map.delete("");
  booking_map.delete("");

  //match payments to bookings
  let [payments_found_row, matches] = assign(booking_map, payments_map);

  //check id any of the found payments have already paid with a different payment id
  //make ID - PaymentID dict
  const bookingnr_paymentids = Object.fromEntries(booking_nr_arr.map((key, index) => [key, payment_ids[index]]));

  var dupl_payments = [];

  var payments_found_del_idx = []
  let i = 0;
  var booking_nr, dupl_payment_arr;
  for (let [match_row, value_array] of matches) {
    booking_nr = value_array.pop();
    if (bookingnr_paymentids.hasOwnProperty(booking_nr)) {
      if (bookingnr_paymentids[booking_nr] !== "" && bookingnr_paymentids[booking_nr] !== value_array[5]) {
        dupl_payment_arr = value_array;
        dupl_payment_arr.unshift(match_row);
        dupl_payment_arr.unshift(payments_found_row[i]);
        payments_found_del_idx.push(i)
        dupl_payments.push(dupl_payment_arr);
        matches.delete(match_row);
      }
    }
    i++;
  }

  //delete indices from payments_found_rows
  let indicesSet = new Set(payments_found_del_idx);
  payments_found_row = payments_found_row.filter((_, index) => !indicesSet.has(index));

  //Print stuff about duplicate payments
  if (dupl_payments.length > 0) {
    dupl_payments.forEach((e) => IMPORTPAYMENTSHEET.getRange(e[0], 3, 1, 6).setBackground(RED));
    dupl_payments.forEach((e) =>
      IMPORTPAYMENTSHEET.getRange(e[0], 2).setValue("Betrag mit unterschiedlicher ID bereits bezahlt")
    );
  }

  var msg = String(payments_found_row.length) + "/" + String(last_row - starting_row + 1) + " Buchungen zugeordnet";
  IMPORT_INFOCELL.setValue(msg);

  var keys_not_found = registerPayments(payment_string, matches);

  var assigned_elements = IMPORTPAYMENTSHEET.getRange(
    IMPORT_ASSIGNEDELEMENTSROW,
    IMPORT_ASSIGNEDELEMENTSCOL
  ).getValue();
  switch (assigned_elements) {
    case "markieren":
      payments_found_row.forEach((e) => IMPORTPAYMENTSHEET.getRange(e, 3, 1, 6).setBackground(GREEN));
      break;
    case "entfernen":
      payments_found_row.forEach((e) => IMPORTPAYMENTSHEET.deleteRow(e));
      break;
  }

  msg = "Buchungszuordnung erfolgreich.";
  if (keys_not_found.length > 0) {
    msg =
      msg + "Folgende LehrerID,KursID Paare konnten in den Lehrerdateien nicht gefunden werden:\\n\\n" + keys_not_found;
  }
  Browser.msgBox(msg);
  SpreadsheetApp.flush();

  if (payment_string == "office") {
    return;
  }

  updatePayments();

  return;
}

//matches are map with booking course_billing_row as key and [amount, date, paymentref] as value
function assign(booking_map, payments_map) {
  //all keyd on booking nr
  //let booking_dict = {"1":["kid1","tid1"], "2":["kid2", "tid2"], "3":["kid3", "tid3"], "4":["kid4", "tid4"], "5":["kid5", "tid5"]}
  //let payments_map = {"1":["row1","amount1", "date1", ..], "2":["row2","amount2", "date2", ..], "random":["row3","random", "random", ..]}

  let found_row = [];
  let matches = new Map();
  const booking_iter = booking_map.entries();
  let booking = booking_iter.next();
  var booking_nr, data_arr, match_array;

  //iterate over all bookings and look for matching payments
  while (!booking.done) {
    [booking_nr, data_arr] = booking.value;
    if (payments_map.has(booking_nr)) {
      found_row.push(payments_map.get(booking_nr)[0]);
      payments_map.get(booking_nr).shift();
      match_array = payments_map.get(booking_nr);
      match_array.push(booking_nr); //add matches booking_nr to array (needed to check for paymentID)
      matches.set(data_arr, match_array);
      booking_map.delete(booking_nr); //to avoid double payments
    }
    booking = booking_iter.next();
  }
  return [found_row, matches];
}

function registerPayments(payment_string, matches) {
  //deal with payments just registered in the coursetable first (admin fee, ass fees and office fee)
  //give teacherfile payments to TF
  var keys_not_found = [];
  switch (payment_string) {
    case "admin":
      registerPaymentsInCourseTable(COURSEBILLINGSHEET, BIL_ADMINADMOUNTCOL, BIL_ADMINFEEPAYMENTID, matches);
      break;
    case "payment1":
      keys_not_found = TF.registerPayment(matches, payment_string);
      setPaymentID(matches, BIL_PARTIALPAYMENT1ID);
      break;
    case "payment2":
      keys_not_found = TF.registerPayment(matches, payment_string);
      setPaymentID(matches, BIL_PARTIALPAYMENT2ID);
      break;
    case "payment3":
      keys_not_found = TF.registerPayment(matches, payment_string);
      setPaymentID(matches, BIL_PARTIALPAYMENT3ID);
      break;
    case "payment4":
      keys_not_found = TF.registerPayment(matches, payment_string);
      setPaymentID(matches, BIL_PARTIALPAYMENT4ID);
      break;
    case "saldo":
      keys_not_found = TF.registerPayment(matches, payment_string);
      setPaymentID(matches, BIL_PARTIALPAYMENT5ID);
      break;
    case "ass_vom":
      registerPaymentsInCourseTable(TEACHERBILLINGSHEET, TEA_VOMAMOUNTCOL, TEA_VOMPAYMENTID, matches);
      break;
    case "ass_maz":
      registerPaymentsInCourseTable(TEACHERBILLINGSHEET, TEA_MAZAMOUNTCOL, TEA_MAZPAYMENTID, matches);
      break;
    case "office":
      registerPaymentsInCourseTable(TEACHERBILLINGSHEET, TEA_OFFICEAMOUNTCOL, TEA_OFFICEPAYMENTID, matches);
      break;
  }
  return keys_not_found;
}

function setPaymentID(matches, paymentid_col) {
  var match_iter = matches.entries();
  let match = match_iter.next();
  var row, values, key;
  while (!match.done) {
    [key, values] = match.value;
    row = Array.isArray(key) ? key.slice(-1)[0] : key; //if key is array, take last element.
    COURSEBILLINGSHEET.getRange(row, paymentid_col).setValue(values[5]);

    match = match_iter.next();
  }
}

//key of matches is expected to be an array with one entry which is the row
function registerPaymentsInCourseTable(sheet, amount_col, paymentid_col, matches) {
  var match_iter = matches.entries();
  let match = match_iter.next();
  var row, values, values_row;
  while (!match.done) {
    [row, values] = match.value;
    values_row = [values[0], values[1], values[3] + ": " + values[2]];
    sheet.getRange(row, amount_col, 1, 3).setValues([values_row]);
    sheet.getRange(row, amount_col).setNumberFormat("[$€]#,##0.00");
    sheet.getRange(row, paymentid_col).setValue(values[5]);

    match = match_iter.next();
  }
}

function registerPreRegistrations()
{
  //read all col from import sheet
  let starting_row = IMPORTPAYMENTSHEET.getRange(IMPORT_STARGINGROW, IMPORT_STARTINGCOL).getValue();
  let last_row = IMPORTPAYMENTSHEET.getLastRow();

  var import_ids = IMPORTPAYMENTSHEET.getRange(starting_row, IMPORT_AUTOASSIGNMENTCOL, last_row-starting_row+1).getValues().flat()

  //read all student ids, keep dont delete any rows
  last_row = COURSEBILLINGSHEET.getLastRow()
  var student_ids = COURSEBILLINGSHEET.getRange(HEADERROW+1, STUDENTIDCOL, last_row-HEADERROW).getValues().flat()

  for (let i = 0; i < import_ids.length; i++) {
    var import_id = import_ids[i]
    var student_idx = student_ids.indexOf(import_id)
    if (student_idx == -1)
    {
      continue
    } 
    //set color field green
    var import_row = starting_row+i
    IMPORTPAYMENTSHEET.getRange(import_row, IMPORT_BANKAMOUNTCOL, 1, 6).setBackground(GREEN)

    //set box to checked
    var billing_row = HEADERROW+1+student_idx
    COURSEBILLINGSHEET.getRange(billing_row, BIL_PREREGCOL).setValue("TRUE")

    }  

}
