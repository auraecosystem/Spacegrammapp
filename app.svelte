<script lang="ts">
  import { sendMessage } from "./lib/api";

  let input = "";
  let log: string[] = [];

  async function send() {
    const res = await sendMessage("user", input);
    log = [...log, res];
    input = "";
  }
</script>

<main>
  <h1>Spacegramm</h1>

  <input bind:value={input} placeholder="Type message..." />
  <button on:click={send}>Send</button>

  <div>
    {#each log as item}
      <p>{item}</p>
    {/each}
  </div>
</main>

<style>
  main {
    font-family: sans-serif;
    padding: 20px;
  }
</style>
