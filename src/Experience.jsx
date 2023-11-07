import { OrbitControls, Text, useKeyboardControls, useHelper } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { DirectionalLightHelper } from "three";
import { InstancedRigidBodies, Physics, RigidBody, CuboidCollider,  CylinderCollider, MeshCollider } from '@react-three/rapier'




import ControlButton from './ControlButton.jsx'
import Cube from './Cube.jsx'




import { useKeyCombinations } from './useKeyCombinations.jsx';




export default function Experience() {

    const [cubeStartPos, setCubeStartPos] = useState([1, 1, 1])

    const cubesRef = useRef()
    const cubeModelRef = useRef()
    const state = useThree()

    const [turnQueue, setTurnQueue] = useState([])
    const [reverseTurnQueue, setReverseTurnQueue] = useState([])

    const [callSolve, setCallSolve] = useState()

    const [readyToPlay, setReadyToPlay] = useState(false)



    const dlightRef = useRef()

    // useHelper(dlightRef, DirectionalLightHelper, 'cyan')

    // this state will hold the parameters  Iwnat to call controlClick with
    const [callControlClick, setCallControlClick] = useState([])


    // redundant for new model
    // const cubesArray = []

    // // sets positions of array
    // for (let z = -1; z < 2; z++) {
    //     // for each slice font middle back
    //     for (let x = -1; x < 2; x++) {
    //         for (let y = -1; y < 2; y++) {
    //             cubesArray.push({ position: [x * 1.02, y * 1.02, z * 1.02] })
    //         }

    //     }
    // }



    // control btn clicked
    /**
     * 
     * @param {string} axis      - x,y,z 
     * @param {number} direction - 1, -1  (clockwise /anticlockwise)
     * @param {number} slice     - -1,0,1 slice of th axis sections -1 = x1 ,0=x2, 1=x3
     */
    const controlClick = (axis, direction, slice) => {
        // set by model when animation complete -> prevents premature movements
        if (readyToPlay) {
            //select axis to turn on
            let axisAngle = (axis === 'x') ? new THREE.Vector3(1, 0, 0) : ((axis === 'y') ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1))

            //difine and end rotation quarternion positon using axis + direction + rotation amount
            let endRotation = new THREE.Quaternion()
            endRotation.setFromAxisAngle(axisAngle, Math.PI / 2 * -direction);// rotate around Y half turn


            // moved turn cube selector to diff function to be used to updatre on turn queue pop



            // if queue has turns in it aready give  it dummy valuse to update later

            //        (tAxis, tPos, targetArray, lerptarget, lerpspeed, slice, firstTime = true) => {
            addToQueue(axis, null, [], endRotation, 0.3, slice)
            addToReverseQueue(axis, direction, slice)
        }



    }

    const getPivotGroup = (axis, slice) => {


        const targetArray = []

        // create a new fresh pivot for each turn
        const pivotGroup = new THREE.Group();

        // this sets pivot group position to same as the whole cube
        pivotGroup.position.set(cubeModelRef.current.position.x, cubeModelRef.current.position.y, cubeModelRef.current.position.z);


        state.scene.add(pivotGroup);

        // the [0] selects the cube we want. (when we added rigid body it replaced our groupw withg [group,3d,3d,3d])


        cubeModelRef.current.children.forEach((child, index) => {
            // the .children[0] selects the cube we want. (when we added rigid body it replaced our groupw withg [group,3d,3d,3d])
            // let cube = child
            // console.log('child: ',child)
            let cube = child //.children[0]
            // console.log('child.children[0]: ',child.children[0])
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
        // console.log(pivotGroup)


        return { pivotGroup, targetArray }
    }



    const cleanUp = (turn) => {
        // this a cheap and dirty way to counteract the setting pivot group to cubesRefs position
        // we need to subtract pivotgroups POS before applying the matrix˝
        turn.turnGroup.position.set(
            turn.turnGroup.position.x - cubeModelRef.current.position.x,
            turn.turnGroup.position.y - cubeModelRef.current.position.y,
            turn.turnGroup.position.z - cubeModelRef.current.position.z
        )
        // makes sure children are upt date from above update uptodate
        turn.turnGroup.updateMatrixWorld(true)

        // Add back all children of pivot group
        // keeping transformation by applying the pivots transformation to each cube
        turn.targetArray.forEach((cube) => {
            cube.applyMatrix4(turn.turnGroup.matrixWorld);
            cubeModelRef.current.add(cube);
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

    const solve = () => {
        // the use efect part makes this function call when reverseTurnQueue exists rather than on creation in useKeyCombinations.jsx
        // this funct just does the turns again 3x in order returning cube to original state
        reverseTurnQueue.reverse().forEach((turn, index) => {
            // tdo the turn 3 time to reverse the turn
            controlClick(turn.axis, turn.direction, turn.slice)
            controlClick(turn.axis, turn.direction, turn.slice)
            controlClick(turn.axis, turn.direction, turn.slice)
        })
        // set revse queue as empty
        setReverseTurnQueue([])
    }




    const addToQueue = (tAxis, tPos, targetArray, lerptarget, lerpspeed, slice, firstTime = true) => {

        const newTurn = {
            turnAxis: tAxis,
            turnGroup: tPos,
            targetArray: targetArray,
            lerpTarget: lerptarget,
            lerpSpeed: lerpspeed,
            slice: slice,
            firstTime: firstTime
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
    const togglePlayState = (boolean) => {
        // console.log('setting the play state to: ', boolean)
        setReadyToPlay(() => { return boolean })
    }


    useEffect(() => {
        if (callSolve) {
            solve(); //  solve when callSolve is true
            setCallSolve(false); // Reset the state variable
        }
    }, [callSolve]);

    useEffect(() => {
        // if greater than 0 callControlClick is true
        if (callControlClick.length > 0) {
            controlClick(...callControlClick); // call click with the contents of the caller (spread arr to params)      
            setCallControlClick([]); // Reset the state variable back to empty
        }

    }, [callControlClick]);


    //use keyboardHooks -> need to put them after definitions
    // Use the custom hook to manage key combinations
    useKeyCombinations(
        controlClick,
        resetCamera,
        scramble, () => setCallSolve(true),
        (params) => setCallControlClick(params) // params are the controlClick parms we want to use in the updated use effect
    )




    useFrame(() => {
        // console.log( cubeModelRef.current.position)


        // if its the first time this item turnQueue[0] has been called we want to calculate its pivot
        if (turnQueue.length != 0 && turnQueue[0].firstTime) {
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


    return <>
        <color args={['#bdedfc']} attach='background' />
        <OrbitControls makeDefault />


        {/* <axesHelper args={[9]} /> */}
        {/* <gridHelper args={[10, 10]} /> */}

        <ambientLight />
        <directionalLight ref={dlightRef} position={[15, 15, 15]} castShadow />

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

        <Physics
            // debug
            gravity={[0, -19.08, 0]}
        >


            <Cube ref={cubeModelRef} castShadow position={[0, 10, 0]} finalPos={new THREE.Vector3(0, 1, 0)} togglePlayState={togglePlayState} />


            {/* Shpere */}
            {/* <RigidBody
                colliders='ball'
            >
                <mesh castShadow position={[0, 0, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody> */}

            {/* Floor */}
            <RigidBody
                type='fixed'
                restitution={1}
                friction={0.7}

            >
                <mesh receiveShadow position-y={-2} rotation-x={3 * Math.PI / 2}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial />
                </mesh>
            </RigidBody>

            {/* Invis Walls */}
            {/* Walls */}
            <RigidBody
                type='fixed'
            >
                <CuboidCollider args={[10, 4, 0.5]} position={[0, -2, 10.25]} />
                <CuboidCollider args={[10, 4, 0.5]} position={[0, -2, -10.25]} />

                <CuboidCollider args={[.5, 4, 10]} position={[10.25, -2, 0]} />
                <CuboidCollider args={[.5, 4, 10]} position={[-10.25, -2, 0]} />

            </RigidBody>
            {/* invisible Sphere to bounce on impact */}
            <RigidBody
                type='fixed'
                colliders='ball'
            >
                <mesh >
                    <sphereGeometry args={[0.7,2,2]}/>
                    <meshNormalMaterial visible={false} />
                </mesh>
            </RigidBody>


        </Physics>
    </>
}

