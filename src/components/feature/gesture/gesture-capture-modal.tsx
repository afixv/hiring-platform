"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useGestureCapture } from "@/hooks/useGestureCapture";
import { GestureOverlay } from "./gesture-overlay";
import { PoseSequence } from "./pose-sequence";

export default function GestureCaptureModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (image: string) => void;
}) {
  const { state, actions, refs } = useGestureCapture();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.7/dist/handpose.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js"
        strategy="afterInteractive"
        onReady={actions.onScriptsLoaded}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={onClose}>
        <div
          className="relative bg-white w-full max-w-2xl p-4 rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center pb-3">
            <div>
              <h3 className="text-lg-bold text-neutral-100">
                Raise Your Hand to Capture
              </h3>
              <p className="text-xs text-neutral-100">
                Well take the photo once your hand pose is detected.
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-2xl text-gray-400 hover:text-gray-600">
              &times;
            </button>
          </div>

          <div className="relative w-full aspect-[3/2] bg-gray-900 rounded-md overflow-hidden">
            {state.status === "review" && state.capturedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={refs.videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={refs.drawingCanvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
                <GestureOverlay
                  status={state.status}
                  countdown={state.countdown}
                />
              </>
            )}
            <canvas ref={refs.canvasRef} className="hidden" />
          </div>

          <div className="mt-4">
            {state.status === "review" ? (
              <div className="flex justify-center gap-4">
                <button
                  onClick={actions.handleRetake}
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                  Retake
                </button>
                <button
                  onClick={() => actions.handleSubmit(onSubmit)}
                  type="button"
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                  Submit
                </button>
              </div>
            ) : (
              <PoseSequence status={state.status} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
