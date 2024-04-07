

'use client';
import { FC, useEffect } from "react";
import { createBackground } from "./backgroundEffect";



const Background: FC<any> = () => {
  useEffect(() => {
    createBackground();
  }, []);

  return <>
    <canvas id='background-canvas' style={{
      position: 'fixed',
      zIndex: -1,
      top: 0,
      left: 0,
    }} />
  </>;
}

export default Background;
