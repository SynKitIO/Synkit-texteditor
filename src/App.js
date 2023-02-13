import React, { useRef, useState } from "react";

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [erasing, setErasing] = useState(false);

  const startDrawing = e => {
    const canvas = canvasRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setLastX(offsetX);
    setLastY(offsetY);

    canvas.style.cursor = erasing ? "cell" : "crosshair";
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current.style.cursor = "default";
  };

  const draw = e => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    ctx.lineWidth = erasing ? 10 : 2;
    ctx.strokeStyle = erasing ? "white" : "black";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setLastX(offsetX);
    setLastY(offsetY);
  };

  const toggleErasing = () => {
    setErasing(!erasing);
  };

  return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <canvas
            width="1000"
            height="500"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            style={{ backgroundColor: "white", border: "1px solid black" }}
        />
        <div style={{ position: "absolute", top: 20, left: 20 }}>
          <button onClick={toggleErasing}>Toggle Eraser</button>
        </div>
      </div>
  );
};

export default DrawingApp;
