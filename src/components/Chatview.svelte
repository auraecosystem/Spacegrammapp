<script>
  import { messages } from '../stores/messages'
</script>

<div class="chat-view">
  {#each $messages as message}
    <div class="message">
      {message}
    </div>
  {/each}
</div>

<style>
  .chat-view {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .message {
    background: #18213c;
    padding: 14px;
    border-radius: 12px;
    margin-bottom: 10px;
  }
</style>
