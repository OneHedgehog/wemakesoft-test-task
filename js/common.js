$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function App() {
var inputs = document.querySelectorAll("#AjForm input[type='text']");
button = document.querySelector('.btn');
ServerWarn = document.querySelector('.alert-danger');

button.onclick = function() {
	if(FormValidation() == true){
		if(TaskControl() == true){
		
			SendToServer();
		};

	}else{
		alert('pls, try again ("Maybe, u have empty values")');
	}

};

function getChar(event) {
	if (event.which != 0 && event.charCode != 0) {
    if (event.which < 32) return null;
    return String.fromCharCode(event.which)
      	}
	}

function NumberInputs() {
	for (var i = inputs.length - 1; i >= 0; i--) {
		
		inputs[i].onkeypress = function(e) {
  			var chr = getChar(e);

  			if (chr == null) return; // 0 == null будет true
  			if (chr < '0' || chr > '9') {
  				alert('value type must be a Number')
   				return false;
  			}

		}
	}
} 

NumberInputs();



function FormValidation() {
	var Valid = true;

	for (var i = inputs.length - 1; i >= 0; i--) {
		
		if(isNaN(parseInt(inputs[i].value))){
			// alert('please, use only integer data type');
			Valid = false
			break;
		}else{
			var MR = inputs[i].value.split("");
			console.log(MR);
			for (var j =  MR.length - 1; j >= 0; j--) {
				if(MR[j] == "." || MR[j] == "," || MR[0] == "-"){
					alert('please, use only integer data type, without any "," or "."');
					Valid = false;
				}else if ( MR[0] == "0" && MR[1]){
					alert("don't use '0' as first item");
					Valid = false;
				}
			}
			
		}

	}
	console.log(Valid);
	return Valid;

};


function TaskControl() {
	var control = true;
	if (parseInt(inputs[3].value) > parseInt(inputs[1].value)){
		alert("Open is part of delivered. It can't be bigger than DELIVERED");
		inputs[3].value = "";
		control = false;
	}

	if (parseInt(inputs[4].value) > parseInt(inputs[3].value)){
		alert("Clicks is part of open. It can't be bigger than OPEN");
		inputs[4].value = "";
		control = false;
	}
	if ((parseInt((inputs[1].value))+parseInt(inputs[2].value)) > parseInt(inputs[0].value)){
		alert("Delivered and Fail is part of total count. It can't be bigger than TOTAL COUNT");
		inputs[1].value = "";
		inputs[2].value = "";
		control = false;
	}

	return control;
	}


function SendToServer() {
	total_countV = inputs[0].value;
	deliveredV = inputs[1].value;
	failV = inputs[2].value;
	openV = inputs[3].value;
	clickV = inputs[4].value;

	
	body = 'total_count=' + total_countV +
  	'&delivered=' + deliveredV + '&failed=' + failV + '&open=' + openV + 
  	'&click=' + clickV;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', "handler.php", true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


	xhr.onreadystatechange = function() {
		button.value = 'sending';
		if (xhr.readyState == 4 && xhr.status == 200){
			var return_data = JSON.parse(xhr.responseText);
		}


		if(NullData(return_data)){
			Diagram(return_data);
			ServerWarn.setAttribute('style', 'display: none');
		}else if(return_data[total_count] !== false){

			ServerValidation(return_data);
		}
		else{
			ServerWarn.removeAttribute('style');
			alert('FromAjax: Response Error');
		}
		
	}

	xhr.send(body);
};

function NullData(data) {
	var HaveData = Boolean;
	if(data.total_count == 0){
		alert("FromNullData: We don't have any data OR data values had wrong type");
		HaveData = false;
		return HaveData;
		NullData();
	}else if(data.total_count > 0){
		HaveData = true;
		return HaveData;
	}else{
		HaveData = false;
		return HaveData;
		alert('Unexpected Err: please, check input Values');
	}
	 		
}

function ServerValidation(data) {
	ServerWarn.removeAttribute('style');
	ServerWarn.innerHTML = data.Err;
	console.log(data);
}


function Diagram(data) {
	var ProgressBars = document.querySelectorAll('.progress-bar');

	//установим значение тултипов
	ProgressBars[0].setAttribute('data-original-title', 'click: ' + data.click);
	ProgressBars[1].setAttribute('data-original-title', 'open: ' + data.open);
	ProgressBars[2].setAttribute('data-original-title', 'delivered: ' + data.delivered);
	ProgressBars[3].setAttribute('data-original-title', 'progress: ' + data.progress);
	ProgressBars[4].setAttribute('data-original-title', 'fail: ' +data.fail);

	//процент от всего прогресс бара целиком
	Procent = data.total_count/100;



	//ClICK
	DelivProcent = data.delivered/100;
	//(data.click/DelivProcent) / 100;//1% процент от delivery
	if(data.delivered == 0){
		ClickWidth = 0;
	}else{
		ClickWidth = data.delivered*((data.click/DelivProcent) / 100);//процентов вообще(будем выводит во вьюшку)
	}
	
	

	 //OPEN
	 if(data.delivered == 0){
	 	OpenWidth = 0;
	 }else{
	 	//console.log("deliv: " + (data.open/DelivProcent) / 100 );//1% процент от delivery
		OpenWidth = data.delivered*((data.open/DelivProcent) / 100);//процентов вообще(будем выводит во вьюшку)
	 }







	 function DrowDiagram() {




	 	var WidthArray = {
	 		Click: (ClickWidth/Procent),
	 		Open: (OpenWidth/Procent) -(ClickWidth/Procent),
	 		Deliverd: (data.delivered/Procent) -(OpenWidth/Procent),
	 		Progress: (data.progress/Procent),
	 		Fail: (data.fail/Procent)
	 	}



	 	var bomb = 0;
	 	for (key in WidthArray) {
	 		ProgressBars[bomb].children[0].innerHTML = (Math.round( WidthArray[key] * 100) / 100)+ "%";
	 		bomb++;
	 	};

	 	ProgressBars[2].children[0].innerHTML = (Math.round(  (data.delivered/Procent) * 100) / 100)+ "%";
	 	ProgressBars[0].children[0].innerHTML = (Math.round( (data.click/DelivProcent) * 100) / 100)+ "%";
	 	ProgressBars[1].children[0].innerHTML = (Math.round( (data.open/DelivProcent) * 100) / 100)+ "%";


	 	
	 	var counter = 0;

		for(var key in WidthArray){





			if(WidthArray.Click < 4 && data.click !== 0){
				counter++;
			};

			if(WidthArray.Open < 4 && data.open !== 0){
				counter++;
			};

			if(WidthArray.Deliverd < 4 && data.delivered !== 0){
				counter++;
			};

			if(WidthArray.Progress < 4 && data.progress !== 0 ){
				counter++;
			};

			if(WidthArray.Fail < 4 && data.fail !== 0 ){
				counter++;
			};



	 		
	 	}

	 	var TotalCount = counter/5;

	 	for (var key in WidthArray) {


			if(WidthArray.Deliverd < 4 && data.delivered !== 0){
				WidthArray.Deliverd = 4;
			};

			if(WidthArray.Click < 4 && data.click !== 0){
				WidthArray.Click = 4;
			};

			if(WidthArray.Open < 4 && data.open !== 0){
				WidthArray.Open = 4;
			};

			if(WidthArray.Progress < 4 && data.progress !== 0 ){
				WidthArray.Progress = 3;
			};

			if(WidthArray.Fail < 4 && data.fail !== 0 ){
				WidthArray.Fail = 4;
			};
	 	}

	 	var max = 0;
	 	for (var key in WidthArray){
	 		if( max < WidthArray[key]){
	 			max = WidthArray[key];
	 		}
	 	}

	 	for (var key in WidthArray) {
	 		if(WidthArray[key] == max ){
	 			WidthArray[key] = WidthArray[key] - ((counter/5) * 4);
	 		}
	 	}

	 	var sum = 0;
	 	for (var key in WidthArray) {
	 		sum += WidthArray[key];
	 	}


	 	var FixedWidth = 0;
	 	for (var key in WidthArray){
	 		if(WidthArray[key]>FixedWidth){
	 			FixedWidth = WidthArray[key];
	 		}
	 	}

	 	if( sum < 100){
	 		for(var key in WidthArray){
	 			if(WidthArray[key] == FixedWidth){
	 				WidthArray[key] = WidthArray[key] + (100 - sum);
	 			}
	 		}
	 	}




	 	//Click
	 	ProgressBars[0].style.width = (  WidthArray.Click + "%")

	 	//open
	 	ProgressBars[1].style.width = ( WidthArray.Open + "%")

	 	//delivered
	 	ProgressBars[2].style.width = (WidthArray.Deliverd + '%');

	 	//progress
		ProgressBars[3].style.width = (WidthArray.Progress + '%');


	 	//fail
	 	ProgressBars[4].style.width = WidthArray.Fail + '%';

	 };



	 DrowDiagram();
}
}

App();


