<script>
  import Sidebar from './components/Sidebar.svelte'
  import ChatView from './components/ChatView.svelte'
  import MessageInput from './components/MessageInput.svelte'
</script>

<div class="app">
  <Sidebar />

  <div class="chat-area">
    <ChatView />
    <MessageInput />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #0b1020;
    color: white;
    font-family: sans-serif;
  }

  .app {
    display: flex;
    height: 100vh;
  }

  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
