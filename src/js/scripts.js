var payWithCard = function(stripe, card, clientSecret) {
    loading(true);
    stripe
        .confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        })
        .then(function(result) {
            if (result.error) {
                // Show error to your customer
                showError(result.error.message);
            } else {
                // The payment succeeded!
                orderComplete(result.paymentIntent.id);
            }
        });
};

var orderComplete = function(paymentIntentId) {
	sendEmail(true)
    loading(false);
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;
};

var showError = function(errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
        errorMsg.textContent = "";
    }, 4000);
};

// Show a spinner on payment submission
var loading = function(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};

var sendEmail = function(donation) {

	var nameValue = document.getElementById("name").value;
	var emailValue = document.getElementById("email").value;

    fetch("/.netlify/functions/sendmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            	name: nameValue,
            	email: emailValue,
            	donation: donation
            }) //need to define how much to purchase first duh
        })
        .then(function(result) {
            return result.json();
        })
        .then(function(data) {

        })
}

function triggerBrowserValidation() {
    // The only way to trigger HTML5 form validation UI is to fake a user submit
    // event.
    var submit = document.createElement('input');
    var form = document.getElementById("payment-form");
    submit.type = 'submit';
    submit.style.display = 'none';
    form.appendChild(submit);
    submit.click();
    submit.remove();
}

document.addEventListener("DOMContentLoaded", function() {
	var stripe = Stripe("pk_test_51HFo77FL2039H5Ri4ovbl2tOvdsa1yhxoVRcJozYX1rsRv2KmYhSvgyNXvAO57CMw7QTxANJarZGTqpeNbscXCeW00DgsNrtjq", {
		maxNetworkRetries: 2
	});

    document.querySelector("button").disabled = true;
    fetch("/.netlify/functions/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: 100 //need to define how much to purchase first duh
        })
        .then(function(result) {
            return result.json();
        })
        .then(function(data) {
            var elements = stripe.elements({
                fonts: [{
                    cssSrc: 'https://fonts.googleapis.com/css?family=Roboto'
                }]
            });
            var style = {
                base: {
                    color: "#32325d",
                    fontFamily: 'Arial, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {
                        color: "#32325d"
                    }
                },
                invalid: {
                    fontFamily: 'Arial, sans-serif',
                    color: "#fa755a",
                    iconColor: "#fa755a"
                }
            };
            var card = elements.create("card", {
                style: style
            });
            // Stripe injects an iframe into the DOM
            card.mount("#card-element");
            card.on("change", function(event) {
                // Disable the Pay button if there are no card details in the Element
                document.querySelector("button").disabled = event.empty;
                document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
            });

            var form = document.getElementById("payment-form");

            form.addEventListener("submit", function(event) {
                event.preventDefault();
                // Trigger HTML5 validation UI on the form if any of the inputs fail
                // validation.
                var plainInputsValid = true;
                Array.prototype.forEach.call(form.querySelectorAll('input'), function(
                    input
                ) {
                    if (input.checkValidity && !input.checkValidity()) {
                        plainInputsValid = false;
                        return;
                    }
                });

                if (!plainInputsValid) {
                    triggerBrowserValidation();
                    return;
                } else {
                    payWithCard(stripe, card, data.clientSecret);
                }

                // Complete payment when the submit button is clicked
            });
        });

});