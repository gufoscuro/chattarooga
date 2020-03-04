<script>
    import { createEventDispatcher } from 'svelte';
    export let roomsActive;

    const dispatch = createEventDispatcher ();

    let message = '';
    let textarea;
    let writing = false;

    function emitWriting (bool) {
        dispatch ('writing', bool);
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
            emitWriting (false);
            writing = false;
            sendMessage ();
        } else if (message !== '' && writing === false) {
            writing = true;
            emitWriting (true);
        }
        else if (message === '' && writing === true) {
            writing = false;
            emitWriting (false);
        }
	}
</script>

<div class={"Input" + (roomsActive ? ' with-rooms' : '')}>
    <textarea bind:value={message} placeholder="enter message here" bind:this={textarea} on:keydown={handleKeydown}/>
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