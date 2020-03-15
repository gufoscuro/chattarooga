<script>
    import { createEventDispatcher } from 'svelte';
    export let username;
    export let active;
    
    let visible = true;

    const dispatch = createEventDispatcher ();

    function handleClick (event, action) {
        dispatch ('login');
        active = false;
        setTimeout (() => {
            visible = false;
        }, 300)
    }
</script>

<div class={"Login" + (active ? ' active' : '') + (visible ? ' visible' : '')}>
    <div class="pane">
        <div class="welcome">
            <div>You are</div>
            <div class="username">{username}</div>
        </div>
        <button class="btn btn-primary login-btn" on:click={handleClick}>Let's go!</button>
    </div>
</div>

<style>
    .Login {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        /* background-color: rgba(60, 75, 84, 0.9); */
        background-color: rgba(255, 255, 255, .9);

        -webkit-transform: scale(2);
        -moz-transform: scale(2);
        -ms-transform: scale(2);
        transform: scale(2);
        opacity: 0;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        display: none;
        z-index: 29;
    }

    .Login .pane {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        /* color: #fff; */
    }

    .Login .welcome {
        font-size: 20px;
        margin-bottom: 20px;
    }

    .Login .welcome .username {
        font-size: 38px;
        font-weight: 600;
    }

    .Login .room-field {
        border: none;
        border-bottom: 1px solid #a4b9bf;
        outline: none;
        padding: 10px 20px;
    }

    .Login .login-btn {
        padding: .375rem 1.95rem;
        font-size: 19px;
    }

    .Login.active {
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        transform: scale(1);
        opacity: 1;
    }
    .Login.visible {
        display: block;
    }
</style>