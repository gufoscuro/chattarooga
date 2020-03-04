<script>
    import { afterUpdate } from 'svelte';

    export let messages;
    export let author;
    export let roomsActive;

    let messages_ref;
    let scrollY     = 0,
        following   = true,
        timer       = null,
        lastAuthor  = '';

    function onWindowScroll (event) {
        following = window.scrollY == scrollY
    }

    function updateScroll () {
        scrollY = (messages_ref !== undefined && messages_ref.offsetHeight > (window.innerHeight - 70)) ? 
                messages_ref.offsetHeight - (window.innerHeight - 61) : 0;
        window.scrollTo (0, scrollY)
    }

    afterUpdate (() => {
        if (following)
            updateScroll ();
    });
</script>

<svelte:window on:scroll={onWindowScroll}/>

<div class={"Messages" + (roomsActive ? ' with-rooms' : '')} bind:this={messages_ref}>
    {#each messages as m, i (m.id)}
        {#if (i === 0 || (i > 0 && m.author !== messages[i-1].author))}
            <div class={"username " + (m.author === author ? 'mine' : 'their')}>{m.author} {(m.author === author ? '(you)' : '')}</div>
        {/if}
        <div class={"clearfix " + (m.author === author ? 'mine' : 'their')}>
            <div class="message animated softZoomIn">{@html m.text !== undefined ? m.text.replace (/\n/g, '<br>') : ''}</div>
        </div>
	{/each}
</div>

<div class={"Follow animated softFadeInUp" + (following ? '' : ' active')} on:click={updateScroll}>
    <i class="far fa-arrow-down"></i> More messages below
</div>

<!-- <div class="Hud">scrolly: {scrollY}, following: {following}</div> -->

<style>
    .Hud {
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, .6);
        color: #fff;
        padding: 3px 10px;
        border-radius: 2px;
    }

    .Follow {
        position: fixed;
        bottom: 71px;
        right: 10px;
        background-color: rgba(68, 79, 94, .7);
        color: #fff;
        padding: 3px 10px;
        border-radius: 2px;
        display: none;
        cursor: default;

        -webkit-animation-duration: .2s;
        animation-duration: .2s;
    }
    .Follow:hover {
        background-color: #00cec9;
    }
    .Follow.active { display: block }

    .Messages {
        padding: 10px;
        width: 60%
    }

    .Messages.with-rooms {
        width: 80%
    }

    @media (max-width: 1000px) {
        .Messages, 
        .Messages.with-rooms {
            width: 100%
        }
    }

    .Messages :global(.message) {
        font-size: 14px;
        padding: 2px 10px;
        border-radius: 4px;
        margin-bottom: 2px;
        background-color: #74b9ff;
        color: #fff;
        -webkit-animation-duration: .2s;
        animation-duration: .2s;
    }
    .Messages :global(.username) {
        font-size: 12px;
        font-weight: 600;
    }
    .Messages :global(.username.mine) {
        text-align: right;
    }
    .Messages :global(.their) :global(.message) {
        width: 60%;
    }
    .Messages :global(.mine) :global(.message) {
        float: right;
        width: 60%;
        background-color: #00cec9;
    }
</style>