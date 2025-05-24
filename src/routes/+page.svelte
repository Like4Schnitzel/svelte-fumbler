<script lang="ts">
    import { page } from '$app/state';
    let { data, form } = $props();
</script>

<form method="POST" enctype="multipart/form-data">
    {#if !data.username}
        <input type="text" id="username" name="username" required />
        <input type="password" id="password" name="password" required />
    {/if}
    <input type="file" id="file-upload" name="file" required />
    <button type="submit">Upload</button>
</form>
<div class="form-response">
    {#if form?.success}
        <p>File uploaded successfully to <a href={form.path}>{page.url.hostname}{form.path}</a>!</p>
    {:else if form?.message}
        <p>Error: {form.message}</p>
    {/if}
</div>
