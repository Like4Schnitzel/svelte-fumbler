<script lang="ts">
    const { form } = $props();
    
    const hour = 1000 * 60 * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
</script>

<form method="POST" enctype="multipart/form-data">
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required />
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />
    <label for="time">Stay logged in for: </label>
    <select id="time" name="time" required>
        <option value={hour}>1 hour</option>
        <option value={day}>1 day</option>
        <option value={week}>1 week</option>
        <option value={month}>30 days</option>
    </select>
    <button type="submit">Log In</button>
</form>
{#if form?.message}
    <div class="form-response">
        <p>Error: {form.message}</p>
    </div>
{/if}

