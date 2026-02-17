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

		$firstName = $inData["firstName"] ?? "";
		$lastName  = $inData["lastName"] ?? "";
		$phone     = $inData["phone"] ?? "";
		$email     = $inData["email"] ?? "";
		$userID    = $inData["ID"] ?? 0;

		$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($conn->connect_error) {
			returnWithError("DB connection failed: " . $conn->connect_error);
			exit();
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			returnWithError("The email address '$email' is invalid.");
			$conn->close();
			exit();
		}

		$stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("issss", $userID, $firstName, $lastName, $phone, $email);

		if ($stmt->execute()) {
			returnWithError("");
		} else {
			returnWithError("Failed to add contact: " . $stmt->error);
		}

		$stmt->close();
		$conn->close();

	} catch (Exception $e) {
		returnWithError("Exception: " . $e->getMessage());
	}

	function returnWithError($err)
	{
		echo json_encode(["error" => $err]);
	}
?>
