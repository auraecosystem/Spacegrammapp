<script>
  import { messages } from '../stores/messages'

  let text = ''

  function send() {
    if (!text) return

    messages.update(m => [...m, text])
    text = ''
  }
</script>

<div class="input">
  <input bind:value={text} placeholder="Message..." />

  <button on:click={send}>
    Send
  </button>
</div>

<style>
  .input {
    display: flex;
    padding: 20px;
    background: #11182d;
  }

  input {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #18213c;
    color: white;
  }

  button {
    margin-left: 10px;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    background: #4b7cff;
    color: white;
  }
</style>
