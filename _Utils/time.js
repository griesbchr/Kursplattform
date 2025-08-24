function getToday(ss)
{
  if (ss === undefined || ss === null) {
    return Utilities.formatDate(new Date(), 'Europe/Vienna', "dd.MM.yyyy")
  }else if(ss.getSpreadsheetTimeZone() == "")
  {
    ss.setSpreadsheetTimeZone('Europe/Vienna');
  }
  return Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "dd.MM.yyyy")
}

function getTodayWithTime(ss)
{
  if (ss === undefined || ss === null) {
    return Utilities.formatDate(new Date(), 'Europe/Vienna', "dd.MM.yyyy HH:mm")
  }else if(ss.getSpreadsheetTimeZone() == "")
  {
    ss.setSpreadsheetTimeZone('Europe/Vienna');
  }
  return Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), "dd.MM.yyyy HH:mm")
}