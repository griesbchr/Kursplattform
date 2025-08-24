//Logger.log("Load MAIL")
function doGet(e) {
  
}

function doPost(e)
{
  switch(e.parameter["request_type"])
  {
  case("sent_mail"):
    var payload = JSON.parse(e.postData.contents)
    sentMail(payload)
    break;

  case("sent_html_mail"):
    var payload = JSON.parse(e.postData.contents)
    sendHTMLMail(payload)
    break;
  
  //case("fetch_mail"):
  //  var payload = JSON.parse(e.postData.contents)
  //  sentMail(payload)
  //  break;

  default:
    throw(new Error("action string '"+e.parameter["request_type"]+"' could not be matched in file Mail_Scripts"))    
  }
}