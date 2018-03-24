const usernameRegex = /^[a-z](([\w][\.\-]{0,1}){6,22})[a-z]$/;
// const emailRegex = /^[\w]([\w][\.\-]{0,1}?)+\@([a-z0-9][_\.\-]{0,1}?)+\.([a-z]{2,5})$/;
const passwordRegex = /^.{7,}$/;

$("#username").on('keydown', function() {
    $(this).removeClass('error').removeClass('correct');
})
$("#password").on('keydown', function() {
    $(this).removeClass('error').removeClass('correct');
})


$("#loginForm").submit(event => {
    event.preventDefault();
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    var isValid = true;
    //check validity
    if (username == '' || !usernameRegex.test(username)) {
        isValid = false;
        $("#username").addClass('error');
    }
    if (password == '' || !passwordRegex.test(password)) {
        isValid = false;
        $("#password").addClass('error');
    }
    if (isValid) {
        $.ajax({

        })
    }
})

// $("#login").hover(event => {

//     if ($("#username").val().trim() == '' || $("#password").val().trim() == '') {
//         $("#login").css('background', 'red')
//     } else {
//         $("#login").css('background', 'green')
//     }
// })