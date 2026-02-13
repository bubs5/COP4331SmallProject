<?php

	$inData = getRequestInfo();

	$contactID = $inData["contactId"];
	$userID    = $inData["userId"];

	$conn = new mysqli("localhost", "root", getPassword(), "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
		exit();
	}
	else
	{
		// userId check ensures a user can only delete their OWN contacts
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactID, $userID);
		$stmt->execute();

		if ($stmt->affected_rows === 1)
		{
			returnWithError("");       
		}
		else
		{
			returnWithError("Contact not found or not authorized");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function getPassword()
	{
		return trim(file_get_contents("/root/.digitalocean_password"));
	}

?>
