"use client";

import dynamic from "next/dynamic";
import FlyingDumbbell from "@/public/loading.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function DumbbellAnimation() {
  return (
    <Lottie
      style={{ height: 250 }}
      animationData={FlyingDumbbell}
      loop={true}
    />
  );
}
