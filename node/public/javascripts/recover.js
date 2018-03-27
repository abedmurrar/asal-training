const emailRegex = /^[\w]([\w][.-]{0,1}?)+@([a-z0-9][_.-]{0,1}?)+\.([a-z]{2,5})$/

$('#email').on('keydown', function () {
  $(this)
    .removeClass('error')
    .removeClass('correct')
  $('.email-msg')
    .html('Enter your Email')
    .removeClass('error-hint')
    .removeClass('correct-hint')
})

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
      url: '/recover',
      method: 'POST',
      data: $('#recoverForm').serialize(),
      success: data => {
        $('#recoverForm')[0].reset()
        $('#msg').html('Request is sent, if your email exists you will receive an email to reset your password')
      }
    })
  }
})
