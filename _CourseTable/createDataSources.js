function createPayment1DataSource() {
  createPartialPaymentDataSource(1);
}
function createPayment2DataSource() {
  createPartialPaymentDataSource(2);
}
function createPayment3DataSource() {
  createPartialPaymentDataSource(3);
}
function createPayment4DataSource() {
  createPartialPaymentDataSource(4);
}

function createSaldoPaymentDataSourceTest() {
  createSaldoPaymentDataSource(true);
}

function createSaldoPaymentDataSourceNoTest() {
  createSaldoPaymentDataSource(false);
}

function createSaldoPaymentDataSourceIncludeAlreadyPaid() {
  createSaldoPaymentDataSource(true, true);
}

/**
 * Creates a data source that includes all courses.
 * Completed courses with 0 or 1 hours are ignored.
 *
 * @returns {void}
 */
function createCompleteDataDataSourse() 
{
  var year = Number(DATA.getYear());

  var static_headers = [];
  var static_values = [];
  var datasource_headers;
  var sheet_name =
    "Kursdaten_20" +
    String(year) +
    "_20" +
    String(year - 1) +
    "_Datenquelle_ " +
    Utilities.formatDate(new Date(), 'Europe/Vienna', "dd.MM.yyyy'_'HH:mm");
  datasource_headers = getDataSourceSaldoPaymentHeaders();

  var [headers, data_array] = loadAllPaymentCourseBillingTable();

  [headers, data_array] = mergeCourseTable(headers, data_array);

  [headers, data_array] = mergeTeacherTable(headers, data_array);

  [headers, data_array] = addAdminFee(headers, data_array);

  for (let i = 1; i <= 5; i++) {
    [headers, data_array] = addPayment(headers, data_array, static_headers, static_values, i);
  }
  // add price_per_hour, total hours and total_cost
  [headers, data_array] = addLessonsAmountDue(headers, data_array);

  [headers, data_array] = addSaldoPayment(headers, data_array);

  [headers, data_array] = addStaticFields(headers, data_array, static_headers, static_values);

  //--------------------------sanity check --------------------------
  if (data_array[0].length !== headers.length) {
    console.log("Fatal error: data length and headers length dont match");
    throw new Error("Fatal error: data length and headers length dont match");
  }

  //--------------------------make datasource file array --------------------------
  var [datasource_headers, datasource_array] = makeDataSourceArray(headers, data_array, datasource_headers);

  // --------------------------create datafile--------------------------
  createDataSourceFile(sheet_name, datasource_headers, datasource_array);


  return;
}

/**
 * Creates a data source for saldo payment.
 * Courses with 0 or 1 final hours are ignored.
 * Courses with Ausstellungsstatus "Saldo ausgestellt" are ignored.
 * The last payment is the saldo payment.
 *
 * @param {number} payment - The number of payments.
 * @returns {void}
 */
function createSaldoPaymentDataSource(is_test=true, includeAlreadyPaid=false) {
  var year = Number(DATA.getYear());

  var static_headers = [];
  var static_values = [];
  var datasource_headers;
  var sheet_name =
    "Saldozahlung_20" +
    String(year) +
    "_20" +
    String(year - 1) +
    "_Datenquelle_ " +
    Utilities.formatDate(new Date(), 'Europe/Vienna', "dd.MM.yyyy'_'HH:mm");
  datasource_headers = getDataSourceSaldoPaymentHeaders();

  var [headers, data_array] = loadSaldoPaymentCourseBillingTable(includeAlreadyPaid);

  [headers, data_array] = mergeCourseTable(headers, data_array);

  [headers, data_array] = mergeTeacherTable(headers, data_array);

  [headers, data_array] = addAdminFee(headers, data_array);

  for (let i = 1; i <= 5; i++) {
    [headers, data_array] = addPayment(headers, data_array, static_headers, static_values, i);
  }
  // add price_per_hour, total hours and total_cost
  [headers, data_array] = addLessonsAmountDue(headers, data_array);

  [headers, data_array] = addSaldoPayment(headers, data_array);

  [headers, data_array] = addStaticFields(headers, data_array, static_headers, static_values);

  //--------------------------sanity check --------------------------
  if (data_array[0].length !== headers.length) {
    console.log("Fatal error: data length and headers length dont match");
    throw new Error("Fatal error: data length and headers length dont match");
  }

  //--------------------------make datasource file array --------------------------
  var [datasource_headers, datasource_array] = makeDataSourceArray(headers, data_array, datasource_headers);

  // --------------------------create datafile--------------------------
  createDataSourceFile(sheet_name, datasource_headers, datasource_array);

  if (!is_test) {
    changeBillingStatusToSaldoSent(headers, data_array);
  }
  return;
}

function createPartialPaymentDataSource(payment) {
  var year = Number(DATA.getYear());

  var static_headers = [];
  var static_values = [];
  var datasource_headers;
  switch (payment) {
    case 1:
      var sheet_name = "1_Teilzahlung_20" + String(year) + "_20" + String(year - 1) + "_Datenquelle";
      static_headers.push("KdnNr_1_Tlz");
      static_values.push("");
      datasource_headers = getDataSourceFirstPaymentHeaders();
      break;
    case 2:
      var sheet_name = "2_Teilzahlung_20" + String(year) + "_20" + String(year - 1) + "_Datenquelle";
      static_headers.push("KdnNr_2_Tlz");
      static_values.push("");
      datasource_headers = getDataSourceSecondPaymentHeaders();
      break;
    case 3:
      var sheet_name = "3_Teilzahlung_20" + String(year) + "_20" + String(year - 1) + "_Datenquelle";
      static_headers.push("KdnNr_3_Tlz");
      static_values.push("");
      datasource_headers = getDataSourceThirdPaymentHeaders();
      break;
    case 4:
      var sheet_name = "4_Teilzahlung_20" + String(year) + "_20" + String(year - 1) + "_Datenquelle";
      static_headers.push("KdnNr_4_Tlz");
      static_values.push("");
      datasource_headers = getDataSourceFourthPaymentHeaders();
      break;

    case 5:
      var sheet_name = "5_Teilzahlung_20" + String(year) + "_20" + String(year - 1) + "_Datenquelle";
      static_headers.push("KdnNr_5_Tlz");
      static_values.push("");
      datasource_headers = getDataSourceFifthPaymentHeaders();
      break;
    default:
      console.log("Fatal error: payment number not valid");
      throw new Error("Fatal error: payment number not valid");
  }

  var [headers, data_array] = loadParialPaymentCourseBillingTable();

  [headers, data_array] = mergeCourseTable(headers, data_array);

  [headers, data_array] = mergeTeacherTable(headers, data_array);

  [headers, data_array] = addAdminFee(headers, data_array);

  for (let i = 1; i <= 5; i++) {
    [headers, data_array] = addPayment(headers, data_array, static_headers, static_values, i);
  }

  // add warning field
  [headers, data_array] = addTotalAmountDue(headers, data_array, payment);

  // TODO: expand units_dates to one date per field

  [headers, data_array] = addStaticFields(headers, data_array, static_headers, static_values);

  //--------------------------sanity check --------------------------
  if (data_array[0].length !== headers.length) {
    console.log("Fatal error: data length and headers length dont match");
    throw new Error("Fatal error: data length and headers length dont match");
  }

  //--------------------------make datasource file array --------------------------
  var [datasource_headers, datasource_array] = makeDataSourceArray(headers, data_array, datasource_headers);

  // --------------------------create datafile--------------------------
  createDataSourceFile(sheet_name, datasource_headers, datasource_array);
  return;
}

function loadAllPaymentCourseBillingTable()
{
  // --------------------------first read course billing table--------------------------
  var data_array_raw = COURSEBILLINGSHEET.getDataRange().getValues();
  // add row index to each row
  data_array_raw = data_array_raw.map((row, i) => row.concat([i + 1]));
  data_array_raw.splice(0, BIL_FIRST_DATAROW - 2);
  var bil_headers = data_array_raw.splice(0, 1).flat();

  //Filtering courses with 0 and 1 final hours (dont bill them)
  var data_array = data_array_raw.filter(
    (v) => !(v[BIL_FINALCOURSEHOURS - 1] !== "" && v[BIL_FINALCOURSEHOURS - 1] < ADMINFEEMINHOURS)
  );
  //rename last column to "row_index"
  bil_headers[bil_headers.length - 1] = "row_index";

  return [bil_headers, data_array];
}

function loadParialPaymentCourseBillingTable() {
  // --------------------------first read course billing table--------------------------
  var data_array_raw = COURSEBILLINGSHEET.getDataRange().getValues();
  data_array_raw.splice(0, BIL_FIRST_DATAROW - 2);
  var bil_headers = data_array_raw.splice(0, 1).flat();

  //Filtering courses with 0 and 1 final hours (dont bill them)
  var data_array = data_array_raw.filter(
    (v) => !(v[BIL_FINALCOURSEHOURS - 1] !== "" && v[BIL_FINALCOURSEHOURS - 1] < ADMINFEEMINHOURS)
  );

  //Skip courses where "billing status" is "abgeschlossen" as this isnt a partial payment anymore
  var data_array = data_array_raw.filter(
    (v) => !(v[BIL_BILLINGSTATUS - 1] !== "" && v[BIL_BILLINGSTATUS - 1] == BILLINGDONESTATUS)
  );

  return [bil_headers, data_array];
}

function loadSaldoPaymentCourseBillingTable(includeAlreadyPaid=false) {
  // --------------------------first read course billing table--------------------------
  var data_array_raw = COURSEBILLINGSHEET.getDataRange().getValues();
  // add row index to each row
  data_array_raw = data_array_raw.map((row, i) => row.concat([i + 1]));
  data_array_raw.splice(0, BIL_FIRST_DATAROW - 2);
  var bil_headers = data_array_raw.splice(0, 1).flat();

  //rename last column to "row_index"
  bil_headers[bil_headers.length - 1] = "row_index";

  //Select courses that are done (Verrechnungsstatus = abgeschlossen)
  //AND
  //Filter out courses where the final hours col is empty (unreliable results)
  //AND
  //
  //Select courses (with more than three hours and ) where the course payment status is "nicht bezahlt"
  //OR
  //Select courses with more than one hour and where the admin fee status is "nicht bezahlt" or "falscher Betrag"

  // TODO: Also consider that the the course is already paid (meaning no saldo is needed)
  //Actually, also keep the ones with less than 3 hours and where payment status is "nicht bezahlt", as the teacher usually has to pay somehing back
  if (!includeAlreadyPaid)  //exclude already paid
  {
    var data_array = data_array_raw.filter(
      (v) =>
        v[BIL_BILLINGSTATUS - 1] == BILLINGDONESTATUS && //course billing needs to be done
        v[BIL_FINALCOURSEHOURS - 1] !== "" && //final hourse should never be empty when billing is done
        //add course payments
        (v[BIL_PAIDSTATUS - 1] == PAYMENTSTATUSDUE || //this is missing course payment
        //add admin fees
          (v[BIL_FINALCOURSEHOURS - 1] >= ADMINFEEMINHOURS &&
            (v[BIL_ADMINFEESTATUSCOL - 1] == PAYMENTSTATUSDUE || //this is missing admin fee payment
              v[BIL_ADMINFEESTATUSCOL - 1] == PAYMENTSTATUSWRONGAMOUNT))) //this is wrong admin fee payment
    );
  }else
  {
    var data_array = data_array_raw.filter(
      (v) =>
        v[BIL_BILLINGSTATUS - 1] == BILLINGDONESTATUS && //course billing needs to be done
        v[BIL_FINALCOURSEHOURS - 1] !== "" && //final hourse should never be empty when billing is done
        //add course payments, dont include all of them and dont filter for payment status "nicht bezahlt"
        (v[BIL_PAIDSTATUS - 1] == PAYMENTSTATUSDUE ||  v[BIL_PAIDSTATUS - 1] == PAYMENTSTATUSPAIED || //this is missing course payment
        //add admin fees
          (v[BIL_FINALCOURSEHOURS - 1] >= ADMINFEEMINHOURS &&
            (v[BIL_ADMINFEESTATUSCOL - 1] == PAYMENTSTATUSDUE || //this is missing admin fee payment
              v[BIL_ADMINFEESTATUSCOL - 1] == PAYMENTSTATUSWRONGAMOUNT))) //this is wrong admin fee payment
    );
  }
  //Skip courses where "billing status" is NOT "abgeschlossen" as this isnt a partial payment anymore
  //var data_array = data_array_raw.filter((v) => v[BIL_BILLINGSTATUS - 1] == BILLINGDONESTATUS);

  return [bil_headers, data_array];
}

function mergeCourseTable(headers, data_array) {
  var course_data = COURSESHEET.getDataRange().getValues();
  var cou_lastrow = COURSESHEET.getLastRow();
  var course_data_courseids = COURSESHEET.getRange(COU_FIRST_DATAROW, COURSEIDCOL, cou_lastrow).getValues().flat();
  var cou_headers = course_data.splice(0, COU_FIRST_DATAROW - 1).flat();
  headers = headers.concat(cou_headers);
  for (let i = 0; i < data_array.length; i++) {
    var data_row = data_array[i];
    var course_data_idx = course_data_courseids.indexOf(data_row[COURSEIDCOL - 1]);
    if (course_data_idx == -1) {
      console.log("Fatal error: course ids dont match!", data_row[COURSEIDCOL - 1]);
      throw new Error("Fatal error: course ids dont match!", data_row[COURSEIDCOL - 1]);
    }
    data_array[i] = data_array[i].concat(course_data[course_data_idx]);
  }

  return [headers, data_array];
}

function mergeTeacherTable(headers, data_array) {
  var info_list = [
    "Vorname",
    "Nachname",
    "Anrede",
    "Email",
    "Verrechnungsservice",
    "Strasse, HausNR, Türe",
    "Plz",
    "Ort",
    "IBAN",
    "BIC",
    "Bank",
    "IBAN_MBS",
    "Tel",
    "Verrechnungsservice",
  ];
  var teacher_headers = [
    "Lehrername",
    "Anrede",
    "Email",
    "Verrechnungsservice",
    "Strasse, HausNR, Türe",
    "Plz",
    "Ort",
    "IBAN",
    "BIC",
    "Bank",
    "IBAN_MBS",
    "Tel",
    "Verrechnungsservice"
  ];
  headers = headers.concat(teacher_headers);

  var teacher_data = TT.getTeacherDataArray(info_list);

  for (var [teacher_id, row_data] of Object.entries(teacher_data)) {
    var teacher_name = row_data.splice(0, 2).join(" ");
    row_data.unshift(teacher_name);
  }

  for (let i = 0; i < data_array.length; i++) {
    var data_row = data_array[i];
    var teacher_id = data_row[TEACHERIDCOL - 1];
    if (!teacher_data.hasOwnProperty(teacher_id)) {
      console.log("Fatal error: teacher ids dont match!", data_row[TEACHERIDCOL - 1]);
      throw new Error("Fatal error: teacher ids dont match!", data_row[TEACHERIDCOL - 1]);
    }
    data_array[i] = data_array[i].concat(teacher_data[teacher_id]);
  }

  return [headers, data_array];
}

function addAdminFee(headers, data_array) {
  var adminfee_paid_idx = headers.indexOf("Betrag Regie");
  var adminfee_due_idx = headers.indexOf("fälliger Betrag Regie");
  var waived_idx = headers.indexOf("Beitrag erlassen");

  var duedate_string = DATESSHEET.getRange(DATES_ADMINFEEROW, 1).getValue();
  var duedate =
    duedate_string == ""
      ? ""
      : Utilities.formatDate(new Date(duedate_string), COURSETABLESS.getSpreadsheetTimeZone(), "dd.MM.yyyy");

  var adminfee_paid_amount = data_array.map((row) => (row[adminfee_paid_idx] == "" ? 0 : row[adminfee_paid_idx]));
  var adminfee_due_amount = data_array.map((row, idx) => (row[waived_idx] == "TRUE" ? 0 : row[adminfee_due_idx]));
  var adminfee_saldo_amount = adminfee_due_amount.map((val, i) => val - adminfee_paid_amount[i]);

  data_array = data_array.map((row, i) =>
    row.concat([adminfee_paid_amount[i], adminfee_due_amount[i], adminfee_saldo_amount[i]], duedate)
  );
  headers = headers.concat([
    "adminfee_paid_amount",
    "adminfee_due_amount",
    "adminfee_saldo_amount",
    "adminfee_duedate",
  ]);

  return [headers, data_array];
}

//add payments to data array (to allow processing of entry strings)
function addPayment(headers, data_array, static_headers, static_values, payment) {
  date_dict = {
    5: DATES_SALDOPAYMENT,
    4: DATES_PAYMENT4DATEROW,
    3: DATES_PAYMENT3DATEROW,
    2: DATES_PAYMENT2DATEROW,
    1: DATES_PAYMENT1DATEROW,
  };

  static_headers.push("tz" + payment + "_duedate");
  payment_duedate = DATESSHEET.getRange(date_dict[payment], 1).getValue();
  static_values.push(
    payment_duedate == ""
      ? ""
      : Utilities.formatDate(new Date(payment_duedate), COURSETABLESS.getSpreadsheetTimeZone(), "dd.MM.yyyy")
  );

  var tz_paid_idx = headers.indexOf("Betrag TZ" + String(payment));
  var tz_due_idx = headers.indexOf("fälliger Betrag TZ" + String(payment));
  var tz_date_idx = headers.indexOf("Datum TZ" + String(payment));

  //set paid_amount to 0 if empty
  var tz_paid_amount = data_array.map((row) => (row[tz_paid_idx] == "" ? "" : row[tz_paid_idx]));
  var tz_due_amount = data_array.map((row) => row[tz_due_idx]);
  var tz_date = data_array.map((row) =>
    row[tz_date_idx] == ""
      ? ""
      : Utilities.formatDate(new Date(row[tz_date_idx]), COURSETABLESS.getSpreadsheetTimeZone(), "dd.MM.yyyy")
  );

  // TODO: if payment is 4 add infra

  data_array = data_array.map((row, i) =>
    row.concat([tz_paid_amount[i], tz_due_amount[i], tz_date[i]], String(payment) + ". Quartal")
  );
  headers = headers.concat([
    "tz" + String(payment) + "_paid_amount",
    "tz" + String(payment) + "_due_amount",
    "tz" + String(payment) + "_date",
    "tz" + String(payment) + "_subj",
  ]);
  return [headers, data_array];
}

function addSaldoPayment(headers, data_array) {
  function calcTotalPaidAmount(headers, row) {
    //add up the total amount due and the total amount paid for all payments
    var total_paid_amount = 0;
    var tz_paid_idx;
    tz_paid_idx = headers.indexOf("tz5_paid_amount");
    total_paid_amount += row[tz_paid_idx] == "" ? 0 : parseFloat(row[tz_paid_idx]);
    tz_paid_idx = headers.indexOf("tz4_paid_amount");
    total_paid_amount += row[tz_paid_idx] == "" ? 0 : parseFloat(row[tz_paid_idx]);
    tz_paid_idx = headers.indexOf("tz3_paid_amount");
    total_paid_amount += row[tz_paid_idx] == "" ? 0 : parseFloat(row[tz_paid_idx]);
    tz_paid_idx = headers.indexOf("tz2_paid_amount");
    total_paid_amount += row[tz_paid_idx] == "" ? 0 : parseFloat(row[tz_paid_idx]);
    tz_paid_idx = headers.indexOf("tz1_paid_amount");
    total_paid_amount += row[tz_paid_idx] == "" ? 0 : parseFloat(row[tz_paid_idx]);

    return total_paid_amount;
  }
  // find latest payment that is not PAYMENTSTATUSNOTDUE
  var last_payment = Array(data_array.length).fill(0);
  for (let i = 5; i >= 0; i--) {
    var tz_due_idx = headers.indexOf("tz" + String(i) + "_due_amount");
    var tz_due_amount = data_array.map((row) => row[tz_due_idx]);

    //find payments with payment_due not equal to PAYMENTSTATUSNOTDUE and set row in last_payment to i
    //only do that if last_payment is not already set
    for (let j = 0; j < tz_due_amount.length; j++) {
      if (tz_due_amount[j] !== PAYMENTSTATUSNOTDUE) {
        if (last_payment[j] == 0) {
          last_payment[j] = i;
        }
      }
    }
  }
  var saldo_payment_reference_idxs = last_payment.map((row, i) => headers.indexOf("Buchungsnummer TZ" + row));
  var saldo_payment_reference = data_array.map((row, i) => row[saldo_payment_reference_idxs[i]]);
  var total_paid_amount = data_array.map((row) => calcTotalPaidAmount(headers, row));

  var total_due_amount_idx = headers.indexOf("total_due_lessons_amount");
  var total_due_amount = data_array.map((row) => row[total_due_amount_idx]);

  var saldo_due_amount = total_due_amount.map((_, index) => total_due_amount[index] - total_paid_amount[index]);

  headers = headers.concat(["total_paid_amount", "saldo_due_amount", "saldo_payment_reference"]);
  data_array = data_array.map((row, i) =>
    row.concat(total_paid_amount[i], [saldo_due_amount[i]], saldo_payment_reference[i])
  );

  return [headers, data_array];
}

function addLessonsAmountDue(headers, data_array) {
  var final_hours_idx = headers.indexOf("Finale Anz. Einheiten");
  var price_per_lesson = headers.indexOf("Preis pro Einheit");

  var final_hours = data_array.map((row) => row[final_hours_idx]);
  var price_per_lesson = data_array.map((row) => row[price_per_lesson]);

  //only if price_per_lesson is not empty multiply final_hours with price_per_lesson
  var saldo_due_amount = final_hours.map((val, i) => (price_per_lesson[i] == "" ? 0 : val * price_per_lesson[i]));

  headers = headers.concat(["total_due_lessons_amount"]);
  data_array = data_array.map((row, i) => row.concat([saldo_due_amount[i]]));

  return [headers, data_array];
}

function addTotalAmountDue(headers, data_array, payment) {
  function calcTotalAmount(headers, row) {
    //add up the total amount due and the total amount paid for all payments up to the current payment
    //use a switch case with fallthrough to add up all payments up to the current payment
    var total_due_amount = 0;
    var total_paid_amount = 0;
    switch (payment) {
      case 4:
        // TODO: Check if this works as intended
        // Here dont add up all payments but only the forth one as it is already a saldo
        tz_due_idx = headers.indexOf("tz4_due_amount");
        tz_paid_idx = headers.indexOf("tz4_paid_amount");
        total_due_amount += row[tz_due_idx] == PAYMENTSTATUSNOTDUE || row[tz_due_idx] == "" ? 0 : row[tz_due_idx];
        total_paid_amount += row[tz_paid_idx] == "" ? 0 : row[tz_paid_idx];
        break;
      case 3:
        tz_due_idx = headers.indexOf("tz3_due_amount");
        tz_paid_idx = headers.indexOf("tz3_paid_amount");
        total_due_amount += row[tz_due_idx] == PAYMENTSTATUSNOTDUE || row[tz_due_idx] == "" ? 0 : row[tz_due_idx];
        total_paid_amount += row[tz_paid_idx] == "" ? 0 : row[tz_paid_idx];
      case 2:
        tz_due_idx = headers.indexOf("tz2_due_amount");
        tz_paid_idx = headers.indexOf("tz2_paid_amount");
        total_due_amount += row[tz_due_idx] == PAYMENTSTATUSNOTDUE || row[tz_due_idx] == "" ? 0 : row[tz_due_idx];
        total_paid_amount += row[tz_paid_idx] == "" ? 0 : row[tz_paid_idx];
      case 1:
        tz_due_idx = headers.indexOf("tz1_due_amount");
        tz_paid_idx = headers.indexOf("tz1_paid_amount");
        total_due_amount += row[tz_due_idx] == PAYMENTSTATUSNOTDUE || row[tz_due_idx] == "" ? 0 : row[tz_due_idx];
        total_paid_amount += row[tz_paid_idx] == "" ? 0 : row[tz_paid_idx];
        break;
    }
    return total_due_amount - total_paid_amount;
  }

  var total_amount = data_array.map((row) => calcTotalAmount(headers, row));

  headers = headers.concat(["saldo_due_amount"]);
  data_array = data_array.map((row, i) => row.concat([total_amount[i]]));

  return [headers, data_array];
}

function addStaticFields(headers, data_array, static_headers, static_values) {
  headers = headers.concat(static_headers);
  data_array = data_array.map((row, i) => row.concat(static_values));
  return [headers, data_array];
}

function makeDataSourceArray(headers, data_array, data_source_headers) {
  var header_map = geColToHeaderMap();

  var data_index_array = [];
  for (let data_source_header of data_source_headers) {
    var mapped_header_name = header_map[data_source_header];
    data_index_array.push(headers.indexOf(mapped_header_name));
  }

  if (data_index_array.indexOf(-1) !== -1) {
    console.log("fatal error: header mapping failed.", data_index_array);
    throw new Error("fatal error: header mapping failed. " + String(data_index_array));
  }

  var datasource_array = [];
  for (let i = 0; i < data_array.length; i++) {
    var datasource_row = [];
    var data_row = data_array[i];

    for (let index of data_index_array) {
      datasource_row.push(data_row[index]);
    }

    datasource_array.push(datasource_row);
  }
  return [data_source_headers, datasource_array];
}

function createDataSourceFile(sheet_name, datasource_headers, datasource_array) {
  var ss = SpreadsheetApp.create(sheet_name);
  var file = DriveApp.getFileById(ss.getId());
  var folder = DriveApp.getFolderById(DATSOURCESFOLDERIS);
  file.moveTo(folder);
  var data_course_sheet = ss.getSheets()[0];
  data_course_sheet.setName("Datenquelle");

  //set data format for tel number to preserrve leading 0
  var string_col = datasource_headers.indexOf("S_Telefonnummer") + 1;
  data_course_sheet.getRange(2, string_col, datasource_array.length).setNumberFormat("@");

  data_course_sheet.getRange(1, 1, 1, datasource_headers.length).setValues([datasource_headers]);
  data_course_sheet.getRange(2, 1, datasource_array.length, datasource_array[0].length).setValues(datasource_array);

  number_to_string_headers = [
    "Regiebeitrag_fällig",
    "Regiebeitrag_bez",
    "Regiebeitrag_rest",
    "Gesamtbetrag",
    "1_Tlz_Betrag_fällig",
    "1_Tlz_Betrag_bez",
    "2_Tlz_Betrag_fällig",
    "2_Tlz_Betrag_bez",
    "3_Tlz_Betrag_fällig",
    "3_Tlz_Betrag_bez",
    "4_Tlz_Betrag_fällig",
    "4_Tlz_Betrag_bez",
    "5_Tlz_Betrag_fällig",
    "5_Tlz_Betrag_bez",
    "Saldobetrag",
    "Gesamtbetrag aus Unterricht",
    "Gesamtbetrag bezahlt",
    "Voraussichtl_Gesamtbetrag_fällig",
    "Gesamtbetrag_bezahlt",
    "Voraussichtl_Saldobetrag_fällig",
    "Lehrerdatei Gesamtbetrag Unterricht",
    "Lehrerdatei Gesamtbetrag bezahlt",
    "Lehrerdatei Saldobetrag fällig",
  ];

  to_string_headers = [
    "Regiebeitrag_Rechnungsdatum",
    "1_Tlz_Datum",
    "2_Tlz_Datum",
    "3_Tlz_Datum",
    "4_Tlz_Datum",
    "5_Tlz_Datum",
    "1_Tlz_Rechnungsdatum",
    "2_Tlz_Rechnungsdatum",
    "3_Tlz_Rechnungsdatum",
    "4_Tlz_Rechnungsdatum",
    "5_Tlz_Rechnungsdatum",
  ];

  number_to_4digits_headers = ["Rechnungsnummer_Lehrer"];
  number_to_string_precision_headers = ["Preis_pro_Einheit"];

  for (let header of number_to_string_precision_headers) {
    var col = datasource_headers.indexOf(header) + 1;
    if (col !== 0) {
      //two digits after decimal point for numbers and to string
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("0.0000");
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("@STRING@");
      var data = data_course_sheet.getRange(2, col, datasource_array.length).getValues();
      //replace "." with ","
      data = data.map((row) => row.map((val) => val.toString().replace(".", ",")));
      data_course_sheet.getRange(2, col, datasource_array.length).setValues(data);
    }
  }

  for (let header of number_to_string_headers) {
    var col = datasource_headers.indexOf(header) + 1;
    if (col !== 0) {
      //two digits after decimal point for numbers and to string
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("0.00");
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("@STRING@");
      var data = data_course_sheet.getRange(2, col, datasource_array.length).getValues();
      //replace "." with ","
      data = data.map((row) => row.map((val) => val.toString().replace(".", ",")));
      data_course_sheet.getRange(2, col, datasource_array.length).setValues(data);
    }
  }

  for (let header of to_string_headers) {
    var col = datasource_headers.indexOf(header) + 1;
    if (col !== 0) {
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("@STRING@");
    }
  }
  for (let header of number_to_4digits_headers) {
    var col = datasource_headers.indexOf(header) + 1;
    if (col !== 0) {
      data_course_sheet.getRange(2, col, datasource_array.length).setNumberFormat("0000");
    }
  }
}

function changeBillingStatusToSaldoSent(datasource_headers, datasource_array) {
  // change billing status to "Saldo ausgestellt"
  var billing_status_idx = datasource_headers.indexOf("Kursstatus");
  var row_index_idx = datasource_headers.indexOf("row_index");
  var row_index_array = datasource_array.map((row) => row[row_index_idx]);
  var billing_status_array = datasource_array.map((row) => row[billing_status_idx]);

  var new_billing_status_array = billing_status_array.map((status) => {
    if (status == COURSEBILLINGSENT) {
      return status;
    } else {
      return COURSEBILLINGSENT;
    }
  });
  //load old billing status array
  var billing_status_array = COURSEBILLINGSHEET.getRange(1, BIL_SALSOSENTSTATUSCOL, COURSEBILLINGSHEET.getLastRow(), 1)
    .getValues()
    .flat();

  //change billing status to new billing status
  for (let i = 0; i < row_index_array.length; i++) {
    var row_index = row_index_array[i];
    var new_billing_status = new_billing_status_array[i];
    var old_billing_status = billing_status_array[row_index - 1];
    if (old_billing_status == BILLINGNOTSENT) {
      billing_status_array[row_index - 1] = new_billing_status;
    }
  }

  //convert to correct format
  billing_status_array = billing_status_array.map(item => [item])

  //write new billing status to sheet
  COURSEBILLINGSHEET.getRange(1, BIL_SALSOSENTSTATUSCOL, billing_status_array.length, 1).setValues(
    billing_status_array
  );
}

function getDataSourceFirstPaymentHeaders() {
  var base_headers = getDataSourceBaseHeaders();
  var first_payment_headers = [
    "KdnNr_1_Tlz",
    "1TZ_Zahlungsreferenz",
    "1_Tlz_Betrag_fällig",
    "1_Tlz_Betrag_bez",
    "1_Tlz_Datum",
    "1_Tlz_Betreff",
    "1_Tlz_Rechnungsdatum",
  ];
  return base_headers.concat(first_payment_headers);
}

function getDataSourceSecondPaymentHeaders() {
  var base_headers = getDataSourceFirstPaymentHeaders();
  base_headers.splice(base_headers.indexOf("KdnNr_1_Tlz"), 1);
  base_headers.splice(base_headers.indexOf("1TZ_Zahlungsreferenz"), 1);
  var second_payment_headers = [
    "KdnNr_2_Tlz",
    "2TZ_Zahlungsreferenz",
    "2_Tlz_Betrag_fällig",
    "2_Tlz_Betrag_bez",
    "2_Tlz_Datum",
    "2_Tlz_Betreff",
    "2_Tlz_Rechnungsdatum",
  ];
  return base_headers.concat(second_payment_headers);
}

function getDataSourceThirdPaymentHeaders() {
  var base_headers = getDataSourceSecondPaymentHeaders();
  base_headers.splice(base_headers.indexOf("KdnNr_2_Tlz"), 1);
  base_headers.splice(base_headers.indexOf("2TZ_Zahlungsreferenz"), 1);
  var third_payment_headers = [
    "KdnNr_3_Tlz",
    "3TZ_Zahlungsreferenz",
    "3_Tlz_Betrag_fällig",
    "3_Tlz_Betrag_bez",
    "3_Tlz_Datum",
    "3_Tlz_Betreff",
    "3_Tlz_Rechnungsdatum",
  ];
  return base_headers.concat(third_payment_headers);
}

function getDataSourceFourthPaymentHeaders() {
  var base_headers = getDataSourceThirdPaymentHeaders();
  base_headers.splice(base_headers.indexOf("KdnNr_3_Tlz"), 1);
  base_headers.splice(base_headers.indexOf("3TZ_Zahlungsreferenz"), 1);
  var fourth_payment_headers = [
    "KdnNr_4_Tlz",
    "4TZ_Zahlungsreferenz",
    "4_Tlz_Betrag_fällig",
    "4_Tlz_Betrag_bez",
    "4_Tlz_Datum",
    "4_Tlz_Betreff",
    "4_Tlz_Rechnungsdatum",
    "Preis_pro_Einheit",
    "Voraussichtl_Einheiten",
    "Voraussichtl_Gesamtbetrag_fällig",
    "Gesamtbetrag_bezahlt",
    "Voraussichtl_Saldobetrag_fällig",
  ];
  return base_headers.concat(fourth_payment_headers);
}

function getDataSourceFifthPaymentHeaders() {
  var base_headers = getDataSourceFourthPaymentHeaders();
  base_headers.splice(base_headers.indexOf("KdnNr_4_Tlz"), 1);
  base_headers.splice(base_headers.indexOf("4TZ_Zahlungsreferenz"), 1);
  var fifth_payment_headers = [
    "KdnNr_5_Tlz",
    "5TZ_Zahlungsreferenz",
    "5_Tlz_Betrag_fällig",
    "5_Tlz_Betrag_bez",
    "5_Tlz_Datum",
    "5_Tlz_Betreff",
    "5_Tlz_Rechnungsdatum",
  ];
  return base_headers.concat(fifth_payment_headers);
}

function getDataSourceSaldoPaymentHeaders() {
  var base_headers = getDataSourceFifthPaymentHeaders();
  base_headers.splice(base_headers.indexOf("KdnNr_5_Tlz"), 1);
  base_headers.splice(base_headers.indexOf("5TZ_Zahlungsreferenz"), 1);
  var fifth_payment_headers = [
    "Finale Anz. Einheiten",
    "Preis pro Einheit",
    "Einheiten Datum",
    "Rechnungsnummer_Lehrer",
    "SaldoTZ_Zahlungsreferenz",
    "Gesamtbetrag aus Unterricht",
    "Gesamtbetrag bezahlt",
    "Saldobetrag",
    "Lehrerdatei Mom. Anz. Einheiten",
    "Lehrerdatei Gesamtbetrag Unterricht",
    "Lehrerdatei Gesamtbetrag bezahlt",
    "Lehrerdatei Saldobetrag fällig",
  ];
  return base_headers.concat(fifth_payment_headers);
}

function getDataSourceBaseHeaders() {
  return [
    "KursID",
    "SchuelerID",
    "LehrerID",
    "Modus",
    "Instrument",
    "Unterrichtsort",
    "Lehrer",
    "S_Vorname",
    "S_Zuname",
    "Re_Tit_Zuname",
    "Re_Adresse",
    "Re_Plz",
    "Re_Ort",
    "S_Wohngemeinde",
    "S_Email",
    "S_Telefonnummer",
    "S_Geburtsdatum",
    "Re_Email",
    "Kursstatus",
    "Kurs_Nr",
    "Vorangemeldet",
    "L_Anrede",
    "L_Tit_Vorname",
    "L_Zuname",
    "L_Adresse",
    "L_Plz",
    "L_Ort",
    "L_Verrechnungsservice",
    "IBAN",
    "BIC",
    "Bank",
    "L_Tel",
    "e-mail",
    "Regiebeitrag_Zahlungsreferenz",
    "Regiebeitrag_fällig",
    "Regiebeitrag_bez",
    "Regiebeitrag_rest",
    "Regiebeitrag_Rechnungsdatum",
    "Gesamtbetrag",
  ];
}

function geColToHeaderMap() {
  return {
    KursID: "KursID",
    SchuelerID: "SchuelerID",
    LehrerID: "LehrerID",
    KdnNr_1_Tlz: "KdnNr_1_Tlz",
    KdnNr_2_Tlz: "KdnNr_2_Tlz",
    KdnNr_3_Tlz: "KdnNr_3_Tlz",
    KdnNr_4_Tlz: "KdnNr_4_Tlz",
    KdnNr_5_Tlz: "KdnNr_5_Tlz",
    Modus: "Kursart",
    Instrument: "Instrument",
    Unterrichtsort: "Zweigstelle",
    Lehrer: "Lehrername",
    S_Vorname: "Schüler Vorname",
    S_Zuname: "Schüler Nachname",
    Re_Tit_Zuname: "Rechnungsname",
    Re_Adresse: "Rechnungsadresse",
    Re_Plz: "Rechnungs_PLZ",
    Re_Ort: "Rechnungsort",
    S_Wohngemeinde: "Wohngemeinde",
    S_Email: "EMail",
    S_Geburtsdatum: "Geburtsdatum",
    S_Telefonnummer: "Telefon_mobil",
    Re_Email: "Rechnungs_Mail",
    Kursstatus: "Kursstatus",
    Kurs_Nr: "Kursnummer",
    Vorangemeldet: "Vorangemeldet",
    "1_Tlz_Betrag_fällig": "tz1_due_amount",
    "2_Tlz_Betrag_fällig": "tz2_due_amount",
    "3_Tlz_Betrag_fällig": "tz3_due_amount",
    "4_Tlz_Betrag_fällig": "tz4_due_amount",
    "5_Tlz_Betrag_fällig": "tz5_due_amount",
    "1_Tlz_Betrag_bez": "tz1_paid_amount",
    "2_Tlz_Betrag_bez": "tz2_paid_amount",
    "3_Tlz_Betrag_bez": "tz3_paid_amount",
    "4_Tlz_Betrag_bez": "tz4_paid_amount",
    "5_Tlz_Betrag_bez": "tz5_paid_amount",
    "1_Tlz_Datum": "tz1_date",
    "2_Tlz_Datum": "tz2_date",
    "3_Tlz_Datum": "tz3_date",
    "4_Tlz_Datum": "tz4_date",
    "5_Tlz_Datum": "tz5_date",
    "1_Tlz_Betreff": "tz1_subj",
    "2_Tlz_Betreff": "tz2_subj",
    "3_Tlz_Betreff": "tz3_subj",
    "4_Tlz_Betreff": "tz4_subj",
    "5_Tlz_Betreff": "tz5_subj",
    "1_Tlz_Rechnungsdatum": "tz1_duedate",
    "2_Tlz_Rechnungsdatum": "tz2_duedate",
    "3_Tlz_Rechnungsdatum": "tz3_duedate",
    "4_Tlz_Rechnungsdatum": "tz4_duedate",
    "5_Tlz_Rechnungsdatum": "tz5_duedate",
    Gesamtbetrag_bezahlt: "Gesamtbetrag bezahlt",
    Voraussichtl_Einheiten: "Voraussichtl. Anz. Einheiten",
    Preis_pro_Einheit: "Preis pro Einheit",
    Voraussichtl_Gesamtbetrag_fällig: "Voraussichtl. Gesamtbetrag fällig",
    Voraussichtl_Saldobetrag_fällig: "Voraussichtl. Saldobetrag fällig",
    Gesamtbetrag: "saldo_due_amount",
    L_Anrede: "Anrede",
    L_Tit_Vorname: "Lehrer Vorname",
    L_Zuname: "Lehrer Nachname",
    L_Adresse: "Strasse, HausNR, Türe",
    L_Plz: "Plz",
    L_Ort: "Ort",
    IBAN: "IBAN",
    BIC: "BIC",
    Bank: "Bank",
    L_Tel: "Tel",
    "e-mail": "Lehrermail",
    "L_Verrechnungsservice": "Verrechnungsservice",
    Regiebeitrag_fällig: "adminfee_due_amount",
    Regiebeitrag_bez: "adminfee_paid_amount",
    Regiebeitrag_rest: "adminfee_saldo_amount",
    Regiebeitrag_Zahlungsreferenz: "Buchungsnummer_Regie",
    Regiebeitrag_Rechnungsdatum: "adminfee_duedate",
    "1TZ_Zahlungsreferenz": "Buchungsnummer TZ1",
    "2TZ_Zahlungsreferenz": "Buchungsnummer TZ2",
    "3TZ_Zahlungsreferenz": "Buchungsnummer TZ3",
    "4TZ_Zahlungsreferenz": "Buchungsnummer TZ4",
    "5TZ_Zahlungsreferenz": "Buchungsnummer TZ5",
    SaldoTZ_Zahlungsreferenz: "saldo_payment_reference",
    Rechnungsnummer_Lehrer: "Rechnungsnummer_Lehrer",
    "Einheiten Datum": "Einheiten_Datum",
    "Preis pro Einheit": "Preis pro Einheit",
    "Finale Anz. Einheiten": "Finale Anz. Einheiten",
    "Gesamtbetrag aus Unterricht": "total_due_lessons_amount",
    "Gesamtbetrag bezahlt": "total_paid_amount",
    Saldobetrag: "saldo_due_amount", //intentionally same as Gesamtbetrag, its a duplidate field
    "Lehrerdatei Mom. Anz. Einheiten": "Mom. Anz. Einheiten",
    "Lehrerdatei Gesamtbetrag Unterricht": "Gesamtbetrag Unterricht",
    "Lehrerdatei Gesamtbetrag bezahlt": "Gesamtbetrag bezahlt",
    "Lehrerdatei Saldobetrag fällig": "Saldobetrag fällig"
  };
}
