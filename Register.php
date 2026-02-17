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
		$rawInput = file_get_contents("php://input");

		if ($rawInput === false || $rawInput === "") {
			returnWithError("No input received");
			exit();
		}

		$inData = json_decode($rawInput, true);

		if ($inData === null) {
			returnWithError("Invalid JSON: " . json_last_error_msg());
			exit();
		}

		$first = $inData["firstName"] ?? "";
		$last  = $inData["lastName"] ?? "";
		$login = $inData["login"] ?? "";
		$pass  = $inData["password"] ?? "";

		if ($first === "" || $last === "" || $login === "" || $pass === "") {
			returnWithError("Missing required fields");
			exit();
		}

		$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

		if ($conn->connect_error) {
			returnWithError("DB connection failed: " . $conn->connect_error);
			exit();
		}

		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");

		if (!$stmt) {
			returnWithError("Prepare failed: " . $conn->error);
			$conn->close();
			exit();
		}

		$hashed = password_hash($pass, PASSWORD_DEFAULT);
		$stmt->bind_param("ssss", $first, $last, $login, $hashed);

		if ($stmt->execute()) {
			returnWithInfo($first, $last, $conn->insert_id);
		} else {
			returnWithError("Execute failed: " . $stmt->error);
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
