const client = require('@sendgrid/client');

client.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name, donation) {
  template_id = 'd-3f4e0602bfe64c6aa141e69f2d1ae8c2'

  if (donation=="notUsDonation"){
    template_id = 'd-54287736b4134ca386975f78d7a38bd4'
  } else if (donation=="usDonation"){
    template_id = 'd-698fee4171eb4abda875eb2b60ecdf39'
  } else if (donation=="justDonation"){
    template_id = 'd-3f4e0602bfe64c6aa141e69f2d1ae8c2'
  }
  return new Promise((fulfill, reject) => {
    const data = {
      from: {
        email: "support@theartofthevote.com",
        name: "The Art of the Vote"
      },
      reply_to: {
        email: email
      },
      template_id: template_id,
      personalizations: [
        {
          to: [{email: email}],
          bcc: [{email: 'monika.pawar48@gmail.com'}],
          dynamic_template_data: {
            "name": name
          }
        }
      ],
    };

    const request = {
      method: "POST",
      url: "/v3/mail/send",
      body: data
    };

    client
      .request(request)
      .then(([response, body]) => {
        console.log(response.statusCode);
        console.log(body);
        fulfill(response);
      })
      .catch(error => reject(error));
  });
}

const statusCode = 200;
const headers = {
	"Access-Control-Allow-Origin" : "*",
	"Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event) {

  console.log("accessed")
  const body = JSON.parse(event.body)
  const name = body.name
  const email = body.email
  const donation = body.donation

  response = await sendWelcomeEmail(email, name, donation)

  console.log(response)

  return {
    statusCode: 200, // <-- Important!
      headers,
      body: JSON.stringify({
        "response": response,
        "email": "email"
      })
  }

};