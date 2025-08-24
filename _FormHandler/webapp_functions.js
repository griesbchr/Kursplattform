function getHTML(id)
{
  let form_url = createPrefilledForm(id)

  var template = HtmlService.createTemplateFromFile('Index').getRawContent()
  template = template.replace("replace_with_url", form_url)
  template = template.replace("replace_with_id", String(id))
  template = template.replace("replace_with_form_url", form_url)
  html = HtmlService.createTemplate(template).evaluate()

  return html
}
