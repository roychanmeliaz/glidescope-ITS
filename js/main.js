'use strict';

let rel_vid_url_sekarang;

/* globals MediaRecorder */

const mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs;
let sourceBuffer;

function downloadRec() {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

const errorMsgElement = document.querySelector('span#errorMsg');
const recordButton = document.querySelector('button#record');
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    downloadRec();
  }
});

window.onload=init;

function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`);
    errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  document.getElementById("defaultOpen").click();
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

function ganti(filename) {
  rel_vid_url_sekarang = filename;
  var vid = document.getElementById("playback");
  // vid.src = "recordings/rec05042020163636.webm";
  vid.src = filename;
  
  vid.style.display="block";
  document.querySelector("#playback").play();
  ul.innerHTML="";
  hapusVideo.style.display="block";
}

let ul = document.createElement('ul');
let hapusVideo = document.getElementById('hapusvideo');
recList.appendChild(ul);
function bacaFile() {
  hapusVideo.style.display="none";
  var vid = document.getElementById("playback");
  vid.style.display="none";
  //baca folder
  const { readdirSync } = require('fs');
  var PATH =  require('electron').remote.app.getAppPath()+"/recordings/";
  var listRec = readdirSync(PATH);
  $("#playback").get(0).pause();
  hapusVideo.style.display="none";

  ul.innerHTML="";
  listRec.forEach(function (namafile) {
    let li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML += namafile;
    li.onclick = function(){ganti(PATH+namafile)}
  });			
}

async function init() {
  console.log(require('electron').remote.app.getAppPath());

  //playback
  var vid = document.getElementById("playback");
  vid.style.display="none";


  const constraints = {
    audio: false,
    video: {
      width: 1280, height: 720
      // width: 320, height: 240
    }
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function hapusVideoIni() {
  var vid = document.getElementById("playback");
  vid.style.display="none";
  console.log(rel_vid_url_sekarang)
  hapusFile(rel_vid_url_sekarang);
}

function hapusFile(namafile) {
  const fs = require('fs')

  const path = namafile;

  try {
    fs.unlinkSync(path);
    //file removed
    bacaFile();
  } catch(err) {
    console.error(err);
  }
}