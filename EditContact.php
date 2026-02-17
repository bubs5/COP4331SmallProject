<?php
	$inData = getRequestInfo();
	
	$email = $inData["Email"];
	$phone = $inData["Phone"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$ID = $inData["ID"];

	$conn = new mysqli("localhost", "root", getPassword(), "CONTACTSPROJ"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = '$firstName', LastName = '$lastName', Email = '$email', Phone = '$phone' where ID = '$ID'");
			$stmt->execute();
			$stmt->close();
			$conn->close();

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

