
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'

import './style.css'
import Experience from './Experience.jsx'
import Interface from './interface.jsx'


const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(<>

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

            { name: 'anti', keys: ['Space', 'ControlLeft','MetaLeft'] },
        ]}
    >
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [4, 8, 12]
            }}
        >
            <Experience />
        </Canvas>
        <Interface />
    </KeyboardControls>
</>

)