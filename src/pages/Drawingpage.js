import {PencilIcon} from '@heroicons/react/24/solid'
import circle from '../images/circle.svg'
import rectangle from '../images/rectangle.svg'
import logo from '../images/logo.svg'
import inkpen from '../images/inkpen.png'
import settings from '../images/settings.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {  faPencilAlt, faEraser, faSquare, faCircle,faPenNib,faBars } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';

import {useEffect, useRef, useState} from "react";
import {TwitterPicker} from 'react-color';
import "../App.css";
import {ChevronRightIcon} from "@heroicons/react/24/solid";
import {useAuth} from '@clerk/clerk-react'
import {SignedIn} from "@clerk/clerk-react";
import Navbar from "../components/Navbar";


const Drawingpage = () => {


    const {userId, sessionId, getToken} = useAuth();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [erasing, setErasing] = useState(false);
    const [lastx, setLastx] = useState(0);
    const [lasty, setLasty] = useState(0);
    const [socket, setSocket] = useState(null);
    const [coordinates, setCoordinates] = useState({'x': 0, 'y': 0});
    const url = 'wss://synkit-backend-production.up.railway.app/json';
    const [palette, showPalette] = useState(false);
    const [color, setColor] = useState("#000000");
    const [tool, setTool] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startRX, setStartRX] = useState(0);
    const [startRY, setStartRY] = useState(0);
    const [currentx, setCurrentx] = useState(0);
    const [currenty, setCurrenty] = useState(0);
    const [radius, setRadius] = useState(0);
    const [snapshot, setSnapshot] = useState(null);
    const [flag, setFlag] = useState('false');

    useEffect( () => {
        async function detailsSend() {
            //console.log(await getToken(), userId, sessionId);
            //console.log(await userId);
            const userID = await userId;
            const sessionID = await sessionId;

            const token = await getToken();
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    Authorization: token,
                },
            }
            // console.log(sessionID);
            // console.log(token);
            if (sessionID && userID) {
                const resp = await fetch(`https://synkit-backend-production.up.railway.app/auth/verify?session_id=${sessionID}`, options);
                if (resp.status === 200) {
                    console.log("Sucessfully sended session_id");
                } else {
                    console.log("Failed to send session_id");
                }
                const op = {
                    method: 'POST',
                }
                const res = await fetch(`https://synkit-backend-production.up.railway.app/auth/signup?user_id=${userID}`, op);
                if (res.status === 200) {
                    console.log("Sucessfully sended userid");
                } else {
                    console.log("Failed to send userid");
                }


            }
        }

        detailsSend();

    }, [userId,sessionId])

    useEffect(() => {

        const data = {
            'x': 0,
            'y': 0,
            'px': 0,
            'py': 0,
            'color': color,
            'tool': 'pen',
            'h': 0,
            'w': 0,
            'radius': 0
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
            if (d.tool ==='pen' || d.tool === 'eraser' || d.tool === 'inkpen') {
                if (d.px || d.py) {

                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");

                    if (d.tool === 'pen') {

                        var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                        gradient.addColorStop(0, 'rgb(218, 218, 218)');
                        gradient.addColorStop(1, d.color);

                        ctx.lineWidth = 2;
                        ctx.strokeStyle = gradient;
                    } else if (d.tool === 'eraser') {

                        ctx.lineWidth = 80;

                        ctx.strokeStyle = "white";

                    } else if (d.tool === 'inkpen') {


                        ctx.strokeStyle = d.color;
                    }

                    ctx.beginPath();

                    ctx.moveTo(d.px, d.py);
                    ctx.lineTo(d.x, d.y);
                    console.log("reciever" + d.tool);
                    console.log(ctx.strokeStyle);
                    ctx.stroke();


                }

            } else if (d.tool === 'rectangle') {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = d.color;
                ctx.strokeRect(d.x, d.y, d.w, d.h);

            } else if (d.tool === 'circle') {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = d.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
                console.log("stroked");
                ctx.stroke();
            }
        };
    } catch (e) {
        console.log(e)
    }


    const tooglePalette = () => {
        showPalette(!palette);
    }

    const startDrawing = (e) => {
        const {offsetX, offsetY} = e.nativeEvent;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (tool === 'pen' || tool === 'eraser' || tool === 'inkpen') {
            setIsDrawing(true);
            coordinates.x = offsetX;
            coordinates.y = offsetY;
            coordinates.tool = tool;
            console.log(coordinates);
            socket.send(JSON.stringify(coordinates));
            setLastx(e.offsetX);
            setLasty(e.offsetY);
            canvas.style.cursor = tool === 'eraser' ? "cell" : "crosshair";
        } else if (tool === 'rectangle' || tool === 'circle') {
            coordinates.color = color;
            setIsMouseDown(true);
            setStartRX(e.nativeEvent.offsetX);
            setStartRY(e.nativeEvent.offsetY);
            ctx.beginPath();


        }
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };
    const startErasing = () => {
        setErasing(true);
        setIsDrawing(false);
    }
    const stopDrawing = () => {
        if (tool === 'pen' || tool === 'eraser' || tool === 'inkpen') {
            coordinates.px = 0;
            coordinates.py = 0;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            socket.send(JSON.stringify(coordinates));
            setIsDrawing(false);
            canvasRef.current.style.cursor = "default";
        } else if (tool === 'rectangle' || tool === 'circle') {
            setIsMouseDown(false);
            coordinates.radius = 0;
        }
    };
    const Draw = e => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (tool === 'pen' || tool === 'eraser') {
            if (!isDrawing) return;

            const {offsetX, offsetY} = e.nativeEvent;
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgb(218, 218, 218)');
            gradient.addColorStop(1, color);

            ctx.lineWidth = erasing ? 40 : 2;

            ctx.strokeStyle = tool === 'eraser' ? "white" : gradient;
            console.log(tool);
            console.log(ctx.strokeStyle);
            coordinates.color = color;
            ctx.beginPath();

            ctx.moveTo(lastx, lasty);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();

            coordinates.x = offsetX;
            coordinates.y = offsetY;
            coordinates.px = lastx;
            coordinates.py = lasty;
            coordinates.tool = tool;
            coordinates.color = color;

            socket.send(JSON.stringify(coordinates));

            setLastx(offsetX);
            setLasty(offsetY);

        } else if (tool === 'rectangle') {
            if (isMouseDown) {
                setFlag(true);
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const currentX = e.nativeEvent.offsetX;
                const currentY = e.nativeEvent.offsetY;

                ctx.putImageData(snapshot, 0, 0);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;

                ctx.strokeRect(currentX, currentY, startRX - currentX, startRY - currentY);

                setCurrentx(e.nativeEvent.offsetX);
                setCurrenty(e.nativeEvent.offsetY);


            } else {
                if (flag) {

                    coordinates.x = startRX;
                    coordinates.y = startRY;
                    coordinates.h = -(startRY - currenty);
                    coordinates.w = -(startRX - currentx);
                    coordinates.tool = tool;

                    socket.send(JSON.stringify(coordinates));
                    setFlag(false);
                }

            }
        } else if (tool === 'circle') {
            console.log(tool);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const currentX = e.nativeEvent.offsetX;
            const currentY = e.nativeEvent.offsetY;
            if (isMouseDown) {
                setFlag(true);
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.putImageData(snapshot, 0, 0);
                ctx.beginPath();
                setRadius(Math.sqrt(Math.pow((startRX - currentX), 2) + Math.pow((startRY - currentY), 2)));
                ctx.arc(startRX, startRY, radius, 0, 2 * Math.PI);
                console.log("send circle stroked");
                console.log(radius);
                ctx.stroke();

            } else {
                if (flag) {

                    coordinates.x = startRX;
                    coordinates.y = startRY;
                    coordinates.tool = tool;
                    coordinates.radius = radius;
                    socket.send(JSON.stringify(coordinates));
                    setFlag(false);
                }
            }
        } else if (tool === 'inkpen') {
            console.log("inkpen");
            if (!isDrawing) return;

            const {offsetX, offsetY} = e.nativeEvent;


            ctx.lineWidth = 2;

            ctx.strokeStyle = color;

            coordinates.color = color;
            ctx.beginPath();

            ctx.moveTo(lastx, lasty);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();

            coordinates.x = offsetX;
            coordinates.y = offsetY;
            coordinates.px = lastx;
            coordinates.py = lasty;
            coordinates.tool = tool;
            coordinates.color = color;

            socket.send(JSON.stringify(coordinates));

            setLastx(offsetX);
            setLasty(offsetY);
        }

    };
    const handleChangeComplete = (color) => {
        setColor(color.hex);
        showPalette(!palette);
    };
    return (
        <SignedIn>
            <Navbar/>
            <div className="w-screen h-screen bg-[#F2F2F2]">
                <div className=" flex  items-center relative  top-7">

                    <canvas className="canvas border-2  rounded-lg relative left-10 "
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onMouseMove={Draw}
                            // height={(window.screen.height) * 0.65}
                            // width={(window.screen.width) * 0.75}
                            height={468}
                            width={960}
                    />

                    <div  className="boxWrapper h-full absolute left-10 flex flex-col justify-between items-center" >

                            <div>
                                <button onClick={() => {
                                    setErasing(false);

                                    stopDrawing();
                                    setTool('pen');

                                }}>
                                    {/*<PencilIcon className="h-8 w-8 text-black relative "/>*/}
                                    <FontAwesomeIcon className="flex-1 m-2 h-6 w-6" icon={faPencilAlt} />
                                </button>
                                <button onClick={tooglePalette}>
                                    <ChevronRightIcon className="h-8 w-4 -left-3 top-2 relative"/>
                                </button>
                            </div>
                                {tool === 'pen' ?
                                    <div style={{background: color}} className="relative -top-3 h-1 w-10"></div> :
                                    <div className="relative h-1 -top-3 w-10 bg-white"></div>}





                                <button onClick={() => {
                                    setTool('circle');
                                }}>
                                    {/*<img src={circle} className="circle"/>*/}
                                    <FontAwesomeIcon icon={farCircle} className="flex-1 m-2 h-6 w-6" />
                                </button>
                                {tool === 'circle' ?
                                    <div style={{background: color}} className="relative -top-3 h-1 w-10"></div> :
                                    <div className="relative -top-3 h-1 w-10 bg-white"></div>}



                                <button onClick={() => {
                                    setTool('rectangle');
                                }}>
                                    {/*<img src={rectangle} className="rectangle"/>*/}
                                    <FontAwesomeIcon icon={farSquare} className="flex-1 m-2 h-6 w-6"/>
                                </button>
                                {tool === 'rectangle' ?
                                    <div style={{background: color}} className="relative -top-3 h-1 w-10 "></div> :
                                    <div className="relative -top-3 h-1 w-10 bg-white"></div>}



                                <img src={logo} className="logo"/>



                                <button onClick={() => {
                                    setTool('inkpen');
                                }}>
                                    {/*<img src={inkpen} className="h-12 w-12 text-black relative pb-2.5"/>*/}
                                    <FontAwesomeIcon icon={faPenNib} className="flex-1 m-2 h-6 w-6"/>
                                    {tool === 'inkpen' ?
                                        <div style={{background: color}} className="relative -top-1 h-1 w-0.15"></div> :
                                        <div className="relative -top-1 h-1 w-0.15 bg-white"></div>}
                                </button>


                                <button onClick={() => {

                                    startErasing();
                                    setTool('eraser');


                                }}>
                                    <FontAwesomeIcon icon={faEraser} className="flex-1 m-2 h-6 w-6"/>
                                </button>
                                {tool === 'eraser' ?
                                    <div style={{background: color}} className="relative -top-3 h-1 w-10"></div> :
                                    <div className="relative -top-3 h-1 w-10 bg-white"></div>}


                                <button>

                                    {/*<img src={settings} className="settings"/>*/}
                                    <FontAwesomeIcon icon={faBars} className="flex-1 m-2 h-6 w-6" />

                                </button>

                            {/*<li>*/}
                            {/*    <button>*/}
                            {/*    <ShareIcon className="h-8 w-8 text-black relative "/>*/}
                            {/*    </button>*/}
                            {/*</li>*/}


                    </div>
                </div>
                <div className="absolute bg-white  left-28 top-20  ">

                    {palette ? <TwitterPicker
                        colors={['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']}
                        onChangeComplete={handleChangeComplete}/> : null}

                </div>

            </div>
        </SignedIn>
    );
};

export default Drawingpage;
