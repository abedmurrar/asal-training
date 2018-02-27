document.addEventListener('DOMContentLoaded', main);

function main() {

    var form = document.getElementById('regform');
    if (form) {
        var email = emailInput();
        var span = spanMessage();
        var message;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (email.getValue() != "") {
                if (isEmailValid(email.getValue())) {
                    message = 'Email is valid!';
                    email.setCorrect();
                } else {
                    message = 'Email is not valid, try again !';
                    email.setError();
                }
            } else {
                message = 'at least give me an email :(';
                email.setError();
            }
            span.setMessage(message);
        })
    }
}

function isEmailValid(email) {
    var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!regex.test(email))
        return false;
    return true
}

function emailInput() {
    var email = document.getElementById('email');

    email.addEventListener("keydown", clearClass);

    return {
        setError: function() {
            clearClass();
            email.classList.add('error');
        },
        setCorrect: function() {
            clearClass();
            email.classList.add('correct');
        },
        getValue: function() {
            return email.value;
        }
    }

    function clearClass() {
        email.classList.remove('correct');
        email.classList.remove('error');
    }
}

function spanMessage() {
    var span = document.getElementById('msg');

    return {
        setMessage: function(msg) {
            span.innerHTML = msg;
        }
    }
}