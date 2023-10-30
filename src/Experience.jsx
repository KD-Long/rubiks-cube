import { OrbitControls, Text, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import ControlButton from './ControlButton'




import { useKeyCombinations } from './useKeyCombinations.jsx';




export default function Experience() {

    const cubesRef = useRef()
    const testCubeRef = useRef()
    const state = useThree()

    const [turnAxis, setTurnAxis] = useState('') // string 'x','y'
    const [turnPos, setTurnPos] = useState(() => { return new THREE.Group() }) // parent of a group
    const [lerpTarget, setLerpTarget] = useState(() => { return new THREE.Quaternion() })
    const [targArray, setTargArray] = useState([]) // string 'x','y'
    const [lerpSpeed, setLerpSpeed] = useState(0.3)


    // const [subscribeKey, getKeys] = useKeyboardControls()


    const cubesArray = []

    // sets positions of array
    for (let z = -1; z < 2; z++) {
        // for each slice font middle back
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                cubesArray.push({ position: [x * 1.02, y * 1.02, z * 1.02] })
            }

        }
    }




    // control btn clicked
    /**
     * 
     * @param {string} axis      - x,y,z 
     * @param {number} direction - 1, -1  (clockwise /anticlockwise)
     * @param {number} slice     - -1,0,1 slice of th axis sections -1 = x1 ,0=x2, 1=x3
     */
    const controlClick = (axis, direction, slice) => {

        /* THERE is still a massive bug with this
        if I hit two combinations at the same time it is freezing out XD
        */



        // check X case
        // add objects to pivot group

        if (turnAxis == '') {

            setLerpSpeed(0.3)
            const targetArr = []

            // create a new fresh pivot for each turn
            const pivotGroup = new THREE.Group();
            state.scene.add(pivotGroup);

            cubesRef.current.children.forEach((child, index) => {

                let cube = child
                // three way if to to set position to corresponding .x .y .z value
                let position = (axis === 'x') ? cube.position.x : ((axis === 'y') ? cube.position.y : cube.position.z)

                if (position < -0.5 && slice < 0) // left slice x1
                    targetArr.push(cube)
                else if (position > 0.5 && slice > 0) // right slice x2
                    targetArr.push(cube)
                else if ((position > -0.5 && position < 0.5) && slice == 0) // midle slice x1 there are sligh
                    targetArr.push(cube)
            })


            //add targets to pivot group
            //Note cant loop on group as it dynamicly chnages during loop -> weird shit
            targetArr.forEach((cube) => {
                pivotGroup.add(cube)
            })


            //select axis to turn on
            let axisAngle = (axis === 'x') ? new THREE.Vector3(1, 0, 0) : ((axis === 'y') ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1))

            //difine and end rotation quarternion positon using axis + direction + rotation amount
            let endRotation = new THREE.Quaternion()
            endRotation.setFromAxisAngle(axisAngle, Math.PI / 2 * -direction);// rotate around Y half turn

            setLerpTarget(endRotation)

            setTargArray(targetArr)
            setTurnPos(pivotGroup)
            //THis is the trigger for use frame to catch
            setTurnAxis(axis)

        }



    }



    const cleanUp = () => {
        // Add back all children of pivot group
        // keeping transformation by applying the pivots transformation to each cube
        turnPos.updateMatrixWorld(true)
        targArray.forEach((cube) => {
            cubesRef.current.add(cube);
            cube.applyMatrix4(turnPos.matrixWorld);
        })

        // reset all the use frame trigger
        // Note all other states are set before this is changed on click func hence we dont need to discard old value
        setLerpSpeed(0.3) // reset lerpspeed as it is not always reset on click 
        setTurnAxis('')

    }



    

    // Use the custom hook to manage key combinations
    useKeyCombinations(controlClick);




    // one time call when component is rendered (no dependencies)
    useEffect(() => {



        // the point of this is to only jump on change of key from:"not pressed" to "pressed"
        // this function also returns a way to unsbuscribe (in the case of a component hot module replacment)
        // useKeyCombinations(combinations);
        // const unsubX1 = subscribeKey(
        //     //selector "i want to listen to"
        //     (state) => {
        //         return (state.x1) && !(state.x1 && state.anti)
        //     },
        //     // whenq the change/event above happens above call this func
        //     (value) => {
        //         if (value)
        //             controlClick('x', -1, -1)
        //     })
        // const unsubX1anti = subscribeKey(
        //     //selector "i want to listen to"
        //     (state) => {
        //         return state.x1 && state.anti
        //     },
        //     // when the change/event above happens above call this func
        //     (value) => {
        //         if (value)
        //             controlClick('x', 1, -1)
        //     })

        // // cleanup when //player gets modified hot module replacment (prevents subscribed key functions being called twice)
        // return () => {
        //     unsubX1()
        //     unsubX1anti()
        // }


    }, [])


    useFrame(() => {

        // console.log('frame: turnAxis= ',getAxis())
        // console.log("turnPos = ", turnPos.children.length);
        if (turnAxis != '') {
            // lerp stuff
            turnPos.quaternion.slerp(lerpTarget, lerpSpeed)
            console.log('animation frame')

            // ramp up let speed towards end (ending was too slow)
            setLerpSpeed(Math.min(1, lerpSpeed * 1.2))

            // checks if it rotation complete
            if (lerpTarget.angleTo(turnPos.quaternion) <= 0) {
                console.log("STOP animation")
                cleanUp()
            }
        }


    })


    return <>
        <color args={['#bdedfc']} attach='background' />
        <OrbitControls makeDefault />
        {/* <axesHelper args={[9]} /> */}
        {/* <gridHelper args={[10, 10]} /> */}


        <group ref={cubesRef}>
            {cubesArray.map((value, index) => {
                return <mesh key={index} position={value.position}>
                    <boxGeometry />
                    <meshBasicMaterial attach="material-0" color="#00FF00" toneMapped={false} />{/* green */}
                    <meshBasicMaterial attach="material-1" color="#0000FF" toneMapped={false} />{/* blue */}
                    <meshBasicMaterial attach="material-2" color="#FFFF00" toneMapped={false} />{/* yellow */}
                    <meshBasicMaterial attach="material-3" color="#FFFFFF" toneMapped={false} />{/* white */}
                    <meshBasicMaterial attach="material-4" color="#FF0000" toneMapped={false} />{/* red */}
                    <meshBasicMaterial attach="material-5" color="#FFA500" toneMapped={false} />{/* orange */}
                </mesh>
            })}
        </group>


        {/* Control Buttons */}
   
        {/* 
        <ControlButton position={[3, 3, 0]} color={'#FF0000'} text={'X1'} onClickLeft={() => { controlClick('x', -1, -1) }} onClickRight={() => { controlClick('x', 1, -1) }} />
        <ControlButton position={[3, 2.5, 0]} color={'#FF0000'} text={'X2'} onClickLeft={() => { controlClick('x', -1, 0) }} onClickRight={() => { controlClick('x', 1, 0) }} />
        <ControlButton position={[3, 2, 0]} color={'#FF0000'} text={'X3'} onClickLeft={() => { controlClick('x', -1, 1) }} onClickRight={() => { controlClick('x', 1, 1) }} />
       
        <ControlButton position={[4.5, 3, 0]} color={'#00FF00'} text={'Y1'} onClickLeft={() => { controlClick('y', -1, 1) }} onClickRight={() => { controlClick('y', 1, 1) }} />
        <ControlButton position={[4.5, 2.5, 0]} color={'#00FF00'} text={'Y2'} onClickLeft={() => { controlClick('y', -1, 0) }} onClickRight={() => { controlClick('y', 1, 0) }} />
        <ControlButton position={[4.5, 2, 0]} color={'#00FF00'} text={'Y3'} onClickLeft={() => { controlClick('y', -1, -1) }} onClickRight={() => { controlClick('y', 1, -1) }} />
       
        <ControlButton position={[6, 3, 0]} color={'#0000FF'} text={'Z1'} onClickLeft={() => { controlClick('z', -1, 1) }} onClickRight={() => { controlClick('z', 1, 1) }} />
        <ControlButton position={[6, 2.5, 0]} color={'#0000FF'} text={'Z2'} onClickLeft={() => { controlClick('z', -1, 0) }} onClickRight={() => { controlClick('z', 1, 0) }} />
        <ControlButton position={[6, 2, 0]} color={'#0000FF'} text={'Z3'} onClickLeft={() => { controlClick('z', -1, -1) }} onClickRight={() => { controlClick('z', 1, -1) }} />
        */}

    </>
}

