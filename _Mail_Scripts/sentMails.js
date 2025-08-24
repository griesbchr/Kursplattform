//fromalias: 
//0: main mail adress, 
//1: anmeldungen@kursplattform.at,
//2: noreply@kursplattform.at
function sentMail(to, subject, text, fromalias=0, replyTo="", name="", cc="") 
{
  sendMail_(to, subject, text, fromalias, replyTo, name, cc=cc)
} 

function sendHTMLMail(to, subject, text_body, html_body, from_alias=0, replyTo="", name="", cc="")
{
  sendMail_(to, subject, html_body, from_alias, replyTo, name, is_html=true, html_body=html_body, cc=cc)
}

function sendHTMLMailWithAttachment(to, subject, html_body, from_alias, replyTo, name, cc, attachments)
{
  sendMail_(to, subject, html_body, from_alias, replyTo, name, is_html=true, html_body=html_body, cc=cc, attachments=attachments)

}

function sendMail_(to, subject, text, fromalias, replyTo, name, is_html=false, html_body=null, cc=null, attachments=null)
{
  var sender 
  if (fromalias != 0)
  {
    sender = GmailApp.getAliases()[fromalias-1]
    console.log("sending mail with alias: " + sender)
  }else   //sent from main email address
  {
    sender = null
  }

  if (!is_html)
  {
    options = {
    from: sender,
    replyTo:replyTo,
    name:name,
    cc:cc,
    attachments:attachments}

    GmailApp.sendEmail(to, subject, text, options);
  }else
  {
    options = {
    from: sender,
    replyTo:replyTo,
    name:name,
    htmlBody:html_body,
    cc:cc,
    attachments:attachments}

    GmailApp.sendEmail(to, subject, "", options);
  }
  Logger.log('[MAIL]Mail "' + subject + '"  to recipient "' + to + '" was sent successfully!')
}

function printAliasOrder()
{
  console.log(GmailApp.getAliases())
}

function sentTestMail()
{
  sentMail("christoph.griesbacher@gmail.com", "subject", "text", 0, "admin@kursplattform.at", "Kursplattform")
}

//[ 'anmeldungen@kursplattform.at', 'noreply@kursplattform.at' ]
function printAliases()
{
  var aliases = GmailApp.getAliases()

  for (let i=0; i<aliases.length; i=i+1)
  {
    console.log(String(i) + " : " + aliases[i])
  }
}
