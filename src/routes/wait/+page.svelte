<script>
    import { onMount } from 'svelte';
    import { beatTimeStamps } from '../beats';
    import { audioContext, source, buffer, analyser } from '../audio';
    import { get } from 'svelte/store';

    let canvas;
    let ctx;
    let animationFrameId;
    let beatTimes = get(beatTimeStamps);
    let audioSource;
    let analyserNode;
    let dataArray;
    let bufferLength;

    onMount(() => {
        // Set up the canvas context
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Set up the audio context, source, and analyser
        const context = get(audioContext);
        const decodedBuffer = get(buffer);
        if (context && decodedBuffer) {
            analyserNode = context.createAnalyser();
            analyserNode.fftSize = 256;
            bufferLength = analyserNode.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            audioSource = context.createBufferSource();
            audioSource.buffer = decodedBuffer;
            audioSource.connect(analyserNode);
            analyserNode.connect(context.destination);
            audioSource.start(0);

            // Start the animation loop
            animationFrameId = requestAnimationFrame(draw);
        }

        return () => {
            // Clean up the animation frame on component destroy
            cancelAnimationFrame(animationFrameId);
            if (audioSource) {
                audioSource.stop();
            }
        };
    });

    function draw() {
        analyserNode.getByteFrequencyData(dataArray);

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the frequency bars
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }

        // Highlight the beats
        const currentTime = (audioContext.currentTime * 1000);
        beatTimes.forEach(beat => {
            if (Math.abs(currentTime - beat) < 100) {
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });

        // Continue the animation loop
        animationFrameId = requestAnimationFrame(draw);
    }
</script>

<main>
    <canvas bind:this={canvas}></canvas>
</main>

<style>
    canvas {
        display: block;
        background-color: black;
    }
</style>
