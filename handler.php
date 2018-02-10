<?php 

function Res()
{
	if(isset($_POST['total_count'])){

	$Err = ' Server Validation Err: Data type fail (you have too big, or no data, or invalid data type) :(';
	if (IsValid()) {
			$responseData = array(
			'total_count' => (int) $_POST['total_count'],
			'delivered'=> (int) $_POST['delivered'],
			'progress' => (int) $_POST['total_count'] - (int) $_POST['delivered'] - (int) $_POST['failed'],
			'fail' =>  (int) $_POST['failed'],
			'open' =>  (int) $_POST['open'],
			'click' => (int) $_POST['click']
		);
	}elseif (IsValid() != true) {
		$responseData = array(
			'total_count' => false,
			'Err' => $Err
			);
	}



	echo json_encode($responseData);
	}


}


function IsValid()
{
	$Valid = true;
	
	foreach ($_POST as $key) {
		if(  strlen(($value= $key)) < 1 or
				strlen(($value= $key))	> 9 ) {
			$Valid = false;
			break;
		}
		else if(preg_match('(/([1-9])\w+/)', $key)){
			$Valid = false;
			break;
		}
		else{
			$Valid = true;
		}
		
	}

	return $Valid;

}





Res();


?>