/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    fp: any;
    handpose: any;
  }
}

export interface GestureCaptureState {
  scriptsLoaded: boolean;
  status: string;
  isLoading: boolean;
  error: string | null;
  model: any;
  gestureEstimator: any;
  boundingBox: any;
  currentPose: string | null;
  countdown: number;
  capturedImage: string | null;
  isDelaying: boolean;
}

export interface GestureCaptureActions {
  onScriptsLoaded: () => void;
  handleRetake: () => void;
  handleSubmit: (onSubmit: (image: string) => void) => void;
}

export function useGestureCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [gestureEstimator, setGestureEstimator] = useState<any>(null);
  const [status, setStatus] = useState<string>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boundingBox, setBoundingBox] = useState<any>(null);
  const [currentPose, setCurrentPose] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDelaying, setIsDelaying] = useState(false);
  const [restartStream, setRestartStream] = useState(0);

  const onScriptsLoaded = () => {
    console.log("All scripts loaded");
    setScriptsLoaded(true);
  };

  // === 1. Setup Model & Gestures ===
  useEffect(() => {
    if (scriptsLoaded) {
      async function setup() {
        try {
          // Check if required libraries are available
          if (!window.fp || !window.handpose) {
            throw new Error("Required libraries (fingerpose or handpose) not loaded");
          }

          const { GestureDescription, Finger, FingerCurl, FingerDirection } =
            window.fp;

          // === 3 Fingers ===
          const three = new GestureDescription("three_fingers");
          for (const f of [Finger.Index, Finger.Middle, Finger.Ring]) {
            three.addCurl(f, FingerCurl.NoCurl, 1.0);
            three.addDirection(f, FingerDirection.VerticalUp, 1.0);
            three.addDirection(f, FingerDirection.DiagonalUpLeft, 0.9);
            three.addDirection(f, FingerDirection.DiagonalUpRight, 0.9);
          }
          for (const f of [Finger.Thumb, Finger.Pinky]) {
            three.addCurl(f, FingerCurl.FullCurl, 1.0);
            three.addCurl(f, FingerCurl.HalfCurl, 0.9);
          }

          const two = window.fp.Gestures.VictoryGesture;

          // === One finger (still needed for matching) ===
          const one = new GestureDescription("one_finger");
          one.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
          one.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8);
          one.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
          one.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 0.9);
          one.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 0.9);
          for (const f of [
            Finger.Thumb,
            Finger.Middle,
            Finger.Ring,
            Finger.Pinky,
          ]) {
            one.addCurl(f, FingerCurl.FullCurl, 1.0);
            one.addCurl(f, FingerCurl.HalfCurl, 0.8);
          }

          const ge = new window.fp.GestureEstimator([three, two, one]);
          setGestureEstimator(ge);

          const handposeModel = await window.handpose.load();
          setModel(handposeModel);
          setIsLoading(false);
          setStatus("ready");
        } catch (err) {
          console.error("Error loading model:", err);
          const errorMsg = err instanceof Error ? err.message : "Failed to load model";
          setError(errorMsg);
          setIsLoading(false);
          setStatus("error");
        }
      }

      setup();
    }
  }, [scriptsLoaded]);

  // === 2. Webcam ===
  useEffect(() => {
    if (model && !streamRef.current) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play();
                setStatus("detecting_3");
              }
            };
          }
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      })();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [model, restartStream]);

  // === 3. Gesture Detection (with custom 1-finger check) ===
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout | undefined;
    let lastGesture: string | null = null;
    let stableCount = 0;

    const detectGesture = async () => {
      if (
        isDelaying ||
        !model ||
        !gestureEstimator ||
        !videoRef.current ||
        videoRef.current.readyState !== 4
      )
        return;

      const predictions = await model.estimateHands(videoRef.current);
      if (predictions.length === 0) {
        setBoundingBox(null);
        return;
      }

      const hand = predictions[0];
      setBoundingBox(hand.boundingBox);

      // --- 1️⃣ Custom one-finger heuristic ---
      const landmarks = hand.landmarks;
      const tips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
      const mcp = [5, 9, 13, 17]; // knuckles
      const extended = tips.map(
        (tip, i) => landmarks[tip][1] < landmarks[mcp[i]][1] - 20 // jari lebih tinggi
      );
      const isIndexUp =
        extended[0] && !extended[1] && !extended[2] && !extended[3];

      let bestGesture: string | null = null;
      if (isIndexUp) {
        bestGesture = "one_finger_hybrid";
      } else {
        const result = gestureEstimator.estimate(landmarks, 6.0);
        if (result.gestures.length > 0)
          bestGesture = result.gestures.sort(
            (a: any, b: any) => b.score - a.score
          )[0].name;
      }

      // --- Stability Filter ---
      if (bestGesture === lastGesture) stableCount++;
      else {
        lastGesture = bestGesture;
        stableCount = 0;
      }

      if (stableCount > 2 && bestGesture) {
        setCurrentPose(bestGesture);
        const startDelay = (next: string) => {
          setIsDelaying(true);
          setTimeout(() => {
            setStatus(next);
            setIsDelaying(false);
          }, 1000);
        };

        if (status === "detecting_3" && bestGesture === "three_fingers")
          startDelay("detecting_2");
        else if (status === "detecting_2" && bestGesture === "victory")
          startDelay("detecting_1");
        else if (
          status === "detecting_1" &&
          (bestGesture === "one_finger" || bestGesture === "one_finger_hybrid")
        )
          startDelay("countdown");
      }
    };

    if (status.startsWith("detecting")) {
      detectionInterval = setInterval(detectGesture, 200);
    }
    return () => clearInterval(detectionInterval);
  }, [status, model, gestureEstimator, isDelaying]);

  // === 4. Countdown & Capture ===
  useEffect(() => {
    if (status === "countdown") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const v = videoRef.current;
        const c = canvasRef.current;
        if (v && c) {
          c.width = v.videoWidth;
          c.height = v.videoHeight;
          const ctx = c.getContext("2d");
          if (!ctx) return;
          ctx.translate(v.videoWidth, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);
          const img = c.toDataURL("image/png");
          setCapturedImage(img);
          setStatus("review");
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
        }
      }
    }
  }, [status, countdown]);

  // === 5. Draw bounding box ===
  useEffect(() => {
    const c = drawingCanvasRef.current;
    const v = videoRef.current;
    // Jangan tampilkan bounding box ketika countdown atau review
    if (
      !c ||
      !v ||
      !boundingBox ||
      status === "countdown" ||
      status === "review"
    ) {
      if (c) {
        c.width = v?.videoWidth || 0;
        c.height = v?.videoHeight || 0;
        const ctx = c.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, c.width, c.height);
      }
      return;
    }
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

    const isPoseCorrect =
      (status === "detecting_3" && currentPose === "three_fingers") ||
      (status === "detecting_2" && currentPose === "victory") ||
      (status === "detecting_1" &&
        (currentPose === "one_finger" || currentPose === "one_finger_hybrid"));

    const color = isPoseCorrect ? "#059669" : "#DC2626";
    const [x1, y1] = boundingBox.topLeft;
    const [x2, y2] = boundingBox.bottomRight;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = color;
    ctx.font = "bold 18px sans-serif";
    const label = isPoseCorrect
      ? status === "detecting_3"
        ? "Pose 3"
        : status === "detecting_2"
        ? "Pose 2"
        : "Pose 1"
      : "Undetected";
    const textW = ctx.measureText(label).width;
    ctx.fillRect(x1, y1 - 30, textW + 20, 30);
    ctx.fillStyle = "#FFF";
    ctx.fillText(label, x1 + 10, y1 - 8);
  }, [boundingBox, currentPose, status]);

  const handleRetake = () => {
    setCapturedImage(null);
    setCountdown(3);
    setCurrentPose(null);
    setBoundingBox(null);
    // Trigger stream restart dengan increment restartStream counter
    setRestartStream((prev) => prev + 1);
  };

  const handleSubmit = (onSubmit: (image: string) => void) => {
    if (capturedImage) onSubmit(capturedImage);
  };

  const state: GestureCaptureState = {
    scriptsLoaded,
    status,
    isLoading,
    error,
    model,
    gestureEstimator,
    boundingBox,
    currentPose,
    countdown,
    capturedImage,
    isDelaying,
  };

  const actions: GestureCaptureActions = {
    onScriptsLoaded,
    handleRetake,
    handleSubmit,
  };

  return {
    state,
    actions,
    refs: {
      videoRef,
      canvasRef,
      drawingCanvasRef,
    },
  };
}
