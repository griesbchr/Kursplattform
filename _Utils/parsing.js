function format_currency(numberstr, post_comma_digits = 2) {
  const options = {
    style: "decimal",
    minimumFractionDigits: post_comma_digits,
    maximumFractionDigits: post_comma_digits,
  };
  if (numberstr == ""){
  return ""
  }
  else{
  return "€ " + parseFloat(numberstr).toLocaleString("de-AT", options);
  }
}
