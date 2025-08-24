function startCreatingInvoices()
{
  //check if source file id is set
  var script_props = PropertiesService.getScriptProperties()
  if (script_props.getProperty(SOURCEFILEID_KEY) == null)
  {
    console.log("Bitte zuerst Datenquelle auswählen!")
    return
  }

  if (script_props.getProperty(TEACHER_ID_QUEUE_KEY) != null)
  {
  	console.log("Erstellungsprozess bereits gestartet!")
    return
  }

  //load data
  var teacher_courses_data = loadCourseData(script_props.getProperty(SOURCEFILEID_KEY))


  //create script properties 
  var teacher_ids = Object.keys(teacher_courses_data)
  script_props.setProperty(TEACHER_ID_QUEUE_KEY,  JSON.stringify(teacher_ids))
  script_props.setProperty(TEACHER_ID_DONE_KEY, JSON.stringify([]))

  //register trigger 
  registerInvoiceTrigger()

  //create sheet creation date
  var creationDate = DriveApp.getFileById(script_props.getProperty(SOURCEFILEID_KEY)).getDateCreated();
  var invoice_folder_name = Utilities.formatDate(creationDate, "Europe/Vienna", 'dd.MM.yyyy');
  var target_folder_id = getOrCreateFolder(TEACHERINVOICESFOLDERID, invoice_folder_name)
  console.log("Erstellungsprozess gestartet.")
}


function printProgressStatement()
{
  var script_props = PropertiesService.getScriptProperties()

  if (script_props.getProperty(TEACHER_ID_QUEUE_KEY) == null)
  {
    Browser.msgBox("Momentan läuft kein Erstellungsprozess. Entweder abgeschlossen oder nicht gestartet.")
    return
  }
  var teacher_id_queue_string = script_props.getProperty(TEACHER_ID_QUEUE_KEY)
  var teacher_id_queue = JSON.parse(teacher_id_queue_string)

  var teacher_id_done_string = script_props.getProperty(TEACHER_ID_DONE_KEY)
  var teacher_id_done = JSON.parse(teacher_id_done_string)

  Browser.msgBox("Anzahl an erstellten Lehrerabrechnungen: " + teacher_id_done.length + "\\nAnzahl an Lehrerabrechnungen in der Warteschlange: "+teacher_id_queue.length)
  return
}

function loadPDFLib()
{
  // Load pdf-lib
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
  eval(UrlFetchApp.fetch(cdnjs).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, "Utilities.sleep($1);return t();"));
}

//loads course data given a saldopayment file
//returns object with key teacher id, each key has a list of courses (courses is dict with course infos)
function loadCourseData(file_id)
{
  //file_id = "1EA8cKhwCSFqrEpjxJ8ZPir21ZyK_HjjGAsAtq_3bzCw"

  var data_ss = SpreadsheetApp.openById(file_id)
  var data_range = data_ss.getSheets()[0].getDataRange()
  var data = data_range.getValues()

  //get sheet creation date
  var creationDate = DriveApp.getFileById(file_id).getDateCreated();
  var formattedDate = Utilities.formatDate(creationDate, "Europe/Vienna", 'dd.MM.yyyy');
  var curr_year = Utilities.formatDate(creationDate, "Europe/Vienna", 'yyyy');
  var course_year = String(Number(curr_year)-1) + "/"+curr_year
  var headers = data[0]

  data = data.slice(1)

  var teacher_course_dict = {}
  var course_dict
  for (var data_row of data)
  {
    course_dict = {}
    data_row.map((v, i) => course_dict[headers[i]] = v) 
    course_dict["creation_date"] = formattedDate
    course_dict["course_year"] = course_year
    for (var field_name of  CURRENCYFIELDS)
    {
      if (course_dict[field_name] === "" || course_dict[field_name] === "nicht verrechnet"){course_dict[field_name] = "-,-"}
    }
    course_dict["Preis pro Einheit"] = course_dict["Preis pro Einheit"].toFixed(3)
    if (course_dict[TEACHERIDFIELDNAME] in teacher_course_dict)
    {
      teacher_course_dict[course_dict[TEACHERIDFIELDNAME]].push(course_dict)
    } else
    {
      teacher_course_dict[course_dict[TEACHERIDFIELDNAME]] = [course_dict]
    }
    
  }
  return teacher_course_dict
}

//returns folder id of folder with specified name in specified super folder. 
//creates new folder if it doesnt exist
function getOrCreateFolder(folder_id, folder_name)
{
  var invoice_super_folder = DriveApp.getFolderById(folder_id)
  
  //check if folder with specified name exists
  var folder_iter = invoice_super_folder.getFoldersByName(folder_name)

  if (folder_iter.hasNext()) {return folder_iter.next().getId()}
  
  return invoice_super_folder.createFolder(folder_name).getId()
}

//creates all invoices files
function createNextInvoices()
{
  var script_props = PropertiesService.getScriptProperties()
  var file_id = script_props.getProperty(SOURCEFILEID_KEY)
  console.log("loading data from file")
  var teacher_courses_data = loadCourseData(file_id)
  console.log("finished loading data from file")
  loadPDFLib()
  
  //get sheet creation date
  var creationDate = DriveApp.getFileById(file_id).getDateCreated();
  var invoice_folder_name = Utilities.formatDate(creationDate, "Europe/Vienna", 'dd.MM.yyyy');
  var target_folder_id = getOrCreateFolder(TEACHERINVOICESFOLDERID, invoice_folder_name)

  
  while (JSON.parse(script_props.getProperty(TEACHER_ID_QUEUE_KEY)).length > 0)
  { 
    //get next teacher id
    var open_ids_string = script_props.getProperty(TEACHER_ID_QUEUE_KEY)
    var open_ids = JSON.parse(open_ids_string)
    var curr_id = open_ids.splice(0, 1)[0]

    //create invoice
    createTeacherInvoices(curr_id, teacher_courses_data, target_folder_id)
    
    //set script props
    script_props.setProperty(TEACHER_ID_QUEUE_KEY, JSON.stringify(open_ids))
    var new_done_list = JSON.parse(script_props.getProperty(TEACHER_ID_DONE_KEY))
    new_done_list.push(curr_id)
    script_props.setProperty(TEACHER_ID_DONE_KEY, JSON.stringify(new_done_list))
    console.log("Done with teacher id " + curr_id)
  }

  //list empty, sent finish mail
  GmailApp.sendEmail("christoph.griesbacher@kursplattform.at", "Lehrerabrechnung erstellt", "Lehrerabrechnung erstellt");
  GmailApp.sendEmail("griesbacher@kursplattform.at", "Lehrerabrechnung erstellt", "Lehrerabrechnung erstellt");

  cleanUpInvoiceTrigger()

  cleanUpFilesInFolder(TEMPFOLDERID, "temp")
  cleanUpFilesInFolder(TEMPLATESFOLDERID, "temp")
  cleanUpFilesInFolder(TEMPLATESFOLDERID, "Kopie von Lehrerrechnung_Template")

  //clean up script props
  script_props.deleteProperty(TEACHER_ID_QUEUE_KEY)
  script_props.deleteProperty(TEACHER_ID_DONE_KEY)
  script_props.deleteProperty(TRIGGER_ID_KEY)

}

function cleanUpFilesInFolder(folder_id, filename)
{

  // Get the folder by ID
  const folder = DriveApp.getFolderById(folder_id);
  
  // Get all files in the folder
  const files = folder.getFiles();
  let filesDeleted = 0;

  // Loop through the files and delete those named "temp"
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName() === filename) {
      file.setTrashed(true); // Moves the file to the trash
      filesDeleted++;
      Logger.log('Deleted file: ' + file.getName());
    }
  }

  if (filesDeleted > 0) {
    Logger.log(filesDeleted + ' files named '+filename+' deleted in folder '+folder.getName()+'.');
  } else {
    Logger.log('No files named '+filename+' found in the folder '+folder.getName()+'.');
  }
}
function testmail()
{
    GmailApp.sendEmail("christoph.griesbacher@kursplattform.at", "Lehrerabrechnung erstellt", "Lehrerabrechnung erstellt");

}

function testCreateTeacherInvoice()
{
  var teacher_id = "131"
  var source_file_id = "1t8Dtt7VJDP0m5EUbgqDFvVpcyzeCNjW8_ZhkBZLPTDY"
  var target_folder_id = "1hXoFf8pDjFFXFlgjPMXlBovis90IwnKz"
  var teacher_courses_data = loadCourseData(source_file_id)
  createTeacherInvoices(teacher_id, teacher_courses_data, target_folder_id)

}


function createTeacherInvoices(teacher_id, teacher_courses_data, target_folder_id)
{
  Logger.log("[TIHandler] Creating invoices for teacher with id " + teacher_id)
  
  teacher_id = parseInt(teacher_id, 10)
  if (!(teacher_id in teacher_courses_data))
  {
    console.warn("[TIHandler] No courses found for teacher with id " + teacher_id)
    return
  }

  var coursedata_array = teacher_courses_data[teacher_id]

  var docs_array = []
  //loop through course data to generate one pdf for each course
  var i = 0;
  for (var course_data of coursedata_array)
  {
    i++;
    console.log("creating invoice " + i + "/"+coursedata_array.length + " for teacher id " + teacher_id)
    docs_array.push(createInvoiceDoc(course_data))
  }
  var teacher_id_string = String(coursedata_array[0]["LehrerID"])
  teacher_id_string = teacher_id_string.padStart(3, "0")
  var file_name = "Jahresabrechnung_"+ teacher_id_string +"_"+ coursedata_array[0]["L_Zuname"]+"_"+coursedata_array[0]["creation_date"]
  
  var merged_doc = DriveApp.getFileById(mergeGoogleDocs(docs_array, target_folder_id).getId())

  // Convert the merged document to PDF
  
  const pdfBlob = merged_doc.getAs(MimeType.PDF);
  merged_doc.setTrashed(true)

  // Save the PDF to your Drive
  const pdfFile = DriveApp.createFile(pdfBlob)
  .setName(file_name+'.pdf')
  .moveTo(DriveApp.getFolderById(target_folder_id));
}

function mergeGoogleDocs(docs_array) {

  var baseDoc = DocumentApp.create("temp");
  DriveApp.getFileById(baseDoc.getId()).moveTo(DriveApp.getFolderById(TEMPFOLDERID))
  var body = baseDoc.getBody();
  
  var source_body = docs_array[0].getBody() 
  body.setPageHeight(595.276).setPageWidth(841.89);
  body.setMarginBottom(source_body.getMarginBottom())
  body.setMarginLeft(source_body.getMarginLeft())
  body.setMarginRight(source_body.getMarginRight())
  body.setMarginTop(source_body.getMarginTop())

  for (var doc of docs_array) {
    var otherBody = doc.getBody();
    var totalElements = otherBody.getNumChildren();
    for (var j = 0; j < totalElements; ++j) {
      var element = otherBody.getChild(j).copy();
      var type = element.getType();
      if (type == DocumentApp.ElementType.PARAGRAPH) {
        var cp = element.asParagraph();
        var positionedImages = cp.getPositionedImages();
        if (positionedImages.length > 0) {
          var img = positionedImages[0];
          var { id, blob, width, height, layout, leftOffset, topOffset } = { id: img.getId(), blob: img.getBlob(), width: img.getWidth(), height: img.getHeight(), layout: img.getLayout(), leftOffset: img.getLeftOffset(), topOffset: img.getTopOffset() };
          cp.removePositionedImage(id);
          var p = body.appendParagraph(cp);
          p.addPositionedImage(blob)
            .setWidth(width)
            .setHeight(height)
            .setLayout(layout)
            .setLeftOffset(leftOffset)
            .setTopOffset(topOffset);
        } else {
          body.appendParagraph(element);
        }
      } else if (type == DocumentApp.ElementType.TABLE) {
        body.appendTable(element);
      } else if (type == DocumentApp.ElementType.LIST_ITEM) {
        body.appendListItem(element);
      } else if (type == DocumentApp.ElementType.INLINE_IMAGE) {
        var image = element.asInlineImage();
        var blob = image.getBlob();
        var imageFile = folder.createFile(blob);
        combinedDoc.getBody().appendImage(imageFile.getBlob());
      } else {
        throw new Error('Unknown element type: ' + type);
      }
    }

    body.appendPageBreak();

    //trash temp file
    DriveApp.getFileById(doc.getId()).setTrashed(true)
  }

  baseDoc.saveAndClose()

  //trash temp files

  return baseDoc
}


//takes a single invoice document corresponsing to a single course
function createInvoiceDoc(coursedata) {
  
  var filename = "temp"
  var docfile = DriveApp.getFileById(INVOICETEMPLATEFILEID)
                .makeCopy()
                .setName(filename)

  var doc_id = docfile.getId()
  var doc = DocumentApp.openById(doc_id)
  var docBody = doc.getBody();

  //replace text
  for (var key in SALDOPAYMENTTOFIELDNAMEMAP)
  {
    docBody.replaceText(key, coursedata[SALDOPAYMENTTOFIELDNAMEMAP[key]])
  }

  //check if any placeholders are left
  if (doc.getBody().getText().indexOf("<<") !== -1)
  {
    Logger.log("[TIHandler] Warning when creating a contract form: text still contains '<<' after text replacement")
  }
  
  // Save the modified Google Docs file
  doc.saveAndClose()
  
  doc_file = DriveApp.getFileById(doc_id).moveTo(DriveApp.getFolderById(TEMPFOLDERID));
  
  return doc
}
