//url for post request
const WEBAPP_URL = "https://script.google.com/a/macros/kursplattform.at/s/AKfycbyW-KuOy6LFZN76Vc30HZ1D8s-mC_5XGJcsLyOdkyUjKXngs2_Azoe8j2OD3nyXH9UkCQ/exec"
///a/macros/kursplattform.at/s/ is inserted!!
//IS THIS IS CHANGED, ALSO CHANGE URL IN BOUND FILE

//function getWebAppUrl()
function getRegistrationUrl()
{
  return WEBAPP_URL
}

function getPersonalizedRegistrationUrl(id)
{
  return WEBAPP_URL + "?id="+String(id)
}

//serve HTML when GET is called
function doGet(e) {
  let param_dict = e.parameter
  let id = param_dict["id"]
  if (typeof(id)==typeof(undefined))
  {
    id = "undefined_id"
  } 

  html = getHTML(id)

  return html
}

//process response form when post is called
function doPost(e)
{
  switch(e.parameter["request_type"])
  {
  case("form_submit"):
    var data = JSON.parse(e.postData.contents)
    handleFormSubmit(data)
    break;
 
  default:
    throw(new Error("action string '"+e.parameter["request_type"]+"' could not be matched in file FormHandler"))    
  }
}