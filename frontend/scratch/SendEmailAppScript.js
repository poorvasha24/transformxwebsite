function onFormSubmit(e) {
  var formResponse = e.response;
  // First, try to get the email if "Collect email addresses" is enabled in form settings
  var teamLeadEmail = formResponse.getRespondentEmail();
  
  // If not collected automatically, search the form answers for an email field
  if (!teamLeadEmail) {
    var itemResponses = formResponse.getItemResponses();
    for (var i = 0; i < itemResponses.length; i++) {
      var itemResponse = itemResponses[i];
      var title = itemResponse.getItem().getTitle().toLowerCase();
      
      // Look for a field asking for the email (adjust the exact text if needed)
      if (title.includes("team lead mail id") || title.includes("email") || title.includes("mail")) {
        teamLeadEmail = itemResponse.getResponse();
        break;
      }
    }
  }
  
  if (teamLeadEmail) {
    var subject = "TRANSFORMX Registration Confirmation";
    var message = "HI!";
    
    MailApp.sendEmail(teamLeadEmail, subject, message);
  } else {
    console.error("Could not find team lead email in the form response.");
  }
}

// Optional: Run this function ONCE manually from the editor to set up the automatic trigger
function setupTrigger() {
  var form = FormApp.getActiveForm();
  
  // Clean up any existing triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create a new trigger for form submission
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
}
