<script lang="ts">
    export let url: string;
    export let mimeType: string;
    export let enterDeletePassword: boolean;

    const fileName = url.split("/").pop() || "File";
</script>

<h1>{fileName}</h1>
<form method="POST" action={`${url}/delete`}>
    {#if enterDeletePassword}
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
    {/if}
    <button type="submit">Delete</button>
</form>
{#if mimeType?.startsWith("image/")}
    <!-- svelte-ignore a11y_missing_attribute -->
    <img src={url} />
{:else if mimeType?.startsWith("video/")}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video controls>
        <source src={url} />
    </video>
{:else if mimeType?.startsWith("audio/")}
    <audio controls>
        <source src={url} />
    </audio>
{:else if mimeType?.startsWith("text/")}
    <!-- svelte-ignore a11y_missing_attribute -->
    <iframe
        src={url}
        style="width: 100%; height: 100%; border: none;"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="clipboard-write"
    ></iframe>
{/if}

