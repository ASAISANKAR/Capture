import React, { useRef, useState, useEffect } from "react";

export default function EmptyPage() {
  const videoPlayer = useRef(null);
  const camera = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImageSize, setCapturedImageSize] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null); // State to store people count

  useEffect(() => {
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

    camera.current.toBlob((blob) => {
      handleCapturedImage(blob);
      sendImageToServer(blob);
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

    fetch("https://kluiot.pythonanywhere.com/count_people", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data);
        setPeopleCount(data.people_count); // Store people count
      })
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

      <video ref={videoPlayer} width="360" height="360" autoPlay />
      <canvas ref={camera} width="360" height="360" style={{ display: "none" }} />

      <button onClick={captureImage}>Click Me</button>

      {capturedImage && (
        <div>
          {peopleCount !== null && <h2>People Count: {peopleCount}</h2>} 
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" width="360" height="360" />
          <p>Size: {capturedImageSize}</p>
        </div>
      )}
    </div>
  );
}
