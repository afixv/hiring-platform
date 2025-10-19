interface OverlayProps {
  status: string;
  countdown: number;
}

export function GestureOverlay({ status, countdown }: OverlayProps) {
  if (status === "loading")
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl">
        Loading models...
      </div>
    );
  if (status === "countdown")
    return (
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
        <div className="text-white text-lg-bold mb-2">Capturing photo in</div>
        <div className="text-white font-bold text-5xl">{countdown}</div>
      </div>
    );
  if (status === "error")
    return (
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xl p-4 text-center">
        Could not access webcam. Please Restart your browser and allow webcam
        access.
      </div>
    );
  return null;
}
