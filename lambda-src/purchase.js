require('dotenv').config();

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

  // Parse the body contents into an object.
  const data = JSON.parse(event.body);

  // Make sure we have all required data. Otherwise, get outta here.
  if (!data.token || !data.amount || !data.idempotency_key) {
  	const message = "Required information is missing!";

  	console.error(message);

  	return {
  		statusCode,
  		headers,
  		body: JSON.stringify({
  			status: "failed",
  			message
  		})
  	};
  }

  let charge;

  try {
  	charge = await stripe.charges.create(
  	{
  		currency: "usd",
  		amount: data.amount,
  		source: data.token.id,
  		receipt_email: data.token.email,
  		description: `charge for a widget`
  	},
  	{
  		idempotency_key: data.idempotency_key
  	}
  	);
  } catch (e) {
  	let message = e.message;

  	console.error(message);

  	return {
  		statusCode: 424,
  		headers,
  		body: JSON.stringify({
  			status: "failed",
  			message
  		})
  	};
  }

  const status = (charge === null || charge.status !== "succeeded") ? "failed" : charge.status;

  return {
  	statusCode,
  	headers,
  	body: JSON.stringify({
  		status,
  		message: "Charge successfully created!"
  	})
  };
};