// Constants for Payment Confirmation system
// These constants follow the existing Kursplattform patterns

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwFIsdDFw1ldJHNUfm_2xBQ_tU1vAtR1MUN77nb_oVkUiIAPLo727O5jbza52UxUXw1sA/exec";

// Colors for conditional formatting (matching existing system)
const GREEN = "#b7e1cd";
const YELLOW = "#fce8b2";
const RED = "#f4c7c3";
const BLUE = "#cfe2f3";
const WHITE = "#ffffff";
const LIGHT_GRAY = "#f9f9f9";

// Structured color constants for payment confirmation
const PC_COLORS = {
  CONFIRMED: GREEN,
  PENDING: YELLOW,
  ISSUES: RED,
  HEADER: BLUE,
  BACKGROUND: WHITE,
  ROW_ALTERNATE: LIGHT_GRAY,
};

// Sheet structure constants
const PC_HEADER_ROW = 1;
const PC_DATA_START_ROW = 2;

// Column positions (1-based indexing)
const PC_COL_TEACHER_ID = 1;
const PC_COL_TEACHER_NAME = 2;
const PC_COL_EMAIL = 3;
const PC_COL_STATUS = 4;
const PC_COL_CONFIRMATION_DATE = 5;
const PC_COL_LAST_REMINDER = 6;
const PC_COL_ISSUES = 7;
const PC_COL_FORM_ID = 8;
const PC_COL_COURSE_COUNT = 9;
const PC_COL_LAST_UPDATE = 10;

// Sheet headers for A2 teacher payment confirmation
const PC_SHEET_HEADERS = [
  "Lehrer-ID",
  "Lehrername (A2)",
  "Email",
  "Bestätigungsstatus",
  "Bestätigungsdatum",
  "Letzte Erinnerung",
  "Anmerkungen/Probleme",
  "Form-ID",
  "Anzahl Kurse",
  "Letzte Aktualisierung",
];

// Status values for payment confirmation
const PC_STATUS_PENDING = "Ausstehend";
const PC_STATUS_CONFIRMED = "Bestätigt";
const PC_STATUS_ISSUES = "Probleme";
const PC_STATUS_REMINDED = "Erinnert";
const PC_STATUS_OVERDUE = "Überfällig";

// Form response status
const PC_FORM_STATUS_CREATED = "Erstellt";
const PC_FORM_STATUS_SENT = "Versendet";
const PC_FORM_STATUS_RESPONDED = "Beantwortet";
const PC_FORM_STATUS_ERROR = "Fehler";

// Timing constants (in milliseconds)
const PC_REMINDER_INTERVAL_DAYS = 3; // Days between reminders
const PC_OVERDUE_THRESHOLD_DAYS = 7; // Days until marked overdue

// Email constants
const PC_EMAIL_FROM_ALIAS = 1; // Use anmeldungen@kursplattform.at
const PC_EMAIL_REPLY_TO = "anmeldungen@kursplattform.at";
const PC_EMAIL_CC = "info@kursplattform.at";

// Form constants
const PC_FORM_TITLE_PREFIX = "Zahlungsbestätigung - ";
const PC_FORM_DESCRIPTION = "Bitte bestätigen Sie die aktuellen Zahlungsinformationen Ihrer Kurse.";

// Sheet name patterns
const PC_SHEET_NAME_PREFIX = "A2_Zahlungsabfrage_";
const PC_TIMEZONE = "Europe/Vienna";
const PC_DATE_FORMAT = "dd.MM.yyyy";
const PC_DATETIME_FORMAT = "dd.MM.yyyy HH:mm";

// API endpoints (following existing pattern)
const PC_WEBAPP_URL = ""; // To be set when web app is deployed

// Log prefixes (following existing pattern)
const PC_LOG_PREFIX = "[PC]";

// Error messages
const PC_ERROR_NO_TEACHERS = "Keine aktiven A2-Lehrer gefunden";
const PC_ERROR_SHEET_CREATION = "Fehler beim Erstellen der Tabelle";
const PC_ERROR_DATA_ACCESS = "Fehler beim Datenzugriff";
const PC_ERROR_EMAIL_SEND = "Fehler beim Versenden der E-Mail";
const PC_ERROR_FORM_CREATION = "Fehler beim Erstellen des Formulars";
const PC_ERROR_CREATING_QUERY = "Fehler beim Erstellen der Zahlungsabfrage:";

// Success messages
const PC_SUCCESS_SHEET_CREATED = "Zahlungsabfrage erfolgreich erstellt";
const PC_SUCCESS_EMAILS_SENT = "E-Mails erfolgreich versendet";
const PC_SUCCESS_FORMS_CREATED = "Formulare erfolgreich erstellt";
const PC_SUCCESS_TEACHERS_POPULATED = "Neue A2-Lehrer Zahlungsabfrage erstellt mit";
const PC_SUCCESS_TEACHERS_SUFFIX = "aktiven A2-Lehrern";

// Toast titles
const PC_TOAST_TITLE_SUCCESS = "Erfolg";
const PC_TOAST_TITLE_ERROR = "Fehler";
const PC_TOAST_DURATION_SUCCESS = 5;
const PC_TOAST_DURATION_ERROR = 5;

// Menu text constants
const PC_MENU_TITLE = "A2-Zahlungsbestätigung";
const PC_MENU_CREATE_QUERY = "Neue A2-Zahlungsabfrage erstellen";
const PC_MENU_START_CONFIRMATION = "Bestätigung starten";
const PC_MENU_CHECK_STATUS = "Status prüfen";
const PC_MENU_SEND_REMINDERS = "Erinnerungen senden";
const PC_MENU_TEST_FUNCTION = "Test-Funktion";

// Toast message constants
const PC_TOAST_NOT_IMPLEMENTED = "Diese Funktion wird in der nächsten Phase implementiert";
const PC_TOAST_TITLE_INFO = "Information";
const PC_TOAST_DURATION = 3;

// File and folder constants
const PC_TEACHER_LIST_FILENAME = "Lehrerliste";
const PC_FORMS_FOLDER_NAME = "Zahlungsbestätigung_Formulare";

// Validation constants
const PC_MIN_TEACHER_ID_LENGTH = 2;
const PC_MAX_TEACHER_ID_LENGTH = 5;
const PC_REQUIRED_EMAIL_DOMAIN = "@"; // Basic email validation
