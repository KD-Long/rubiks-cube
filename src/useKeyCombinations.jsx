

// useKeyCombinations.js
import { useEffect } from 'react';
import { useKeyboardControls } from '@react-three/drei'

export function useKeyCombinations(resetCamera, callbackScramble, callbackSetSolve,callbackControlClick) {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const combinations = [
    // other controls cam etc
    {
      keys: ['resetCam'],
      effect: () => { resetCamera() },
    },
    {
      keys: ['scramble'],
      effect: () => { callbackScramble() },
    },
    {
      keys: ['solve'],
      effect: () => { callbackSetSolve() },
    },
 



    // controls
    {
      keys: ['x1'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['x', 1, -1]) },
    },
    {
      keys: ['x2'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['x', 1, 0]) },
    },
    {
      keys: ['x3'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['x', 1, 1]) },
    },

    {
      keys: ['y1'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['y', 1, 1]) },
    },
    {
      keys: ['y2'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['y', 1, 0]) },
    },
    {
      keys: ['y3'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['y', 1, -1]) },
    },

    {
      keys: ['z1'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['z', 1, 1]) },
    },
    {
      keys: ['z2'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['z', 1, 0]) },
    },
    {
      keys: ['z3'],
      effect: () => { if (!getKeys().anti) callbackControlClick(['z', 1, -1]) },
    },

    // anti clockwise version
    {
      keys: ['x1', 'anti'],
      effect: () => { callbackControlClick(['x', -1, -1]) },
    },
    {
      keys: ['x2', 'anti'],
      effect: () => { callbackControlClick(['x', -1, 0]) },
    },
    {
      keys: ['x3', 'anti'],
      effect: () => { callbackControlClick(['x', -1, 1]) },
    },

    {
      keys: ['y1', 'anti'],
      effect: () => { callbackControlClick(['y', -1, 1]) },
    },
    {
      keys: ['y2', 'anti'],
      effect: () => { callbackControlClick(['y', -1, 0]) },
    },
    {
      keys: ['y3', 'anti'],
      effect: () => { callbackControlClick(['y', -1, -1]) },
    },

    {
      keys: ['z1', 'anti'],
      effect: () => { callbackControlClick(['z', -1, 1]) },
    },
    {
      keys: ['z2', 'anti'],
      effect: () => { callbackControlClick(['z', -1, 0]) },
    },
    {
      keys: ['z3', 'anti'],
      effect: () => { callbackControlClick(['z', -1, -1]) },
    },
  ];



  useEffect(() => {
    combinations.forEach((combination) => {
      const { keys, effect } = combination;

      const unsub = subscribeKey(
        // Selector: Check if all keys in the combination are pressed
        (state) => keys.every((key) => state[key]),
        // When all keys are pressed, call the corresponding effect
        (value) => {
          if (value) {
            effect();
          }
        }
      )
      return () => {
        unsub()

      }
    });
  }, [])
}

