// ###################TeacherInvoices ############################

const CLOUDPROJECTNUMBER = "802167359539"

const INVOICETEMPLATEFILEID = "1HcJ320Bsg8iHM0RB4DDjDEw9Yw9jqvVpKzppn68QESE"
const DATASOURCEFOLDERID = "1DrVV2cLEns0cpWSys3hqqreMZNqN5QfM"
const TEMPLATESFOLDERID = "1ofqcH4V8rrUCbvfy5hQEeDNn3j9NTe8L"

const TEACHERINVOICESFOLDERID = "1hXoFf8pDjFFXFlgjPMXlBovis90IwnKz"
const TEMPFOLDERID = TEACHERINVOICESFOLDERID
const TEACHERIDFIELDNAME = "LehrerID"

const TRIGGER_INTERVAL = 30      //1, 5, 10, 15 or 30
const TRIGGER_ID_KEY = "TRIGGER_ID"
const TEACHER_ID_QUEUE_KEY = "TEACHER_ID_QUEUE"
const TEACHER_ID_DONE_KEY = "TEACHER_ID_DONE"

const SOURCEFILEID_KEY = "SOURCEFILEID" 

const SALDOPAYMENTTOFIELDNAMEMAP = 
{
  "<<L_Tit_Vorname>>": "L_Tit_Vorname",
  "<<L_Zuname>>": "L_Zuname",
  "<<L_Adresse>>": "L_Adresse",
  "<<L_Plz>>": "L_Plz",
  "<<L_Ort>>": "L_Ort",
  "<<Lehrer_Email>>": "e-mail",
  "<<Lehrer_Tel>>": "L_Tel",
  "<<L_IBAN>>": "IBAN",
  "<<Rechnungsname>>": "Re_Tit_Zuname",
  "<<Rechnungsadresse>>": "Re_Adresse",
  "<<Rechnungs_ PLZ>>": "Re_Plz",
  "<<Rechnungsort>>": "Re_Ort",
  "<<SchuelerID>>": "SchuelerID",
  "<<Rechnungsnummer_Lehrer>>": "Rechnungsnummer_Lehrer",
  "<<Instrument>>": "Instrument",
  "<<Anzahl_Einheiten>>": "Anzahl Einheiten",
  "<<Kurs_Nr>>": "Kurs_Nr",
  "<<Preis_pro_Einheit>>": "Preis pro Einheit",
  "<<Gesamtbetrag aus Unterricht>>": "Gesamtbetrag aus Unterricht",
  "<<Gesamtbetrag_bezahlt>>": "Gesamtbetrag_bezahlt",
  "<<Saldobetrag>>": "Saldobetrag",
  "<<Unterrichtsort>>": "Unterrichtsort",
  "<<Modus>>": "Modus",
  "<<M_1_Tlz_Betreff>>": "1_Tlz_Betreff",
  "<<M_2_Tlz_Betreff>>": "2_Tlz_Betreff",
  "<<M_3_Tlz_Betreff>>": "3_Tlz_Betreff",
  "<<M_4_Tlz_Betreff>>": "4_Tlz_Betreff",
  "<<M_5_Tlz_Betreff>>": "5_Tlz_Betreff",
  "<<M_1_Tlz_Rechnungsdatum>>": "1_Tlz_Rechnungsdatum",
  "<<M_2_Tlz_Rechnungsdatum>>": "2_Tlz_Rechnungsdatum",
  "<<M_3_Tlz_Rechnungsdatum>>": "3_Tlz_Rechnungsdatum",
  "<<M_4_Tlz_Rechnungsdatum>>": "4_Tlz_Rechnungsdatum",
  "<<M_5_Tlz_Rechnungsdatum>>": "5_Tlz_Rechnungsdatum",
  "<<M_1_Tlz_Betrag_fällig>>": "1_Tlz_Betrag_fällig",
  "<<M_2_Tlz_Betrag_fällig>>": "2_Tlz_Betrag_fällig",
  "<<M_3_Tlz_Betrag_fällig>>": "3_Tlz_Betrag_fällig",
  "<<M_4_Tlz_Betrag_fällig>>": "4_Tlz_Betrag_fällig",
  "<<M_5_Tlz_Betrag_fällig>>": "5_Tlz_Betrag_fällig",
  "<<M_1_Tlz_Betrag_bez>>": "1_Tlz_Betrag_bez",
  "<<M_2_Tlz_Betrag_bez>>": "2_Tlz_Betrag_bez",
  "<<M_3_Tlz_Betrag_bez>>": "3_Tlz_Betrag_bez",
  "<<M_4_Tlz_Betrag_bez>>": "4_Tlz_Betrag_bez",
  "<<M_5_Tlz_Betrag_bez>>": "5_Tlz_Betrag_bez",
  "<<M_1_Tlz_Datum>>": "1_Tlz_Datum",
  "<<M_2_Tlz_Datum>>": "2_Tlz_Datum",
  "<<M_3_Tlz_Datum>>": "3_Tlz_Datum",
  "<<M_4_Tlz_Datum>>": "4_Tlz_Datum",
  "<<M_5_Tlz_Datum>>": "5_Tlz_Datum",
  "<<Datenquelle_Datum>>": "creation_date",
  "<<Kursjahr>>": "course_year"
}

var CURRENCYFIELDS = ["1_Tlz_Betrag_fällig", "2_Tlz_Betrag_fällig", "3_Tlz_Betrag_fällig", "4_Tlz_Betrag_fällig", "5_Tlz_Betrag_fällig", "1_Tlz_Betrag_bez", "2_Tlz_Betrag_bez", "3_Tlz_Betrag_bez", "4_Tlz_Betrag_bez", "5_Tlz_Betrag_bez", "Saldobetrag", "Gesamtbetrag_bezahlt", "Gesamtbetrag aus Unterricht"]



// ################################# Office Invoices #####################################

// ###SET THESE FOR EVERY OFFICE PAYMENT PERIOD
const OFFICERORECHNUNGSDATUM = "18.05.2025"           // Datum an dem die Rechnung datiert ist 
const OFFICERORECHNUNGFAELLIGDATUM = "18.05.2025"     // Stichtag bis zu dem Schüler gezählt werden
const OFFICEROZAHLUNGSDEADLINE = "08.06.2025"         // Datum bis zu dem die Lehrer zahlen müssen    
// ############################################


const OFFICEINVOICETEMPLATEFILEID = "1HKZJ-1ztxbniS2Nkl8gMowd0te4GTzUwPNyzFK2xYvc"
const OFFICEINVOICEFOLDERID = "1KQnWBGCUbsljuec1Ik20E2eV_o15_ShH"

var OFFICEROBANKNAME = "Officero Büroservice"
var OFFICEROIBAN = "AT741912050111228010"
var OFFICEROBIC = "SPBAATWW"
var OFFICEROTRANSACTIONMESSAGE = "Vielen Dank!"

const OFFICEINVOICEFIELDNAMEMAP = 
{
  "<<Rechnungsnr>>": "Rechnungsnummer",
  "<<Rechnungsdatum>>": "Rechnungsdatum",
  "<<Anrede>>": "Anrede",
  "<<L_Name>>": "L_Name",
  "<<L_Vorname>>": "Vorname",
  "<<L_Nachname>>": "Nachname",
  "<<Adresse1>>": "Adresse1",
  "<<Adresse2>>": "Adresse2",
  "<<Schuljahr>>": "Schuljahr",
  "<<Faellig_datum>>": "Faellig_datum",
  "<<Schueleranzahl>>": "Anz. Schüler",
  "<<Betrag_pro_Schueler>>": "Betrag_pro_Schueler",
  "<<Gesamtbetrag>>": "fälliger Betrag",
  "<<Rechnung_deadline>>": "Rechnung_deadline",
  "<<Zahlungsreferenz>>": "Paymentref"
}


