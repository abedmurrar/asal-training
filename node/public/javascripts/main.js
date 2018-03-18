$.get("/login", data => {
    $('main').html(data);
});

// $.get("/register")