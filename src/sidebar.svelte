<script>
    import { createEventDispatcher } from 'svelte';
    export let count;
    export let roomsActive;
    
    const dispatch = createEventDispatcher ();

    function handleClick (event, action) {
        dispatch ('message', { action: action });
    }
</script>

<div class="Sidebar">
    <div class="logo">
        <i class="fad fa-comments-alt"></i>
    </div>

    <div class={"navbar-btn" + (roomsActive ? ' active' : '')} on:click={(event) => handleClick (event, 'toggle-rooms')}>
        <i class="far fa-stream"></i>
    </div>

    <div class="bottom-ctrls">
        <div class="count">{count}</div>
    </div>
</div>



<style>
    .Sidebar {
        position: fixed;
        background-color: #3d5667;
        width: 50px;
        height: 100%;
        z-index: 30;
    }

    .Sidebar .logo {
        line-height: 55px;
        color: #fff;
        text-align: center;
        font-size: 20px;
        cursor: default;
        color: #72c2ff;
    }
    .Sidebar :global(.navbar-btn) {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 18px;
    }
    .Sidebar :global(.navbar-btn:hover), 
    .Sidebar :global(.navbar-btn.active) {
        background-color: #284252;
    }

    .Sidebar .bottom-ctrls {
        position: absolute;
        width: 100%;
        bottom: 0;
    }
    .Sidebar .bottom-ctrls .count {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 20px;
    }
</style>