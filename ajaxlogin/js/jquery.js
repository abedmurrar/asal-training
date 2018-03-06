$(function() {

    $("#apply").click(function() {
        $.ajax({
            url: "http://localhost/data/data.json",
            type: 'GET',
            data: { q: '' },
            dataType: 'json'
        }).done(data => console.log(data));
        let emailField = $("#email");
        let emailMsg = $(".email-field~.msg");
        emailField.on("keydown", function() {
            $(this).removeClass("correct");
            $(this).removeClass("error");
        });
        if (emailField.val().trim() != "") {
            if (isEmailValid(emailField.val())) {
                emailField.addClass("correct");
                emailMsg.html("email valid");
            } else {
                emailField.addClass("error");
                emailMsg.html("email is not valid");
            }
        } else {
            emailField.addClass("error");
            emailMsg.html("email can not be empty");
        }

        // let span = spanMessage();
        // let message;
    });

    // $("#loginform").on('submit', function(e) {
    //     e.preventDefault();
    //     let email = emailInput();
    //     let span = spanMessage();
    //     let message;
    // });

});

function isEmailValid(email) {
    email = email.toLowerCase();
    let regex = /^[a-z|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
    if (!regex.test(email))
        return false;
    return true;
}