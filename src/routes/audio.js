import { writable } from 'svelte/store';

export const audioContext = writable(null);
export const analyser = writable(null);
export const source = writable(null);
export const file = writable(null);
export const buffer = writable(null);