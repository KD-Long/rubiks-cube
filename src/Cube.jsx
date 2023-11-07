/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.14 ./public/cube.glb 
*/

import React, { useRef, forwardRef, useEffect,useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { InstancedRigidBodies, Physics, RigidBody, CuboidCollider, CylinderCollider, MeshCollider, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default forwardRef(function Cube(props, cubeModelRef) {
  // const group = useRef()
  const gltf = useGLTF('/cube.glb')
  const { nodes, materials } = gltf
  

  // is 27 if all if all bodies are sleeping
  const [allSleeping, setAllSleeping] = useState(0)
  const [readyToPlay, setReadyToPlay] = useState(false) // flag for first state change of cleanup post restore


  const dstGroup = useRef()

  const rigid = useRef()
  const rapier = useRapier()


  // not 'ref' is the reffere3nce passed from the parent
  const [isVisible, setIsVisible] = useState(true);

  const togglePhysics = ()=>{
      setIsVisible(!isVisible)
  }


  useEffect(() => {
    const groupWorldPosition = new THREE.Vector3();
    cubeModelRef.current.getWorldPosition(groupWorldPosition);

    cubeModelRef.current.children.forEach((cube) => {

      // set the position we want to end add
      // cube.originalPosition = cube.position.clone()
      cube.originalPosition = cube.position.clone() //.add(props.finalPos) 
      // cube.lerpTarget = props.finalPos.sub(cubeModelRef.current.position)
      // console.log(cube.lerpTarget)
      
      
      // const meshWorldPosition = new THREE.Vector3();
      // cube.getWorldPosition(meshWorldPosition);


      // cube.targetPosition = cube.originalPosition
      //   .clone()
      //   .add(cube.directionVector.clone().multiplyScalar(distance));


      // cube.directionVector = meshWorldPosition
      //   .clone()
      //   .sub(groupWorldPosition)
      //   .normalize();

      // cube.originalRotation = cube.rotation.clone();
      cube.originalRotation = cube.quaternion.clone();


      // cube.targetRotation = new THREE.Euler(
      //   Math.random() * Math.PI,
      //   Math.random() * Math.PI,
      //   Math.random() * Math.PI
      // );
    })

  }, []);

  useFrame((state) => {
  
    const elapsedTime = state.clock.elapsedTime.toFixed(0) // note this rounds 1.5 ->2 but thats fine

    // logic
    // if all cubes sleeping OR time 7s start lerping ->
    // when 10 sec stop lerping and cleanup

    // start lerping
    if( ((allSleeping == 27 || elapsedTime > 7) && elapsedTime < 10)){
      reasembleCube()
    }
    
    // cleanup
    if(elapsedTime == 10 && !readyToPlay){
      dofinal()
      setReadyToPlay(true)
      props.togglePlayState(true) // function passed down from experience to allow clicks after thsi point 'play'
    }
  })

  // useFrame helper functions

  //Do restor to postion
  const reasembleCube = ()=>{

    if(cubeModelRef.current){
      // lerp the group to the final location

      cubeModelRef.current.children.forEach((mesh) => {
        
        mesh.position.lerp(
          new THREE.Vector3(
            props.finalPos.x - cubeModelRef.current.position.x,
            props.finalPos.y - cubeModelRef.current.position.y,
            props.finalPos.z - cubeModelRef.current.position.z
            ),
          0.03
        );
        mesh.quaternion.slerp(
          mesh.originalRotation,
          0.03
        ) 
      })
    }
  }

  const dofinal= ()=>{
    const tempChildren = new THREE.Group()
      
    // add all cube mesh groups we want leave 3d  bodies
    cubeModelRef.current.children.forEach((child)=>{
      tempChildren.add(child.children[0])
    
    })
    // clear all physics bodies
    cubeModelRef.current.clear()
    
    //set group to finalPos we want (where the cubes are lerping to)
    cubeModelRef.current.position.set(props.finalPos.x,props.finalPos.y,props.finalPos.z)
    
    //add all temp back to OG group
    cubeModelRef.current.add(...tempChildren.children)
  }
  

  return (<>
  { isVisible && ( <>

    {/* Destination group TODO */}
    <group ref= {dstGroup} position={props.finalPos}>

    </group>


    <group ref={cubeModelRef} {...props} dispose={null}  >
      <RigidBody
        ref={rigid}
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      colliders='cuboid'
        type='dynamic'

      >
        <group name="cube_1" position={[-1.01, -1.01, -1.01]} rotation={[Math.PI, 1.571, 0]}>
          <mesh castShadow name="Cube070" geometry={nodes.Cube070.geometry} material={materials['white.015']} />
          <mesh castShadow name="Cube070_1" geometry={nodes.Cube070_1.geometry} material={materials['blue.010']} />
          <mesh castShadow name="Cube070_2" geometry={nodes.Cube070_2.geometry} material={materials['orange.010']} />
        </group>
      </RigidBody>
     

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
                setAllSleeping((previous)=>{return previous+1})
           
        }}
        type='dynamic'
      >
        <group name="cube_2" position={[0, -1.01, -1.01]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow name="Cube069" geometry={nodes.Cube069.geometry} material={materials['white.014']} />
          <mesh castShadow name="Cube069_1" geometry={nodes.Cube069_1.geometry} material={materials['orange.009']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
        onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_3" position={[1.01, -1.01, -1.01]} rotation={[0, 0, Math.PI]}>
          <mesh castShadow name="Cube071" geometry={nodes.Cube071.geometry} material={materials['white.016']} />
          <mesh castShadow name="Cube071_1" geometry={nodes.Cube071_1.geometry} material={materials['orange.011']} />
          <mesh castShadow name="Cube071_2" geometry={nodes.Cube071_2.geometry} material={materials['green.008']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_4" position={[-1.01, -1.01, 0]} rotation={[Math.PI, Math.PI / 2, 0]}>
          <mesh castShadow name="Cube066" geometry={nodes.Cube066.geometry} material={materials['white.011']} />
          <mesh castShadow name="Cube066_1" geometry={nodes.Cube066_1.geometry} material={materials['blue.009']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_5" geometry={nodes.cube_5.geometry} material={materials['white.010']} position={[0, -1.01, 0]} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_6" position={[1.01, -1.01, 0]} rotation={[-Math.PI, -Math.PI / 2, 0]}>
          <mesh castShadow name="Cube068" geometry={nodes.Cube068.geometry} material={materials['white.013']} />
          <mesh castShadow name="Cube068_1" geometry={nodes.Cube068_1.geometry} material={materials['green.007']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_7" position={[-1.01, -1.01, 1.01]} rotation={[-Math.PI, 0, 0]}>
          <mesh castShadow name="Cube073" geometry={nodes.Cube073.geometry} material={materials['white.018']} />
          <mesh castShadow name="Cube073_1" geometry={nodes.Cube073_1.geometry} material={materials['red.009']} />
          <mesh castShadow name="Cube073_2" geometry={nodes.Cube073_2.geometry} material={materials['blue.011']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_8" position={[0, -1.01, 1.01]} rotation={[Math.PI, 0, 0]}>
          <mesh castShadow name="Cube067" geometry={nodes.Cube067.geometry} material={materials['white.012']} />
          <mesh castShadow name="Cube067_1" geometry={nodes.Cube067_1.geometry} material={materials['red.008']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_9" position={[1.01, -1.01, 1.01]} rotation={[-Math.PI, -Math.PI / 2, 0]}>
          <mesh castShadow name="Cube074" geometry={nodes.Cube074.geometry} material={materials['white.019']} />
          <mesh castShadow name="Cube074_1" geometry={nodes.Cube074_1.geometry} material={materials['green.010']} />
          <mesh castShadow name="Cube074_2" geometry={nodes.Cube074_2.geometry} material={materials['red.010']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_10" position={[-1.01, 0, -1.01]} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow name="Cube052" geometry={nodes.Cube052.geometry} material={materials['blue.003']} />
          <mesh castShadow name="Cube052_1" geometry={nodes.Cube052_1.geometry} material={materials['orange.004']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_11" geometry={nodes.cube_11.geometry} material={materials['orange.003']} position={[0, 0, -1.01]} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_12" position={[1.01, 0, -1.01]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow name="Cube053" geometry={nodes.Cube053.geometry} material={materials['green.002']} />
          <mesh castShadow name="Cube053_1" geometry={nodes.Cube053_1.geometry} material={materials['orange.005']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_13" geometry={nodes.cube_13.geometry} material={materials['blue.002']} position={[-1.01, 0, 0]} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_14" geometry={nodes.cube_14.geometry} material={materials['white.009']} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_15" geometry={nodes.cube_15.geometry} material={materials['green.001']} position={[1.01, 0, 0]} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_16" position={[-1.01, 0, 1.01]} rotation={[Math.PI, 0, Math.PI / 2]}>
          <mesh castShadow name="Cube054" geometry={nodes.Cube054.geometry} material={materials['blue.004']} />
          <mesh castShadow name="Cube054_1" geometry={nodes.Cube054_1.geometry} material={materials['red.003']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_17" geometry={nodes.cube_17.geometry} material={materials['red.002']} position={[0, 0, 1.01]} />
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_18" position={[1.01, 0, 1.01]} rotation={[Math.PI, 0, -Math.PI / 2]}>
          <mesh castShadow name="Cube055" geometry={nodes.Cube055.geometry} material={materials['green.003']} />
          <mesh castShadow name="Cube055_1" geometry={nodes.Cube055_1.geometry} material={materials['red.004']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_19" position={[-1.01, 1.01, -1.01]}>
          <mesh castShadow name="Cube061" geometry={nodes.Cube061.geometry} material={materials['Yellow.007']} />
          <mesh castShadow name="Cube061_1" geometry={nodes.Cube061_1.geometry} material={materials['orange.007']} />
          <mesh castShadow name="Cube061_2" geometry={nodes.Cube061_2.geometry} material={materials['blue.007']} />
        </group>
      </RigidBody>


      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_20" position={[0, 1.01, -1.01]}>
          <mesh castShadow name="Cube060" geometry={nodes.Cube060.geometry} material={materials['Yellow.006']} />
          <mesh castShadow name="Cube060_1" geometry={nodes.Cube060_1.geometry} material={materials['orange.006']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_21" position={[1.01, 1.01, -1.01]} rotation={[0, -1.571, 0]}>
          <mesh castShadow name="Cube062" geometry={nodes.Cube062.geometry} material={materials['Yellow.008']} />
          <mesh castShadow name="Cube062_1" geometry={nodes.Cube062_1.geometry} material={materials['green.005']} />
          <mesh castShadow name="Cube062_2" geometry={nodes.Cube062_2.geometry} material={materials['orange.008']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_22" position={[-1.01, 1.01, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <mesh castShadow name="Cube058" geometry={nodes.Cube058.geometry} material={materials['Yellow.004']} />
          <mesh castShadow name="Cube058_1" geometry={nodes.Cube058_1.geometry} material={materials['blue.005']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <mesh castShadow name="cube_23" geometry={nodes.cube_23.geometry} material={materials['Yellow.002']} position={[0, 1.01, 0]} />
      </RigidBody>
      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_24" position={[1.01, 1.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <mesh castShadow name="Cube059" geometry={nodes.Cube059.geometry} material={materials['Yellow.005']} />
          <mesh castShadow name="Cube059_1" geometry={nodes.Cube059_1.geometry} material={materials['green.004']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_25" position={[-1.01, 1.01, 1.01]} rotation={[0, 1.571, 0]}>
          <mesh castShadow name="Cube064" geometry={nodes.Cube064.geometry} material={materials['Yellow.010']} />
          <mesh castShadow name="Cube064_1" geometry={nodes.Cube064_1.geometry} material={materials['blue.008']} />
          <mesh castShadow name="Cube064_2" geometry={nodes.Cube064_2.geometry} material={materials['red.007']} />
        </group>
      </RigidBody>

      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_26" position={[0, 1.01, 1.01]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh castShadow name="Cube057" geometry={nodes.Cube057.geometry} material={materials['Yellow.003']} />
          <mesh castShadow name="Cube057_1" geometry={nodes.Cube057_1.geometry} material={materials['red.005']} />
        </group>
      </RigidBody>
      <RigidBody
        colliders='cuboid'
               onSleep={() => {
           setAllSleeping((previous)=>{return previous+1})
           
        }}
      type='dynamic'
      >
        <group name="cube_27" position={[1.01, 1.01, 1.01]} rotation={[Math.PI, 0, Math.PI]}>
          <mesh castShadow name="Cube063" geometry={nodes.Cube063.geometry} material={materials['Yellow.009']} />
          <mesh castShadow name="Cube063_1" geometry={nodes.Cube063_1.geometry} material={materials['red.006']} />
          <mesh castShadow name="Cube063_2" geometry={nodes.Cube063_2.geometry} material={materials['green.006']} />
        </group>
      </RigidBody>


    </group>
    </>)}
  
    </>
)
});


useGLTF.preload('/cube.glb')






// return (<>
//   { isVisible && ( <>

//     <group ref={cubeModelRef} {...props} dispose={null} >
      
//         <group name="cube_1" position={[-1.01, -1.01, -1.01]} rotation={[Math.PI, 1.571, 0]}>
//           <mesh castShadow name="Cube070" geometry={nodes.Cube070.geometry} material={materials['white.015']} />
//           <mesh castShadow name="Cube070_1" geometry={nodes.Cube070_1.geometry} material={materials['blue.010']} />
//           <mesh castShadow name="Cube070_2" geometry={nodes.Cube070_2.geometry} material={materials['orange.010']} />
//         </group>
      
     

      
//         <group name="cube_2" position={[0, -1.01, -1.01]} rotation={[Math.PI / 2, 0, 0]}>
//           <mesh castShadow name="Cube069" geometry={nodes.Cube069.geometry} material={materials['white.014']} />
//           <mesh castShadow name="Cube069_1" geometry={nodes.Cube069_1.geometry} material={materials['orange.009']} />
//         </group>
      

      
//         <group name="cube_3" position={[1.01, -1.01, -1.01]} rotation={[0, 0, Math.PI]}>
//           <mesh castShadow name="Cube071" geometry={nodes.Cube071.geometry} material={materials['white.016']} />
//           <mesh castShadow name="Cube071_1" geometry={nodes.Cube071_1.geometry} material={materials['orange.011']} />
//           <mesh castShadow name="Cube071_2" geometry={nodes.Cube071_2.geometry} material={materials['green.008']} />
//         </group>
      

      
//         <group name="cube_4" position={[-1.01, -1.01, 0]} rotation={[Math.PI, Math.PI / 2, 0]}>
//           <mesh castShadow name="Cube066" geometry={nodes.Cube066.geometry} material={materials['white.011']} />
//           <mesh castShadow name="Cube066_1" geometry={nodes.Cube066_1.geometry} material={materials['blue.009']} />
//         </group>
      

      
//         <mesh castShadow name="cube_5" geometry={nodes.cube_5.geometry} material={materials['white.010']} position={[0, -1.01, 0]} />
      

      
//         <group name="cube_6" position={[1.01, -1.01, 0]} rotation={[-Math.PI, -Math.PI / 2, 0]}>
//           <mesh castShadow name="Cube068" geometry={nodes.Cube068.geometry} material={materials['white.013']} />
//           <mesh castShadow name="Cube068_1" geometry={nodes.Cube068_1.geometry} material={materials['green.007']} />
//         </group>
      

      
//         <group name="cube_7" position={[-1.01, -1.01, 1.01]} rotation={[-Math.PI, 0, 0]}>
//           <mesh castShadow name="Cube073" geometry={nodes.Cube073.geometry} material={materials['white.018']} />
//           <mesh castShadow name="Cube073_1" geometry={nodes.Cube073_1.geometry} material={materials['red.009']} />
//           <mesh castShadow name="Cube073_2" geometry={nodes.Cube073_2.geometry} material={materials['blue.011']} />
//         </group>
      

      
//         <group name="cube_8" position={[0, -1.01, 1.01]} rotation={[Math.PI, 0, 0]}>
//           <mesh castShadow name="Cube067" geometry={nodes.Cube067.geometry} material={materials['white.012']} />
//           <mesh castShadow name="Cube067_1" geometry={nodes.Cube067_1.geometry} material={materials['red.008']} />
//         </group>
      

      
//         <group name="cube_9" position={[1.01, -1.01, 1.01]} rotation={[-Math.PI, -Math.PI / 2, 0]}>
//           <mesh castShadow name="Cube074" geometry={nodes.Cube074.geometry} material={materials['white.019']} />
//           <mesh castShadow name="Cube074_1" geometry={nodes.Cube074_1.geometry} material={materials['green.010']} />
//           <mesh castShadow name="Cube074_2" geometry={nodes.Cube074_2.geometry} material={materials['red.010']} />
//         </group>
      

      
//         <group name="cube_10" position={[-1.01, 0, -1.01]} rotation={[0, 0, Math.PI / 2]}>
//           <mesh castShadow name="Cube052" geometry={nodes.Cube052.geometry} material={materials['blue.003']} />
//           <mesh castShadow name="Cube052_1" geometry={nodes.Cube052_1.geometry} material={materials['orange.004']} />
//         </group>
      

      
//         <mesh castShadow name="cube_11" geometry={nodes.cube_11.geometry} material={materials['orange.003']} position={[0, 0, -1.01]} />
      

      
//         <group name="cube_12" position={[1.01, 0, -1.01]} rotation={[0, 0, -Math.PI / 2]}>
//           <mesh castShadow name="Cube053" geometry={nodes.Cube053.geometry} material={materials['green.002']} />
//           <mesh castShadow name="Cube053_1" geometry={nodes.Cube053_1.geometry} material={materials['orange.005']} />
//         </group>
      

      
//         <mesh castShadow name="cube_13" geometry={nodes.cube_13.geometry} material={materials['blue.002']} position={[-1.01, 0, 0]} />
      

      
//         <mesh castShadow name="cube_14" geometry={nodes.cube_14.geometry} material={materials['white.009']} />
      

      
//         <mesh castShadow name="cube_15" geometry={nodes.cube_15.geometry} material={materials['green.001']} position={[1.01, 0, 0]} />
      

      
//         <group name="cube_16" position={[-1.01, 0, 1.01]} rotation={[Math.PI, 0, Math.PI / 2]}>
//           <mesh castShadow name="Cube054" geometry={nodes.Cube054.geometry} material={materials['blue.004']} />
//           <mesh castShadow name="Cube054_1" geometry={nodes.Cube054_1.geometry} material={materials['red.003']} />
//         </group>
      

      
//         <mesh castShadow name="cube_17" geometry={nodes.cube_17.geometry} material={materials['red.002']} position={[0, 0, 1.01]} />
      

      
//         <group name="cube_18" position={[1.01, 0, 1.01]} rotation={[Math.PI, 0, -Math.PI / 2]}>
//           <mesh castShadow name="Cube055" geometry={nodes.Cube055.geometry} material={materials['green.003']} />
//           <mesh castShadow name="Cube055_1" geometry={nodes.Cube055_1.geometry} material={materials['red.004']} />
//         </group>
      

      
//         <group name="cube_19" position={[-1.01, 1.01, -1.01]}>
//           <mesh castShadow name="Cube061" geometry={nodes.Cube061.geometry} material={materials['Yellow.007']} />
//           <mesh castShadow name="Cube061_1" geometry={nodes.Cube061_1.geometry} material={materials['orange.007']} />
//           <mesh castShadow name="Cube061_2" geometry={nodes.Cube061_2.geometry} material={materials['blue.007']} />
//         </group>
      


      
//         <group name="cube_20" position={[0, 1.01, -1.01]}>
//           <mesh castShadow name="Cube060" geometry={nodes.Cube060.geometry} material={materials['Yellow.006']} />
//           <mesh castShadow name="Cube060_1" geometry={nodes.Cube060_1.geometry} material={materials['orange.006']} />
//         </group>
      

      
//         <group name="cube_21" position={[1.01, 1.01, -1.01]} rotation={[0, -1.571, 0]}>
//           <mesh castShadow name="Cube062" geometry={nodes.Cube062.geometry} material={materials['Yellow.008']} />
//           <mesh castShadow name="Cube062_1" geometry={nodes.Cube062_1.geometry} material={materials['green.005']} />
//           <mesh castShadow name="Cube062_2" geometry={nodes.Cube062_2.geometry} material={materials['orange.008']} />
//         </group>
      

      
//         <group name="cube_22" position={[-1.01, 1.01, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
//           <mesh castShadow name="Cube058" geometry={nodes.Cube058.geometry} material={materials['Yellow.004']} />
//           <mesh castShadow name="Cube058_1" geometry={nodes.Cube058_1.geometry} material={materials['blue.005']} />
//         </group>
      

      
//         <mesh castShadow name="cube_23" geometry={nodes.cube_23.geometry} material={materials['Yellow.002']} position={[0, 1.01, 0]} />
      
      
//         <group name="cube_24" position={[1.01, 1.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
//           <mesh castShadow name="Cube059" geometry={nodes.Cube059.geometry} material={materials['Yellow.005']} />
//           <mesh castShadow name="Cube059_1" geometry={nodes.Cube059_1.geometry} material={materials['green.004']} />
//         </group>
      

      
//         <group name="cube_25" position={[-1.01, 1.01, 1.01]} rotation={[0, 1.571, 0]}>
//           <mesh castShadow name="Cube064" geometry={nodes.Cube064.geometry} material={materials['Yellow.010']} />
//           <mesh castShadow name="Cube064_1" geometry={nodes.Cube064_1.geometry} material={materials['blue.008']} />
//           <mesh castShadow name="Cube064_2" geometry={nodes.Cube064_2.geometry} material={materials['red.007']} />
//         </group>
      

      
//         <group name="cube_26" position={[0, 1.01, 1.01]} rotation={[-Math.PI / 2, 0, 0]}>
//           <mesh castShadow name="Cube057" geometry={nodes.Cube057.geometry} material={materials['Yellow.003']} />
//           <mesh castShadow name="Cube057_1" geometry={nodes.Cube057_1.geometry} material={materials['red.005']} />
//         </group>
      
      
//         <group name="cube_27" position={[1.01, 1.01, 1.01]} rotation={[Math.PI, 0, Math.PI]}>
//           <mesh castShadow name="Cube063" geometry={nodes.Cube063.geometry} material={materials['Yellow.009']} />
//           <mesh castShadow name="Cube063_1" geometry={nodes.Cube063_1.geometry} material={materials['red.006']} />
//           <mesh castShadow name="Cube063_2" geometry={nodes.Cube063_2.geometry} material={materials['green.006']} />
//         </group>
      


//     </group>
//     </>)}
  
//     </>
// )
// });