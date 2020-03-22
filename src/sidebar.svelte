<script>
    import { getContext, createEventDispatcher } from 'svelte';
    import { fly, scale, fade, slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    

    export let rooms;
    export let joined;

    let createRoomFlow = false
    let createRoomControls = false
    let newRoomName = ''
    
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

    function createRoom (event) {
        createRoomFlow = true;
    }

    function doCreateRoom () {
        let roomName = newRoomName;
        newRoomName = '';
        createRoomFlow = false;
        
        dispatch ('message', {
            action: 'join-room',
            roomName: roomName
        })
    }

    const showPopupCustom = () => {
		open (AddRoom, {
				message: "It's a customized popup!"
		    },
		    {
				styleBg: {
					background: 'rgba(200, 255, 0, 0.66)'
				},
				styleWindow: {
					border: '2px solid #00beff',
					boxShadow: 'inset 0 0 0 2px white, 0 0 0 2px white',
					background: '#ff7000'
				},
				styleContent: {
					color: '#9500ff',
					fontFamily: 'Comic Sans',
					fontStyle: 'italic'
				},
				transitionWindow: fly,
				transitionWindowProps: {
					y: 100
				},
			}
		);
	};
</script>



<div class="Sidebar">
    <div class="logo">
        <i class="fad fa-rocket icn"></i>
        <span class="lbl">Chat<span>tarooga</span></span>
    </div>

    <div class="rooms">
        {#each rooms as r, i}
            <div class={"room-item" + (r === joined ? ' active' : '')} on:click={e => joinRoom (e, r)}>
                <span>#</span>{r}
            </div>
        {/each}

        <div class="room-item add-room" on:click={e => { createRoomFlow = true }}>
            <span>+</span>Create Room
        </div>
    </div>
</div>


{#if (createRoomFlow)}
    <div class="Modal" transition:fade={{ delay: 0, duration: 300, opacity: 0, easing: cubicOut }}>
        <div class="PanelHolder">
            <div class="" transition:fly={{ delay: 0, duration: 300, y: 500, opacity: 0.5, easing: cubicOut }}>
                <div transition:scale={{ delay: 0, duration: 300, easing: cubicOut }} on:introend={() => { createRoomControls = true }}>
                    <div class="Panel">
                        <div class="heading">Create Room</div>
                        <input type="text" class="textfield" bind:value={newRoomName} placeholder="The room name"/>
                    </div>
                    {#if (createRoomControls)}
                        <div class="Controls" transition:slide={{ delay: 100, duration: 300 }}>
                            <button class="btn btn-sm btn-danger" on:click={(e) => { createRoomFlow = false; newRoomName = '' }}>
                                Cancel
                            </button>
                            <button class="btn btn-sm btn-primary" on:click={(e) => doCreateRoom()}>Create Room</button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}



<style>
    .Sidebar {
        position: fixed;
        /* background-color: #3d5667; */
        background-color: #2c3d4c;
        width: 220px;
        height: 100%;
        z-index: 30;
    }

    .Sidebar .logo {
        padding: 15px 15px 10px;
        line-height: 55px;
        color: #fff;
        /* text-align: center; */
        font-size: 20px;
        cursor: default;
        color: #72c2ff;
        
        -webkit-user-select: none;
        -webkit-app-region: drag;
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

    .Sidebar :global(.room-item.add-room) {
        margin-top: 10px;
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


    .Modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(140, 165, 181, 0.8);
        z-index: 31;
    }
    .Modal .PanelHolder {
        position: absolute;
        width: 400px;
        top: 48%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 3px;
        z-index: 3;
    }
    .Modal :global(.Panel) {
        background-color: #fff;
        /* min-height: 200px; */
        padding: 20px;
    }

    .Modal :global(.heading) {
        font-size: 20px;
        line-height: 20px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .Modal :global(.textfield) {
        min-width: 250px;
        outline: none;
        padding: 2px 0 3px;
        background-color: #0000;
        border: none;
        border-bottom: 1px solid #bdcdd2;
    }

    .Modal .Controls {
        margin-top: 10px;
    }
</style>