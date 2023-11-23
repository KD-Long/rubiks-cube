
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Loader } from '@react-three/drei'
import { Suspense } from 'react'

import './style.css'
import Experience from './Experience.jsx'
import Interface from './Interface.jsx'
import Placeholder from './LoadingScreen.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import { useState } from 'react'



export default function App() {

    const [start, setStart] = useState()

    return <>
        <KeyboardControls
            map={[
                { name: 'x1', keys: ['KeyQ', 'Numpad7'] },
                { name: 'x2', keys: ['KeyW', 'Numpad8'] },
                { name: 'x3', keys: ['KeyE', 'Numpad9'] },

                { name: 'y1', keys: ['KeyA', 'Numpad4'] },
                { name: 'y2', keys: ['KeyS', 'Numpad5'] },
                { name: 'y3', keys: ['KeyD', 'Numpad6'] },

                { name: 'z1', keys: ['KeyZ', 'Numpad1'] },
                { name: 'z2', keys: ['KeyX', 'Numpad2'] },
                { name: 'z3', keys: ['KeyC', 'Numpad3'] },

                { name: 'anti', keys: ['Space', 'ControlLeft', 'MetaLeft'] },
                { name: 'resetCam', keys: ['F1'] },
                { name: 'scramble', keys: ['F2'] },
                { name: 'solve', keys: ['F3'] },
            ]}
        >

            <Canvas
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [4, 8, 16]
                }}
            >
                {/* suspense waits for experience and start before rendering (should show loading screen) */}
                <Suspense fallback={null} >
                    {start && <Experience started = {start}/>}
                </Suspense>

              

            </Canvas>
            
            <LoadingScreen started = {start} onStarted={() => setStart(true)} />

           
            <Interface />

        </KeyboardControls>
    </>
}


