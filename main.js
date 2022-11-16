const MAIN_AUDIO = new Audio( "./assets/electronic-future-beats.mp3" );
let runVisualizer = false;

const SLIDER = document.querySelector( "#range-slider" );
MAIN_AUDIO.addEventListener(
  "canplay",
  function( ev ){
    SLIDER.setAttribute( "max", `${Math.floor(MAIN_AUDIO.duration)}` );
    return;
  }
)
SLIDER.addEventListener(
  "input",
  function( ev ){
    let progress = ev.target.value;
    MAIN_AUDIO.currentTime = progress;
    // console.log( "changed" );
    return;
  }
)
addAudioPlayer( MAIN_AUDIO );

MAIN_AUDIO.addEventListener(
  "timeupdate",
  function( ev ){
    let current_time = playback_length_value( MAIN_AUDIO.currentTime );
    let time = ""

    if( current_time.hours > 0 ){
      time += `${current_time.hours}:`;
    }

    if( current_time.minutes < 10 ){
      time += `0${current_time.minutes}:`;
    } else {
      time += `${current_time.minutes}:`;
    }

    if( current_time.seconds < 10 ){
      time += `0${current_time.seconds}`;
    } else {
      time += `${current_time.seconds}`;
    }

    // console.log( time );

    SLIDER.setAttribute( "value", Math.floor( MAIN_AUDIO.currentTime ) );
    return;
  }
)

function playback_length_value( duration ){
  let time = {}
  time.hours = Math.floor( duration / 3600 );
  duration -= time.hours * 60;

  time.minutes = Math.floor( duration / 60 );
  duration -= time.minutes * 60;

  time.seconds = Math.round( duration );
  return time;
}
// add event listener for MAIN_AUDIO
MAIN_AUDIO.addEventListener(
  "play",
  function( ev ){
    // console.log( "playing" );
    startVisualizerAnimation(  )
  }
)

MAIN_AUDIO.addEventListener(
  "ended",
  function( ev ){
    console.log( "ended" );
  }
)

MAIN_AUDIO.addEventListener(
  "pause",
  function( ev ){
    console.log( "paused" );
  }
)

// create an audio context object
const AUDIO_CTX = new window.AudioContext();
// console.log( AUDIO_CTX );

const CONTAINER = document.getElementById( "container" );
const CANVAS = document.getElementById( "visualizer" );
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

const CTX = CANVAS.getContext( "2d" );

let audioSource;
let analyzer;

CONTAINER.addEventListener(
  "click", visualizerClicked
)

function visualizerClicked( ev ){

  MAIN_AUDIO.play();
  
  // create an audio source from an audio element
  audioSource = AUDIO_CTX.createMediaElementSource( MAIN_AUDIO );

  // creates an analyser node that exposes the time and frequency
  // data of the audio
  analyzer = AUDIO_CTX.createAnalyser();

  // connect audio source to the analyserexposing the audio and 
  // returning its timing and frequency as a data object
  audioSource.connect( analyzer );
  
  // connect the analyser to the audio output device
  analyzer.connect( AUDIO_CTX.destination );

  // analyser can have the number of samples set for a given audio
  // they are base 2 numbers starting at 32 - 32768, default is 2048
  analyzer.fftSize = 64;

  // frequencyBInCount is a read only value, it contains the number
  // of data values we have from the analyzer data file. It is always
  // half the fftSize.
  const bufferLength = analyzer.frequencyBinCount;

  // convert the data into Unsigned Integer that are 8-bit, this is 
  // the format we can use.
  const dataArray = new Uint8Array( bufferLength );

  // set the width of each bar
  const barWidth = CANVAS.width / bufferLength;

  // variables to hold the bar height and xpos
  // as we cycle through all frequencies in the audio
  let barHeight;
  let x = 0;

  function animate(){
    
    drawVisualizerCycle( analyzer, dataArray, barWidth, bufferLength, "#ff6400" );

    // loop animation
    requestAnimationFrame( animate );

    return;
  }

  animate();

  return;
}

function addAudioPlayer( AudioElement ){
  let control_panel = document.getElementById( "control-panel" );
  AudioElement.controls = true;
  control_panel.appendChild( AudioElement );
  return;
}

// draws the visualization at a given point in the playback
function drawVisualizerCycle( analyser, dataArray, barWidth, bufferLength, fillColor = "#ffffff", maxHeight = 1 ){

  // clear canvas
  CTX.clearRect( 0, 0, CANVAS.width, CANVAS.height );

  analyser.getByteFrequencyData( dataArray );

  // maxHeight is a number between 0 and 1
  let max_height = CANVAS.height * maxHeight;

  let x = 0;

  for( let i = 0; i < bufferLength; i++ ){
    barHeight = ( dataArray[i] / 255 ) * max_height;
    CTX.fillStyle = fillColor;
    CTX.fillRect( x, CANVAS.height - barHeight, barWidth, barHeight );

    x += barWidth;
  }

  return;
}


function startVisualizerAnimation(){

  // create audio source
  let audioSource = AUDIO_CTX.p 
}



let test_audio = new Audio("./assets/electronic-future-beats.mp3")
test_audio.addEventListener(
  "canplaythrough",
  function(){

    let duration = playback_length_value( test_audio.duration );
    console.log( duration );
    console.log( `audio length: ${duration.minutes} min ${duration.seconds} sec` );
    return;
  }
)