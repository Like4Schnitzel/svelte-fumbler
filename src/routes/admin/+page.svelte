<script lang="ts">
    import { page } from '$app/state';
    
    const { data, form } = $props();
</script>

<form method="POST">
    <p>Auth</p>
    <input type="text" id="username" name="username" required />
    <input type="password" id="password" name="password" required />
    <p>New user</p>
    <input type="text" id="new-username" name="new-username" required />
    <button type="submit">Upload</button>
</form>
<div class="form-response">
    {#if form?.success}
        <p>
            {form.username} can activate and set a password for their account at
            <a href={`/activate/${form.sessionId}`}>{page.url.hostname}/activate/{form.sessionId}</a>
            for the next <u>10 minutes</u>.
        </p>
    {:else if form?.message}
        <p>Error: {form.message}</p>
    {/if}
</div>
