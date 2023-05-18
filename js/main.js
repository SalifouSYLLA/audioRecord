//verify devices permission access

const devicesStatus = document.querySelector('.devices-status');

//snackBar

const snackbar = ()=>{
    setTimeout(()=>{
        devicesStatus.classList.add('hide');
    },8000) //hide after 8s
}

//Check access permission

navigator.permissions.query({
    name: 'microphone'
})
.then(function(result){
    console.log(result)
    if(result.state === 'granted'){
        devicesStatus.innerHTML = 'Devices Access Granted'
        snackbar()
    }
    if(result.state === 'prompt'){
        devicesStatus.innerHTML = 'Devices Access Request'
        snackbar()
    }

    if(result.state === 'denied'){
        devicesStatus.innerHTML = 'Please enable Microphone Devices.'
        snackbar()
    }
})



//Select Buttons

const title = document.querySelector('.title');
const rec = document.querySelector('.rec');
const stop = document.querySelector('.stop');
const audioplay = document.querySelector('.audio');
const stopwatch = document.querySelector('.stopwatch');

//Type of media

let typeOfMedia = {
    audio:true
    //, video: true
}

//create chunks audio array container

let chunks = [];
//Media options

let options = {
    audioBitsPerSecond:128000,
    videoBitPerSecond:2500000,
    mimeType:'audio/webm'
}

//Download counter

let counter = 0;



let recStream;

const recFunction = async() =>{
    try{
        //Access computer devices
        const mediaDevices = await navigator.mediaDevices.getUserMedia(typeOfMedia);

        if(mediaDevices.active === true){
            //ceate a new Media recorde object

            recStream = new MediaRecorder(mediaDevices, options);
            recStream.ondataavailable = e =>{
                //push inside the array

                chunks.push(e.data);
                //If state is inactive stop recording

                if(recStream.state === 'inactive'){
                    //create a new Blob

                    let blob = new  Blob(chunks,{
                        type: 'audio/webm'
                    });
                    //create a playback
                    createAudioElement(URL.createObjectURL(blob));
                }
            }
        //start rec now
        recStream.start();
        }
    }catch(error){
        if(error) throw error;
    }
}


//Link styles

let linkStyles = "display:block;padding:10px;color:red;text-decoration:none;"
let divlinkstyle = "margin-left:40%; margin-top:1%;"

//create audio element to playback

function createAudioElement(blobUrl){
    const divE1 = document.createElement('div');
    divE1.style = divlinkstyle;
    divE1.className = 'div-audio';
    const downloadE1 = document.createElement('a');
    downloadE1.style = linkStyles;
    downloadE1.innerHTML = 'Download-'+counter;
    downloadE1.download = 'Audio-"'+counter+'".webm';
    downloadE1.href = blobUrl;
    const audioE1 = document.createElement('audio');
    audioE1.className = 'audio';
    audioE1.controls = true;
    const sourceE1 = document.createElement('source');
    sourceE1.type = 'audio/webm';
    sourceE1.src = blobUrl;
    audioE1.appendChild(sourceE1);
    divE1.appendChild(audioE1);
    divE1.appendChild(downloadE1);

    //apped all in the dom

    document.body.appendChild(divE1);
}


//Rec on click
rec.onclick = e =>{
    //disable rec button during registration

    rec.disabled = true;

    //change back color

    rec.style.backgroundColor = 'orange';
    //Animate rec button

    rec.classList.add('scale');
    //Enable stop button

    stop.disabled = false;

    //change stop styles

    stop.style.backgroundColor = '#292964';
    stop.style.color = '#ffffff';
    //change title back color

    title.style.color='#2196f3';

    //STATRT Recording

    recFunction();

    //start stopwatch...
}

//on click stop

stop.onclick = e =>{
    //Enable Rec button

    rec.disabled = false;
    //restore red color on rec button

    rec.style.backgroundColor = 'red';
    //Disable rec animation

    rec.classList.remove('scale');
    //Disable stop button

    stop.disabled = true;

    //change stop colors;

    stop.style.backgroundColor = '#292929';
    stop.style.color = 'rgb(103,103,103)';
    //title color
    title.style.color = '#313142';
    //Stop and reset stopwatch

    //stop Rec

    recStream.stop();
}