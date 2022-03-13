const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);



function webCamButton() 
{
    let e = document.getElementById("btn1");
    if(e.value == 'off') {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        webcam.start()
        .then(result =>{
            console.log("webcam started");
          })
          .catch(err => {
            console.log(err);
          });

        e.innerHTML = 'Take Photo';
        e.value = 'on';
    }

    else if(e.value == 'on'){

        let profilePic = webcam.snap();
    
        webcam.stop();

        e.innerHTML = 'Retake Picture';
        e.value = 'off';

        
       
    }
}


function getInputs() {

    let inputData = [12];

    inputData[0] = 0; //ID NUMBER
    inputData[1] = document.getElementById("sBox1").value; //Last Name
    inputData[2] = document.getElementById("sBox2").value; //First Name
    inputData[3] = document.getElementById("sBox3").value; //Phone Number
    inputData[4] = document.getElementById("sBox4").value; //Email Address
    inputData[5] = document.getElementById("sBox5").value; //Current Address
    inputData[6] = document.getElementById("sBox6").value; //Previous Address
    inputData[7] = document.getElementById("sBox7").value; //Location

    inputData[8] = profilePic; //Profile Image

    inputData[9] = document.getElementById("sBox8").value;  //Passport Number
    inputData[10] = document.getElementById("sBox9").value; //Driver's License ID
   // inputData[11] = document.getElementById("sBox10").value;//DNA Test ID

  }

