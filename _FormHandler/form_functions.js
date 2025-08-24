function createPrefilledForm(id)
{
  Logger.log("[FH]Creating prefilled form for teacher id " + id)
  var TEACHERNAME_QNR = 7

  //Get teacher id item
  var items = REGFORM.getItems();
  var teacher_name_item = items[TEACHERNAME_QNR].asListItem()

  var teacher_names = TT.getAllActiveTeacherFullNames()

  //Logger.log("teacher_name_choices duplicates")
  //Logger.log(findDuplicates(teacher_names))

  var teacher_name_choices = teacher_names.map((v) => teacher_name_item.createChoice(v))
  //Logger.log("teacher_name_choices")
  //for (let choice of teacher_name_choices)
  //{
  //  Logger.log(choice.getValue())
  //}
  teacher_name_item.setChoices(teacher_name_choices)

  //create item choices
  try{
    var choice = TT.getTeacherFullName(id)
  } catch(error){
    return REGFORM.getPublishedUrl()
  }
  //Logger.log("teacher id is " + id)

  //create item response
  teacher_name_item_respose = teacher_name_item.createResponse(choice)

  //create form response
  var form_response = REGFORM.createResponse();

  //add response item to form 
  form_response.withItemResponse(teacher_name_item_respose);

  var prefilled_url = form_response.toPrefilledUrl()
  

  return prefilled_url
}

function handleFormSubmit(response)
{
  //Logger.log("form response event")
  //Logger.log(Object.entries(response))
  //convert response to student-like object
  //Logger.log(response["Vorname SchülerIn"])
  var course_type
  switch (response["Kursart"])
  {
    case "Basic":
      course_type = "BASIC"
      break;
    case "Plus":
      course_type = "PLUS"
      break;
    case "QV":
      course_type = "QV"
      break;
    case "Plus/QV Kumberg":
      course_type = "PLUS/QV"
      break;
    case "Noch nicht besprochen":
      course_type = ""
      break;
    default: 
      course_type = ""
  }

student = {
  "S_Vorname": response["SchülerIn Vorname "],
  "S_Nachname": response["SchülerIn Nachname"],
  "Instrument": response["Instrument"],
  "Rechnungsname":response["Vorname, Nachname (für Zusendung der Rechnung)"],
  "Rechnungsadresse": response["Straße, Hausnummer, Stock, Türe (für Zusendung der Rechnung)"],
  "Rechnungsort": response["Ort (für Zusendung der Rechnung)"],
  "Rechnungs_PLZ":response["PLZ (für Zusendung der Rechnung)"],
  "Wohngemeinde": response["Wohngemeinde"],
  "Telefon_Vormittag": response["Telefonnummer am Vormittag"],
  "Telefon_mobil":response["Telefonnummer mobil"],
  "Rechnungs_Mail": response["E-Mail Adresse (für Zusendung der Rechnung)"],
  "Geburtsdatum": new Date(response["Geburtsdatum"]).toLocaleDateString('de-AT'),
  "Schule_Klasse": response["Unterrichtsort / Schule"] + " " + response["Schulklasse"],
  "Wunschtermine":response["Mögliche Unterrichtszeitfenster (keine Wunschtermine)"],
  "Nicht_Moeglich":response["Unterricht: Nicht möglich an folgenden Wochentagen"],
  "Nachmittagsbetreuung": response["Nachmittagsbetreuung an folgenden Wochentagen: "],
  "Anmerkungen": response["Sonstige Anmerkungen"],
  "EMail": response["SchülerIn E-Mail: "] == "" ? (response["E-Mail Adresse (für die Zusendung der Rechnung)"]) : response["SchülerIn E-Mail: "],
  "Kursart" : course_type
  }
  student["Lehrer"] = TT.getTeacherDriveNameFromFullName(response["Lehrperson"])
  student["Kursvertragsstatus"] = "Vertrag nicht vorhanden"
  student["Zweigstelle"] = "Keine Zweigstelle"
  student["Voranmeldung"] = "keine Voranmeldung"
  student["Kontaktstatus"] = "Noch offen"
  student["SchuelerID"] = DATA.getNewStudentID()

  //Logger.log("student dict")
  //Logger.log(Object.entries(student))
  
  API.postTFApi("add_student",student)

}

function findDuplicates(arr)
{
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}