<script>
    import { createEventDispatcher } from 'svelte';
    export let rooms;
    export let joined;
    
    const dispatch = createEventDispatcher ();

    function handleClick (event, action) {
        // dispatch ('message', { action: action });
    }

    function joinRoom (event, room) {
        dispatch ('message', {
            action: 'join-room',
            roomName: room
        })
    }
</script>

<div class="Sidebar">
    <div class="logo">
        <i class="fad fa-comments-alt icn"></i>
        <span class="lbl">Chat<span>tarooga</span></span>
    </div>

    <div class="rooms">
        {#each rooms as r, i}
            <div class={"room-item" + (r === joined ? ' active' : '')} on:click={e => joinRoom (e, r)}>
                <span>#</span>{r}
            </div>
            <!-- {#if (m.type === 'system')}
                <div class="system-message">{m.text}</div>
            {:else}
                {#if (i === 0 || (i > 0 && m.author !== messages[i-1].author))}
                    <div class={"username " + (m.author === author ? 'mine' : 'their')}>{m.author} {(m.author === author ? '(you)' : '')}</div>
                {/if}
                <div class={"clearfix " + (m.author === author ? 'mine' : 'their')}>
                    <div class="message">
                        {#if (m.text.indexOf ('<pre><code') !== -1)}
                            <div class="message-code animated softFadeInUp">{@html m.text}</div>
                        {:else}
                            <div class="message-bubble animated softZoomIn">{@html m.text}</div>
                        {/if}
                    </div>
                </div>
            {/if} -->
        {/each}
    </div>
</div>



<style>
    .Sidebar {
        position: fixed;
        /* background-color: #3d5667; */
        background-color: rgb(36, 47, 60);
        width: 220px;
        height: 100%;
        z-index: 30;
    }

    .Sidebar .logo {
        line-height: 55px;
        color: #fff;
        /* text-align: center; */
        padding: 0 15px;
        font-size: 20px;
        cursor: default;
        color: #72c2ff;
    }

    .Sidebar .logo .icn {
        margin-right: 5px;
    }
    .Sidebar .logo .lbl span {
        /* color: #b9d2e2; */
        color: rgb(192, 196, 201);
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

    .Sidebar :global(.room-item) {
        color: #c0c4c9;
        font-weight: 600;
        padding: 1px 15px;
        cursor: default;
    }
    .Sidebar :global(.room-item:hover), 
    .Sidebar :global(.room-item.active) {
        background-color: #384556;
    }
    .Sidebar :global(.room-item) :global(span) {
        color: #5480a5;
        display: inline-block;
        margin-right: 5px;
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