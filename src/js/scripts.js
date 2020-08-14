var stripe = Stripe("pk_live_51HFo77FL2039H5RiYSleGu9sWCNWIZRy6PjTYkfLe7y8kpLiHNJ58Cri6FACnCc5ZxqAhqEm1ebYFRLKWRpoxHIx001zAuXrja");

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
    loading(false);
    document
        .querySelector(".result-message a")
        .setAttribute(
            "href",
            "https://dashboard.stripe.com/test/payments/" + paymentIntentId
        );
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

document.addEventListener("DOMContentLoaded", function() {
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
            var elements = stripe.elements();
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
        // Complete payment when the submit button is clicked
        payWithCard(stripe, card, data.clientSecret);
    });
        });

});