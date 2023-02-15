import { PencilIcon,ShareIcon,ChevronUpIcon } from '@heroicons/react/24/solid'
import circle from './circle.svg'
import rectangle from './rectangle.svg'
import logo from './logo.svg'
import cursor from './cursor.png'
import settings from './settings.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from "react";
import { SketchPicker,TwitterPicker } from 'react-color';



const Drawingpage =() => {
    const canvasRef=useRef(null);
    const[isDrawing,setIsDrawing]=useState(false);
    const[erasing,setErasing]=useState(false);
    const[lastx,setLastx]=useState(0);
    const[lasty,setLasty]=useState(0);
    const[pen,setpen]=useState(true);
    const [rub,setRub]=useState(false);
    const [socket, setSocket] = useState(null);
    const[coordinates,setCoordinates]=useState({'x':0,'y':0});
    const url='wss://synkit-backend-production.up.railway.app/json';
    const[palette,showPalette]=useState(false);
    const [color, setColor] = useState( "#121212");



    useEffect(() => {
        const data={
            'x':0,
            'y':0,
            'px':0,
            'py':0,
            'color':'black',
            'item':'pen'
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
            var d=JSON.parse(event.data);



            if(d.px || d.py){

                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
            
                if(d.item=='pen'){
                ctx.lineWidth =  2;

                ctx.strokeStyle = d.color;
                }
                else{
                    ctx.lineWidth =  40 ;

                    ctx.strokeStyle = "white" ;
                }

                ctx.beginPath();

                ctx.moveTo(d.px, d.py);
                ctx.lineTo(d.x, d.y);

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
        const canvas = canvasRef.current;
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true);
        coordinates.x=offsetX;
        coordinates.y=offsetY;
        if(erasing){
        coordinates.item='eraser';
        }
        else
        {
            coordinates.item='pen';
        }
        console.log(coordinates);
        socket.send(JSON.stringify(coordinates));

        setLastx(offsetX);
        setLasty(offsetY);

        canvas.style.cursor = erasing ? "cell" : "pen";
    };
    const startErasing=()=>{
        setErasing(true);
        setIsDrawing(false);
    }
    const stopDrawing = () => {

        coordinates.px=0;
        coordinates.py=0;
        socket.send(JSON.stringify(coordinates));
        setIsDrawing(false);
        canvasRef.current.style.cursor="default";
    };
    const Draw=e=>{

        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { offsetX, offsetY } = e.nativeEvent;

        ctx.lineWidth = erasing ? 40 : 2;

        ctx.strokeStyle = erasing ? "white" : color;
        coordinates.color=color;
        ctx.beginPath();

        ctx.moveTo(lastx, lasty);
        ctx.lineTo(offsetX, offsetY);

        ctx.stroke();
        coordinates.x=offsetX;
        coordinates.y=offsetY;
        coordinates.px=lastx;
        coordinates.py=lasty;
        if(erasing){
            coordinates.item='eraser';
            }
            else
            {
                coordinates.item='pen';
            }
        socket.send(JSON.stringify(coordinates));

        setLastx(offsetX);
        setLasty(offsetY);

    };
    const handleChangeComplete = (color) => {
       setColor(color.hex);
       showPalette(!palette);
    };
    return (
        <div className="h-screen w-screen  bg-[#A7A7A7]  ">
            <div className=" flex flex-col justify-center items-center gap-y-5 ">

            <canvas  className=" mt-4 bg-white border border-black  "
                     ref={canvasRef}
                     onMouseDown={startDrawing}
                     onMouseUp={stopDrawing}
                     onMouseOut={stopDrawing}
                     onMouseMove={Draw}
                     onTouchStart={stopDrawing}
                     onTouchMove={Draw}
                     onTouchEnd={stopDrawing}
                     onTouchCancel={stopDrawing}
                     height={(window.screen.height)*0.65}
                     width={(window.screen.width)*0.75}
            />

            <div className=" w-1/2 h-16 bg-white border rounded-full border-black inline-flex  items-center">
                <ul className="inline-flex px-16 gap-x-11  relative">
                    <li>
                        <button onClick={()=>{
                            setErasing(false);
                            setRub(false);
                            setpen(true);
                            stopDrawing();

                        }}>
                            <PencilIcon className="h-8 w-8 text-black relative "/>

                        </button>
                        {pen?<div style={{background:color}} className="relative h-1 w-0.15"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                    </li>
                    <li>
                        <button onClick={tooglePalette}>
                        <ChevronUpIcon className="h-4 w-4 -left-14 top-3 relative"/>
                        </button>
                        </li>
                    <li>
                        <button>
                            <img src={circle} className="h-8 w-8 text-black -left-14 relative"/>
                        </button>
                    </li>

                    <li>
                        <button>
                            <img src={rectangle} className="h-8 w-8 text-black relative -left-12"/>
                        </button>
                    </li>
                    <li>

                        <img src={logo} className="h-10 w-10 text-black relative justify-center items-center -left-8"/>

                    </li>
                    <li>
                        <button>
                            <img src={cursor} className="h-8 w-8 text-black  relative -left-6"/>
                        </button>
                    </li>
                    <li>
                        <button onClick={()=>{
                            setRub(true);
                            setpen(false);
                            startErasing()
                        }}>
                            <FontAwesomeIcon icon={faEraser} className="h-8 w-8 text-black  relative -left-4"/>
                        </button>
                        {rub?<div className="relative h-1 w-0.15 bg-[#0085FF]"></div>:<div className="relative h-1 w-0.15 bg-white"></div>}
                    </li>
                    <li>
                        <button>

                            <img src={settings} className="h-8 w-8 text-black  relative"/>
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
