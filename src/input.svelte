<script>
    import { createEventDispatcher, onMount } from 'svelte';
    export let roomsActive;
    export let active;

    const dispatch = createEventDispatcher ();

    let message = '';
    let textarea;
    let writing = false;

    $: {
        dispatch ('writing', writing);
    }
    
    $: {
        if (active && textarea) {
            setTimeout (() => {
                textarea.focus ();
            }, 100)
        }
    }

    function sendMessage () {
        if (message.trim () !== '') {
            let m = message.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
            dispatch ('message', {
                text: m
            });
            message = '';
        }
        textarea.focus ();
    }

    function handleKeydown (event) {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault ();
            writing = false;
            sendMessage ();
        }
    }
    
    function handleKeyup (event) {
        if (message !== '' && writing === false) 
            writing = true;
        else if (message === '' && writing === true) 
            writing = false;
    }
</script>

<div class={"Input" + (roomsActive ? ' with-rooms' : '') + (active ? ' active' : '')}>
    <textarea bind:value={message} placeholder="enter message here" bind:this={textarea} on:keydown={handleKeydown} on:keyup={handleKeyup}/>
    <div class="send-button" on:click={sendMessage}>
        <i class="far fa-envelope"></i>
    </div>
</div>


<style>
    .Input {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        min-height: 50px;
        padding: 0 0 0 50px;
        background-color: #fff;
        border-top: 1px solid #d5e2ea;
        display: none;
    }
    .Input.active {
        display: block;
    }
    .Input.with-rooms {
        padding: 0 0 0 310px;
    }
    .Input textarea {
        width: 100%;
        font-size: 14px;
        padding: 6px 10px;
        border: none;
        outline: none;
        resize: none;
    }
    .Input .send-button {
        position: absolute;
        padding: 3px 10px;
        right: 0;
        top: 0;
    }
</style>