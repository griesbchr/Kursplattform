function makeDropdown(range, value_list, default_option="", allow_invalid=false)
{
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(value_list).setAllowInvalid(allow_invalid).build()
  range.setDataValidation(rule)
  range.setValue(default_option)
}

function makeDropdowns(range, value_lists, default_option, allow_invalid=false)
{
  let len = value_lists.length
  let rules = Array(len).fill(null)

  for (let i = 0; i < len; i++)
  {
    if (!(value_lists[i] === null))
    {
      rules[i] = SpreadsheetApp.newDataValidation().requireValueInList(value_lists[i]).setAllowInvalid(allow_invalid).build()
    }
  }
  range.setDataValidations([rules])
  range.setValues([default_option])
}

function makeColorOnValueFormat(spreadsheet, range, value, color)
{
  let color_rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(value)
    .setBackground(color)
    .setRanges([range])
    .build();
  //Formatting rules
  let rules = spreadsheet.getConditionalFormatRules();
  rules.push(color_rule);
  spreadsheet.setConditionalFormatRules(rules);
}

function makeColorOnEmptyFormat(spreadsheet, range, color)
{
  let color_rule = SpreadsheetApp.newConditionalFormatRule()
    .whenCellEmpty()
    .setBackground(color)
    .setRanges([range])
    .build();
  //Formatting rules
  let rules = spreadsheet.getConditionalFormatRules();
  rules.push(color_rule);
  spreadsheet.setConditionalFormatRules(rules);
}