function createRoomusageList(district_name)
{
  var roomusagelist_folder = DriveApp.getFolderById(ROOMUSAGELISTSFOLDERID)

  var template_file_copy = DriveApp.getFileById(ROOMUSAGELISTTEMPLATEFILEID)
  .makeCopy()
  .setName("Raumbenützungsliste_"+district_name)
  .moveTo(roomusagelist_folder)
  .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  
  var roomusagelist_ss = SpreadsheetApp.openById(template_file_copy.getId())
  roomusagelist_ss.addDeveloperMetadata(district_name)    //set KEY of dev metadata
  var roomusagelist_sheet = roomusagelist_ss.getSheetByName(ROOMUSAGELISTSHEETNAME)
  roomusagelist_sheet.getRange(ROOMUSAGELISTDISTRICTROW, ROOMUSAGELISTDISTRICTCOL).setValue(district_name)
}

function getMissingLists()
{
  //get districs from data
  var district_names_data = DATA.getDistricts()
  
  //remove "Keine Zweigstelle"
  var idx = district_names_data.indexOf(NODISTRICTNAME)
  if (idx != -1)
  {
    district_names_data.splice(idx, 1)
  }

  //get districts from folder
  var roomusagelist_folder_iter = DriveApp.getFolderById(ROOMUSAGELISTSFOLDERID).getFiles()

  var district_names_folder = []
  while(roomusagelist_folder_iter.hasNext())
  {
    var file_id = roomusagelist_folder_iter.next().getId()
    district_names_folder.push(SpreadsheetApp.openById(file_id).getDeveloperMetadata()[0].getKey()) //read KEY of dev metadata
  }

  //calculate set difference
  var district_names_data_set =   new Set(district_names_data)
  var district_names_folder_set = new Set(district_names_folder)

  var missing_names_set = district_names_data_set.difference(district_names_folder_set)
  var missing_names = Array.from(missing_names_set);

  return missing_names
}

function updateData() {

  //check for new districts and create lists
  var missing_list = getMissingLists()
  //missing_list = ["Sacre Coeur"]   // this is for debugging
  if (missing_list.length > 0)
  {
    console.log("[ROOMUSAGE] Creating missing roomusagelists for district/s "+missing_list)
    for (var district_name of missing_list)
    {
      createRoomusageList(district_name)
    }
  }

  //get teacher data
  var info_list = ["Vorname", "Nachname", "Email", "Tel"]
  var teacher_data = TT.getTeacherDataArray(info_list)
  //merge firstname and lastname
  for (var key in teacher_data)
  {
    var data =  teacher_data[key]
    data.splice(0, 2, data[0] + " " + data[1]);
  }

  //get room data
  var room_data = TF_GET.getRoomUsageData()

  var room_data_array = []
  // add teacher data to sheet
  for (var data_obj of room_data)
  {
    var row = []
    var teacher_id = data_obj["Lehrer_ID"]
    delete data_obj["Lehrer_ID"]
    
    if (!("Instrument" in data_obj)){data_obj["Instrument"] = ""}
    row = teacher_data[teacher_id].concat(Object.values(data_obj))

    room_data_array.push(row)
  }

  //write to sheet
  var roomdata_sheet = SpreadsheetApp.openById(ROOMDATASSID).getSheetByName(ROOMDATASHEETNAME)
  roomdata_sheet.getRange(ROOMDATAHEADERROW+1, 1, room_data_array.length, room_data_array[0].length).setValues(room_data_array)
  
}
