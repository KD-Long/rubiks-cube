

// useKeyCombinations.js
import { useEffect } from 'react';
import { useKeyboardControls } from '@react-three/drei'

export function useKeyCombinations(controlClick) {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const combinations = [
    {
        keys: ['x1'],
        effect: () => {if (!getKeys().anti)controlClick('x', 1, -1)},
    },
    {
        keys: ['x2'],
        effect: () => {if (!getKeys().anti)controlClick('x', 1, 0) },
    },
    {
        keys: ['x3'],
        effect: () => {if (!getKeys().anti)controlClick('x', 1, 1) },
    },

    {
        keys: ['y1'],
        effect: () => {if (!getKeys().anti)controlClick('y', 1, 1) },
    },
    {
        keys: ['y2'],
        effect: () => {if (!getKeys().anti)controlClick('y', 1, 0) },
    },
    {
        keys: ['y3'],
        effect: () => {if (!getKeys().anti)controlClick('y', 1, -1) },
    },

    {
        keys: ['z1'],
        effect: () => {if (!getKeys().anti)controlClick('z', 1, 1) },
    },
    {
        keys: ['z2'],
        effect: () => {if (!getKeys().anti)controlClick('z', 1, 0) },
    },
    {
        keys: ['z3'],
        effect: () => {if (!getKeys().anti)controlClick('z', 1, -1) },
    },

    // anti clockwise version
    {
        keys: ['x1', 'anti'],
        effect: () => { controlClick('x', -1, -1) },
    },
    {
        keys: ['x2', 'anti'],
        effect: () => { controlClick('x', -1, 0) },
    },
    {
        keys: ['x3', 'anti'],
        effect: () => { controlClick('x', -1, 1) },
    },

    {
        keys: ['y1', 'anti'],
        effect: () => { controlClick('y', -1, 1) },
    },
    {
        keys: ['y2', 'anti'],
        effect: () => { controlClick('y', -1, 0) },
    },
    {
        keys: ['y3', 'anti'],
        effect: () => { controlClick('y', -1, -1) },
    },

    {
        keys: ['z1', 'anti'],
        effect: () => { controlClick('z', -1, 1) },
    },
    {
        keys: ['z2', 'anti'],
        effect: () => { controlClick('z', -1, 0) },
    },
    {
        keys: ['z3', 'anti'],
        effect: () => { controlClick('z', -1, -1) },
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

