<?php
header("Content-Type: application/json");

$inData = json_decode(file_get_contents("php://input"), true);

$first = $inData["firstName"] ?? "";
$last  = $inData["lastName"] ?? "";
$login = $inData["login"] ?? "";
$pass  = $inData["password"] ?? "";

if ($first === "" || $last === "" || $login === "" || $pass === "")
{
    returnWithError("Missing required fields");
    exit();
}

$conn = new mysqli("localhost", "root", getPassword(), "CONTACTSPROJ");

if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare(
    "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)"
);

$hashed = password_hash($pass, PASSWORD_DEFAULT);
$stmt->bind_param("ssss", $first, $last, $login, $hashed);

if ($stmt->execute())
{
    returnWithInfo($first, $last, $conn->insert_id);
}
else
{
    returnWithError("Login already exists");
}

$stmt->close();
$conn->close();

function getPassword()
{
    return trim(file_get_contents("/root/.digitalocean_password"));
}

function returnWithError($err)
{
    echo json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => $err
    ]);
}

function returnWithInfo($firstName, $lastName, $id)
{
    echo json_encode([
        "id" => $id,
        "firstName" => $firstName,
        "lastName" => $lastName,
        "error" => ""
    ]);
}
?>
