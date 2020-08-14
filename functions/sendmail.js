const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'rosshochwert@gmail.com',
  from: 'support@theartofthevote.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};


const statusCode = 200;
const headers = {
	"Access-Control-Allow-Origin" : "*",
	"Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event) {
/*	if (event.httpMethod !== "POST") {
		return {
      statusCode: 200, // <-- Important!
      headers,
      body: "This was not a POST request 3!"
    };
  }*/

  sgMail.send(msg);

  return {
    statusCode: 200, // <-- Important!
      headers,
      body: JSON.stringify({
        "clientSecret": "success"
      })
  }

};