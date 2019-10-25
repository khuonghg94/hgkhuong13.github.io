var IPWebservices = "http://192.168.1.242:3000";
function LoadTableDanhMucNV(){
		jQuery.support.cors = true;
		webservices_address = IPWebservices + "/loadDanhSachNhanVien";
		$.ajax({
        url : webservices_address,
        type : 'get',
        contentType: 'text/plain',
        xhrFields: {
            withCredentials: false
          },
          headers: {
        	  },
        success : function(response){
        	stt = 0; 
            var contentTableNV = "";
            $.each(response, function( key, val ) {
            	$.each(val, function( key1, val1 ) {
            		stt += 1;
            		var HightlightRow =0;  
            		iconStt = "<i class='fa fa-star' style='color:red;'></i>&nbsp;";
            		var trangthai = val1["status"];
            		if(String(trangthai) == '1'){
            			dadiemdanh = "Đã điểm danh";
            			iconStt = "<i class='fa fa-check' style='color:green;'></i>&nbsp;";
            			HightlightRow ++;
            		}else{
            			dadiemdanh = "Chưa điểm danh";
            		}
            		
            		if(HightlightRow > 0){
            			contentTableNV += "<tr class='bg-warning' style='font-weight:600;'>";
            		}else{
            			contentTableNV += "<tr>";
            		}
            		contentTableNV += "<td scope='row'>" + iconStt + stt + "</td>";
            		contentTableNV += "<td scope='row'>" + dadiemdanh + "</td>";
            		contentTableNV += "<td scope='row'>" + val1.id + "</td>";
            		contentTableNV += "<td scope='row'>" + val1.hten + "</td>";
            		contentTableNV += "<td scope='row'>" + val1.room + "</td>";
            		contentTableNV += "</tr>";	

                });
            	
              });
            $("#bodyDanhMucDK").html(contentTableNV);
            $("#btnrefreshness").prop('disabled', false);
            	
        }, 
        error : function(error){
        	alert('error');
        }
    });
}
$(document).ready(function(){ 
	$("#btnrefreshness").click(function(){
		$(this).prop('disabled', true);
		$("#bodyDanhMucDK").html("<tr><td colspan='8'><center><i class='fa fa-spinner fa-spin mt-3' style='font-size:54px'></i>&nbsp;&nbsp;Đang tải dữ liệu...</center></td></tr>");
		 setTimeout(function(){
			 LoadTableDanhMucNV();
			}, 100);
	});
});
