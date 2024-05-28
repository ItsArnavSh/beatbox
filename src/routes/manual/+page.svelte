<script>
  import { onMount, tick } from 'svelte';
  import { audioContext, analyser, source, file } from '../audio.js'; // Ensure the correct path
  import { get } from 'svelte/store';
  import {beatTimeStamps} from '../beats.js'
  let info = "Start"
  let canvas;
  let ctx;
  let isPlaying = false;
  let tapTimestamps = [];
  let startTime;
  let countdown = 3;
  let showCountdown = false;

  function startCountdown() {
    info = "Wait for countdown"
    showCountdown = true;
    const interval = setInterval(async () => {
      if (countdown > 1) {
        countdown--;
      } else {
        clearInterval(interval);
        countdown = 0;
        showCountdown = false;
        await tick(); // Wait for the DOM to update
        playAudio();
      }
    }, 1000);
  }

  function playAudio() {
    info = "Go!"
    const audioSource = get(source);
    const context = get(audioContext);
    if (audioSource && context) {
      context.resume().then(() => {
        startTime = context.currentTime * 1000; // Convert to milliseconds
        audioSource.start(0);
        isPlaying = true;

        audioSource.onended = () => {
          beatTimeStamps.set(tapTimestamps);
          isPlaying = false;
        };

        setupCanvas();
      });
    }
  }

  function setupCanvas() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    // Clear previous click events
    canvas.removeEventListener('click', handleCanvasClick);
    // Add new click event listener
    canvas.addEventListener('click', handleCanvasClick);
  }

  function handleCanvasClick(event) {
    if (isPlaying) {
      const currentTime = (get(audioContext).currentTime * 1000) - startTime;
      tapTimestamps.push(currentTime-200);
      createClickEffect(event.offsetX, event.offsetY);
    }
  }

  function createClickEffect(x, y)
  {

  }

  onMount(() => {
    // Initialize canvas and its context on mount
    setupCanvas();
  });
</script>

<style>
  .custom-button {
    display: inline-block;
    background-color: #ffffff;
    color: #242424;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
  }

  .countdown {
    font-size: 3rem;
    color: white;
    margin-top: 20px;
  }

  canvas {
    border: 1px solid black;
    background-color: rgb(185, 185, 185);
    margin-top: 20px;
    width: 100%;
    height: 300px;
  }
</style>

<div class="bg-[#242424] pager flex flex-col items-center">
  <div class="h-[100px]"></div>
  <h1 class="text-white goldman-bold text-[150px]">Beat-Box</h1>
  <p class="text-white goldman-regular p-0 text-2xl">The audio is modified by 200ms to account for Human Response Time</p>
  <div class="h-[200px] text-center text-white text-xl mt-10 goldman-regular">
    <p>When you press start, your music will start playing.<br> You are supposed to click whenever you hear a beat in the surface below</p>
  </div>
  <button class="custom-button text-3xl p-5 rounded-md goldman-regular" on:click={startCountdown} disabled={isPlaying || showCountdown}>
    {info}
  </button>
  {#if showCountdown}
    <div class="countdown">{countdown}</div>
  {/if}
  <canvas width="800" height="300"></canvas>
</div>
