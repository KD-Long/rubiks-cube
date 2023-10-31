import { OrbitControls, Text, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import ControlButton from './ControlButton'




import { useKeyCombinations } from './useKeyCombinations.jsx';




export default function Experience() {

    const cubesRef = useRef()
    const state = useThree()

    const [turnQueue, setTurnQueue] = useState([])


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

        //select axis to turn on
        let axisAngle = (axis === 'x') ? new THREE.Vector3(1, 0, 0) : ((axis === 'y') ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1))

        //difine and end rotation quarternion positon using axis + direction + rotation amount
        let endRotation = new THREE.Quaternion()
        endRotation.setFromAxisAngle(axisAngle, Math.PI / 2 * -direction);// rotate around Y half turn


        // moved turn cube selector to diff function to be used to updatre on turn queue pop
        

        
        // if queue has turns in it aready give  it dummy valuse to update later
    
        addToQueue(axis, null, [], endRotation, 0.3, slice)
            
    




        
    }

    const getPivotGroup = (axis, slice) => {
   

        const targetArray = []
        
        // create a new fresh pivot for each turn
        const pivotGroup = new THREE.Group();
        state.scene.add(pivotGroup);

        cubesRef.current.children.forEach((child, index) => {
            let cube = child
            // three way if to to set position to corresponding .x .y .z value
            let position = (axis === 'x') ? cube.position.x : ((axis === 'y') ? cube.position.y : cube.position.z)
            if (position < -0.5 && slice < 0) // left slice x1
                targetArray.push(cube)
            else if (position > 0.5 && slice > 0) // right slice x2
                targetArray.push(cube)
            else if ((position > -0.5 && position < 0.5) && slice == 0) // midle slice x1 there are sligh
                targetArray.push(cube)
        })
     



        //add targets to pivot group
        //Note cant loop on group as it dynamicly chnages during loop -> weird shit
        targetArray.forEach((cube) => {
            pivotGroup.add(cube)
        })


        return { pivotGroup, targetArray }
    }



    const cleanUp = (turn) => {
        // Add back all children of pivot group
        // keeping transformation by applying the pivots transformation to each cube
        turn.turnGroup.updateMatrixWorld(true)
        turn.targetArray.forEach((cube) => {
            cubesRef.current.add(cube);
            cube.applyMatrix4(turn.turnGroup.matrixWorld);
        })


        // remove front item from turn queue
        removeFromQueue()
     


    }

    const resetCamera = () => {
        state.camera.position.copy(new THREE.Vector3(4, 8, 12))
        state.camera.lookAt(new THREE.Vector3(0, 0, 0))
        console.log("camera reset")
    }

    const scramble = () => {
        console.log("scramble function")

        //controlClick('x', 1, -1) 
        for (let i = 0; i < 2; i++) {
            // pick and axis
            const a = 'x'
            // pick a direction
            const d = 1
            // pick a slice
            const s = -1
            controlClick(a, d, s)

        }


    }



    const addToQueue = (tAxis, tPos, targetArray, lerptarget, lerpspeed, slice, firstTime= true) => {

        const newTurn = {
            turnAxis: tAxis,
            turnGroup: tPos,
            targetArray: targetArray,
            lerpTarget: lerptarget,
            lerpSpeed: lerpspeed,
            slice: slice,
            firstTime:firstTime
        }

        // basically just pushs new turn to end of queue
        setTurnQueue((prevQueue) => { return [...prevQueue, newTurn] })
    }
    const removeFromQueue = () => {
        // Remove the item at the front of the queue (FIFO)
        if (turnQueue.length > 0) {
            const [removedItem, ...remainingItems] = turnQueue;
            setTurnQueue(remainingItems);
            // You can now use 'removedItem' if needed
        }
    };


    useFrame(() => {
        // if its the first time this item turnQueue[0] has been called we want to calculate its pivot
        if(turnQueue.length != 0 && turnQueue[0].firstTime){
            //update the flag to flase
            const thisTurn = turnQueue[0]
            thisTurn.firstTime = false

            // update pivotgroup and targetarr
            const { pivotGroup, targetArray } = getPivotGroup(thisTurn.turnAxis, thisTurn.slice)
            thisTurn.turnGroup = pivotGroup
            thisTurn.targetArray = targetArray
        }

        // check queue is not empty
        if (turnQueue.length != 0) {

            // operate on the first item of queue
            const turn = turnQueue[0]
            // lerp stuff
            turn.turnGroup.quaternion.slerp(turn.lerpTarget, turn.lerpSpeed)
            console.log('animation frame')

            // ramp up let speed towards end (ending was too slow)
            turn.lerpSpeed = Math.min(1, turn.lerpSpeed * 1.2)

            // setLerpSpeed(Math.min(1, lerpSpeed * 1.2))

            // checks if it rotation complete
            if (turn.lerpTarget.angleTo(turn.turnGroup.quaternion) <= 0) {
                console.log("STOP animation")
                cleanUp(turn)
                // dont forget to pop from queue $$$$
            }
        }







    })

    // Use the custom hook to manage key combinations
    useKeyCombinations(controlClick, resetCamera, scramble)


    return <>
        <color args={['#bdedfc']} attach='background' />
        <OrbitControls makeDefault />


        <axesHelper args={[9]} />
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

