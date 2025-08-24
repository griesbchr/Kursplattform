function shareTeacherFile(teacher_id, email) {

  try{
    var teacher_file = getTeacherFile(teacher_id)
  }catch
  {
    throw new Error("Es konnte zur angegebenen Lehrer ID keine Lehrerdatei gefunden werden. Bitte Lehrer ID eingeben (dreistellig, zB '009')")
  }

  try{
    teacher_file.addEditor(email)
    shareTFLib(email)
  }catch (e){
      if (e.message.includes('Since there is no Google account associated with this email address, you must check the "Notify people" box to invite this recipient.'))
      { 
        //continue, this email doesnt have a google account and thus is not used to edit the google sheet
        return
      }
    throw new Error("Freigabe mit Fehlermeldung "+name+" fehlgeschlagen. Fehlermeldung:"+message);
  }
  return
}
