import { OrbitControls, Text, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import ControlButton from './ControlButton.jsx'
import Cube from './Cube.jsx'




import { useKeyCombinations } from './useKeyCombinations.jsx';




export default function Experience() {

    const cubesRef = useRef()
    const cubeModelRef = useRef()
    const state = useThree()

    const [turnQueue, setTurnQueue] = useState([])
    const [reverseTurnQueue, setReverseTurnQueue] = useState([])
    
    const [callSolve, setCallSolve] = useState()






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

        addToReverseQueue(axis, direction, slice)
        
        
    }

    const getPivotGroup = (axis, slice) => {
   

        const targetArray = []
        
        // create a new fresh pivot for each turn
        const pivotGroup = new THREE.Group();
        state.scene.add(pivotGroup);

        cubeModelRef.current.children.forEach((child, index) => {
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
            cubeModelRef.current.add(cube);
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

        const axes = ['x', 'y', 'z'];
        const directions = [-1, 1];
        const slices = [-1, 0, 1];

        for (let i = 0; i < 40; i++) {
          
            const randomAxis = axes[Math.floor(Math.random() * axes.length)];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            const randomSlice = slices[Math.floor(Math.random() * slices.length)];
          
            // this will add 30 turns to the queue
            controlClick(randomAxis, randomDirection, randomSlice)
            
        }
    }

    const solve = ()=>{
        // the use efect part makes this function call when reverseTurnQueue exists rather than on creation in useKeyCombinations.jsx
        // this funct just does the turns again 3x in order returning cube to original state
        reverseTurnQueue.reverse().forEach((turn,index)=>{
            // tdo the turn 3 time to reverse the turn
            controlClick(turn.axis,turn.direction,turn.slice)
            controlClick(turn.axis,turn.direction,turn.slice)
            controlClick(turn.axis,turn.direction,turn.slice)
        })
        // set revse queue as empty
        setReverseTurnQueue([])
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

    const addToReverseQueue = (axis, direction, slice) => {
        const revTurn = {
            axis: axis,
            direction: direction,
            slice: slice,

        }
        // basically just pushs new turn to end of queue
        setReverseTurnQueue((prevQueue) => { return [...prevQueue, revTurn] })
    }


    useEffect(() => {
        if (callSolve) {
          solve(); // Step 3: Call solve when callSolve is true
          setCallSolve(false); // Reset the state variable
        }
      }, [callSolve]);

      

    useFrame(() => {
        // console.log( cubeModelRef.current)
        
      
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
    useKeyCombinations(controlClick, resetCamera, scramble, solve, () => setCallSolve(true) )


    return <>
        <color args={['#bdedfc']} attach='background' />
        <OrbitControls makeDefault />


        <axesHelper args={[9]} />
        {/* <gridHelper args={[10, 10]} /> */}

        <ambientLight />
        <directionalLight />


        {/* <group ref={cubesRef}>

            {cubesArray.map((value, index) => {
                return <mesh key={index} position={value.position}>
                    <boxGeometry />
                    <meshBasicMaterial attach="material-0" color="#00FF00" toneMapped={false} />
                    <meshBasicMaterial attach="material-1" color="#0000FF" toneMapped={false} />
                    <meshBasicMaterial attach="material-2" color="#FFFF00" toneMapped={false} />
                    <meshBasicMaterial attach="material-3" color="#FFFFFF" toneMapped={false} />
                    <meshBasicMaterial attach="material-4" color="#FF0000" toneMapped={false} />
                    <meshBasicMaterial attach="material-5" color="#FFA500" toneMapped={false} />
                </mesh>
            })}
            
        </group> */}

       

        <Cube ref={cubeModelRef} position={[0,0,0]} />


        <mesh position-y={-2} rotation-x={3*Math.PI/2}>
            <planeGeometry args={[20,20]} />
            <meshStandardMaterial />
        </mesh>

    </>
}

