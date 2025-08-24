function getNextFreeDataCellDownwards(range) {
  while (!range.isBlank() || range.isPartOfMerge()) {
    range = range.getSheet().getRange(range.getRow() + 1, range.getColumn())
  }
  return range
}

//finds first occurance of a value val in a given column of a sheet and returns the row index (starting at 1), returns -1 if not found
function findValueInCol(sheet, col, val) {
  let last_row = sheet.getLastRow()
  let col_vals = sheet.getRange(1, col, last_row + 1).getValues()

  return col_vals.indexOf(val)
}

//get all checked rows (or cells containing a boolean true) from a specified sheet and col
function getCheckedRows(sheet, col) {
  let lastRow = sheet.getLastRow()
  let checked_array = sheet.getRange(1, col, lastRow).getValues()

  return checked_array.map((e, i) => (e[0] == true ? i + 1 : "")).filter(String)
}

//return values in a column for the specified rows
function getColValues(sheet, col, rows) {
  let values = []
  for (let row of rows) {
    values.push(sheet.getRange(row, col).getValues())
  }
  return values
}


