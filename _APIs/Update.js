//TF_POST_URL
//TF_GET_URL

function setScriptProperty(key, value)
{
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(key, value)
}
