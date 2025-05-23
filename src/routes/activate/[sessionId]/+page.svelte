<script lang="ts">
    const { form, data } = $props();
</script>

<h1>Hello {data.username},</h1>
<p>to create your account, please enter a password. Make sure to memorize it.</p>
<form method="POST">
    <div>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />
    </div>
    <div>
        <label for="password-repeat">Repeat password</label>
        <input type="password" id="password-repeat" name="password-repeat" required />
    </div>
    <div>
        <button type="submit">Create account</button>
    </div>
</form>
{#if form?.message}
    <div class="form-response">
        <p>Error: {form.message}</p>
    </div>
{/if}

<style>
    label {
        display: inline-block;
        width: 10rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
