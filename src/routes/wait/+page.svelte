<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { audioContext, source, buffer, analyser } from '../audio';

    let canvas;
    let canvasContext;
    let processing = true;
    let animationId;

    // Mock long-running function
    function mockProcessing() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000); // Mocking a 5 second processing time
        });
    }

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

            await mockProcessing();
            processing = false;

            drawVisualizer();
        }
    });

    // Function to start the animation
    function startAnimation() {
        const audioSource = get(source);
        if (audioSource) {
            audioSource.stop();
        }
    }

    // Function to draw the visualizer
    function drawVisualizer() {
        if (!canvasContext) {
            canvasContext = canvas.getContext('2d');
        }

        const context = get(audioContext);
        const audioAnalyser = get(analyser);
        audioAnalyser.fftSize = 256;
        const bufferLength = audioAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            audioAnalyser.getByteFrequencyData(dataArray);

            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasContext.fillStyle = '#DD8B3F';
                canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }

            animationId = requestAnimationFrame(draw);
        }

        draw();
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
    <canvas bind:this={canvas} width="800" height="400"></canvas>
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


    canvas {
        z-index: -1;
    }
</style>
