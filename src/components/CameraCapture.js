import React, { useRef, useState, useEffect } from "react";

export default function CameraCapture() {
  const videoPlayer = useRef(null);
  const camera = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImageSize, setCapturedImageSize] = useState(null);

  useEffect(() => {
    // Access the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoPlayer.current) {
          videoPlayer.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  }, []);

  const captureImage = () => {
    const context = camera.current.getContext("2d");
    context.drawImage(videoPlayer.current, 0, 0, 360, 360);

    // Convert the canvas image to a Blob
    camera.current.toBlob((blob) => {
      handleCapturedImage(blob);
      sendImageToServer(blob); // Send image to Flask backend
    }, "image/png");
  };

  const handleCapturedImage = (blob) => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      let sz = formatFileSize(blob.size);
      setCapturedImageSize(sz);
    };
  };

  const sendImageToServer = (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "captured_image.png");
    fetch("https://kluiot.pythonanywhere.com/send_message", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Server Response:", data))
      .catch((error) => console.error("Error sending image:", error));
  };

  const formatFileSize = (bytes, decimalPoint = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint)) + " " + sizes[i];
  };

  return (
    <div align="center">
      <h1>Hello KLU IoT</h1>

      {/* Video Feed */}
      <video ref={videoPlayer} width="360" height="360" autoPlay />

      {/* Hidden Canvas */}
      <canvas ref={camera} width="360" height="360" style={{ display: "none" }} />

      {/* Capture Button */}
      <button onClick={captureImage}>Click Me</button>

      {/* Display Captured Image */}
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" width="360" height="360" />
          <p>Size: {capturedImageSize}</p>
        </div>
      )}
    </div>
  );
}
