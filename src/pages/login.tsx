import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import styles from "../styles/Login.module.css";

const Login = () => {
  const webcamRef = useRef<Webcam>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const lastBoxRef = useRef<faceapi.Box | null>(null);
  const stableStartRef = useRef<number | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
      setCameraOn(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!cameraOn || faceLocked || !modelsLoaded) return;

    const detectLoop = async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState < 2) return requestAnimationFrame(detectLoop);

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        lastBoxRef.current = null;
        stableStartRef.current = null;
        setScanProgress(0);
        return requestAnimationFrame(detectLoop);
      }

      const box = detection.box;
      if (!lastBoxRef.current) {
        lastBoxRef.current = box;
        stableStartRef.current = Date.now();
        setScanProgress(10);
        return requestAnimationFrame(detectLoop);
      }

      const dx = Math.abs(box.x - lastBoxRef.current.x);
      const dy = Math.abs(box.y - lastBoxRef.current.y);

      if (dx < 50 && dy < 50) {
        const elapsed = stableStartRef.current ? Date.now() - stableStartRef.current : 0;
        setScanProgress(Math.min(100, Math.floor((elapsed / 1000) * 100)));
        if (elapsed > 800 && !faceLocked) {
          setFaceLocked(true);
          setScanProgress(100);
          autoLogin(detection.descriptor);
          return;
        }
      } else {
        lastBoxRef.current = box;
        stableStartRef.current = Date.now();
        setScanProgress((prev) => Math.max(prev - 5, 0));
      }

      requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }, [cameraOn, faceLocked, modelsLoaded]);

  const stopCamera = () => {
    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setCameraOn(false);
  };

  const autoLogin = async (descriptor: Float32Array) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/login-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceEmbedding: Array.from(descriptor) }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Face not recognized",
          background: "#000",
          color: "#fff",
          confirmButtonColor: "#ff4c4c",
        });
        setFaceLocked(false);
        setScanProgress(0);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${data.name}`,
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#00c853",
      });

      stopCamera();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#ff4c4c",
      });
      setFaceLocked(false);
      setScanProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Face Login</h1>
        <p className={styles.subtitle}>Automatic face recognition</p>

        {cameraOn && (
          <div className={styles.webcamWrapper}>
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className={styles.webcam} />
            <div className={styles.scanBarContainer}>
              <div className={styles.scanBar} style={{ width: `${scanProgress}%` }} />
            </div>
            <p className={styles.statusWarn}>
              {faceLocked ? "Face captured, logging in..." : "Align your face and hold still"}
            </p>
          </div>
        )}

        {!cameraOn && <p>Loading camera...</p>}
      </div>
    </div>
  );
};

export default Login;
