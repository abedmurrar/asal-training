const usernameRegex = /^[a-z](([\w][.-]{0,1}){6,22})[a-z]$/
const emailRegex = /^[\w]([\w][.-]{0,1}?)+@([a-z0-9][_.-]{0,1}?)+\.([a-z]{2,5})$/
const passwordRegex = /^.{7,}$/

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

$('#delete').on('click', event => {
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
          success: data => {
            $.alert('Deleted!')
            method = 'GET'
            document.location.assign('/')
          },
          error: data => {
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
      success: data => {
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

function response (data) {
  if (!data.success) {
    if (data.username) {
      $('#username')
        .addClass('error')
        .removeClass('correct')
      $('.username-msg')
        .html(data.username)
    } else {
      $('#username')
        .addClass('correct')
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
    } else {
      $('#password')
        .addClass('correct')
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
