<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 0);

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json");

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(200);
		exit();
	}

	require_once '/var/www/config.php';

	try {
		$inData = json_decode(file_get_contents('php://input'), true);

		$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($conn->connect_error) {
			returnWithError("DB connection failed: " . $conn->connect_error);
			exit();
		}

		$stmt = $conn->prepare("SELECT ID,FirstName,LastName,Password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()) {
			if (password_verify($inData["password"], $row["Password"])) {
				returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
			} else {
				returnWithError("No Records Found");
			}
		} else {
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();

	} catch (Exception $e) {
		returnWithError("Exception: " . $e->getMessage());
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
