<script>
	export let active;
</script>

<div class={"Rooms softFadeInLeft" + (active ? ' active' : '')}>
    
</div>

<style>
    .Rooms {
        position: fixed;
        background-color: #fff;
        border-right: 1px solid #d5e2ea;
        top: 0;
        left: 50px;
        width: 260px;
        height: 100%;
        z-index: 28;
        display: none;

        -webkit-animation-duration: .2s;
        animation-duration: .2s;
    }
    .Rooms.active {
        display: block;
    }
</style>