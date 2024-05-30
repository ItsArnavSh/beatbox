<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { audioContext, source, buffer, analyser } from '../audio';
    import {simulation} from '../simulation'
    import { goto } from '$app/navigation'
import {width,height} from '../canvas'
    let processing = true;
    let animationId;
    width.set(1600);
      height.set(1000);
      
    // Mock long-running function
    simulation.begin();

    // Starts the audio and visualizer when the component is mounted
    onMount(async () => {
        const context = get(audioContext);
        const audioBuffer = get(buffer);
        if (context && audioBuffer) {
            const audioSource = context.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(context.destination);
            source.set(audioSource);
            audioSource.start(0);

            await simulation.begin();
            processing = false;

        }
    });

    // Function to start the animation
    function startAnimation() {
        const audioSource = get(source);
        if (audioSource) {
            audioSource.stop();
        }
        goto('../simulation')
    }


    // Cleanup function
    onDestroy(() => {
        cancelAnimationFrame(animationId);
        const audioSource = get(source);
        if (audioSource) {
            audioSource.stop();
        }
    });
</script>

<main>
    <div class="overlay">
        {#if processing}
        <div class = "w-full">
            <h1 class = " w-[50%] goldman-bold text-8xl text-white">Please Wait while we process</h1>
            <div></div>
        </div>    

        {:else}
            <div class = "w-full flex flex-row">
                <div class = "w-[50%]"></div>
                <div class = "w-[50%] goldman-bold text-8xl text-black">
                    <h1 class = " ">Processing complete, your animation is ready</h1>
            <button  class = "text-white bg-black p-4" on:click={startAnimation}>Start</button>
                </div>
            </div>   
        {/if}
    </div>

</main>

<style>
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 2em;
        text-align: center;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to right,black 50%,white 50%); 
    }



</style>
