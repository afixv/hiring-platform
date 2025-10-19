import { ChevronRight } from "lucide-react";

interface PoseSequenceProps {
  status: string;
}

export function PoseSequence({ status }: PoseSequenceProps) {
  
  return (
    <>
      <p className="text-xs text-neutral-100">
        To take a picture, follow the hand poses in the order shown below. The
        system will automatically capture the image once the final pose is
        detected.
      </p>
      <div className="flex justify-center items-center gap-2 mt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            status === "detecting_2" || status === "detecting_1" || status === "countdown" || status === "review"
              ? "/img/pose/3-success.svg"
              : "/img/pose/3.svg"
          }
          alt="Three fingers pose"
          className="w-16 h-16 transition-all"
        />
        <ChevronRight className="size-6 text-neutral-100" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            status === "detecting_1" || status === "countdown" || status === "review"
              ? "/img/pose/2-success.svg"
              : "/img/pose/2.svg"
          }
          alt="Victory pose"
          className="w-16 h-16 transition-all"
        />
        <ChevronRight className="size-6 text-neutral-100" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            status === "countdown" || status === "review"
              ? "/img/pose/1-success.svg"
              : "/img/pose/1.svg"
          }
          alt="One finger pose"
          className="w-16 h-16 transition-all"
        />
      </div>
    </>
  );
}
