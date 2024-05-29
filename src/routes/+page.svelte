<div class = "main pager flex flex-col items-center ">
    <div class = "h-[100px]"></div>
    <h1 class = "text-white goldman-bold text-[150px]"><span class = "text-black">Beat</span><span class="white">-</span><span class="text-[#DD8B3F]">Box</span><span class="text-black">I</span></h1>
    <p class = "text-white goldman-regular p-0 text-4xl">watch your favorite music come to life</p>
    <div class = "h-[200px]"></div>
    <button class="custom-button text-3xl p-5 rounded-md goldman-regular">Upload Your Music</button>
    <input class="file-input" type="file" accept="audio/*" on:change={handleFileInput} />
</div>
<style>

  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .custom-button {
    display: inline-block;
    background-color: #ffffff;
    color: #DD8B3F;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
  }
  .main
    {
        background: linear-gradient(to right,#DD8B3F 50%,#000000 50%)   
    }

</style>
<script>
    import { goto } from '$app/navigation'
    import { audioContext, analyser, source, file ,buffer} from './audio.js';

  function handleFileInput(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      file.set(selectedFile);
      processAudioFile(selectedFile);
      goto('/choice');
    }
  }

  function processAudioFile(selectedFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            const context = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.set(context);
            context.decodeAudioData(arrayBuffer, function(decodedBuffer) {
                const audioAnalyser = context.createAnalyser();
                const audioSource = context.createBufferSource();
                audioSource.buffer = decodedBuffer;
                audioSource.connect(audioAnalyser);
                audioAnalyser.connect(context.destination);
                source.set(audioSource);
                analyser.set(audioAnalyser);
                buffer.set(decodedBuffer);  // Update the buffer store
            });
        };
        reader.readAsArrayBuffer(selectedFile);
    }
</script>