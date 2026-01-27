import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import Link from "next/link";
import styles from "../styles/Register.module.css";

export default function Register() {
  const webcamRef = useRef<Webcam>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Core states
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);

  // Scan states
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Align your face");

  // Form
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ================= LOAD MODELS ================= */
  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(() => setModelsLoaded(true));
  }, []);

  /* ================= CAPTURE SNAPSHOT ================= */
  const captureSnapshot = async () => {
    const video = webcamRef.current?.video;
    if (!video || video.videoWidth === 0) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      showError("Face not detected properly. Try again!");
      return;
    }

    const img = webcamRef.current?.getScreenshot();
    if (!img) return;

    setSnapshot(img);
    setFaceDescriptor(Array.from(detection.descriptor));
    setFaceLocked(true);
    stopCamera();
  };

  /* ================= SHOW SWEETALERT ERROR ================= */
  const showError = (message: string) => {
    Swal.fire({
      icon: "error",
      title: message,
      background: "#000000",
      color: "#ffffff",
      confirmButtonColor: "#ff0000",
      confirmButtonText: "OK",
    });
  };

  /* ================= FACE SCANNING ================= */
  useEffect(() => {
    if (!cameraOn || faceLocked || !modelsLoaded) return;

    scanIntervalRef.current = setInterval(async () => {
      const video = webcamRef.current?.video;

      if (!video || video.readyState !== 4 || video.videoWidth === 0) return;

      // Detect all faces
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setScanMessage("Align your face");
        setScanProgress(0);
      } else if (detections.length > 1) {
        setScanMessage("Multiple faces detected!");
        setScanProgress(0);
      } else {
        setScanMessage("Hold still...");
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(scanIntervalRef.current!);
            captureSnapshot();
            return 100;
          }
          return prev + 10;
        });
      }
    }, 400);

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [cameraOn, faceLocked, modelsLoaded]);

  /* ================= STOP CAMERA ================= */
  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());

    setCameraOn(false);
  };

  /* ================= SAVE DATA ================= */
  const saveFace = async () => {
    if (!name || !email) {
      showError("Name & Email required");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Invalid Email");
      return;
    }

    if (!faceLocked || !faceDescriptor) {
      showError("Face scan required");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/register-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          faceEmbedding: faceDescriptor,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Registration Complete",
        text: "Face registered successfully",
        background: "#000000",
        color: "#ffffff",
        confirmButtonColor: "#ff4c4c",
        confirmButtonText: "OK",
      });

      setSnapshot(null);
      setFaceDescriptor(null);
      setFaceLocked(false);
      setScanProgress(0);
      setName("");
      setEmail("");
    } catch {
      showError("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Face Registration</h1>
        <p className={styles.subtitle}>Biometric Enrollment</p>

        {!cameraOn && !snapshot && (
          <button
            className={styles.button}
            onClick={() => {
              setCameraOn(true);
              setScanProgress(0);
              setScanMessage("Align your face");
            }}
          >
            Start Camera
          </button>
        )}

        {cameraOn && !snapshot && (
          <>
            <div className={styles.webcamWrapper}>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className={styles.webcam}
              />

              <div className={styles.scanContainer}>
                <div className={styles.scanCircle}>
                  <div
                    className={styles.scanProgress}
                    style={{ height: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <p className={styles.scanText}>{scanMessage}</p>
          </>
        )}

        {snapshot && (
          <div className={styles.snapshotWrapper}>
            <img src={snapshot} className={styles.snapshot} />
            <div className={styles.scanOverlay}>
              <div className={styles.tick}>✔</div>
              Face captured
            </div>
          </div>
        )}

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={saveFace}
            disabled={!faceLocked || loading}
          >
            {loading ? "Saving..." : "Register"}
          </button>

          <p>
            Already registered?{" "}
            <Link href="/login" className={styles.link}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
