function getTeacherRows(ids) {
  let id_col = TEACHERSHEET.getRange(1, IDCOL, TEACHERSHEET.getLastRow()).getValues().flat();
  return ids.map((id) => id_col.indexOf(id) + 1);
}

function getTeacherRow(id) {
  let row = TEACHERSHEET.getRange(1, IDCOL, TEACHERSHEET.getLastRow()).getValues().flat().indexOf(id) + 1;
  if (row == 0) {
    throw new Error("The teacher id " + id + " could not be found in the TeacherTable");
  }
  return row;
}

function getTeacherRowNoError(id) {
  let row = TEACHERSHEET.getRange(1, IDCOL, TEACHERSHEET.getLastRow()).getValues().flat().indexOf(id) + 1;
  return row;
}
function getTeacherFirstName(id) {
  return TEACHERSHEET.getRange(getTeacherRow(id), FIRSTNAMECOL).getValue();
}

function getTeacherLastName(id) {
  return TEACHERSHEET.getRange(getTeacherRow(id), LASTNAMECOL).getValue();
}

function getAllTeacherIds() {
  return TEACHERSHEET.getRange(HEADINGROWS + 1, IDCOL, TEACHERSHEET.getLastRow() - HEADINGROWS)
    .getValues()
    .flat();
}

function getAllTeacherIDNames() {
  return getTeacherIDNames(getAllTeacherIds());
}

function getAllTeacherMail() {
  var last_row = TEACHERSHEET.getLastRow();
  var ids = TEACHERSHEET.getRange(1, IDCOL, last_row).getValues().flat();
  var mails = TEACHERSHEET.getRange(1, EMAILCOL, last_row).getValues().flat();

  var mail_dict = {};
  for (var i = 0; i < ids.length; i++) {
    mail_dict[ids[i]] = mails[i];
  }
  return mail_dict;
}

function getTeacherMail(id) {
  return TEACHERSHEET.getRange(getTeacherRow(id), EMAILCOL).getValue();
}

function getBillingServiceStatus(id) {
  return TEACHERSHEET.getRange(getTeacherRow(id), BILLINGSERVICECOL).getValue();
}

function getAllTeacherFullNames() {
  var full_names_split = TEACHERSHEET.getRange(HEADINGROWS + 1, FIRSTNAMECOL, TEACHERSHEET.getLastRow(), 2).getValues();
  var full_names = full_names_split.map((v) => v[0] + " " + v[1]);

  return full_names.filter((n) => n.trim());
}

//get names of teachers that have a teacher file
function getAllActiveTeacherFullNames() {
  var teacher_drive_ids = TF_GET.getTeacherFileIDs();
  var table_ids = TEACHERSHEET.getRange(HEADINGROWS + 1, IDCOL, TEACHERSHEET.getLastRow())
    .getValues()
    .flat();

  var full_names_split = TEACHERSHEET.getRange(HEADINGROWS + 1, FIRSTNAMECOL, TEACHERSHEET.getLastRow(), 2).getValues();

  //filter out names that have no teacher drive
  var full_names_split = full_names_split.filter((_, idx) => teacher_drive_ids.includes(table_ids[idx]));

  //sort by lastname
  full_names_split.sort(function (a, b) {
    var nameA = a[1].toLowerCase();
    var nameB = b[1].toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });

  var full_names = full_names_split.map((v) => v[0] + " " + v[1]);

  return full_names.filter((n) => n.trim());
}

function getAllActiveTeacherIDs() {
  var teacher_drive_ids = TF_GET.getTeacherFileIDs();
  var table_ids = TEACHERSHEET.getRange(HEADINGROWS + 1, IDCOL, TEACHERSHEET.getLastRow())
    .getValues()
    .flat();

  var full_names_split = TEACHERSHEET.getRange(HEADINGROWS + 1, FIRSTNAMECOL, TEACHERSHEET.getLastRow(), 2).getValues();

  //filter out names that have no teacher drive
  var full_names_split = full_names_split.filter((_, idx) => teacher_drive_ids.includes(table_ids[idx]));

  //sort by lastname
  full_names_split.sort(function (a, b) {
    var nameA = a[1].toLowerCase();
    var nameB = b[1].toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });

  var full_names = full_names_split.map((v) => v[0] + " " + v[1]);

  return full_names.filter((n) => n.trim());
}

function getTeacherIdFromFullName(full_name) {
  var last_row = TEACHERSHEET.getLastRow();
  var ids = TEACHERSHEET.getRange(HEADINGROWS + 1, IDCOL, last_row, IDCOL).getValues();

  var full_names_split = TEACHERSHEET.getRange(HEADINGROWS + 1, FIRSTNAMECOL, last_row, 2).getValues();
  var full_names = full_names_split.map((v) => v[0] + " " + v[1]);
  var id_idx = full_names.indexOf(full_name);

  return String(ids[id_idx]);
}

function getTeacherDriveNameFromFullName(full_name) {
  var id = getTeacherIdFromFullName(full_name);
  return getTeacherDriveName(id);
}

function getTeacherLink(id) {
  let row = getTeacherRow(id);
  return BASEURL + "&range=" + row + ":" + row;
}

function getTeacherFileFileId(teacher_id) {
  let row = getTeacherRow(teacher_id);
  return TEACHERSHEET.getRange(row, TEACHERFILEIDCOL).getValue();
}

function getMailName(id) {
  let row = getTeacherRow(id);
  let addressing = TEACHERSHEET.getRange(row, ADDRESSINGCOL).getValue();
  let lastname = TEACHERSHEET.getRange(row, LASTNAMECOL).getValue();
  return addressing + " " + lastname.split(",")[0];
}

function getMailGreeting(id, greeting = "Liebe") {
  let row = getTeacherRow(id);
  let addressing = TEACHERSHEET.getRange(row, ADDRESSINGCOL).getValue();
  let lastname = TEACHERSHEET.getRange(row, LASTNAMECOL).getValue();
  if (addressing === "Herr") {
    greeting = greeting + "r" + " " + addressing + " " + lastname.split(",")[0];
  } else if (addressing === "Frau") {
    greeting = greeting + " " + addressing + " " + lastname.split(",")[0];
  } else {
    greeting = greeting + "/r Lehrende/r";
  }

  return greeting;
}

function getTeacherFullName(id) {
  let firstname = TEACHERSHEET.getRange(getTeacherRow(id), FIRSTNAMECOL).getValue();
  let lastname = TEACHERSHEET.getRange(getTeacherRow(id), LASTNAMECOL).getValue();
  return firstname + " " + lastname;
}

function getBillingNumber(id) {
  return TEACHERSHEET.getRange(getTeacherRow(id), BILLINGNUMBERCOL).getValue();
}

function getTeacherFullNames(id_list) {
  let name_array = [];
  for (let id of id_list) {
    name_array.push(getTeacherFullName(id));
  }
  return name_array;
}

function getTeacherIDNames(id_list) {
  let name_array = [];
  for (let id of id_list) {
    name_array.push(String(id) + " " + getTeacherFullName(id));
  }
  return name_array;
}

function getTeacherDriveName(id) {
  let lastname = TEACHERSHEET.getRange(getTeacherRow(String(id)), LASTNAMECOL).getValue();

  return String(id) + "_" + lastname;
}

function getTeacherDriveNames(id_list) {
  let data_array = [];
  for (let id of id_list) {
    data_array.push(getTeacherDriveName(id));
  }
  return data_array;
}

function getTeacherDataById(teacher_id) {
  let row = getTeacherRow(teacher_id);
  let teacher = {};
  let lastCol = TEACHERSHEET.getLastColumn();
  //fetch all attributes of student list
  for (let col = 1; col <= lastCol; col = col + 1) {
    teacher[TEACHERSHEET.getRange(HEADINGROWS, col).getValue()] = TEACHERSHEET.getRange(row, col).getValue();
  }

  //add some attributes
  teacher["teacher_url"] = getTeacherLink(teacher_id);

  return teacher;
}

function getTeacherContactInformation(teacher_id) {
  let row = getTeacherRow(teacher_id);
  let data = TEACHERSHEET.getRange(row, FIRSTNAMECOL, 1, 6).getValues().flat();
  var contact_string = "Name: " + data[0] + " " + data[1] + " " + data[2] + "\n";
  contact_string = contact_string + "Instrument: " + data[5] + "\n";
  contact_string = contact_string + "Telefonnummer: " + data[4] + "\n";
  contact_string = contact_string + "Email-Adresse: " + data[3];
  return contact_string;
}

//a function to get generic information from a table.
//info list is a list containing the col names, which the return dict should contain
//returns a dict, keyed with the id, that contains anouther dict with key that are items from info_list
function getTeacherData(info_list) {
  var data = TEACHERSHEET.getDataRange().getValues();

  var header = data.splice(0, 1).flat();

  //filter out rows w
  var teacher_drive_ids = TF_GET.getTeacherFileIDs();

  //filter out names that have no teacher drive
  var data = data.filter((row_v, idx) => teacher_drive_ids.includes(row_v[IDCOL - 1]));

  //get col indices for all entries in info_list
  var data_cols = info_list.map((v) => header.indexOf(v));

  if (data_cols.indexOf(-1) != -1) {
    throw new Error("At least one column name was not found in teacher table");
  }

  var return_dict = {};
  for (let data_row of data) {
    return_dict[data_row[IDCOL - 1]] = {};
    for (let data_col of data_cols) {
      return_dict[data_row[IDCOL - 1]][header[data_col]] = data_row[data_col];
    }
  }

  return return_dict;
}

//a function to get generic information from a table.
//info list is a list containing the col names, which the return dict should contain
//returns a dict, keyed with the id, that contains an array with the items from info_list
function getTeacherDataArray(info_list) {
  var data = TEACHERSHEET.getDataRange().getValues();

  var header = data.splice(0, 1).flat();

  //filter out rows w
  var teacher_drive_ids = TF_GET.getTeacherFileIDs();

  //filter out names that have no teacher drive
  var data = data.filter((row_v, idx) => teacher_drive_ids.includes(row_v[IDCOL - 1]));

  //get col indices for all entries in info_list
  var data_cols = info_list.map((v) => header.indexOf(v));

  if (data_cols.indexOf(-1) != -1) {
    throw new Error("At least one column name was not found in teacher table");
  }

  var return_dict = {};
  for (let data_row of data) {
    return_dict[data_row[IDCOL - 1]] = [];
    for (let data_col of data_cols) {
      return_dict[data_row[IDCOL - 1]].push(data_row[data_col]);
    }
  }

  return return_dict;
}
