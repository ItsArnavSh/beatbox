<div class = "bg-[#4C9AAB] pager flex flex-col items-center ">
    <h1 class = "text-white goldman-bold text-[150px]">Beat-Box</h1>
    <div class = "h-[100px]"></div>
<div class="choice w-full items-center flex flex-row">
    <div class="c1 w-[50%] items-center flex flex-col">
        <h1 class = "text-white jetbrains text-[80px]">The Beat Viber</h1>
        <p class = "jetbrains text-2xl text-white text-center mt-20">You have to click on the screen<br>
            whenever there is a beat with the Music Playing</p>
            <div class = "h-[100px]"></div>
        <button class = "rounded-md bg-white text-[#4C9AAB] goldman-regular p-5 text-5xl" on:click={viber}>Begin</button>
    </div>
    <div class = "c2 w-[50%] items-center flex flex-col">
        <h1 class = "text-white jetbrains text-[80px]">The Beat Tracker</h1>
        <p class = "jetbrains text-2xl text-white text-center mt-20">The computer automatically generates beat time stamps,<br>
            Although not very accurate</p>
        <div class = "h-[100px]"></div><select id="genre" class="p-5 ">
    <option value="pop">Pop</option>
    <option value="rock">Rock</option>
    <option value="edm">EDM</option>
    <option value="hiphop">Hip-Hop</option>
    <option value="jazz">Jazz</option>
    <option value="classical">Classical</option>
</select>
        <input type="file" id="audiofile" accept="audio/*" class="hidden">
        <select id="genre" class="hidden">
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="edm">EDM</option>
            <option value="hiphop">Hip-Hop</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
        </select>
        <button class = "rounded-md bg-white text-[#4C9AAB] goldman-regular p-5 text-5xl" on:click = {automatic}>Start</button>
    </div>
</div>
</div>
<script>
  import { goto } from '$app/navigation';
    import { audioContext, analyser, source, file, buffer } from '../audio.js'; // Ensure the correct path
    import { get } from 'svelte/store';
    import {beatTimeStamps} from "../beats.js"

    function viber(event) {
        goto('/manual');
    }

    function automatic(event) {
        const genrePresets = {
            'pop': { threshold: 0.8, separation: 0.25 },
            'rock': { threshold: 0.85, separation: 0.2 },
            'edm': { threshold: 0.75, separation: 0.15 },
            'hiphop': { threshold: 0.85, separation: 0.3 },
            'jazz': { threshold: 0.9, separation: 0.35 },
            'classical': { threshold: 0.95, separation: 0.5 },
        };
        const genreSelect = document.getElementById('genre');
        const genre = genreSelect.value;
        const { threshold, separation } = genrePresets[genre];
        const decodedBuffer = get(buffer); // Access the buffer store's value
        if (decodedBuffer) {
            beatTimeStamps.set(detectBeats(decodedBuffer, threshold, separation));
            goto('/wait');

        } else {
            console.error('Buffer is not set');
        }
    }

    function detectBeats(decodedBuffer, threshold, separation) {
        const sampleRate = decodedBuffer.sampleRate;
        const data = decodedBuffer.getChannelData(0); // assuming mono audio
        const dataLength = data.length;
        let beatTimestamps = [];
        let lastBeat = -Infinity;

        for (let i = 0; i < dataLength; i++) {
            if (data[i] > threshold && (i - lastBeat) > sampleRate * separation) { // peak detection with genre-specific separation
                lastBeat = i;
                beatTimestamps.push((i / sampleRate) * 1000); // converting to milliseconds
            }
        }

        return beatTimestamps;
    }
</script>