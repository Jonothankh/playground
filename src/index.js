import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.js'
import { NoToneMapping } from 'three'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas
        linear
        gl={{ antialias: true, toneMapping: NoToneMapping }}
        camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [- 4, 3, 6]
        }}
    >
        <color attach="background" color={"#f0f0f0"} />
        <Experience />
    </Canvas>
)