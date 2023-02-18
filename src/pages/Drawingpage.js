import { PencilIcon,ShareIcon,ChevronUpIcon } from '@heroicons/react/24/solid'
import circle from './circle.svg'
import rectangle from './rectangle.svg'
import logo from './logo.svg'
import cursor from './cursor.png'
import settings from './settings.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from "react";
import { TwitterPicker } from 'react-color';
import "../App.css";



const Drawingpage =() => {
    const canvasRef=useRef(null);
    const[isDrawing,setIsDrawing]=useState(false);
    const[erasing,setErasing]=useState(false);
    const[lastx,setLastx]=useState(0);
    const[lasty,setLasty]=useState(0);
    const [socket, setSocket] = useState(null);
    const[coordinates,setCoordinates]=useState({'x':0,'y':0});
    const url='wss://synkit-backend-production.up.railway.app/json';
    const[palette,showPalette]=useState(false);
    const [color, setColor] = useState( "#121212");
    const [tool,setTool]=useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startRX, setStartRX] = useState(0);
    const [startRY, setStartRY] = useState(0);
    const [currentx, setCurrentx] = useState(0);
    const [currenty, setCurrenty] = useState(0);
    const[radius,setRadius]=useState(0);
    const[snapshot,setSnapshot]=useState(null);


    useEffect(() => {
        const data={
            'x':0,
            'y':0,
            'px':0,
            'py':0,
            'color':color,
            'tool':'pen',
            'h':0,
            'w':0,
            'radius':0
        };

        setCoordinates(data);
        const ws = new WebSocket(url);
        setSocket(ws);
        ws.onopen = () => {
            console.log('WebSocket connection opened:', ws);
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setSocket(null);
        };


    }, []);
    try {
        socket.onmessage = (event) => {

            console.log(JSON.parse(event.data));
            var d = JSON.parse(event.data);
            if (d.tool == 'pen' || d.tool == 'eraser')
            {
                if (d.px || d.py) {

                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");

                    if (d.tool == 'pen') {
                        ctx.lineWidth = 2;

                        ctx.strokeStyle = d.color;
                    } else if(d.tool=='eraser') {
                        ctx.lineWidth = 40;

                        ctx.strokeStyle = "white";
                    }

                    ctx.beginPath();

                    ctx.moveTo(d.px, d.py);
                    ctx.lineTo(d.x, d.y);

                    ctx.stroke();

                }

        }
            else if(d.tool=='rectangle')
            {const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = d.color;
                ctx.strokeRect(d.x, d.y, d.w, d.h);

            }
            else if(d.tool=='circle')
            console.log(d.tool);
            {const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = d.color;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        };
    }catch (e) {
        console.log(e)
    }




   const tooglePalette=()=>{
        showPalette(!palette);
   }

    const startDrawing = (e) => {
        const {offsetX, offsetY} = e.nativeEvent;
        const canvas = canvasRef.current;
        const ctx=canvas.getContext("2d");
        if(tool=='pen'||tool=='eraser') {
            setIsDrawing(true);
            coordinates.x = offsetX;
            coordinates.y = offsetY;
            coordinates.tool=tool;
            console.log(coordinates);
            socket.send(JSON.stringify(coordinates));
            setLastx(e.offsetX);
            setLasty(e.offsetY);
            canvas.style.cursor = tool=='eraser' ? "cell" : "crosshair";
        }
        else if (tool=='rectangle'||tool=='circle')
        { coordinates.color= color;
            setIsMouseDown(true);
            setStartRX(e.nativeEvent.offsetX);
            setStartRY(e.nativeEvent.offsetY);
            ctx.beginPath();




        }
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    const startErasing=()=>{
        setErasing(true);
        setIsDrawing(false);
    }
    const stopDrawing = () => {
        if (tool == 'pen' || tool == 'eraser') {
            coordinates.px = 0;
            coordinates.py = 0;

            socket.send(JSON.stringify(coordinates));
            setIsDrawing(false);
            canvasRef.current.style.cursor = "default";
        }
        else if(tool=='rectangle'||tool=='circle')
        {
            setIsMouseDown(false);
                   }
    };
    const Draw=e=> {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (tool == 'pen' || tool == 'eraser') {
            if (!isDrawing) return;

            const {offsetX, offsetY} = e.nativeEvent;

            ctx.lineWidth = erasing ? 40 : 2;

            ctx.strokeStyle = erasing ? "white" : color;
            coordinates.color = color;
            ctx.beginPath();

            ctx.moveTo(lastx, lasty);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();

            coordinates.x = offsetX;
            coordinates.y = offsetY;
            coordinates.px = lastx;
            coordinates.py = lasty;
            coordinates.tool=tool;
            coordinates.color=color;

            socket.send(JSON.stringify(coordinates));

            setLastx(offsetX);
            setLasty(offsetY);

        }
        else if(tool=='rectangle')
        {
            if (isMouseDown) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const currentX = e.nativeEvent.offsetX;
                const currentY = e.nativeEvent.offsetY;

                ctx.putImageData(snapshot, 0, 0);
                    ctx.strokeStyle =color;
                    ctx.lineWidth = 2;

                    ctx.strokeRect(currentX, currentY, startRX-currentX, startRY-currentY);

                setCurrentx(e.nativeEvent.offsetX);
                setCurrenty(e.nativeEvent.offsetY);


            }
            else
            {

        coordinates.x = startRX;
        coordinates.y = startRY;
        coordinates.h = -(startRY - currenty);
        coordinates.w = -(startRX - currentx);
        coordinates.tool = tool;

        socket.send(JSON.stringify(coordinates));


            }
        }
        else if(tool=='circle')
        {console.log(tool);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const currentX = e.nativeEvent.offsetX;
            const currentY = e.nativeEvent.offsetY;
            if (isMouseDown) {
                ctx.strokeStyle =color;
                ctx.lineWidth = 1;
                ctx.putImageData(snapshot, 0, 0);
                ctx.beginPath();
                setRadius( Math.sqrt(Math.pow((startRX - currentX), 2) + Math.pow((startRY - currentY), 2)));
                ctx.arc(startRX, startRY, radius, 0, 2 * Math.PI);
                ctx.stroke();

            }
            else{
                coordinates.x = startRX;
                coordinates.y = startRY;
                coordinates.tool = tool;
                coordinates.radius=radius;
                socket.send(JSON.stringify(coordinates));
            }
        }

    };
    const handleChangeComplete = (color) => {
       setColor(color.hex);
       showPalette(!palette);
    };
    return (
        <div className="outer  ">
            <div className="fullWrapper ">

            <canvas  className="canvas "
                     ref={canvasRef}
                     onMouseDown={startDrawing}
                     onMouseUp={stopDrawing}
                     onMouseOut={stopDrawing}
                     onMouseMove={Draw}
                     height={(window.screen.height)*0.65}
                     width={(window.screen.width)*0.75}
            />

            <div className="boxWrapper">
                <ul className="list">
                    <li>
                        <button onClick={()=>{
                            setErasing(false);

                            stopDrawing();
                            setTool('pen');

                        }}>
                            <PencilIcon className="h-8 w-8 text-black relative "/>

                        </button>
                        {tool=='pen'?<div style={{background:color}} className="relative h-1 w-0.15"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                    </li>
                    <li>
                        <button onClick={tooglePalette}>
                        <ChevronUpIcon className="h-4 w-4 -left-14 top-3 relative"/>
                        </button>
                        </li>
                    <li>
                        <button onClick={()=>{setTool('circle');}}>
                            <img src={circle} className="circle"/>
                        </button>
                    </li>

                    <li>
                        <button onClick={()=>{setTool('rectangle');}}>
                            <img src={rectangle} className="rectangle"/>
                        </button>
                    </li>
                    <li>

                        <img src={logo} className="logo"/>

                    </li>
                    <li>
                        <button>
                            <img src={cursor} className="cursor"/>
                        </button>
                    </li>
                    <li>
                        <button onClick={()=>{

                            startErasing();
                            setTool('eraser');
                        }}>
                            <FontAwesomeIcon icon={faEraser} className="h-8 w-8 text-black relative pb-2.5"/>
                        </button>
                        {tool=='eraser'?<div className="relative h-1 w-0.15 bg-[#0085FF]"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                    </li>
                    <li>
                        <button>

                            <img src={settings} className="settings"/>
                        </button>
                    </li>
                    <li>
                        <button>
                        <ShareIcon className="h-8 w-8 text-black relative "/>
                        </button>
                    </li>
                </ul>

            </div>
            </div>
            <div className="absolute bg-white  left-72 top-96  ">

                {palette?<TwitterPicker colors={ ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'] }
                                       onChangeComplete={ handleChangeComplete } />:null}

            </div>

        </div>
    );
};

export default Drawingpage;
