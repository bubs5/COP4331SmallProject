<?php
	$inData = getRequestInfo();
	
	$email = $inData["Email"];
	$phone = $inData["Phone"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$ID = $inData["id"]

	$conn = new mysqli("localhost", "root", getPassword(), "COP4331"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (ID,FirstName,LastName,Phone,Email) VALUES('$ID', '$firstName', '$lastName', '$phone', '$email')");
		if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$stmt->execute();
			$stmt->close();
			$conn->close();
		} else {
			echo "The email address '$email' is considered invalid in format.";
		}
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>


