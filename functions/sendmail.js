const client = require('@sendgrid/client');

client.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name, donation) {
  template_id = 'd-54287736b4134ca386975f78d7a38bd4'
  if (donation==""){
    template_id = 'd-e785df7d137e49a08e15a855c70103dc'
  } else if (donation=="usDonation"){
    template_id = 'd-a72a79e60d9b4f209e7fa7cb809a1361'
  }
  return new Promise((fulfill, reject) => {
    const data = {
      from: {
        email: "support@theartofthevote.com",
        name: "Ross Hochwert"
      },
      reply_to: {
        email: email
      },
      template_id: template_id,
      personalizations: [
        {
          to: [{email: email}],
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