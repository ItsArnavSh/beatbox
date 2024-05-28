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
        <div class = "h-[100px]"></div>
        <button class = "rounded-md bg-white text-[#4C9AAB] goldman-regular p-5 text-5xl">Start</button>
    </div>
</div>
</div>
<script>
    import { goto } from '$app/navigation'
    function viber(event)
    {
        goto('/manual');

    }
</script>