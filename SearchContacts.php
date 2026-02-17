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

		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
		$search = "%" . $inData["search"] . "%";
		$userId = $inData["userId"];
		$stmt->bind_param("ssi", $search, $search, $userId);
		$stmt->execute();

		$result = $stmt->get_result();
		$searchResults = [];

		while ($row = $result->fetch_assoc()) {
			$searchResults[] = $row;
		}

		if (count($searchResults) == 0) {
			returnWithError("No Records Found");
		} else {
			returnWithInfo($searchResults);
		}

		$stmt->close();
		$conn->close();

	} catch (Exception $e) {
		returnWithError("Exception: " . $e->getMessage());
	}

	function returnWithError($err)
	{
		echo json_encode(["results" => [], "error" => $err]);
	}

	function returnWithInfo($searchResults)
	{
		echo json_encode(["results" => $searchResults, "error" => ""]);
	}
?>
