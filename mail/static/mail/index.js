document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());
  document.querySelector("#compose-form").addEventListener("submit",() => send_email());

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector("#individual-email").style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


// send an email when user submit the compose new email form
function send_email() {

  // Store the values the user has entered into variables

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
   // Post email to API route
  fetch('/emails' , {
    method: "POST",
    //data passed into web server must be in string 
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    })
    .catch(error => console.log(error));


  // Loads the sent mailbox
  load_mailbox('sent');

   // the form submission will be handled by javascript
  return false;
};



// Load the respective mailbox when the buttons are clicked
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector("#individual-email").style.display = "none";

  // Show the respective mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // Load the mailbox contents via a GET request to the API route
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    //console.log(emails);

    // 
    const emails_list = emails;
    console.log(emails_list)
    // Loop through the items in the array and create a div for each email
    emails_list.forEach(email=>{

      // Read email will appear with gray background, unread email will appear with white background
      if (email["read"] == false){
        var background_color = "white";
      }
      else{
        background_color = "#D3D3D3";
      }

      // Create the div for each email
      const element = document.createElement("div");
      element.classList.add("row","border","border-dark", "mt-1");

      const sender = document.createElement("div");
      sender.classList.add("col");

      const subject = document.createElement("div");
      subject.className = "col";
    
      const timestamp = document.createElement("div");
      timestamp.className = "col";
     
      sender.innerHTML = email["sender"];
      subject.innerHTML = email["subject"];
      timestamp.innerHTML = email["timestamp"];

      element.append(sender, subject, timestamp);
      element. style. backgroundColor = background_color;
      document.querySelector("#emails-view").append(element);

      const email_id = email["id"];

      // When the email is clicked, present the individual email contents
      element.addEventListener("click", () => email_content(`${email_id}`,`${mailbox}`))
    });
    })
}



// Present the individual email content
function email_content(email_id,mailbox){

  console.log(`This div has been clicked. The email id is ${email_id}`)

  // Send a PUT request to the API to mark the email as read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  // Show the individual-email view and hide other views
  document.querySelector("#individual-email").style.display = "block";
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Empty the contents of the div first
  document.querySelector("#individual-email").innerHTML = "";


  // Send a GET request to the API to request the email content
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(data => {
    const individual_email = data;
    console.log(individual_email);

    
    // Present the email contents in a div
    const element = document.createElement("div");
    element.classList.add("col");

    const sender = document.createElement("div");
    sender.className = "row";

    const recipients = document.createElement("div");
    recipients.className = "row";
    
    const timestamp = document.createElement("div");
    timestamp.className = "row";

    const body= document.createElement("div");
    body.classList.add("row", "mt-5", "mb-3","email-body");


    sender.innerHTML ="<b>From:</b>"+ "&nbsp" + individual_email["sender"];
    recipients.innerHTML = "<b>To: </b>" + "&nbsp"+ individual_email["recipients"];
    const subject =  individual_email["subject"];
    timestamp.innerHTML = "<b>Sent at: </b> " + "&nbsp" + individual_email["timestamp"];
    body.innerHTML = individual_email["body"];

    
    // Append the individual contents into the div
    element.append(sender, recipients, timestamp, body);

    // Display the content of the email
    document.querySelector('#individual-email').innerHTML = `<h3>${subject}</h3>`;
    document.querySelector("#individual-email").append(element);

    // Add in a reply button
    const reply_archive = document.createElement("div")
    reply_archive.classList.add("row", "mt-5")

    const reply_button = document.createElement("button");
    reply_button.classList.add("col-md-2","btn", "btn-primary");
    const reply_text = document.createTextNode ("Reply");
    reply_button.append(reply_text);
    reply_archive.append(reply_button);

    document.querySelector("#individual-email").append(reply_archive);

    // If the reply button is clicked, bring user to the email composition form
    reply_button.addEventListener("click", ()=>{

       // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector("#individual-email").style.display = 'none';

      // Prefill composition fields
      document.querySelector('#compose-recipients').value = individual_email["sender"];
      if (individual_email["subject"].startsWith("Re: ")){
        document.querySelector('#compose-subject').value = individual_email["subject"];
      }
      else{
        document.querySelector('#compose-subject').value = "Re: " + individual_email["subject"];
      }
      document.querySelector('#compose-body').value = `On ${individual_email["timestamp"]} , ${individual_email["sender"]} wrote: ${individual_email["body"]}`;
    });

   
    // If viewing an inbox or archive email, there should be an archive button
    if (mailbox == "inbox"  || mailbox =="archive"){
      console.log("I am clicking into an eamil from the inbox or archive");

      // Create the archive button 
      const archive_button = document.createElement("button");

      // Create the text for the archive button depending on whether the email is archived
      var message = "";
      if (individual_email["archived"]== true){
        message = "Unarchive";
      }
      else{
        message = "Archive";
      }

      // Add the archive button into the reply_archive div
      const archive_text = document.createTextNode(message);
      archive_button.classList.add("col-md-2","offset-md-1","btn","btn-primary");
      archive_button.append(archive_text);
      reply_archive.append(archive_button);
      
     

      // Set the new archive_status 
      if (individual_email["archived"] == true){
        var archive_status = false;
      }
      else{
        archive_status = true;
      }

      // When archive button is clicked, send a PUT request to update the archive status
      archive_button.addEventListener("click", () => {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: archive_status
          })
        })
        // loads the user's inbox
        load_mailbox("inbox");
      })
    }
  })
}
  

