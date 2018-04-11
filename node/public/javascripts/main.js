const usernameRegex = /^[a-z](([\w][.-]{0,1}){6,22})[a-z]$/
const emailRegex = /^[\w]([\w][.-]{0,1}?)+@([a-z0-9][_.-]{0,1}?)+\.([a-z]{2,5})$/
const passwordRegex = /^.{7,}$/
$(function () {
    $('a#nav-show').on('click', function () {
        if ($('.collapse-nav').length === 0) {
            $('nav.tabs').addClass('collapse-nav')
            $(this).hide().html('<i class="fas fa-angle-double-left"></i>').fadeIn('slow')
        } else {
            $('nav.tabs').removeClass('collapse-nav')
            $(this).hide().html('<i class="fas fa-angle-double-down"></i>').fadeIn('slow')
        }
    })
    $('#username').on('keydown', function () {
        $(this)
            .removeClass('error')
            .removeClass('correct')
        $('.username-msg')
            .html('Enter your username')
            .removeClass('error-hint')
            .removeClass('correct-hint')
    })
    $('#password').on('keydown', function () {
        $(this)
            .removeClass('error')
            .removeClass('correct')
        $('.password-msg')
            .html('Enter your password')
            .removeClass('error-hint')
            .removeClass('correct-hint')
    })
    $('#email').on('keydown', function () {
        $(this)
            .removeClass('error')
            .removeClass('correct')
        $('.email-msg')
            .html('Enter your Email')
            .removeClass('error-hint')
            .removeClass('correct-hint')
    })
    /* ACCOUNT PAGE */
    $('#delete').on('click', () => {
        var id = $('#id').val()
        var method = 'DELETE'
        $.confirm({
            title: 'Confirm deletion',
            content: 'Are you sure you want to delete your account ?',
            buttons: {
                Yes: function () {
                    $.ajax({
                        url: '/users/' + id,
                        method: method,
                        success: () => {
                            $.alert('Deleted!')
                            method = 'GET'
                            document.location.assign('/')
                        },
                        error: () => {
                            $.alert('an Error occured while deleting!')
                        }
                    })
                },
                No: function () {}
            }
        })
    })
    $('#accountForm').on('submit', event => {
        event.preventDefault()
        var username = $('#username').val().trim()
        var password = $('#password').val().trim()
        var email = $('#email').val().trim()
        var isValid = true
        // check validity
        var id = $('#id').val().trim()
        if (username === '' || !usernameRegex.test(username)) {
            isValid = false
            $('#username')
                .addClass('error')
            $('.username-msg')
                .html('Invalid username')
                .addClass('error-hint')
        }
        if (password === '' || !passwordRegex.test(password)) {
            isValid = false
            $('#password')
                .addClass('error')
            $('.password-msg')
                .html('Invalid password')
                .addClass('error-hint')
        }
        if (email === '' || !emailRegex.test(email)) {
            isValid = false
            $('#email')
                .addClass('error')
            $('.email-msg')
                .html('Invalid email')
                .addClass('error-hint')
        }
        if (isValid) {
            $.ajax({
                url: '/users/' + id,
                method: 'PUT',
                data: $('#accountForm').serialize(),
                success: () => {
                    $.dialog({
                        title: 'Updated!',
                        content: 'Edited Successfully!'
                    })
                },
                error: data => {
                    response(JSON.parse(data.responseText))
                }
            })
        }


    })
    /* RECOVER PAGE */
    $('#recoverForm').on('submit', event => {
        event.preventDefault()
        var email = $('#email').val().trim()
        var isValid = true
        // check validity
        if (email === '' || !emailRegex.test(email)) {
            isValid = false
            $('#email').addClass('error')
            $('.email-msg')
                .html('Invalid email')
                .addClass('error-hint')
        }
        if (isValid) {
            $.ajax({
                url: '/resets/',
                method: 'POST',
                data: $('#recoverForm').serialize(),
                success: () => {
                    $('#recoverForm')[0].reset()
                    $('#msg').html('Request is sent, if your email exists you will receive an email to reset your password')
                }
            })
        }
    })
    /* LOGIN PAGE */
    $('#loginForm').on('submit', event => {
        event.preventDefault()
        var username = $('#username').val().trim()
        var password = $('#password').val().trim()
        var isValid = true
        // check validity
        if (username === '' || !usernameRegex.test(username)) {
            isValid = false
            $('#username').addClass('error')
            $('.username-msg')
                .html('Invalid username')
                .addClass('error-hint')
        }
        if (password === '' || !passwordRegex.test(password)) {
            isValid = false
            $('#password').addClass('error')
            $('.password-msg')
                .html('Invalid Password')
                .addClass('error-hint')
        }
        if (isValid) {
            $.ajax({
                url: '/login',
                method: 'post',
                // data: ,
                data: {
                    username: username,
                    password: password
                },
                success: () => {
                    window.location.replace('/')
                },
                error: data => {
                    response(JSON.parse(data.responseText))
                }
            })
        }
    })
    /* REGISTER PAGE */
    $('#registerForm').on('submit', event => {
        event.preventDefault()
        var username = $('#username').val().trim()
        var password = $('#password').val().trim()
        var email = $('#email').val().trim()
        var isValid = true
        // check validity
        if (username === '' || !usernameRegex.test(username)) {
            isValid = false
            $('#username').addClass('error')
            $('.username-msg')
                .html('Invalid username')
                .addClass('error-hint')
        }
        if (password === '' || !passwordRegex.test(password)) {
            isValid = false
            $('#password').addClass('error')
            $('.password-msg')
                .html('Invalid password')
                .addClass('error-hint')
        }
        if (email === '' || !emailRegex.test(email)) {
            isValid = false
            $('#email').addClass('error')
            $('.email-msg')
                .html('Invalid email')
                .addClass('error-hint')
        }
        if (isValid) {
            $.ajax({
                url: '/users/',
                method: 'POST',
                data: $('#registerForm').serialize(),
                success: data => {
                    $('#registerForm')[0].reset()
                    $('#msg').html(data.message + ', <a href="/login">login</a> now').addClass('correct-hint')
                },
                error: data => {
                    response(JSON.parse(data.responseText))
                }
            })
        }
    })
    /* RESET PAGE */
    $('#resetForm').on('submit', event => {
        event.preventDefault()
        var confirmPassword = $('#confirmPassword').val().trim()
        var password = $('#password').val().trim()
        var isValid = true
        // check validity
        if (confirmPassword === '' || !passwordRegex.test(confirmPassword)) {
            isValid = false
            $('#confirmPassword').addClass('error')
            $('.confirmPassword-msg')
                .html('Invalid Password')
                .addClass('error-hint')
        } else if (confirmPassword !== password) {
            isValid = false
            $('#confirmPassword').addClass('error')
            $('.confirmPassword-msg')
                .html('Password do not match')
                .addClass('error-hint')
        }
        if (password === '' || !passwordRegex.test(password)) {
            isValid = false
            $('#password').addClass('error')
            $('.password-msg')
                .html('Invalid Password')
                .addClass('error-hint')
        }
        if (isValid) {
            $.ajax({
                url: '/resets/' + $('#token').val(),
                method: 'PUT',
                data: $('#resetForm').serialize(),
                success: () => {
                    $('#msg').html('Reset Successfully').addClass('correct-hint')
                },
                error: () => {
                    $('#msg').html('Reset Failed').addClass('correct-hint')
                }
            })
        }
    })
    /* MANAGE PAGE */
    $(document).on('click', '#deleteUser', event => {
        var btn = event.currentTarget
        var id = $(btn).attr('user')
        var username = $("#username[user^='" + id + "']").html()
        $.confirm({
            title: 'Confirm deletion',
            content: 'Are you sure you want to delete <strong>' + username + '</strong> ?',
            buttons: {
                Yes: function () {
                    $.ajax({
                        url: '/users/' + id,
                        method: 'delete',
                        success: () => {
                            $.alert('Deleted!')
                            getUsers()
                        },
                        error: () => {
                            $.alert('an Error occured while deleting!')
                            getUsers()
                        }
                    })
                },
                No: function () {}

            }
        })
    })
})

function response(data) {
    if (!data.success) {
        if (data.username) {
            $('#username')
                .addClass('error')
                .removeClass('correct')
            $('.username-msg')
                .html(data.username)
                .addClass('error-hint')
                .removeClass('correct-hint')
        } else {
            $('#username')
                .addClass('correct')
                .removeClass('error')
            $('.username-msg')
                .html('Valid username')
                .addClass('correct-hint')
                .removeClass('error-hint')
        }
        if (data.password) {
            $('#password')
                .addClass('error')
                .removeClass('correct')
            $('.password-msg')
                .html(data.password)
                .addClass('error-hint')
                .removeClass('correct-hint')
        } else {
            $('#password')
                .addClass('correct')
                .removeClass('error')
            $('.password-msg')
                .html('Valid password')
                .addClass('correct-hint')
                .removeClass('error-hint')
        }
        if (data.email) {
            $('#email')
                .addClass('error')
                .removeClass('correct')
            $('.email-msg')
                .html(data.email)
                .addClass('error-hint')
                .removeClass('correct-hint')
        } else {
            $('#email')
                .addClass('correct')
                .removeClass('error')
            $('.email-msg')
                .html('Valid email')
                .addClass('correct-hint')
                .removeClass('error-hint')
        }
    }
}

function getUsers() {
    $.ajax({
        url: '/users/',
        method: 'GET',
        success: data => {
            $('tbody').html('')
            data.forEach(element => {
                $('tbody').append(row(element))
            })
        }
    })
}

function row(user) {
    return '<tr>' +
        '<td id="id" user="' + user.id + '">' +
        user.id +
        '</td>' +
        '<td id="username" user="' + user.id + '">' +
        user.username +
        '</td>' +
        '<td id="email" user="' + user.id + '">' +
        user.email +
        '</td>' +
        '<td id="role" user="' + user.id + '">' +
        user.role +
        '</td>' +
        '<td>' +
        '<button id="deleteUser" user="' + user.id + '">Delete</button></td>' +
        '</tr>'
}