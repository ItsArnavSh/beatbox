<script>
    import { onMount } from "svelte";
    import { beatTimeStamps } from "../beats";
    import { get } from "svelte/store";
    import { pts } from "../rim";
    import { source, audioContext, buffer } from "../audio";

    let canvas;
    let ctx;
    let animationFrameId;
    let colors = ["#edeceb", "#fff836", "#fff836", "#fff836", "#ffffff"];
    let ballColor = "#EFFFFE"; // Initial color of the main ball
    let audioSource;

    const points = get(pts);
    const timestamps = get(beatTimeStamps);

    onMount(() => {
        // Get the 2D context of the canvas
        ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = 1600;
        canvas.height = 1000;

        // Start playing the audio
        playAudio();

        // Start the animation
        animateBall();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    });

    function playAudio() {
        const context = get(audioContext);
        const audioBuffer = get(buffer);
        if (context && audioBuffer) {
            audioSource = context.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(context.destination);
            source.set(audioSource);
            audioSource.start(0);
        }
    }

    function animateBall() {
        const startTime = performance.now();

        function draw(now) {
            // Calculate the elapsed time
            const elapsed = now - startTime;

            // Find the current segment
            let segmentIndex = 0;
            for (let i = 0; i < timestamps.length; i++) {
                if (elapsed <= timestamps[i]) {
                    segmentIndex = i;
                    break;
                }
            }

            // Calculate the start and end points of the current segment
            const startPoint = points[segmentIndex];
            const endPoint = points[segmentIndex + 1];

            // Calculate the segment progress (0 to 1)
            const segmentStartTime = segmentIndex === 0 ? 0 : timestamps[segmentIndex - 1];
            const segmentDuration = timestamps[segmentIndex] - segmentStartTime;
            const segmentElapsed = elapsed - segmentStartTime;
            const progress = Math.min(segmentElapsed / segmentDuration, 1);

            // Calculate the current position of the ball
            const x = startPoint.x + (endPoint.x - startPoint.x) * progress;
            const y = startPoint.y + (endPoint.y - startPoint.y) * progress;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw remaining points with different colors
            points.forEach((point, index) => {
                if (index > segmentIndex) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 0.7, 0, 2 * Math.PI);
                    ctx.fillStyle = colors[index % colors.length];
                    ctx.fill();
                }
            });

            // Change ball color if it touches a small ball
            if (segmentIndex < points.length - 1 && progress === 1) {
                ballColor = colors[(segmentIndex + 1) % colors.length];
            }

            // Draw the ball
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = ballColor;
            ctx.fill();

            // Continue the animation if not yet complete
            if (segmentIndex < points.length - 1 || progress < 1) {
                animationFrameId = requestAnimationFrame(draw);
            }
        }

        animationFrameId = requestAnimationFrame(draw);
    }
</script>

<style>
    canvas {
        border: 1px solid black;
    }
    .test
    {
        height: 100vh;
    }
</style>
<div class = "bg-black flex flex-col items-center test">
    <canvas bind:this={canvas}></canvas>
</div>
