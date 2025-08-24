function getFile(filename)
{
  //Logger.log("getFile filename: "+filename)
  let file_ID = DriveApp.getFilesByName(filename).next().getId()
  //Logger.log("Utils getFile: get file with name "+filename+" and file id "+String(file_ID))
  return SpreadsheetApp.openById(file_ID)
}

function getCheckedRows(sheet, col)
{
  let lastRow = sheet.getLastRow()
  let checked_array = sheet.getRange(1, col, lastRow).getValues()

  return checked_array.map((e, i) => (e[0] == true ? i+1 : "")).filter(String)
}

//finds first occurance of a value val in a given column of a sheet and returns the row index (starting at 1), returns 0 if not found
function findValueInCol(sheet, col, val)
{
  let last_row = sheet.getLastRow()
  let col_vals = sheet.getRange(1,col,last_row+1).getValues().flat()
  let row = col_vals.indexOf(val)+1
  return row
}

//get the values of a col for the specified rows
function getColValues(sheet, col, rows)
{
  let col_values = sheet.getRange(1,col, sheet.getLastRow()).getValues().flat()
  return rows.map(x=>col_values[x-1]) //-1 cause array row 1 is at array[0]
}

function getColLetters(columnIndexStartFromOne) {
  const ALPHABETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  if (columnIndexStartFromOne < 27) {
    return ALPHABETS[columnIndexStartFromOne - 1]
  } else {
    var res = columnIndexStartFromOne % 26
    var div = Math.floor(columnIndexStartFromOne / 26)
    if (res === 0) {
      div = div - 1
      res = 26
    }
    return getColLetters(div) + ALPHABETS[res - 1]
  }
}

function getNextFreeDataCellDownwards(range) {
  while (!range.isBlank() || range.isPartOfMerge()) {
    range = range.getSheet().getRange(range.getRow() + 1, range.getColumn())
  }
  return range
}