"use client";

import Lottie from "lottie-react";
import FlyingDumbbell from "@/public/loading.json";

export default function DumbbellAnimation() {
  return (
    <Lottie
      style={{ height: 250 }}
      animationData={FlyingDumbbell}
      loop={true}
    />
  );
}
