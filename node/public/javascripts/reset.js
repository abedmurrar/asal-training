const passwordRegex = /^.{7,}$/

$('#password').on('keydown', function () {
  $(this)
    .removeClass('error')
    .removeClass('correct')
  $('.password-msg')
    .html('Enter your password')
    .removeClass('error-hint')
    .removeClass('correct-hint')
})

$('#confirmPassword').on('keydown', function () {
  $(this)
    .removeClass('error')
    .removeClass('correct')
  $('.confirmPassword-msg')
    .html('Confirm your new password')
    .removeClass('error-hint')
    .removeClass('correct-hint')
})

$('#resetForm').on('submit', event => {
  event.preventDefault()
  var confirmPassword = $('#confirmPassword').val().trim()
  var password = $('#password').val().trim()
  var isValid = true
  // check validity
  if (confirmPassword === '' || !confirmPassword.test(confirmPassword)) {
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
      success: data => {
        // window.location.replace('/')
      },
      error: data => {
        // response(JSON.parse(data.responseText))
      }
    })
  }
})
