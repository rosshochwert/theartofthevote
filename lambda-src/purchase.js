const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
	"Access-Control-Allow-Origin" : "*",
	"Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = async function(event) {
	if (event.httpMethod !== "POST") {
		return {
      statusCode: 200, // <-- Important!
      headers,
      body: "This was not a POST request!"
    };
  }

  const data = JSON.parse(event.body);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data,
    currency: "usd"
  });

  let object = {
    clientSecret: paymentIntent.client_secret
  }
  return {
    statusCode: 200, // <-- Important!
      headers,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret
      })
  }

};