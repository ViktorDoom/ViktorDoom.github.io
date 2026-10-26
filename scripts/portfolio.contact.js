// dit is ai om deliverable 2 senl te vervangen.
// alles wat met ai is gegenereert wordt duidelijk aangegeven



const form = document.getElementById("contact-form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const formStatus = document.getElementById("form-status");


form.addEventListener("submit", function (event) {

    // Block the request immediately.
    event.preventDefault();

    let formIsValid = true;

    // Clear previous error messages.
    clearErrors();


    // NAME
    if (nameInput.value.trim() === "") {
        showError(nameInput, "Please enter your name.");
        formIsValid = false;
    }


    // EMAIL
    if (emailInput.value.trim() === "") {
        showError(emailInput, "Please enter your email address.");
        formIsValid = false;
    }
    else if (!emailInput.validity.valid) {
        showError(emailInput, "Please enter a valid email address.");
        formIsValid = false;
    }


    // SUBJECT
    if (subjectInput.value.trim() === "") {
        showError(subjectInput, "Please enter a subject.");
        formIsValid = false;
    }


    // MESSAGE
    if (messageInput.value.trim() === "") {
        showError(messageInput, "Please enter a message.");
        formIsValid = false;
    }


    // Stop if validation failed.
    if (!formIsValid) {
        formStatus.textContent =
            "Please fill in all required fields correctly.";

        return;
    }


    /*
     * At this point every field is valid.
     *
     * This is where a request WOULD be allowed to happen.
     * For now there is no backend/request implementation.
     */

    formStatus.textContent =
        "Form is valid and ready to be submitted.";
});


function showError(input, message) {

    const errorElement = document.getElementById(
        `${input.id}-error`
    );

    errorElement.textContent = message;

    input.setAttribute("aria-invalid", "true");
}


function clearErrors() {

    const errorMessages =
        document.querySelectorAll(".error-message");

    errorMessages.forEach(function (error) {
        error.textContent = "";
    });


    const fields =
        form.querySelectorAll("input, textarea");

    fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
    });


    formStatus.textContent = "";
}