import React, { useRef, useState, useEffect } from "react";



function Rectangle() {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [color, setColor] = useState("black");
  const [shapeType, setShapeType] = useState("circle");

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setIsMouseDown(true);
    setStartX(event.nativeEvent.offsetX);
    setStartY(event.nativeEvent.offsetY);

    // Add the new shape to the array
    setShapes([...shapes, { type: shapeType, x: startX, y: startY, w: 1, h: 1, color: color }]);
  }

  function handleMouseMove(event) {
    if (isMouseDown) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Get current mouse position
      const currentX = event.nativeEvent.offsetX;
      const currentY = event.nativeEvent.offsetY;

      // Update the size of the last shape in the array
      const updatedShapes = shapes.slice();
      const lastIndex = updatedShapes.length - 1;
      const dx = currentX - startX;
      const dy = currentY - startY;

      if (shapeType === "circle") {
        const radius = Math.sqrt(dx * dx + dy * dy);
        updatedShapes[lastIndex].w = radius;
        updatedShapes[lastIndex].h = radius;
      } else {
        updatedShapes[lastIndex].w = dx;
        updatedShapes[lastIndex].h = dy;
      }

      setShapes(updatedShapes);

      // Draw the updated shape
      const { type, x, y, w, h, color } = updatedShapes[lastIndex];
      ctx.beginPath();
      if (type === "circle") {
        ctx.arc(x, y, w, 0, 2 * Math.PI);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function handleMouseUp(event) {
    setIsMouseDown(false);
  }

  function handleColorChange(event) {
    setColor(event.target.value);
  }

  function handleShapeTypeChange(event) {
    setShapeType(event.target.value);
  }

  // Redraw all of the shapes when the component updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    shapes.forEach(({ type, x, y, w, h, color }) => {
      ctx.beginPath();
      if (type === "circle") {
        ctx.arc(x, y, w, 0, 2 * Math.PI);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });

  return (
      <div
          style={{ width: "100%", height: "100%" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} style={{ width: "50%", height: "50%" }} />
      </div>
  );
}

export default Rectangle;