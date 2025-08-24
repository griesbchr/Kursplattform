# Kursplattform - Google Apps Script Project Documentation

## Project Overview

This is a comprehensive Google Apps Script system for managing a course platform ("Kursplattform") in German. The system handles course management, student enrollments, teacher administration, billing, payments, and document generation. Each folder represents a separate Google Apps Script project with its own unique script ID.

## Project Structure & Architecture

### Core Projects

- **\_CourseTable**: Main course management and billing system
- **\_Enrollment**: Student enrollment and registration handling
- **\_TeacherFiles_Scripts**: Teacher file management and course operations
- **\_TeacherTable**: Teacher administration
- **\_APIs**: Central API coordination
- **\_DataLib_Scripts**: Data access layer and utilities
- **\_Utils**: Shared utility functions

### Specialized Projects

- **\_TeacherInvoiceHandler**: Teacher billing and invoice generation
- **\_FormHandler**: Form processing and web app functionality
- **\_ContractHandler**: Course contract generation
- **\_Mail_Scripts**: Email automation
- **\_Roomusage**: Room usage tracking
- **\_TeacherFiles_Getter**: Teacher file data retrieval

### Bounded Projects

- **teacher_file_bounded**: Scripts bound to teacher spreadsheets
- **TF_bounded**: Alternative teacher file bound scripts

## Technology Stack

### Google Services Used

- **Google Apps Script**: Primary platform (V8 runtime)
- **Google Sheets**: Data storage and UI
- **Google Drive**: File management and sharing
- **Google Docs**: Document generation
- **Google Gmail**: Email automation
- **Google Picker API**: File selection dialogs
- **Advanced Drive Service**: Enhanced file operations

### External Libraries

- **pdf-lib**: PDF manipulation (loaded from CDN)
- **XML parsing**: Bank payment file processing

## Key Configuration & Constants

### Time Zone

All projects use `Europe/Vienna` timezone.

### Important File IDs & Folders

```javascript
// Core Data Files
COURSETABLEFILENAME = "Kursliste";
ENROLLMENTFILENAME = "Anmeldeliste";
TEACHERTABLEFILENAME = "Lehrerliste";

// Folders
DATASOURCESFOLDERNAME = "Datenquellen";
DATSOURCESFOLDERIS = "1DrVV2cLEns0cpWSys3hqqreMZNqN5QfM";
ARCHIVEFOLDERID = "1_kLXIfPRkGY1i7uxNAcVmPS0M9SxFju5";
TEACHERINVOICESFOLDERID = "1hXoFf8pDjFFXFlgjPMXlBovis90IwnKz";

// Templates
INVOICETEMPLATEFILEID = "1HcJ320Bsg8iHM0RB4DDjDEw9Yw9jqvVpKzppn68QESE";
OFFICEINVOICETEMPLATEFILEID = "1HKZJ-1ztxbniS2Nkl8gMowd0te4GTzUwPNyzFK2xYvc";
```

### API Endpoints

```javascript
// Teacher Files API
WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzixZZxNOTyKnmJrrAka_SmyCbqp2jT4gKfwPJ4-QiPxV0mjCKxAjyS6ClcklsTRwxE_w/exec";

// Add Student Base URL
ADDSTU_BASEURL =
  "https://script.google.com/a/macros/kursplattform.at/s/AKfycbyW-KuOy6LFZN76Vc30HZ1D8s-mC_5XGJcsLyOdkyUjKXngs2_Azoe8j2OD3nyXH9UkCQ/exec?id=";

// Getter API
WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbxyohLxJD_JnmiZqCgsJEXn_IgHuaoaYukPXKMaXzu8CqydpOuc-7pVPEwFAL_OfAEP/exec";
```

## Library Dependencies

### Inter-Project Libraries

Projects reference each other as libraries:

- **ET**: Enrollment library (`1OPP8-30DzKxaSh0kIAcALVFrqjbEAVTRSRFBFHIUBlicXwkpUwV2YTjK`)
- **DATA**: Data library (`1iWvHa8GzRyxXEdInfoX4eZKxrvm8WTiDwAl72QOmx47ovya5FoZFVJfh`)
- **CT**: Course Table library (`18e4kEt7-LyH61WRJO6bOJYyt2Tp_IVX2c-CQXnaH9WrnTWqAavGSDfeD`)
- **UTLS**: Utilities library

## Key Data Structures

### Status Values

```javascript
// Payment Status
PAYMENTSTATUSNOTDUE = "nicht verrechnet";
PAYMENTSTATUSDUE = "nicht bezahlt";
PAYMENTSTATUSWRONGAMOUNT = "falscher Betrag";
PAYMENTSTATUSPAIED = "bezahlt";
PAYMENTSTATUSPAIEDANDCHECKED = "bezahlt & geprüft";

// Course Status
NOCOURSEVALUE = "Kein Kurs";
COURSESTARTEDVALUE = "Kurs läuft";
DEREGISTEREDVALUE = "Abgemeldet";

// Contact Status
NOCONTACT = "Noch offen";
ACTIVECONTACT = "Aktiv";

// Colors for UI
YELLOW = "#fce8b2";
RED = "#f4c7c3";
GREEN = "#b7e1cd";
```

### ID Generation

- Course IDs: 4 characters starting with "K"
- Student IDs: 4 characters starting with "S"
- Teacher IDs: 3 characters

## Core Functionality

### Course Management (\_CourseTable)

- **Course Creation**: `addCourse.js` - Complete course setup with billing formulas
- **Payment Processing**: Support for up to 5 partial payments plus saldo payment
- **Admin Fee Management**: Automatic calculation for courses ≥ minimum hours
- **Data Source Generation**: Creates export files for external billing systems
- **XML Payment Import**: Bank file processing with automatic payment matching
- **Room Billing**: Location-based rental calculations
- **Formula Generation**: Complex spreadsheet formulas for payment status tracking
- **Billing Status Management**: Complete workflow from course start to completion

#### Key Course Table Columns:

```javascript
// Course Billing Sheet Column Constants
BIL_ADMINFEESTATUSCOL = 12; // Admin fee payment status
BIL_P1DUECOL = 21; // Payment 1 due amount
BIL_P1BOOKINGCOL = 20; // Payment 1 booking reference
BIL_BILLINGSTATUS = 51; // Overall billing status
BIL_FINALCOURSEHOURS = 63; // Final course hours for billing
BIL_TEACHERPAYMENTNUMNER = 65; // Teacher payment reference
```

### Student Enrollment (\_Enrollment)

- **Registration Management**: Complete student registration workflow
- **Pre-registration Handling**: Future course enrollment system
- **Contact Status Tracking**: Multi-stage communication tracking
- **Course Assignment**: Automatic and manual student-course matching
- **Teacher Allocation**: Teacher assignment to students
- **Statistics Generation**: Comprehensive reporting capabilities
- **Web App Integration**: HTML forms for student data collection

#### Key Enrollment Columns:

```javascript
CONTACTSTATUSCOL = 5; // Student contact status
COURSESTATUSCOL = 6; // Course enrollment status
TEACHERCOL = 7; // Assigned teacher
COURSECONTRACTSTATUSCOL = 9; // Contract status
PREREGISTRATIONCOL = 10; // Pre-registration data
```

### Teacher Administration (\_TeacherFiles_Scripts, \_TeacherTable, teacher_file_bounded)

- **Teacher File Creation**: Automated spreadsheet generation from templates
- **Course Assignment**: Multi-threaded course distribution to teachers
- **Billing Integration**: Teacher payment calculations and tracking
- **File Sharing**: Automated permission management
- **Attendance Tracking**: Student attendance monitoring
- **Room Rent Calculations**: Location-based cost allocation
- **Archive Operations**: End-of-term file management
- **Email Notifications**: Automated teacher communication

#### Key Teacher File Components:

- **Student List Sheet**: Individual student tracking
- **Attendance Sheet**: Lesson-by-lesson tracking
- **Billing Sheets**: Course and room billing
- **Formula Sheet**: Calculation templates

### Document Generation & Templates

- **Course Contracts**: Automated contract generation from templates
- **Teacher Invoices**: PDF creation with course data
- **Room Billing Documents**: Location-specific billing
- **PDF Merging**: Multi-document consolidation
- **QR Code Generation**: Payment integration
- **Email Templates**: HTML email formatting

### Web Applications & Forms

- **FormHandler**: Complete form processing system with doGet/doPost
- **Student Registration Forms**: Multi-step enrollment process
- **Teacher Data Collection**: Customized forms per teacher
- **Payment Processing Forms**: Bank integration interfaces
- **File Picker Dialogs**: Google Drive integration for file selection

### API System & Communication

- **Multi-Project APIs**: Inter-system communication
- **Threaded Requests**: Configurable parallel processing
- **Error Handling**: Comprehensive logging and user feedback
- **Webhook Endpoints**: External system integration
- **Authentication**: OAuth token management for Google services

#### Key API Endpoints:

```javascript
// Teacher Files API actions
"create_course", "create_courses", "create_courses_multithreaded";
"share_teacher_file", "fetch_mails", "return_student";
"deroll_student", "generate_course_contract";
"add_empty_student", "add_student";
```

## UI Components

### Menu Systems

Each main project has extensive custom menu systems:

- **Datenexport**: Data source creation
- **Zahlungsimport**: Payment import and processing
- **Anmeldungen**: Enrollment management
- **Lehrerdateien**: Teacher file operations
- **Lehrerabrechnung**: Teacher billing

### HTML Components

- **Picker dialogs**: Google Drive file selection
- **Web apps**: Form handling and data input
- **Modal dialogs**: User interactions

## Advanced System Features

### Trigger-Based Processing

#### Teacher Invoice Generation

- **Trigger Management**: Time-based triggers for batch invoice creation
- **Progress Tracking**: Script properties maintain processing state
- **Queue Management**: Teacher ID queues for large-scale operations
- **Error Recovery**: Automatic cleanup and restart capabilities
- **Email Notifications**: Completion alerts to administrators

```javascript
// Trigger Configuration
TRIGGER_INTERVAL = 30; // Minutes between trigger executions
TRIGGER_ID_KEY = "TRIGGER_ID";
TEACHER_ID_QUEUE_KEY = "TEACHER_ID_QUEUE";
TEACHER_ID_DONE_KEY = "TEACHER_ID_DONE";
```

### Asynchronous Processing (Async.js)

- **Background Execution**: Non-blocking operations for UI responsiveness
- **Timed Execution**: Delayed function calls via triggers
- **Handler Management**: Dynamic function execution with parameters
- **Cache Integration**: Parameter storage via CacheService
- **Automatic Cleanup**: Self-cleaning trigger removal

### Payment Processing System

#### Bank File Import

- **XML Parsing**: ISO 20022 SEPA format support
- **Automatic Matching**: Reference number-based payment assignment
- **Multi-Currency**: EUR primary with format localization
- **Error Handling**: Malformed data recovery
- **Manual Override**: Admin correction capabilities

#### Payment Types Supported:

```javascript
// Payment Categories
"admin"; // Administrative fees
"payment1"; // First partial payment
"payment2"; // Second partial payment
"payment3"; // Third partial payment
"payment4"; // Fourth partial payment
"saldo"; // Final balance payment
"ass_vom"; // Association VOM fees
"ass_maz"; // Association MAZ fees
"office"; // Office/administrative payments
```

### Advanced UI Components

#### Menu System Architecture

Each project implements comprehensive menu systems:

- **Datenexport**: Data source creation with multiple payment types
- **Zahlungsimport**: Bank file import and payment processing
- **Anmeldungen**: Student enrollment and contract management
- **Lehrerdateien**: Teacher file operations and maintenance
- **Lehrerabrechnung**: Teacher billing and invoice generation
- **Archivieren**: End-of-term archival operations

#### HTML Integration

- **Google Picker API**: Advanced file selection with filtering
- **Modal Dialogs**: User input collection
- **Progress Indicators**: Long-running operation feedback
- **Responsive Design**: Mobile-friendly interfaces
- **Client-Server Communication**: `google.script.run` integration

### Data Management & Storage

#### Master Data Files

```javascript
// Core Data Sources
DISTRICTSFILENAME = "Zweigstellenliste"; // Location master
COURSENUMBERFILENAME = "Kursnummerliste"; // Course type codes
COURSETYPESFILENAME = "Kursartenliste"; // Course categories
TEACHERTABLEFILENAME = "Lehrerliste"; // Teacher master
ENROLLMENTFILENAME = "Anmeldeliste"; // Student master
```

#### ID Generation System

- **Course IDs**: 4-character format starting with "K"
- **Student IDs**: 4-character format starting with "S"
- **Teacher IDs**: 3-character numeric format
- **Auto-increment**: Stored in dedicated files with version control

### Email System Architecture

#### Multi-Alias Support

```javascript
// Email Aliases (0-based indexing)
// 0: Main admin email
// 1: anmeldungen@kursplattform.at (registrations)
// 2: noreply@kursplattform.at (automated)
```

#### Email Types

- **Plain Text**: Basic notifications
- **HTML Templates**: Rich formatting with variable substitution
- **Attachments**: Document delivery (invoices, contracts)
- **Batch Operations**: Bulk email with error handling
- **Template System**: Reusable email templates

### File Management System

#### Template-Based Generation

- **Teacher Files**: Automated spreadsheet creation from master template
- **Course Contracts**: Document generation with data substitution
- **Invoice Templates**: PDF generation with dynamic content
- **Archive Structure**: Organized by date and type

#### Permission Management

- **Automated Sharing**: Role-based access control
- **Editor Assignment**: Teacher file permissions
- **Viewer Access**: Read-only sharing for stakeholders
- **Archive Security**: Historical data protection

### Formula Generation System

#### Dynamic Spreadsheet Formulas

The system generates complex Google Sheets formulas for:

- **Payment Status**: Multi-condition payment tracking
- **Billing Calculations**: Course hours and pricing
- **Conditional Formatting**: Visual status indicators
- **Data Validation**: Dropdown constraints
- **Cross-Sheet References**: Inter-sheet data connections

#### Business Rule Implementation

```javascript
// Example: Admin Fee Formula Generation
function getAdminFeeFormula(row) {
  return `=IF(${FINAL_HOURS_COL}${row}>=${MIN_HOURS},${ADMIN_FEE_AMOUNT},"")`;
}
```

## Data Sources & File Management

### Core Data Files

- Districts/Locations (`Zweigstellenliste`)
- Course numbers (`Kursnummerliste`)
- Course types (`Kursartenliste`)
- Payment status options
- Teacher and student master data

### File Operations

- Automated file creation and sharing
- Archive functionality
- Template-based document generation
- Permission management

## Payment Processing

### Bank Integration

- XML file import (ISO 20022 format)
- Automatic payment matching
- Reference number processing
- Multi-currency support (primarily EUR)

### Billing Cycles

- Partial payments (up to 5 installments)
- Admin fees for courses with minimum hours
- Teacher billing and invoicing
- Office/administrative billing

## Error Handling & Logging

### Logging Strategy

- Comprehensive console.log usage
- Error catching in critical operations
- User notification via Browser.msgBox
- Email notifications for system events

### Lock Management

- Script locks for concurrent operation prevention
- Timeout handling for long operations

## Development & Deployment

### Version Control

- Individual `.clasp.json` files per project
- Batch pull/push operations via `pull-all.sh`
- Git integration (manual push required)

### Project Management

- Each folder = separate Apps Script project
- Shared libraries for common functionality
- Development mode libraries for testing

## Security & Permissions

### OAuth Scopes

Projects require various Google API scopes:

- Drive API access
- Gmail sending
- Spreadsheet manipulation
- Advanced services as needed

### File Sharing

- Automated permission setting
- Role-based access (editor/viewer)
- Teacher file isolation

## Performance Considerations

### Optimization Strategies

- Multithreaded API calls
- Batch operations where possible
- Caching via CacheService
- Efficient range operations

### Limitations

- 6-minute execution time limits
- Trigger-based processing for long operations
- Memory management for large datasets

## Testing & Quality Assurance

### Test Functions

- Dedicated test functions in most modules
- API endpoint testing
- Data validation checks
- Mock data generation

## Common Patterns

### API Communication

```javascript
function sentApiMessage(action_string, dict) {
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(dict),
  };
  UrlFetchApp.fetch(URL + "?request_type=" + action_string, options);
}
```

### Data Loading

```javascript
function getFileContent(filename) {
  let file_ID = DriveApp.getFilesByName(filename).next().getId();
  return SpreadsheetApp.openById(file_ID).getDataRange().getValues();
}
```

### Error Handling

```javascript
try {
  // operation
} catch (e) {
  console.error("[MODULE] Error message: " + e.message);
  Browser.msgBox("User-friendly error message");
}
```

## Localization

- **Language**: German (Austria)
- **Currency**: Euro (EUR)
- **Date Format**: DD.MM.YYYY
- **Time Zone**: Europe/Vienna

## Detailed Business Logic & Workflows

### Course Lifecycle Management

#### 1. Course Creation Workflow

```javascript
// Course Status Progression
"Kurs nicht gestartet"     → Course created but not active
"Kurs wird gestartet"      → Course initialization in progress
"Kurs läuft"               → Active course with students
"Kurs abgeschlossen"       → Completed course ready for billing
"Abgemeldet"               → Student withdrawn from course
```

#### 2. Payment Processing Workflow

- **Phase 1-4**: Partial payments (configurable amounts)
- **Phase 5**: Saldo (final balance) payment
- **Admin Fee**: Applied to courses ≥ minimum hours
- **Association Fees**: VOM/MAZ membership dues
- **Office Fees**: Administrative charges

#### 3. Teacher File Management

```javascript
// Teacher File Structure
STUDENTSSHEETNAME = "Schülerliste"; // Student roster
ATTENDANCESHEETNAME = "Anwesenheitsliste"; // Attendance tracking
BILLINGSTUDENTSHEETNAME = "Abrech_Schüler"; // Student billing
BILLINGCOURSESHEETNAME = "Abrech_Kurse"; // Course billing
BILLINGROOMSHEETNAME = "Abrech_Räume"; // Room billing
```

### Billing & Financial Management

#### Course Billing Rules

- **Price per Lesson**: Location and course type dependent
- **Room Rent**: District-specific charges
- **Admin Fee Minimum**: Hours threshold for fee application
- **Payment Matching**: Automatic via reference numbers
- **Saldo Calculation**: Final payment after all partials

#### Teacher Compensation System

- **Hourly Rates**: Course type and experience based
- **Room Rent Deductions**: Location charges passed through
- **Invoice Generation**: Automated PDF creation
- **Payment Tracking**: Status monitoring per teacher

### Data Integration Patterns

#### Inter-Project Communication

```javascript
// API Communication Pattern
function sentApiMessage(action_string, dict) {
  dict["LehrerID"] = SpreadsheetApp.getActiveSpreadsheet().getName().split("_")[0];
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(dict),
  };
  UrlFetchApp.fetch(WEBAPP_URL + "?request_type=" + action_string, options);
}
```

#### Data Synchronization

- **Student Status**: Real-time updates across systems
- **Course Progress**: Attendance and completion tracking
- **Payment Status**: Multi-system payment verification
- **Teacher Assignments**: Dynamic allocation updates

### Location-Based Business Rules

#### District Management

```javascript
// District-Specific Configuration
function getRoomRent(district) {
  /*...*/
} // Location-based pricing
function getAssociation(district) {
  /*...*/
} // Association membership
function getPaymentName(district) {
  /*...*/
} // Bank account details
function getPaymentIban(district) {
  /*...*/
} // IBAN for payments
```

#### Course Location Types

- **Bei Schüler** (At Student's Location): Home lessons
- **Bei Lehrer** (At Teacher's Location): Teacher's studio
- **Am Kursort** (At Course Location): Designated venues

### Error Handling & Recovery

#### Comprehensive Error Management

- **Try-Catch Blocks**: Graceful error handling
- **User Notifications**: Browser.msgBox for user feedback
- **Logging System**: Console.log with module prefixes
- **Email Alerts**: Critical error notifications
- **Recovery Procedures**: Automatic cleanup and restart

#### Data Validation

- **Input Validation**: Dropdown constraints and data validation
- **Business Rule Enforcement**: Automatic formula validation
- **Reference Integrity**: Cross-system data consistency
- **Backup Procedures**: Archive and recovery systems

### Performance Optimization

#### Multi-Threading Strategy

```javascript
// Configurable Threading
NUM_THREADS = 5; // Maximum concurrent operations
function getThreadedTFApi(action_string, arglist) {
  var number_threads = arglist.length > NUM_THREADS ? NUM_THREADS : arglist.length;
  // Distribute work across threads
}
```

#### Batch Processing

- **Bulk Operations**: Large-scale data processing
- **Queue Management**: Ordered operation execution
- **Memory Management**: Efficient data handling
- **Time-based Execution**: Spread operations over time

### Security & Access Control

#### Permission Layers

- **Script-level**: Apps Script execution permissions
- **File-level**: Google Drive sharing permissions
- **Sheet-level**: Protected ranges and editing restrictions
- **User-level**: Role-based access control

#### Data Protection

- **Archive Access**: Historical data security
- **Student Privacy**: PII protection measures
- **Financial Data**: Secure payment information
- **Audit Trail**: Change tracking and logging

## Development Patterns & Best Practices

### Common Code Patterns

#### API Communication

```javascript
// Standardized API Call Pattern
function sentApiMessage(action_string, dict) {
  // Add teacher ID from spreadsheet name
  dict["LehrerID"] = SpreadsheetApp.getActiveSpreadsheet().getName().split("_")[0];
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(dict),
  };
  try {
    UrlFetchApp.fetch(WEBAPP_URL + "?request_type=" + action_string, options);
  } catch (e) {
    Browser.msgBox("API Error: " + e.message);
  }
}
```

#### Data Loading Pattern

```javascript
// File-based Data Access
function getFileContent(filename) {
  let file_ID = DriveApp.getFilesByName(filename).next().getId();
  return SpreadsheetApp.openById(file_ID).getDataRange().getValues();
}

// Column-specific Data Access
function getFileColContent(filename, col) {
  return getFileContent(filename).map((row) => row[col - 1]);
}
```

#### Error Handling Pattern

```javascript
// Comprehensive Error Management
try {
  // operation
  console.log("[MODULE] Operation successful");
} catch (e) {
  console.error("[MODULE] Error: " + e.message);
  Browser.msgBox("User-friendly error message: " + e.message);
  // Optional: Send error email for critical failures
}
```

#### Web App Handler Pattern

```javascript
function doPost(e) {
  switch (e.parameter["request_type"]) {
    case "action_name":
      var data = JSON.parse(e.postData.contents);
      handleAction(data);
      break;
    default:
      throw new Error("Unknown action: " + e.parameter["request_type"]);
  }
}
```

### Utility Functions & Helpers

#### Spreadsheet Utilities

```javascript
// Dynamic Dropdown Creation
function makeDropdown(range, value_list, default_option="", allow_invalid=false)

// Conditional Formatting
function makeColorOnValueFormat(spreadsheet, range, value, color)

// Date/Time Formatting
function getToday(ss)  // Returns DD.MM.YYYY format
function getTodayWithTime(ss)  // Returns DD.MM.YYYY HH:mm format

// Currency Formatting
function format_currency(numberstr, post_comma_digits = 2)  // Returns "€ 1.234,56"
```

#### File Management Utilities

```javascript
// File Access by Name
function getFile(filename)  // Returns SpreadsheetApp object

// Row Finding
function findValueInCol(sheet, col, val)  // Returns row number

// Column Operations
function getColValues(sheet, col, rows)  // Returns array of values

// Checked Items
function getCheckedRows(sheet, col)  // Returns array of checked row numbers
```

### Testing & Quality Assurance

#### Test Function Patterns

```javascript
// Naming Convention: test_[functionName]
function test_findPattern() {
  var result = findPattern("K1234", "Payment for course K1234");
  console.log("Test result:", result);
}

// Mock Data Generation
function createTestData() {
  return {
    course_id: "K0001",
    student_id: "S0001",
    teacher_id: "001",
  };
}
```

#### Debugging Utilities

```javascript
// Logging with Module Prefixes
console.log("[CT] Course Table operation");
console.log("[ET] Enrollment operation");
console.log("[TF] Teacher Files operation");

// Debug Data Display
function printAliasOrder() {
  console.log(GmailApp.getAliases());
}
```

### Performance Considerations

#### Batch Operations

```javascript
// Efficient Range Operations
var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
// Process in memory
sheet.getRange(1, 1, lastRow, lastCol).setValues(values);
```

#### Memory Management

```javascript
// Array Processing
var data_array = sheet.getDataRange().getValues();
var filtered_data = data_array.filter((row) => row[STATUS_COL] === "Active");
```

#### Execution Time Management

```javascript
// Time-based Triggers for Long Operations
ScriptApp.newTrigger("longRunningFunction")
  .timeBased()
  .after(1000) // 1 second delay
  .create();
```

### Deployment & Version Control

#### Project Management

- **Individual .clasp.json**: Each folder = separate project
- **Shared Libraries**: Common functionality as libraries
- **Development Mode**: Testing without affecting production
- **Batch Operations**: `pull-all.sh` for synchronized updates

#### Environment Management

```javascript
// Environment-specific URLs
const WEBAPP_URL_DEV = "...dev deployment...";
const WEBAPP_URL_PROD = "...production deployment...";

// Feature Flags
const ENABLE_ADVANCED_FEATURES = true;
```

### Integration Patterns

#### Google Services Integration

```javascript
// Drive API Usage
DriveApp.getFilesByName(filename).next().getId();

// Gmail API with Aliases
GmailApp.sendEmail(to, subject, body, {
  from: GmailApp.getAliases()[1],  // Use alias
  replyTo: "admin@example.com"
});

// Calendar Integration (if needed)
CalendarApp.getDefaultCalendar().createEvent(...);
```

#### External Service Integration

```javascript
// PDF Library Loading
const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
eval(UrlFetchApp.fetch(cdnjs).getContentText());
```

This comprehensive documentation provides the complete foundation for understanding and working with the Kursplattform Google Apps Script system. The patterns, structures, and examples shown here represent the actual implementation details found throughout the codebase.
