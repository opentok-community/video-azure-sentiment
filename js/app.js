var opentok_api_key;
var opentok_session_id;
var opentok_token;
var azure_face_api_subscription_key;
var azure_face_api_endpoint;

// See the config.js file.
if (OPENTOK_API_KEY &&
  OPENTOK_SESSION_ID &&
  OPENTOK_TOKEN &&
  AZURE_FACE_API_SUBSCRIPTION_KEY &&
  AZURE_FACE_API_ENDPOINT) {

  opentok_api_key = OPENTOK_API_KEY;
  opentok_session_id = OPENTOK_SESSION_ID;
  opentok_token = OPENTOK_TOKEN;
  azure_face_api_subscription_key = AZURE_FACE_API_SUBSCRIPTION_KEY;
  azure_face_api_endpoint = AZURE_FACE_API_ENDPOINT;

  initializeSession();

} else {

  alert('Failed to get configuration variables. Make sure you have updated the config.js file.');

}

// Handling all of our errors here by logging them to the console
function handleError(error) {
  if (error) {
    console.log(error.message);
  }
}

var streams = [];
var emotions = [];

function initializeSession() {
  var session = OT.initSession(opentok_api_key, opentok_session_id);

  // Subscribe to a newly created streams and add
  // them to our collection of active streams.
  session.on("streamCreated", function (event) {
    streams.push(event.stream);
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append"
      },
      handleError
    );
  });

  // Remove streams from our array when they are destroyed.
  session.on("streamDestroyed", function (event) {
    streams = streams.filter(f => f.id !== event.stream.id);
  });

  // Create a publisher
  var publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append"
    },
    handleError
  );

  // Connect to the session
  session.connect(opentok_token, function (error) {
    // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}

function assignEmoji(emojiClass, index) {
  var widgets = document.getElementsByClassName('OT_widget-container');
  emotions.push(emojiClass);

  var sentimentDiv = document.createElement("div");
  sentimentDiv.classList.add("sentiment");
  sentimentDiv.classList.add("em");
  sentimentDiv.classList.add(emojiClass);

  widgets[index].appendChild(sentimentDiv);

  const legendEl = document.getElementsByName(emojiClass);
  legendEl[0].classList.add('used');
}

function processEmotion(faces, index) {
  // for each face identified in the result
  for (i = 0; i < faces.length; i++) {
    const maxEmotion = Object.entries(
      faces[i].faceAttributes.emotion
    ).reduce((memo, [key, value]) =>
      memo[1] > value ? memo : [key, value]
    );

    let emojiClass = 'em-neutral_face';
    switch (maxEmotion[0]) {
      case 'angry':
        emojiClass = 'em-angry';
        break;
      case 'contempt':
        emojiClass = 'em-frowning';
        break;
      case 'disgust':
        emojiClass = 'em-face_vomiting';
        break;
      case 'fear':
        emojiClass = 'em-fearful';
        break;
      case 'happiness':
        emojiClass = 'em-grin';
        break;
      case 'sadness':
        emojiClass = 'em-cry';
        break;
      case 'surprise':
        emojiClass = 'em-astonished';
        break;
      default:
        break;
    }
    assignEmoji(emojiClass, index);
  }
}

// Gets a <video> element and draws it to a new
// canvas object. Then creates a jpeg blob from that
// canvas and sends to Azure Face API to get emotion
// data.
function sendToAzure(video, index) {
  // Get the stream object associated with this
  // <video> element.
  var stream = streams[index];

  var canvas = document.createElement("canvas");
  canvas.height = stream.videoDimensions.height;
  canvas.width = stream.videoDimensions.width;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  var dataURL = canvas.toDataURL("image/jpeg", 0.8);
  var blob = dataURItoBlob(dataURL);
  var fd = new FormData(document.forms[0]);
  fd.append("canvasImage", blob);

  // Perform the REST API call.
  var uriBase = `${azure_face_api_endpoint}/face/v1.0/detect`;

  // Request parameters.
  var params = 'returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion';

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${uriBase}?${params}`);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  xhr.setRequestHeader("Ocp-Apim-Subscription-Key", azure_face_api_subscription_key);

  xhr.send(blob);

  xhr.onload = () => {

    if (xhr.status == 200) {
      processEmotion(xhr.response, index);
    } else {
      var errorString = `(${xhr.status}) ${xhr.statusText}`;
      alert(errorString);
    }
  }
}

// Reset emojis and loop through all <video> elements and call
// sendToAzure
function processImages() {
  emotions = [];
  var sentiments = document.getElementsByClassName('sentiment');
  var usedListItems = document.getElementsByClassName('used');
  var videos = document.getElementsByTagName('video');

  // Remove any existing sentiment & emotion objects
  if (sentiments.length > 0) {
    for (s = 0; s < sentiments.length; s++) {
      sentiments[s].remove();
    }
  }
  if (usedListItems.length > 0) {
    for (l = 0; l < usedListItems.length; l++) {
      usedListItems[l].classList.remove('used');
    }
  }

  for (v = 0; v < (videos.length - 1); v++) {
    sendToAzure(videos[v], v);
  }
}

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}
