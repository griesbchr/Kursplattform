const TESTTEACHERIDS = ["142", "099", "174"]
function startCreatingOfficeInvoices()
{ 
  // IF THIS GETS TOO SLOW THEN SPEED UP IS POSSIBLE BY GENERATING ALL QR CODES IN PARALLEL WITH FETCHALL 
  // Reminder to set Faellig_datum, Rechnungsdatum and Rechnung_deadline in the TeacherInvoice Code file
  if (!confirmDatesSet()) {
    return;
  }

  // Get Schuljahr from sonstiges
  var current_billing_year = DATESSHEET.getRange(DATES_BILLCYCLEROW, 1).getValue();
  var current_year = "20"+current_billing_year-1+"/20"+current_billing_year

  // Set officero billing numbers
  setOfficeroBillingNumbes()

  // Get data from table
  var teacher_data_array_raw =  TEACHERBILLINGSHEET.getDataRange().getValues()
  var teacher_data_headers = teacher_data_array_raw[HEADERROW-1]
  var teacher_data_array = teacher_data_array_raw.slice(HEADERROW)
  var teacher_data = {}

  const numberFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal', // Use 'decimal' to avoid currency symbols from formatter
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
//"Buchungsnummer": "L142253",
//"Officero Rechnungsnummer": "1", 
//"fälliger Betrag": "€12,00",
//"Anz. Schüler": "1",
//"Schuljahr": "2024/2025",
  for (var i=0; i<teacher_data_array.length; i++)
  {
    if (TESTTEACHERIDS.includes(teacher_data_array[i][TEA_IDCOL-1]))
    {
      continue
    }
    var data_dict = {}
    data_dict[teacher_data_headers[TEA_OFFICEBOOKINGNUMBERCOL-1]] = teacher_data_array[i][TEA_OFFICEBOOKINGNUMBERCOL-1]
    data_dict[teacher_data_headers[TEA_OFFICEROINVOICENUMBERCOL-1]] = teacher_data_array[i][TEA_OFFICEROINVOICENUMBERCOL-1]
    data_dict[teacher_data_headers[TEA_OFFICEAMOUNTDUECOL-1]] = "€"+numberFormatter.format(teacher_data_array[i][TEA_OFFICEAMOUNTDUECOL-1])
    data_dict[teacher_data_headers[TEA_NUMSTUDENTSCOL-1]] = teacher_data_array[i][TEA_NUMSTUDENTSCOL-1]
    data_dict["Schuljahr"] = current_year
                    
    teacher_data[teacher_data_array[i][TEA_IDCOL-1]] = data_dict

  }
  // Create Invoices
  TI.createOfficeInvoices(teacher_data) 

  Browser.msgBox("Officero Invoices wurden erfolgreich erstellt")
  console.log("Officero Invoices wurden erfolgreich erstellt")

}

function confirmDatesSet() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Bitte bestätigen",
    "Wurden Faellig_datum, Rechnungsdatum und Rechnung_deadline in _TeacherInvoice gesetzt?",
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    return true;
  } else {
    return false;
  }
}

function setOfficeroBillingNumbes()
{
  var last_row = TEACHERBILLINGSHEET.getLastRow()
  var teacher_ids = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_IDCOL, last_row - HEADERROW).getValues()
  var billingnumbers = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_OFFICEROINVOICENUMBERCOL, last_row - HEADERROW).getValues()

  var billing_number = 1
  for (var i=0; i<teacher_ids.length; i++)
  {
    if (TESTTEACHERIDS.includes(teacher_ids[i][0]))
    {
      continue
    }
    billingnumbers[i][0] = billing_number
    billing_number += 1
  }

  TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_OFFICEROINVOICENUMBERCOL, last_row - HEADERROW).setValues(billingnumbers)
}

function sendOfficeInvoices()
{

  // TODOO CHANGE FOLDER ID EACH YEAR
  var folder_id = "1mTNNvuT5a9Rg1gOQfzUUHsnvFAb9O5e8"

  // Get Schuljahr from sonstiges
  var current_billing_year = DATESSHEET.getRange(DATES_BILLCYCLEROW, 1).getValue();
  var current_year = "20"+current_billing_year-1+"/20"+current_billing_year

  TI.sentOfficeroInvoices(folder_id, current_year)

}

function sendOfficeInvoicesHelp()
{
  Browser.msgBox("Bitte manuell unter CourseTable -> sendOfficeInvoices starten. \n\n Nicht vergessen folder_id zu Folder mit pdf invoices ausbessern!!!")
}


function sendOfficeroInvoiceReminder()
{
  // TODOO CHANGE FOLDER ID EACH YEAR
  var folder_id = "1mTNNvuT5a9Rg1gOQfzUUHsnvFAb9O5e8"

  var teacher_ids_not_paid = []
  var payment_refs = []
  var due_amounts = []
  var last_row = TEACHERBILLINGSHEET.getLastRow()
  var teacher_ids = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_IDCOL, last_row - HEADERROW).getValues().flat()
  var amount_paid_col = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_OFFICEAMOUNTCOL, last_row - HEADERROW).getValues().flat()  
  var amount_due_col = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_OFFICEAMOUNTDUECOL, last_row - HEADERROW).getValues().flat()
  var payment_ref_col = TEACHERBILLINGSHEET.getRange(HEADERROW+1, TEA_OFFICEBOOKINGNUMBERCOL, last_row - HEADERROW).getValues().flat() 

  for (var i=0; i<teacher_ids.length; i++)
  {
    if (TESTTEACHERIDS.includes(teacher_ids[i][0]))
    {
      continue
    }

    if ((amount_paid_col[i] == "") && (amount_due_col != "") && (amount_due_col != "0"))
    {
      teacher_ids_not_paid.push(teacher_ids[i])
      payment_refs.push(payment_ref_col[i])
      due_amounts.push(amount_due_col[i])
    }
  }

    var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    "Bitte bestätigen",
    "Sollen " + String(teacher_ids_not_paid.length) + " Zahlungserinnerungen versendet werden? \n\n Nicht vergessen folder_id zu Folder mit pdf invoices ausbessern!!!",
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    return TI.sentOfficeroInvoiceReminders(teacher_ids_not_paid, payment_refs, due_amounts, folder_id);
  } else {
    return;
  }
}

