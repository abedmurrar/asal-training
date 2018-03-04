document.addEventListener('DOMContentLoaded', main);

function main() {

    let form = document.getElementById('loginform');
    if (form) {
        let email = emailInput();
        let span = spanMessage();
        let message;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (email.getValue().trim() != "") {
                if (isEmailValid(email.getValue())) {
                    message = 'Email is valid !';
                    email.setCorrect();
                } else {
                    message = 'Email is not valid, try again !';
                    email.setError();
                }
            } else {
                message = 'Please insert your email !';
                email.setError();
            }
            span.setMessage(message);
        })
    }
}

function isEmailValid(email) {
    email = email.toLowerCase();
    let regex = /^[a-z|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
    if (!regex.test(email))
        return false;
    return true
}

function emailInput() {
    let email = document.getElementById('email');
    email.addEventListener("keydown", clearClass);

    return {
        setError() {
            clearClass();
            email.classList.add('error');
        },
        setCorrect() {
            clearClass();
            email.classList.add('correct');
        },
        getValue() {
            return email.value;
        }
    }

    function clearClass() {
        email.classList.remove('correct');
        email.classList.remove('error');
    }
}

function spanMessage() {
    let allfields = document.getElementsByClassName('form-fields');
    let [, field] = allfields //[0].getElementsByClassName('msg')[0];
    let span = field.getElementsByClassName('msg')[0];
    console.log(span);

    return {
        setMessage(msg) {
            span.innerHTML = msg;
        }
    }
}