<script>
    import { onMount } from "svelte";
    import { beatTimeStamps } from "../beats";
    import { get } from "svelte/store";
    import { pts } from "../rim";
    import { source, audioContext, buffer } from "../audio";
    
    let canvas;
    let ctx;
    let animationFrameId;
    playAudio();
    // Array of points the ball should move to
    const points = get(pts);
  
    // Corresponding timestamps in milliseconds
    const timestamps = get(beatTimeStamps);
  
    onMount(async () => {
      // Get the 2D context of the canvas
      ctx = canvas.getContext("2d");
  
      // Set canvas dimensions
      canvas.width = 1600;
      canvas.height = 1000;
  
      // Start playing the audio
      await playAudio();
  
      // Start the animation
      animateBall();
  
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    });
  
    async function playAudio() {
        /*const context = get(audioContext);
        const audioBuffer = get(buffer);
        if (context && audioBuffer) {
            const audioSource = context.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(context.destination);
            source.set(audioSource);
            audioSource.start(0);
            processing = false;

        }
        */
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
  
        // Draw remaining points
        points.forEach((point, index) => {
          if (index > segmentIndex) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
          }
        });
  
        // Draw the ball
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
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
  </style>
  
  <canvas bind:this={canvas}></canvas>
  