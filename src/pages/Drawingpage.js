import { PencilIcon,StopIcon } from '@heroicons/react/24/solid'
import circle from './circle.svg'
import rectangle from './rectangle.svg'
import logo from './logo.svg'
import cursor from './cursor.png'
import settings from './settings.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import {useRef,useState} from "react";

const Drawingpage =() => {
const canvasRef=useRef(null);
const[isDrawing,setIsDrawing]=useState(false);
const[erasing,setErasing]=useState(false);
const[lastx,setLastx]=useState(0);
const[lasty,setLasty]=useState(0);
const[pen,setpen]=useState(false);
const [rub,setRub]=useState(false);


const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);

    setLastx(offsetX);
    setLasty(offsetY);

    canvas.style.cursor = erasing ? "cell" : "crosshair";
};
const startErasing=()=>{
    setErasing(true);
    setIsDrawing(false);
}
const stopDrawing = () => {
  setIsDrawing(false);
  canvasRef.current.style.cursor="default";
};
const Draw=e=>{
    console.log(erasing)
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;

    ctx.lineWidth = erasing ? 40 : 2;
    ctx.strokeStyle = erasing ? "white" : "black";

    ctx.beginPath();
    ctx.moveTo(lastx, lasty);
    ctx.lineTo(offsetX, offsetY);

    ctx.stroke();

    setLastx(offsetX);
    setLasty(offsetY);

};
    return (
        <div className="h-screen w-screen bg-[#A7A7A7]  flex justify-center items-center flex-wrap">

            <canvas  className="mt-10 bg-white border border-black  "
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={Draw}
                     height={(window.screen.height)*3/4}
                     width={(window.screen.width)*3/4}
            />

        <div className="w-1/2 h-16 bg-white border rounded-full border-black inline-flex  items-center">
            <ul className="inline-flex px-16 gap-x-16 left-2 relative">
                <li>
                    <button onClick={()=>{
                        setErasing(false);
                        setRub(false);
                        setpen(true);
                        stopDrawing();

                    }}>
                        <PencilIcon className="h-8 w-8 text-black relative "/>
                    </button>
                    {pen?<div className="relative h-1 w-0.15 bg-[#0085FF]"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                </li>
                <li>
                    <button>
                    <img src={circle} className="h-8 w-8 text-black  relative"/>
                    </button>
                </li>
                <li>
                    <button>
                        <img src={rectangle} className="h-8 w-8 text-black relative"/>
                    </button>
                </li>
                <li>

                        <img src={logo} className="h-10 w-10 text-black relative justify-center items-center"/>

                </li>
                <li>
                    <button>
                        <img src={cursor} className="h-8 w-8 text-black  relative"/>
                    </button>
                </li>
                <li>
                    <button onClick={()=>{
                        setRub(true);
                        setpen(false);
                        startErasing()
                    }}>
                        <FontAwesomeIcon icon={faEraser} className="h-8 w-8 text-black  relative"/>
                    </button>
                    {rub?<div className="relative h-1 w-0.15 bg-[#0085FF]"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                </li>
                <li>
                    <button>

                        <img src={settings} className="h-8 w-8 text-black  relative"/>
                    </button>
                </li>
            </ul>

        </div>

         </div>
    );
};

export default Drawingpage;
