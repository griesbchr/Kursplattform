function pickSourceFile_withFilepicker()
{
  var html = HtmlService.createHtmlOutputFromFile("Picker.html")
    .setWidth(700)
    .setHeight(550)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, "Datenquelle auswählen");
}

function proccessSelectedFiles(file_ids) {

  SpreadsheetApp.getActiveSpreadsheet().toast("File IDs: " + file_ids)
  console.log("File_ids: ", file_ids)

  return true;
}

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

  // Check for errors in the response
  if (response.getResponseCode() !== 200) {
    throw new Error("Failed to fetch file content. Response: " + response.getContentText());
  }

  // Return the file content
  return response.getContentText("ISO-8859-1");
}

function getFilesContentInSharedDrive(file_ids) {
  var files_content = [];
  for (let file_id of file_ids) {
    files_content.push(getFileContent(file_id));
  }
  return files_content;
}
