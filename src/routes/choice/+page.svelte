<div class = "pager main flex flex-col items-center ">
    <h1 class = " goldman-bold text-[150px]"><span class="text-white">Beat</span><span class="text-[#DD8B3F]">-</span><span class="text-black">Box</span><span class="text-white">I</span></h1>
    <div class = "h-[100px]"></div>
<div class="choice w-full items-center flex flex-row">
    <div class="c1 w-[50%] items-center flex flex-col">
        <h1 class = "text-white jetbrains text-[80px]">The Beat Viber</h1>
        <p class = "jetbrains text-2xl text-white text-center mt-20">You have to click on the screen<br>
            whenever there is a beat with the Music Playing</p>
            <div class = "h-[100px]"></div>
        <button class = "rounded-md bg-white text-black goldman-regular p-5 text-5xl" on:click={viber}>Begin</button>
    </div>
    <div class = "c2 w-[50%] items-center flex flex-col">
        <h1 class = "text-black jetbrains text-[80px]">The Beat Tracker</h1>
        <p class = "jetbrains text-2xl text-black text-center mt-20">The computer automatically generates beat time stamps,<br>
            Although not very accurate</p>
        <div class = "h-[10px]"></div><select id="genre" class="p-5 ">
            <option value = "Select">Select</option>
    <option value="pop">Pop</option>
    <option value="rock">Rock</option>
    <option value="edm">EDM</option>
    <option value="hiphop">Hip-Hop</option>
    <option value="jazz">Jazz</option>
    <option value="classical">Classical</option>
</select>

        <button class = "rounded-md bg-black text-white goldman-regular p-5 text-5xl" on:click = {automatic}>Start</button>
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
        genre = genreSelect.value;
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
        let beatTimestamps = [0];
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
<style>
.main
{
    background: linear-gradient(to right, black 50%,white 50%);
}
</style>