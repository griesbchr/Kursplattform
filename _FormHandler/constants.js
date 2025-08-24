const REGFORMFILENAME = "Reg_Form_Template"
const REGFORMFILE = DriveApp.getFilesByName(REGFORMFILENAME).next()
const REGFORM = FormApp.openById(REGFORMFILE.getId())

//when changing the form, also change form_functions: TEACHERNAME_QNR and all the attributes of the form response