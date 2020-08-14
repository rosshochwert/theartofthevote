const { v4: uuidv4 } = require('uuid');

const handler = StripeCheckout.configure({
	key: STRIPE_PUBLISHABLE_KEY,
	image: "https://stripe.com/img/documentation/checkout/marketplace.png",
	locale: "auto",
	token: async (token) => {
		let response, data;

		try {
			response = await fetch(LAMBDA_ENDPOINT, {
				method: "POST",
				body: JSON.stringify({
					token,
					amount,
					idempotency_key: uuid4()
				}),
				headers: new Headers({
					"Content-Type": "application/json"
				})
			});

			data = await response.json();
		} catch (error) {
			console.error(error.message);
			return;
		}
	}
});

const amount = 1000;

document.addEventListener("DOMContentLoaded", function(){
	document.querySelector("button").addEventListener("click", function() {
		handler.open({
			amount,
			name: "Test Shop",
			description: "A Fantastic New Widget"
		});
	});
});