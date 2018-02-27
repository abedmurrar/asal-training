document.addEventListener('DOMContentLoaded', main);

function main() {
    var form = document.getElementById('regform');
    if (form) {
        var email = document.getElementById('email');
        email.addEventListener('keydown', function() {
            email.classList.remove('error');
            email.classList.remove('correct');
        })
        var span = document.getElementById('msg');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (email.value != "") {
                if (isEmailValid(email.value)) {
                    span.innerHTML = 'Email is valid!';
                    email.classList.add('correct');
                } else {
                    span.innerHTML = 'Email is not valid, try again !';
                    email.classList.add('error');
                }
            } else {
                span.innerHTML = 'at least give me an email :(';
                email.classList.add('error');
            }
        })
    }
}

function isEmailValid(email) {
    var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!regex.test(email))
        return false;
    return true
}