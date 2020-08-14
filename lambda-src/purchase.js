const stripe = require('stripe')(STRIPE_SECRET_KEY);

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
    amount: calculateOrderAmount(data),
    currency: "usd"
  });

  return {
    statusCode: 200, // <-- Important!
      headers,
      body: {
        clientSecret: paymentIntent.client_secret
      }
  }

};