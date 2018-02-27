document.addEventListener('DOMContentLoaded', main);

function main() {
    var form = document.getElementById('regform');
    if (form) {
        var email = document.getElementById('email');
        var span = document.getElementById('msg');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (email.value != "") {
                if (isEmailValid(email.value)) {
                    span.innerHTML = 'Email is valid!';
                } else {
                    span.innerHTML = 'Email is not valid, try again !';
                }
            } else {
                span.innerHTML = 'at least give me an email :(';
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