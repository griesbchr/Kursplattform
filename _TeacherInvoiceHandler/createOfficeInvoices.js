function createOfficeInvoices(teacher_data_dict) 
{
  // IF THIS GETS TOO SLOW THEN SPEED UP IS POSSIBLE BY GENERATING ALL QR CODES IN PARALLEL WITH FETCHALL 
  var today = new Date();
  var invoice_folder_name = Utilities.formatDate(today, "Europe/Vienna", 'dd.MM.yyyy');
  var target_folder_id = getOrCreateFolder(OFFICEINVOICEFOLDERID, invoice_folder_name)  
  var docs_folder_id = getOrCreateFolder(target_folder_id, "Google Docs Invoices")  
  var info_list = ["Anrede", "Vorname", "Nachname", "Strasse, HausNR, Türe", "Plz", "Ort"]
  var teacher_info_dict = TT.getTeacherDataArray(info_list)

  // dict value data: [Buchungsnummer, fälliger Betrag, Anz. Schüler]
  //var teacher_data_dict = { 142: {"Buchungsnummer": "L142253",
  //                                "Officero Rechnungsnummer": "1", 
  //                                "fälliger Betrag": "€12,00",
  //                                "Anz. Schüler": "1",
  //                                "Schuljahr": "2024/2025",
  //                                "Rechnung_deadline": "",
  //                                "Faellig_datum": "",
  //                                "Rechnungsdatum": "",
  //                                }
  //                        }
  const numberFormatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal', // Use 'decimal' to avoid currency symbols from formatter
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  var per_student_cost = "€"+numberFormatter.format(DATA.getCourseParameterDict()["Büroservice"])


  for (var teacher_id in teacher_data_dict)
  {
    var teacher_infos = teacher_info_dict[teacher_id]
    var teacher_data = teacher_data_dict[teacher_id]
    info_list.forEach((key, i) => {teacher_data[key] = teacher_infos[i];});

    console.log("starting teacher " +teacher_id + "_" + teacher_data["Nachname"])

    // Add additional fields to data_dict
    teacher_data["Gesamtbetrag_Zahl"] = parseFloat(teacher_data["fälliger Betrag"].replace("€", "").replace(",", "."));
    teacher_data["LehrerID"] = teacher_id
    //TODO create billing number
    teacher_data["Rechnungsnummer"] = teacher_data["Officero Rechnungsnummer"] + "_" + teacher_data["Buchungsnummer"]
    teacher_data["Betrag_pro_Schueler"] = per_student_cost
    teacher_data["Adresse1"] = teacher_data["Strasse, HausNR, Türe"]
    teacher_data["Adresse2"] = teacher_data["Plz"] + " " + teacher_data["Ort"]
    teacher_data["L_Name"] = teacher_data["Anrede"] + " " + teacher_data["Vorname"] + " " + teacher_data["Nachname"]
    teacher_data["Paymentref"] = teacher_data["Buchungsnummer"] + " Bueroservicebeitrag"
    teacher_data["Rechnungsdatum"] = OFFICERORECHNUNGSDATUM
    teacher_data["Faellig_datum"] = OFFICERORECHNUNGFAELLIGDATUM
    teacher_data["Rechnung_deadline"] = OFFICEROZAHLUNGSDEADLINE


    // Create docs and pdf invoices  
    createOfficeInvoice(teacher_data, target_folder_id, docs_folder_id)
  }
  
}


//takes a single invoice document corresponsing to a single course
function createOfficeInvoice(data_dict, target_folder_id, docs_folder_id) {
  
  var filename = "Büroservice_Honorarnote_" + data_dict["LehrerID"] + "_" + data_dict["Nachname"] + "_" + data_dict["Rechnungsnummer"]
  var docfile = DriveApp.getFileById(OFFICEINVOICETEMPLATEFILEID)
                .makeCopy()
                .setName(filename)

  var doc_id = docfile.getId()
  var doc = DocumentApp.openById(doc_id)
  var docBody = doc.getBody();

  //replace text
  for (var key in OFFICEINVOICEFIELDNAMEMAP)
  {
    var data_dict_key = OFFICEINVOICEFIELDNAMEMAP[key]
    var data_dict_value = data_dict[data_dict_key]
    docBody.replaceText(key, data_dict_value)
  }

  // replace QR Code
  insertQrCodeIntoTable("<<QRCode>>", doc_id, OFFICEROBANKNAME, OFFICEROIBAN, data_dict["Gesamtbetrag_Zahl"], OFFICEROBIC, OFFICEROTRANSACTIONMESSAGE, data_dict["Paymentref"]);
  
  // Save the modified Google Docs file
  doc.saveAndClose()
  
  doc_file = DriveApp.getFileById(doc_id).moveTo(DriveApp.getFolderById(docs_folder_id));
  
  // Convert the merged document to PDF
  const pdfBlob = doc_file.getAs(MimeType.PDF);

  // Save the PDF to your Drive
  const pdfFile = DriveApp.createFile(pdfBlob)
  .setName(filename+'.pdf')
  .moveTo(DriveApp.getFolderById(target_folder_id));

  return doc
}

