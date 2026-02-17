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

		// Field names match what app.js saveEditContact() sends
		$contactId = $inData["contactId"] ?? 0;
		$userId    = $inData["userId"] ?? 0;
		$firstName = $inData["firstName"] ?? "";
		$lastName  = $inData["lastName"] ?? "";
		$phone     = $inData["phone"] ?? "";
		$email     = $inData["email"] ?? "";

		$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($conn->connect_error) {
			returnWithError("DB connection failed: " . $conn->connect_error);
			exit();
		}

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=? AND UserID=?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactId, $userId);

		if ($stmt->execute()) {
			if ($stmt->affected_rows >= 0) {
				returnWithError("");
			} else {
				returnWithError("Contact not found or not authorized");
			}
		} else {
			returnWithError("Update failed: " . $stmt->error);
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
