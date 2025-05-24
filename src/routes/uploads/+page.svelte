<script lang="ts">
    import FilePreview from '$lib/FilePreview.svelte';

    const { data, form } = $props();
</script>

{#if data.fileNamesWithMimeTypes === undefined && form?.fileNamesWithMimeTypes === undefined}
    <p>Please authenticate yourself</p>
    <form method="POST">
        <input type="text" id="username" name="username" placeholder="Username" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Authenticate</button>
    </form>
{:else if data.fileNamesWithMimeTypes !== undefined}
    {#each data.fileNamesWithMimeTypes as fileNameWithMimeType}
        <div>
            <FilePreview enterDeletePassword={false} url={`/${data.username}/${fileNameWithMimeType.fileName}`} mimeType={fileNameWithMimeType.mimeType} />
        </div>
    {/each}
{:else if form?.fileNamesWithMimeTypes !== undefined}
    {#each form.fileNamesWithMimeTypes as fileNameWithMimeType}
        <div>
            <FilePreview enterDeletePassword url={`/${form.username}/${fileNameWithMimeType.fileName}`} mimeType={fileNameWithMimeType.mimeType} />
        </div>
    {/each}
{/if}
