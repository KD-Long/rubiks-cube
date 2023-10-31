
import { useKeyboardControls } from '@react-three/drei'
import { addEffect } from '@react-three/fiber'
import useGame from './stores/useGame.jsx'
import { useRef, useEffect } from 'react'
// import { combinations } from './combinations.js'; // Import combinations

import { useKeyCombinations } from './useKeyCombinations.jsx';
import { useState } from 'react';

// I think I need to use some global state
// or rework the errect on key press to not use click /get keys





export default function Interface() {

    // this func is a 'selector' we are telling it what we want back. in this case everything
    // I think the reson we are doing this is we dont have useFrame so we can call a get on each frame to check
    // so instead we get each parameter as a var and then when  the values change  to component needs to be rerendered
    // hence it updates

    const x1 = useKeyboardControls((state) => { return state.x1 })
    const x2 = useKeyboardControls((state) => { return state.x2 })
    const x3 = useKeyboardControls((state) => { return state.x3 })

    const y1 = useKeyboardControls((state) => { return state.y1 })
    const y2 = useKeyboardControls((state) => { return state.y2 })
    const y3 = useKeyboardControls((state) => { return state.y3 })

    const z1 = useKeyboardControls((state) => { return state.z1 })
    const z2 = useKeyboardControls((state) => { return state.z2 })
    const z3 = useKeyboardControls((state) => { return state.z3 })

    const anti = useKeyboardControls((state) => { return state.anti })

    const resetCam = useKeyboardControls((state) => { return state.resetCam })

    // Use the custom hook to manage key combinations
    // useKeyCombinations(controlClick);

    // const restart = useGame((state) => { return state.restart })
    // const phase = useGame((state) => { return state.phase })

    // const startTime = useGame((state) => { return state.startTime })

    const timeRef = useRef()
    const [anticlockwise, setAnticlockwise] = useState(false)


    // const restartClick = () => {
    //     restart()
    // }

    // // called once after first render
    // useEffect(() => {

    //     // from r3f kinda like useFrame (outside canvas)
    //     // note we are subscribing at render time meaning we canot reactivly access:
    //     //       const phase = useGame((state) => { return state.phase }) 
    //     // from above we need to get value on each frame

    //     const unSubEffect = addEffect(() => {
    //         const state = useGame.getState()
    //         let elapsedTime = 0

    //         if(state.phase === 'playing')
    //             elapsedTime = Date.now() - state.startTime
    //         else if(state.phase === 'ended')
    //             elapsedTime = state.endTime - state.startTime

    //         elapsedTime = elapsedTime/1000 
    //         elapsedTime = elapsedTime.toFixed(2)

    //         // upate the html text content here (check exists first)
    //         if(timeRef.current)
    //             timeRef.current.textContent = elapsedTime

    //     })

    //     //dispose this func when comopnent is reloaded other wise multiple funcs will run
    //     return () => {
    //         unSubEffect()
    //     }

    // }, [])


    // Simulate a key press event (e.g., 'x1' keypress)
    const simulateKeyPress = (key) => {
        // console.log('simulate Key: ', key)
        //key down event  
        const keyDownEvent = new KeyboardEvent('keydown', { key });
        window.dispatchEvent(keyDownEvent);


        //key up event straight after
        const keyUpEvent = new KeyboardEvent('keyup', { key });
        window.dispatchEvent(keyUpEvent);



    };
    // anti clockwise version
    const simulateAnti = () => {
        //if not on press
        if (!anticlockwise) {
            const keyDownEventAnti = new KeyboardEvent('keydown', { key: 'Space' })
            window.dispatchEvent(keyDownEventAnti)


        } else {
            // otherwise turn off
            const keyUpEventAnti = new KeyboardEvent('keyup', { key: 'Space' })
            window.dispatchEvent(keyUpEventAnti);

        }
        setAnticlockwise(!anticlockwise)

    }





    return <>
        <div className='interface'>
            {/* time */}
            <div ref={timeRef} className="time">0.00</div>
            {/* Restart */}
            {/* Conditionally display button when condition is met */}

            {/* {phase === 'ended' ? <div className="restart" onClick={restartClick}>Restart</div> : null} */}

            {/* Other Controls */}
            <div className="otherControls">
                <div className="raw"  >
                    <div
                        className='key'
                        onClick={() => { simulateKeyPress('F1') }}
                    >
                        <div className={`text ${resetCam ? 'active' : ''}`}>
                            Reset Cam
                        </div>
                    </div>
                </div>
                <div className="raw"  >
                    <div
                        className={`key`}
                        onClick={() => { simulateKeyPress('F2') }}
                    >
                        <div className='text'>
                            Scramble
                        </div>
                    </div>
                </div>
               

            </div>



            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${x1 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyQ') }}></div>
                    <div className={`key ${x2 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyW') }}></div>
                    <div className={`key ${x3 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyE') }}></div>
                </div>
                <div className="raw">
                    <div className={`key ${y1 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyA') }}></div>
                    <div className={`key ${y2 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyS') }}></div>
                    <div className={`key ${y3 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyD') }}></div>
                </div>
                <div className="raw">
                    <div className={`key ${z1 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyZ') }}></div>
                    <div className={`key ${z2 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyX') }}></div>
                    <div className={`key ${z3 ? 'active' : ''}`} onClick={() => { simulateKeyPress('KeyC') }}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${anti ? 'active' : ''}`} onClick={() => { simulateAnti() }}></div>
                </div>
            </div>



        </div>

    </>

}