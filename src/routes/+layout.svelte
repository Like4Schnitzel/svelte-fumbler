<script lang="ts">
    const { children, data } = $props();
</script>

<div class="main">
    <div>
        {#if data.username}
            <span>Logged in as <b>{data.username}</b>.</span>
            <form method="POST" action="/logout">
                <button type="submit">Log out</button>
            </form>
        {:else}
            <span><a href="/login">Log in</a></span>
        {/if}
    </div>
    <div>
        {@render children()}
    </div>
</div>

<style>
    .main {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    form {
        display: flex;
        flex-direction: row-reverse;
    }
</style>
