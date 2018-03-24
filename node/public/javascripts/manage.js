$.ajax({
    url: '/users/',
    method: 'get',
    success: data => {
        data.forEach(element => {
            $("tbody").append(row(element));
        });
    },
    error: data => {
        response(JSON.parse(data.responseText));
    }
})

function row(user) {
    return "<tr>" +
        "<td>" + user.id + "</td>" +
        "<td>" + user.username + "</td>" +
        "<td>" + user.email + "</td>" +
        "<td>" + user.role + "</td>" +
        "<td><button class=\"edit\" user=\"" + user.id + "\">Edit</button><button class=\"delete\" user=\"" + user.id + "\">Delete</button></td>" +

        "</tr>";
}