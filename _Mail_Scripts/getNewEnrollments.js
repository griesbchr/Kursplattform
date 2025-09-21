const UNPROCESSEDLABELNAME = "Unprocessed"
const PROCESSEDLABELNAME = "Processed"

//shared with ET and TF
const NOTSHAREDVALUE = "Kein Lehrer zugeteilt"

function getNumberOfNewEnrollments()
{
  let unprocessed_label = GmailApp.getUserLabelByName(UNPROCESSEDLABELNAME)
  let threads = unprocessed_label.getThreads()
  let num_of_students = 0
  for (let thread of threads)
  {
    var messages = thread.getMessages()
    //iterate the messages of each thread, looking for stared messages
    for (let message of messages)
    {
      if (message.isStarred())
      {
        num_of_students++;
      }
    }
  }
  return num_of_students
}

function fetchNewMails()
{
  let unprocessed_label = GmailApp.getUserLabelByName(UNPROCESSEDLABELNAME)
  let processed_label = GmailApp.getUserLabelByName(PROCESSEDLABELNAME)
  //get all threads that contain unread messages
  let threads = unprocessed_label.getThreads()
  let student_dicts = []
  var data
  for (let thread of threads)
  {
    var messages = thread.getMessages()
    //iterate the messages of each thread, looking for stared messages
    for (let message of messages)
    {
      if (!message.isStarred()){continue;}

      let attachments = message.getAttachments()
      var message_text = message.getPlainBody()
      
      //remove any text before message to parse in case anything is added before
      const index = message_text.indexOf("Art der Anmeldung");
      if (index !== -1) {
        message_text = message_text.substring(index); // or use originalString.slice(index);
      }

      //remove <mailto: > tags
      message_text = message_text.replace(/<mailto:.*?>/g, '').trim();
      
      var data_message = parseMessageText(message_text)
      
      //use message data as main data source
      data = data_message;

      if (attachments.length > 0)
      {
        var bytes = attachments[0].getBytes()
        var attachment_text = ""
        for (var byte of bytes)
        {
          attachment_text = attachment_text + BYTE_TO_CHAR[byte]
        }

        attachment_text =  attachment_text.replace(/'/g, '"')

        //fix fomating error in json file if teacher mail is present
        attachment_text = attachment_text.replace("'Lehrermail':'Lehrermail:", "'Lehrermail':")

        var data_attachment = JSON.parse(attachment_text)
        //use json data as main data source
        //we dont do that cause the key names are different in the json file
        //data = data_attachment
        
        //add data that is missing in the json file
        //data["Art_Anmeldung"] = data_message["Art_Anmeldung"]

        data["Rechnungsname"] = data_attachment["Rechnungsname"]
        data["Rechnungsmail"] = data_attachment["Rechnungsmail"]
        data["Rechnungsadresse"] = data_attachment["Rechnungsadresse"]
        data["Rechnungsort"] = data_attachment["Rechnungsort"]
        data["Rechnungs_PLZ"] = data_attachment["Rechnungs_PLZ"]
        data["Wohngemeinde"] = data_attachment["Wohngemeinde"]

      }


      data["MailLink"] = ""
      data["Kontaktstatus"] = NOTSHAREDVALUE
      student_dicts.push(data)
      message.unstar()
    }
    thread.removeLabel(unprocessed_label)
    thread.addLabel(processed_label)
  }
  Logger.log("[MAIL]Fetched " + student_dicts.length + " new students from mail")

  return student_dicts
}

function parseDaySelection(text)
{
  //console.log(JSON.stringify(text))
  var text = text.substring(text.indexOf(":") + 3);   //leave out field name
  text = text.replace(/\t\t/g, ' ')       //replace tabs with spaces
  var list = text.split("\r\n")
  list = list.filter(e => e!="")                    //filter out empty entries
  var yes_no_list = list[0].match(/[^ ]+ [^ ]+/g);   //split text by every second space
  list = list.slice(1, list.length)
  
  //append text to yes no list if there is text, if not then dont append anything
  list = list.map(e => e.split(/:\s/))  //regex that selects every colon followed by a space

  for (var i=0; i<list.length; i=i+1)
  {
    if (list[i][1] === "")  //no comments specified
    {
      continue;
    }else
    {
      yes_no_list[i] = yes_no_list[i] + " (" +list[i][1] + ")"
    }
  }


  return yes_no_list.join(" | ")
}

function parseMessageText(text)
{
  let section_list = text.split("------------")
  section_list[0] = section_list[0].replace(/\r\n/," ")         //remve first newLine with Space
  section_list[0] = section_list[0].replace(/\r\n\r\n/,"\r\n")  //remove two newlines with one newline
  var dict_list = section_list[0]
  console.log(dict_list)
  dict_list = dict_list.split("\r\n")

  dict_list = dict_list.filter(e => !e.includes("Von: "))
  dict_list = dict_list.filter(e => !e.includes("Gesendet: "))
  dict_list = dict_list.filter(e => !e.includes("An: "))
  dict_list = dict_list.filter(e => !e.includes("Betreff: "))
  dict_list = dict_list.filter(e => e.trim() !== "")
  //dict_list[0] = dict_list[0] + " " + dict_list.splice(1, 1);   //add "Erstanmeldung / Schnuppern" to "Art der Anmeldung"

  //Fix bug with "Art der Anmeldung" by merging the first two list items
  //let joinedItem = dict_list[0] + ' ' + dict_list[1];
  // Remove the first two items
  //dict_list.splice(0, 2, joinedItem);
  
  dict_list = dict_list.map(e => e.split(/:\s/))  //regex that selects every colon followed by a space
  var dict = {}
  dict_list.forEach(e => dict[e[0]] = e[1].trim())
  
  if (section_list.length > 2)
  {
    var daycare_days = parseDaySelection(section_list[1])
    var possible_days = ""//parseDaySelection(section_list[2])
    var not_possible_days = parseDaySelection(section_list[2])
    var remarks = typeof section_list[3].split(":")[1] === 'string' ? section_list[3].split(":")[1].trim() : ''
  }else
  {
    var daycare_days = ""
    var possible_days = ""
    var not_possible_days = ""
    var remarks = typeof section_list[1].split(":")[1] === 'string' ? section_list[1].split(":")[1].trim() : ''
  }
  var place_list = dict["Ort"].split(" ")
  dict["PLZ"] = place_list.shift()
  dict["Ort"] = place_list.join(" ")

  var data = 
  {
  "Notizen": dict["Schueler ID"],
  "SchuelerID": dict["Schueler ID"],
  "Art_Anmeldung": dict["Art der Anmeldung"],
  "S_Vorname": dict["Vorname"],
  "S_Nachname": dict["Nachname"],
  "Instrument": dict["Instrument"],
  "Kursort": dict["Kursort"],
  "Rechnungsadresse": dict["Strasse"],
  "Rechnungsadresszusatz":"",
  "Rechnungsort": dict["Ort"],
  "Rechnungs_PLZ": dict["PLZ"],
  "Telefon_mobil": dict["Telefon"],
  "Telefon_Vormittag": dict["Telefon"],
  "EMail": dict["EMail"],
  "Geburtsdatum": dict["Gebdat."],
  "Schule_Klasse": dict["Klasse"],
  "Wunschlehrer": dict["Lehrer"],
  "Rechnungs_Mail": dict["EMail"],
  "ScriptInfo": "Anmeldung über Kursplattform",
  "Wunschtermine": possible_days,
  "Nicht_Moeglich":not_possible_days,
  "Nachmittagsbetreuung":daycare_days,
  "Anmerkungen": remarks,
  "Rechnungsname": "Nicht abgefragt",
  "Rechnungsmail": "Nicht abgefragt",
  "Rechnungsadresse": "Nicht abgefragt",
  "Rechnungsort": "Nicht abgefragt",
  "Rechnungs_PLZ": "Nicht abgefragt",
  "Wohngemeinde": "Nicht abgefragt"
  }
  //console.log ("parsed student data")
  //console.log(data)
  return data
}


function getByteMap()
{
  //var chars = ["Ä","Ö","Ü","ä","ö","ü","ß"]
  var chars = getSymboleList()
  var bytes = []
  for (var i=0; i < chars.length; i++)
  {
    bytes.push(chars[i].charCodeAt(0))
  } 
  var blob = Utilities.newBlob(bytes)
  console.log(chars)
  faulty_bytes = blob.getBytes()
  console.log(faulty_bytes)

  var bytemap = {}
  for (var i=0; i<chars.length; i++)
  {
    bytemap[faulty_bytes[i]] = String(chars[i])
  }
  console.log(bytemap);

}

function getSymboleList()
{
  //var document = DocumentApp.openById("1vOBz6-rx43CZ4OzbD91vTiKJ1YyLDRzuwN9XaLg_W9g")
  var sym_list = [],
      i;

  for (i = 32; i < 256; i++) {
      sym_list.push(String.fromCharCode(i));
  }
return sym_list
}
