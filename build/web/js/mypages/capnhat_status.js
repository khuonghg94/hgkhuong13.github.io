var IPWebservices = "http://192.168.1.242:3000";
function sendStatus(){
	jQuery.support.cors = true;
	webservices_address = IPWebservices + "/sendstatus"; 
	$.ajax({
	    url : webservices_address,
	    type: 'POST',
	    contentType: "application/json; charset=utf-8",
        data: JSON.stringify({id: localStorage.getItem("id"), status: "1"}),
        success : function(response){
		     $.each(response, function( key, val ){
		    		 if(key == "data"){
		    			 $("#complete").prop('disabled', false);
		    			 location.href = "http://localhost:8080/Demo/success.html";
		    		 }
		     });
	    }, 
	    error : function(error){
	    	alert('Error!');
	    }
	});
}

