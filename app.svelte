<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";

  let msg = "";
  let chat = [];
  let aiInput = "";

  async function send() {
    const res = await invoke("send_message", { msg });
    chat = [...chat, res];
    msg = "";
  }

  async function askAI() {
    const res = await invoke("chat", { input: aiInput });
    chat = [...chat, res];
    aiInput = "";
  }
</script>

<h1>Spacegramm Web4 Node</h1>

<h2>Messaging</h2>
<input bind:value={msg} />
<button on:click={send}>Send</button>

<h2>AI</h2>
<input bind:value={aiInput} />
<button on:click={askAI}>Ask AI</button>

<h2>Log</h2>
{#each chat as c}
  <p>{c}</p>
{/each}
