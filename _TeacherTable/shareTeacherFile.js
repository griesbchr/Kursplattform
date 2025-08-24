function shareTeacherFile() {

  var teacher_id;

  //while (true) {
  //  
  //  try{
  //    break;
  //  }catch
  //  {
  //    Browser.msgBox("Es konnte zur angegebenen Lehrer ID keine Lehrerdatei gefunden werden. Bitte Lehrer ID eingeben (dreistellig, zB '009')");
  //  }
  //}
  
  teacher_id = Browser.inputBox("Bitte Lehrer ID eingeben (dreistellig, zB '009')");
  if (teacher_id == "cancel"){return}

  var teacher_email;

  while (true) {
    teacher_email = Browser.inputBox("Bitte Email Addresse eingeben");
    if (teacher_email == "cancel"){return}

    if (isValidEmail(teacher_email)) {
      break; // Exit the loop if the input is valid
    } else {
      Browser.msgBox("Unültige Emailadresse. Bitte Email Addresse eingeben");
    }
  }
  try{
    shareTeacherFile_(teacher_id, teacher_email)
    Browser.msgBox("Lehrerdatei wurde erfolgreich freigegeben");
  }catch ({ name, message }){
    Browser.msgBox("Freigabe mit Fehlermeldung "+name+" fehlgeschlagen. Fehlermeldung:"+message);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

