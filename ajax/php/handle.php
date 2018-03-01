<?php

$rows = array();

if (isset($_POST['q']) && $_POST['q'] == 'where_are_my_mentors') {
    $con = new mysqli('localhost', 'root', '246805', 'asaltech');
    $sql = 'SELECT * FROM mentors';
    $result = $con->query($sql);
    $con->close();

    //return json_encode($row);

    while ($row = $result->fetch_field()) {
        array_push($rows, $row);
    }
    $result->free();
    echo json_encode($rows);
}
