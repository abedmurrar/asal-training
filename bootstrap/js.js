document.addEventListener('DOMContentLoaded', main);

function main(){
    var form = document.getElementById('test-form');
    if(form){
        var email = document.getElementById('email');
        form.addEventListener('submit', function(event){
            event.preventDefault();
            var div = document.getElementById('emailcon');
            var span = document.getElementById('isvalid');
            if(email.value != "") {
                if (isEmailValid(email.value)) {
                    span.innerHTML='Email is valid!';
                    span.style.color='GREEN';
                    div.classList.add('has-success');
                    div.classList.remove('has-error');
                    div.classList.remove('has-warning');
                }
                else {
                    span.innerHTML='Email is not valid, try again !';
                    span.style.color='RED';
                    div.classList.add('has-error');
                    div.classList.remove('has-success');
                    div.classList.remove('has-warning');
                }
            }
            else{
                span.innerHTML= 'at least give me an email :(';
                span.style.color='YELLOW';
                div.classList.add('has-warning');
                div.classList.remove('has-success');
                div.classList.remove('has-error');
            }
        })
    }
}

function isEmailValid(email){
    var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(!regex.test(email))
        return false;
    return true
}