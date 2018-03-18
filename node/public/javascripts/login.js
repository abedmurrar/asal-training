// $("#loginForm").on('submit', function() {
//     console.log($(this));
//     $(this).setAttribute('action', 'users/login');
//     $(this).setAttribute('method', 'POST');
//     var username = $("#l_username").val().trim();
//     var password = $("#l_password").val().trim();
//     var isValid = true;
//     //check validity
//     if (username.length > 0) {
//         isValid = true;
//     } else {
//         isValid = false;
//     }
//     if (password.length > 0) {
//         isValid = true;
//     } else {
//         isValid = false;
//     }
//     if (isValid) {
//         $(this).submit();
//     }

// });

// $("#loginForm").submit(event => {
//     event.preventDefault();
//     var username = $("#l_username").val().trim();
//     var password = $("#l_password").val().trim();
//     console.log(username);
//     console.log(password);
//     var isValid = true;
//     //check validity
//     if (username.length > 0) {
//         isValid = true;
//     } else {
//         isValid = false;
//     }
//     if (password.length > 0) {
//         isValid = true;
//     } else {
//         isValid = false;
//     }
//     if (isValid) {
//         $(this).submit();
//     }
// })