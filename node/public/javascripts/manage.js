function getUsers () {
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

function row (user) {
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
        '<button class="delete" id="delete" user="' + user.id + '">Delete</button></td>' +
        '</tr>'
}
getUsers()

$(document).on('click', '.delete', event => {
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
          success: data => {
            $.alert('Deleted!')
            getUsers()
          },
          error: data => {
            $.alert('an Error occured while deleting!')
            getUsers()
          }
        })
      },
      No: function () {}

    }
  })
})
