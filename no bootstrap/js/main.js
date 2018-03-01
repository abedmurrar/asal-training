document.addEventListener('DOMContentLoaded', main);

function main() {

    var form = document.getElementById('loginform');
    if (form) {
        var email = emailInput();
        var span = spanMessage();
        var message;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (email.getValue() != "") {
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
    var regex = /^[a-z|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
    console.log(regex.exec(email));
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