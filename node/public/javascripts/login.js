const usernameRegex = /^[a-z](([\w][\.\-]{0,1}){6,22})[a-z]$/;
const passwordRegex = /^.{7,}$/;


$("#username").on('keydown', function() {
    $(this).removeClass('error').removeClass('correct');
    $(".username-msg").html("Enter your username").removeClass('error-hint');
})
$("#password").on('keydown', function() {
    $(this).removeClass('error').removeClass('correct');
    $(".password-msg").html('Enter your password').removeClass('error-hint');
})


$("#loginForm").on("submit", event => {
    event.preventDefault();
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    var isValid = true;
    //check validity
    if (username == '' || !usernameRegex.test(username)) {
        isValid = false;
        $("#username").addClass('error');
        $(".username-msg").html("Invalid username").addClass('error-hint');
    }
    if (password == '' || !passwordRegex.test(password)) {
        isValid = false;
        $("#password").addClass('error');
        $(".password-msg").html('Invalid Password').addClass('error-hint');
    }
    if (isValid) {
        $.ajax({
            url: '/login',
            method: 'post',
            // data: ,
            data: { username: username, password: password },
            success: data => {
                window.location.replace('/');
            },
            error: data => {
                response(JSON.parse(data.responseText));
            }
        })
    }
})

function response(data) {
    if (!data.success) {
        if (data.username) {
            $("#username").addClass('error');
            $(".username-msg").html(data.username).addClass('error-hint');
        } else {
            $("#username").addClass('correct');
            $(".username-msg").html('Correct username').addClass('correct-hint');
        }
        if (data.password) {
            $("#password").addClass('error');
            $(".password-msg").html(data.password).addClass('error-hint');
        }
    }
}