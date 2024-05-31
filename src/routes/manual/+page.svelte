<script>
  import { onMount, tick } from 'svelte';
  import { audioContext, analyser, source, file } from '../audio.js'; // Ensure the correct path
  import { get } from 'svelte/store';
  import {beatTimeStamps} from '../beats.js'
  import { goto } from '$app/navigation';

  let info = "Start"
  let canvas;
  let ctx;
  let isPlaying = false;
  let tapTimestamps = [0];
  let startTime;
  let countdown = 3;
  let showCountdown = false;
  let beatCounter = 0;


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
          console.log(tapTimestamps)
          isPlaying = false;
          goto('/wait')
        };

      });
    }
  }

  function handleClick(event) {
    beatCounter++;
    if (isPlaying) {
      const currentTime = (get(audioContext).currentTime * 1000) - startTime;
      tapTimestamps.push(currentTime-200);
    }
  }


</script>

<style>
  .main
  {
    background: linear-gradient(to right, black 20% , white 20%);
  }
</style>

<div class="main pager flex flex-col items-center">
  <div class="h-[100px]"></div>
  <div class="flex flex-row w-full items-left h-[150px]">
    <button class=" bg-white text-3xl ml-20  mt-10 mb-10 w-[200px] rounded-md goldman-regular" on:click={startCountdown} disabled={isPlaying || showCountdown}>
      {info}
    </button>
    <div class = "w-[230px]">

    </div>
    
  <div class="h-[200px] text-left text-black text-3xl mt-10 goldman-regular">
    {#if showCountdown}
    <div class="countdown text-black">{countdown}</div>
    {:else if info=="Start"}
    <p>When you press start, your music will start playing.<br> You are supposed to click whenever you hear a beat in the surface below</p>
    {:else}
    <h1>Number of Beats: {beatCounter}</h1>

  {/if}
  </div>
 
  </div>
 <button on:click={handleClick} class = "w-[80%] border-white border-8 h-[700px] bg-[#DD8B3F] rounded-md goldman-regular text-white">Click Here</button>
</div>
