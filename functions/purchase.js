const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

stripe.setMaxNetworkRetries(2);

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
      body: "This was not a POST request 2!"
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