import * as THREE from 'three'
import
{
    MeshReflectorMaterial,
    MeshRefractionMaterial,
    Float,
    Text,
    Html,
    OrbitControls,
    TransformControls,
    PivotControls,
    Instance,
    Instances,
    MarchingCubes, MarchingCube, MarchingPlane,
    useGLTF,
    MeshTransmissionMaterial
} from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

export default function Experience()
{
    const sphere = useRef(null)
    const cube = useRef(null)

    const { introVisible } = useControls('Introduction', { introVisible: true })
    const { attach } = useControls('Controls', { attach: false })
    const { perfVisible } = useControls('Perf', { perfVisible: false })

    const controlsConfig = {
        depthTest: false,
        lineWidth: 2,
        // axisColors: ['#000000', '#000000', '#000000'],
        fixed: false,
        scale: 0.5,
        autoTransform: true
    }

    return <>
        {perfVisible && <Perf colorBlind={true} position={"top-left"} />}


        <OrbitControls makeDefault />

        <color color={"#f0f0f0"} attach={"background"} />

        <fog attach="fog" color={"white"} near={4} far={60} />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <Grid />

        {introVisible &&
            <Html wrapperClass="intro" distanceFactor={10} position={[-1, 2, -4]}>
                <h1>Hey, this is my playground</h1>
                <p>This is where I do webGL experiments.</p>
                <p>The playground is built using <a href='https://threejs.org/'>Three.js</a> via <a href='https://github.com/pmndrs/react-three-fiber'>R3F</a>.</p>
            </Html>
        }

        <PivotControls visible={attach} anchor={[0, -1, 0]}  {...controlsConfig}>
            <LavaLamp position={[0, -1, 0]} />
        </PivotControls>

        <PivotControls visible={attach} anchor={[0, 0, 0]} {...controlsConfig}>
            <mesh position={[0, -.75, 0]} scale={[.3, .3, .3]} ref={sphere} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="green" />
                <Html
                    position={[0, 2, 0]}
                    wrapperClass="label"
                    center
                    distanceFactor={6}
                // occlude={[sphere]}
                >
                    Ooh so very fancy!
                </Html>
            </mesh>
        </PivotControls>

    </>
}

const Grid = ({ number = 23, lineWidth = 0.04, height = 0.5 }) => (
    // Renders a grid and crosses as instances
    <Instances position={[0, -1.02, 0]}>
        <planeGeometry args={[lineWidth, height]} />
        <meshBasicMaterial color="#e4e4e4" />
        {Array.from({ length: number }, (_, y) =>
            Array.from({ length: number }, (_, x) => (
                <group key={x + ':' + y} position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}>
                    <Instance rotation={[-Math.PI / 2, 0, -Math.PI / 4]} />
                    <Instance rotation={[-Math.PI / 2, 0, Math.PI / 4]} />
                </group>
            ))
        )}
        <gridHelper args={[100, 150, '#e4e4e4', '#e4e4e4']} position={[0, -0.01, 0]} />
    </Instances>
)

const MetaBalls = (props) =>
{
    const marching1 = useRef(null)
    const marching2 = useRef(null)
    const marching3 = useRef(null)

    useFrame(({ clock }) =>
    {

        marching1.current.position.y = Math.sin(clock.getElapsedTime()) / 2 - .1
        marching1.current.position.x = (1 - Math.sin(clock.getElapsedTime())) / 30
        marching1.current.position.z = (1 - Math.sin(clock.getElapsedTime())) / 30

        marching2.current.position.y = Math.sin(clock.getElapsedTime() / 2) / 2 - .1
        marching2.current.position.x = -(1 - Math.sin(clock.getElapsedTime() / 2)) / 30
        marching2.current.position.z = -(1 - Math.sin(clock.getElapsedTime() / 2)) / 30

        marching3.current.position.y = Math.sin(clock.getElapsedTime() / 1.6) / 2 - .1
        marching3.current.position.x = -(1 - Math.sin(clock.getElapsedTime() / 1.6)) / 30
        marching3.current.position.z = (1 - Math.sin(clock.getElapsedTime() / 1.6)) / 30


    })

    return (
        <group {...props}>
            <MarchingCubes resolution={80} maxPolyCount={6000} enableUvs={false} enableColors>
                <meshPhysicalMaterial color="orange" roughness={.4} transmission={.6} thickness={1} reflectivity={.1} />
                <MarchingCube ref={marching1} strength={.3} subtract={12} color={"#000000"} />
                <MarchingCube ref={marching2} strength={.3} subtract={12} color={"#000000"} />
                <MarchingCube ref={marching3} strength={.3} subtract={12} color={"#000000"} />
            </MarchingCubes>
        </group>
    )

}

export function LavaLamp(props)
{
    const config = useControls('Lava lamp', {
        meshPhysicalMaterial: true,
        transmissionSampler: false,
        backside: false,
        samples: { value: 1, min: 1, max: 32, step: 1 },
        resolution: { value: 2048, min: 256, max: 2048, step: 256 },
        transmission: { value: 1, min: 0, max: 1 },
        roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
        thickness: { value: -0.05, min: -10, max: 10, step: 0.01 },
        ior: { value: 1.02, min: 1, max: 5, step: 0.01 },
        chromaticAberration: { value: 0.01, min: 0, max: 1 },
        // anisotropy: { value: 0, min: 0, max: 1, step: 0.01 },
        // distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
        // distortionScale: { value: 0, min: 0.01, max: 1, step: 0.01 },
        // temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
        // clearcoat: { value: 0, min: 0, max: 1 },
        attenuationDistance: { value: 0.1, min: 0, max: 10, step: 0.01 },
        attenuationColor: '#ffffff',
        color: '#e4feff',
        bg: '#ffffff'
    })

    const { nodes, materials } = useGLTF(require("./models/lavaLamp.glb"));

    const metal = new THREE.MeshPhysicalMaterial({
        color: "purple",
        metalness: 0.3,
        roughness: 0,
        transmission: 0,
        thickness: 0,
        reflectivity: 1
    })

    return (
        <group {...props} dispose={null}>
            <group scale={[8, 8, 8]}>
                <mesh
                    geometry={nodes.Cylinder.geometry}
                    material={metal}
                />
                <mesh
                    geometry={nodes.Cylinder001.geometry}
                >
                    {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} backside={true} side={THREE.BackSide} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
                    {/* <meshStandardMaterial transparent={true} opacity={0.3} /> */}
                </mesh>
                <mesh
                    geometry={nodes.Cylinder002.geometry}

                    material={metal}
                />
            </group>
            <MetaBalls position={[0, 1, 0]} />
        </group>
    );
}

useGLTF.preload(require("./models/lavaLamp.glb"));