import * as THREE from 'three'
import { Text } from '@react-three/drei'


export default function ControlButton({position, onClickLeft, onClickRight, text, color}) {


    return <>
        <group position={position}>
            <mesh rotation={[0, 0, Math.PI / 2]} onClick={onClickLeft}>
                <coneGeometry args={[0.2, 0.5, 32]} />
                <meshBasicMaterial color={color} />
            </mesh>

            <Text
                font='/bebas-neue-v9-latin-regular.woff'
                scale={0.5}
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign='right'
                position-x={0.5}
                rotation-y={-0.25}
            >
                {text}
                <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
            </Text>
            <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} onClick={onClickRight}>
                <coneGeometry args={[0.2, 0.5, 32]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </group>

    </>
}
