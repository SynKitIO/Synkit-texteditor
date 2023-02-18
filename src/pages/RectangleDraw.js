import React, { useRef, useState, useEffect } from "react";

function Rectangle() {
    const canvasRef = useRef(null);
    const [rectangles, setRectangles] = useState([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startRX, setStartRX] = useState(0);
    const [startRY, setStartRY] = useState(0);
    const [currentColor, setCurrentColor] = useState("black");

    function handleMouseDown(event) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        setIsMouseDown(true);
        setStartRX(event.nativeEvent.offsetX);
        setStartRY(event.nativeEvent.offsetY);

        // Add the new rectangle to the array
        setRectangles([
            ...rectangles,
            { x: startRX, y: startRY, w: 1, h: 1, color: currentColor },
        ]);
    }

    function handleMouseMove(event) {
        if (isMouseDown) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Get current mouse position
            const currentX = event.nativeEvent.offsetX;
            const currentY = event.nativeEvent.offsetY;

            // Update the size of the last rectangle in the array
            const updatedRectangles = rectangles.slice();
            const lastIndex = updatedRectangles.length - 1;
            updatedRectangles[lastIndex].w = currentX - startRX;
            updatedRectangles[lastIndex].h = currentY - startRY;
            setRectangles(updatedRectangles);

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all of the rectangles in the array
            updatedRectangles.forEach(({ x, y, w, h, color }) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, w, h);
            });
        }
    }

    function handleMouseUp(event) {
        setIsMouseDown(false);
    }

    function handleColorChange(color) {
        setCurrentColor(color);
    }

    // Redraw all of the rectangles when the component updates
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        rectangles.forEach(({ x, y, w, h, color }) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
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
            <div>
                <button onClick={() => handleColorChange("black")}>Black</button>
                <button onClick={() => handleColorChange("red")}>Red</button>
                <button onClick={() => handleColorChange("green")}>Green</button>
            </div>
        </div>
    );
}

export default Rectangle;
