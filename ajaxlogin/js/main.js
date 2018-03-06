$(function() {
    $.ajax({
        url: "http://localhost/data/data.json",
        type: 'GET',
        data: { q: '' } //,
        // dataType: 'json'
    }).done(data => {
        users = data.users;
    });
    $("#apply").click(function() {

        let usernameField = $("#username");
        let usernameMsg = $(".username-field~.msg");
        let emailField = $("#email");
        let emailMsg = $(".email-field~.msg");
        let user = { email: emailField.val(), username: usernameField.val() };
        usernameField.on("keydown", function() {
            $(this).removeClass("correct");
            $(this).removeClass("error");
        })
        emailField.on("keydown", function() {
            $(this).removeClass("correct");
            $(this).removeClass("error");
        });
        if (usernameField.val().trim() == "") {
            usernameField.addClass('error');
            usernameMsg.html('username can not be empty');
        } else if (emailField.val().trim() == "") {
            emailField.addClass("error");
            emailMsg.html("email is not valid");
            emailMsg.css({
                "opacity": "1.0",
                "color": "red"
            });
        } else {
            if (!isEmailValid(emailField.val())) {
                emailField.addClass("error");
                emailMsg.html("email is not valid");
                emailMsg.css({
                    "opacity": "1.0"
                });
            } else if (isUserExist(user, users)) {
                usernameField.addClass("correct");
                emailField.addClass("correct");
                emailMsg.html("email valid");
                emailMsg.css({
                    "opacity": "1.0",
                    "color": "green"
                });
            } else {
                emailField.addClass("error");
                emailMsg.html("email does not exist");
                emailMsg.css({
                    "opacity": "1.0"
                });
            }
        }

        // }
        // } else {

        // }


    });
});

function isEmailValid(email) {
    email = email.toLowerCase();
    let regex = /^[a-z|_]([a-z0-9][_\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
    if (!regex.test(email))
        return false;
    return true;
}

function isUserExist(needle, haystack) {
    console.log(haystack);
    console.log(needle);
    if (needle.username == "" || needle.email == "") {
        return false;
    }
    haystack.forEach(element => {
        if (element.username == needle.username && element.email == needle.email) {
            return true;
        }
    });
}