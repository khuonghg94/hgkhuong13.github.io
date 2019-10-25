var takeSnapshotUI = createClickFeedbackUI();

var video;
var takePhotoButton;
var toggleFullScreenButton;
var switchCameraButton;
var amountOfCameras = 0;
var currentFacingMode = 'environment';
var IPWebservices = "http://192.168.1.242:3000";
              
document.addEventListener("DOMContentLoaded", function(event) {
    DetectRTC.load(function() {
        alert(DetectRTC.isWebRTCSupported);
        if (DetectRTC.isWebRTCSupported == false) {
            alert('Please use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher');
        }
        else {
            if (DetectRTC.hasWebcam == false) {
                alert('Please install an external webcam device.');
            }
            else {

                amountOfCameras = DetectRTC.videoInputDevices.length;
                       
                initCameraUI();
                initCameraStream();
            } 
        }
        
        console.log("RTC Debug info: " + 
            "\n OS:                   " + DetectRTC.osName + " " + DetectRTC.osVersion + 
            "\n browser:              " + DetectRTC.browser.fullVersion + " " + DetectRTC.browser.name +
            "\n is Mobile Device:     " + DetectRTC.isMobileDevice +
            "\n has webcam:           " + DetectRTC.hasWebcam + 
            "\n has permission:       " + DetectRTC.isWebsiteHasWebcamPermission +       
            "\n getUserMedia Support: " + DetectRTC.isGetUserMediaSupported + 
            "\n isWebRTC Supported:   " + DetectRTC.isWebRTCSupported + 
            "\n WebAudio Supported:   " + DetectRTC.isAudioContextSupported +
            "\n is Mobile Device:     " + DetectRTC.isMobileDevice
        );

    });

});

function initCameraUI() {
    video = document.getElementById('video');

    takePhotoButton = document.getElementById('takePhotoButton');
    toggleFullScreenButton = document.getElementById('toggleFullScreenButton');
    switchCameraButton = document.getElementById('switchCameraButton');
    
    takePhotoButton.addEventListener("click", function() {
        takeSnapshotUI();
        takeSnapshot();        
    });
    takePhotoButton = document.getElementById('takePhotoButton');
    toggleFullScreenButton = document.getElementById('toggleFullScreenButton');
    switchCameraButton = document.getElementById('switchCameraButton');
    
    takePhotoButton.addEventListener("click", function() {
        takeSnapshotUI();
        takeSnapshot();        
    });

    function fullScreenChange() {
        if(screenfull.isFullscreen) {
            toggleFullScreenButton.setAttribute("aria-pressed", true);
        }
        else {
            toggleFullScreenButton.setAttribute("aria-pressed", false);
        }
    }

    if (screenfull.enabled) {
        screenfull.on('change', fullScreenChange);

        toggleFullScreenButton.style.display = 'block';  
        fullScreenChange();

        toggleFullScreenButton.addEventListener("click", function() {
            screenfull.toggle(document.getElementById('container')).then(function () {
 					console.log('Fullscreen mode: ' + (screenfull.isFullscreen ? 'enabled' : 'disabled'))
 			});
        });
    }
    else {
        console.log("iOS doesn't support fullscreen (yet)");   
    }
    if(amountOfCameras > 1) {
        
        switchCameraButton.style.display = 'block';
        
        switchCameraButton.addEventListener("click", function() {

            if(currentFacingMode === 'environment') currentFacingMode = 'user';
            else                                    currentFacingMode = 'environment';

            initCameraStream();

        });  
    }
    window.addEventListener("orientationchange", function() {
        if(screen.orientation) angle = screen.orientation.angle;
        else                   angle = window.orientation;

        var guiControls = document.getElementById("gui_controls").classList;
        var vidContainer = document.getElementById("vid_container").classList;

        if(angle == 270 || angle == -90) {
            guiControls.add('left');
            vidContainer.add('left');
        }
        else {
            if ( guiControls.contains('left') ) guiControls.remove('left');
            if ( vidContainer.contains('left') ) vidContainer.remove('left');
        }
    }, false);
    
}
function initCameraStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }

    var constraints = { 
        audio: false, 
        video: {
            facingMode: currentFacingMode
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);   
    function handleSuccess(stream) {

        window.stream = stream; 
        video.srcObject = stream;

        if(constraints.video.facingMode) {

            if(constraints.video.facingMode === 'environment') {
                switchCameraButton.setAttribute("aria-pressed", true);
            }
            else {
                switchCameraButton.setAttribute("aria-pressed", false);
            }
        }

        return navigator.mediaDevices.enumerateDevices();
    }

    function handleError(error) {
        console.log(error);
        if(error === 'PermissionDeniedError') {
            alert("Permission denied. Please refresh and give permission.");
        }
        
    }
}
function dataURItoBlob(dataURI) {
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
	    byteString = atob(dataURI.split(',')[1]);
	else
	    byteString = unescape(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
	    ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}
function takeSnapshot() {
    $('body').pleaseWait();
    $("#takePhotoButton").prop('disabled', true);
    $("#switchCameraButton").prop('disabled', true);
    $("#toggleFullScreenButton").prop('disabled', true);
    jQuery.support.cors = true;
    var canvas = document.createElement('canvas');

    var width = video.videoWidth;
    var height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    var dataURL = canvas.toDataURL('image/jpeg', 0.5);
    localStorage.setItem("imgsrc", dataURL)
    var blob = dataURItoBlob(dataURL);
    var fd = new FormData(document.forms[0]);
    fd.append("canvasImage", blob);
	webservices_address = IPWebservices + "/sendblob";
	$.ajax({
		url : webservices_address,
		type: 'POST',
		method: 'POST',
		data: fd,
		processData: false,
		contentType: false,
    	success: function (response) {
    		//alert("Success");
    		$('body').pleaseWait('stop');
    		$.each(response, function( key, val ) {
//    			if(key== "match"){
//    				if(val == 0){
//    					alert("Vị trí điểm danh không hợp lệ, mời điểm danh lại!");
//        				location.href = "http://localhost:8080/Demo/index.html";
//        				return false;
//    				}
//    			}
    			if(key == "data"){
        			if(val == "undefined"){
        				alert("Không thể xác định được khuôn mặt!");
        				location.href = "http://localhost:8080/Demo/index.html";
        			}else if(val == "Unknown"){
        				location.href = "http://localhost:8080/Demo/result.html";
        				localStorage.setItem("id", "");
        				localStorage.setItem("hten", val);
        				localStorage.setItem("room", "");
        			}else{
        				location.href = "http://localhost:8080/Demo/result.html";
        				localStorage.setItem("id", val.id);
        				localStorage.setItem("hten", val.hten);
        				localStorage.setItem("room", val.room);
        			}
    			}
    			$("#takePhotoButton").prop('disabled', false);
    			$("#switchCameraButton").prop('disabled', false);
    			$("#toggleFullScreenButton").prop('disabled', false);
		     });
    	},
    	error: function () {
    		alert("Error");
    		$("#takePhotoButton").prop('disabled', false);
			$("#switchCameraButton").prop('disabled', false);
			$("#toggleFullScreenButton").prop('disabled', false);
    	}
	});  
    function getCanvasBlob(canvas) {
        return new Promise(function(resolve, reject) {
            canvas.toBlob(function(blob) { resolve(blob) }, 'image/jpeg');
        })
    }

    // some API's (like Azure Custom Vision) need a blob with image data
    getCanvasBlob(canvas).then(function(blob) {

        // do something with the image blob

    });
}


function createClickFeedbackUI() {
    var overlay = document.getElementById("video_overlay");
    var sndClick = new Howl({ src: ['snd/click.mp3'] });

    var overlayVisibility = false;
    var timeOut = 80;

    function setFalseAgain() {
        overlayVisibility = false;	
        overlay.style.display = 'none';
    }

    return function() {

        if(overlayVisibility == false) {
            sndClick.play();
            overlayVisibility = true;
            overlay.style.display = 'block';
            setTimeout(setFalseAgain, timeOut);
        }   

    }
}