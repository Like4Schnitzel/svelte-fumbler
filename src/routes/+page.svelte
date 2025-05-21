<script lang="ts">
    let { data, form } = $props();
</script>

<form method="POST" enctype="multipart/form-data">
    <input type="text" id="username" name="username" required />
    <input type="password" id="password" name="password" required />
    <input type="file" id="file-upload" name="file" required />
    <button type="submit">Upload</button>
</form>
<div class="form-response">
    {#if form?.success}
        <p>File uploaded successfully!</p>
    {:else if form?.message}
        <p>Error: {form.message}</p>
    {/if}
</div>
