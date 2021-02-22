console.log('chat')
const template = document.createElement('template')
template.innerHTML = `
<div id="chat-app" class="ui card">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ==" crossorigin="anonymous" />
<link rel="stylesheet" href="css/style.css">
  
  <aside id="header" class="content">
  <i class=" chat icon"></i>Chat
  <i id="chat-close" class="right floated window close outline icon link"></i>
  </aside>
  
  <aside id="chat-app-content">
    <aside id='chat-app-messages-div'>
      <aside id='chat-msg-List'>
        <template id='message'>
          <aside class='new-message'>
            <aside class='content'>
              <span class='client'></span>
              <aside class='text'></aside>
            </aside>
          </aside>
        </template> 
      </aside>
      <form class='ui reply form'>
        <aside class='field'>
          <textarea id='chat-msg-input' placeholder='Enter a message..'></textarea>
        </aside>
      </form>
    </aside>
    
    <aside id='chat-app-welc-div'>
      <aside class='ui fluid icon input'>
        <input id='chat--app-userName' type='text' placeholder='Username'>
      </aside>
      <br />
      <aside class='ui fluid icon input'>
        <input id='chat-channel' type='text' placeholder='chat Channel'>            
      </aside>
      <br />
      <aside id='chat-app-button' class='ui bottom attached button'>Enter</aside>
    </aside>
  </aside>
</aside>
`

class Chat extends window.HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    // The Node.cloneNode() method returns a duplicate of the node on which this method was called.
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    // The ShadowRoot interface of the Shadow DOM API is the root node of a DOM subtree 
    // that is rendered separately from a document's main DOM tree
    this._application = this.shadowRoot.querySelector('#chat-app')
    this.header = this.shadowRoot.querySelector('#header')
    // selects the chat-app-content
    this.chatContent = this.shadowRoot.querySelector('#chat-app-content')
    this.messagesChatDiv = this.shadowRoot.querySelector('#chat-app-messages-div')
    // selects the chat--app-userName
    this.doneBtn = this.shadowRoot.querySelector('#chat-app-button')
    this._userName = this.shadowRoot.querySelector('#chat--app-userName')
    this._chatChannel = this.shadowRoot.querySelector('#chat-channel')
    this._welcomeMsgDiv = this.shadowRoot.querySelector('#chat-app-welc-div')
    this.messageList = this.shadowRoot.querySelector('#chat-msg-List')
    // selects the chat-msg-input
    this.messageInput = this.shadowRoot.querySelector('#chat-msg-input')
    this.messages = null


    /**
     * checks first local storage and gets available 
     * user Otherwise user empty string
     * 
     */
    this.username = window.localStorage.getItem('user') === null ? '' : JSON.parse(window.localStorage.getItem('user')).username
    this.channel = window.localStorage.getItem('user') === null ? '' : JSON.parse(window.localStorage.getItem('user')).channel
    // socket for conneting the users
    this.socket = null
  }
  static get observedAttributes() {
    return ['']
  }
  changedAttributeCB(name, newValue) {
    changedAttributeCB
  }


  /**
   * connects the available user with the storage
   * if storage is empty then ask user to enter a UserName
   * 
   */
  connectedCallback() {
    this.addEventToElements()
    if (this.username === '') {
      this.welcomeScreen()
    } else {
      this.showChatWindow()
    }
  }
  // This welcome screen displaying and hide at start up 
  welcomeScreen() {
    this.messagesChatDiv.style.display = 'none'
    this.messageList.style.display = 'none'
    this._welcomeMsgDiv.style.display = ''
  }
  // this dispplays and hides existing channel
  showChatWindow() {
    this._welcomeMsgDiv.style.display = 'none'
    this.messagesChatDiv.style.display = ''
    this.messageList.style.display = ''
    this.showMessagesList()
  }
  /**
   * StoreUser is saves the user detail into local storage 
   */
  storeUser() {
    let username = ('' + this._userName.value).trim()
    let channel = ('' + this._chatChannel.value).trim()
    if (username.length > 0) {
      window.localStorage.setItem('user', JSON.stringify({
        username: (this.username = username),
        channel: (this.channel = channel)
      }))
      this.showChatWindow()
    }
  }
  /**
   * A heartbeat message is sent from web socket server
   */

  showMessage(response) {
    if (response.type !== 'heartbeat') {
      // template show message for each new message
      let templateShowMsgDiv = this.shadowRoot.querySelectorAll('#chat-msg-List template')[0].content.firstElementChild

      let message = document.importNode(templateShowMsgDiv, true)
      // iterating over all children
      Array.prototype.forEach.call(message.children[0].children, child => {
        // Assign values to each switch cases and checks all elements with t
        // their attributes.
        switch (child.getAttribute('class')) {
          case 'client': child.textContent = response.username
            break
          case 'text': child.textContent = response.data
        }
      })
      // appending each new message to the message list
      this.messageList.appendChild(message)
    }
  }

  showMessagesList() {
    // connets to server
    if (this.socket === null) {
      this.connect()
        .then(socket => this.sendText(socket))
    }
  }

  sendText(event) {
    if (event.keyCode === 13) {
      this.socket.send(JSON.stringify({
        // data property is used to send message
        type: 'message',
        data: event.target.value,
        // new username or from the local storage
        username: this.username,
        channel: this.channel,
        // Api key. 
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
      event.target.value = ''
      event.preventDefault()
    }
  }
  // server show messages and 
  connect() {
    // promise resolve or reject
    //
    return new Promise((resolve, reject) => {
      this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
      this.socket.onopen = () => resolve(this.socket)
      this.socket.onerror = () => reject(this.socket)
      this.socket.onmessage = (event) => this.showMessage(JSON.parse(event.data))
    })
  }
  // this function terminates the connection 
  close() {
    if (this.socket !== null) {
      this.socket.close()
      // closses the connection 
    }
    this._application.remove()
  }
  // Buttons and inputs are Handles below
  addEventToElements() {
    this._close = this.shadowRoot.querySelector('#chat-close')
    this._close.addEventListener('click', this.close.bind(this))
    this.doneBtn.addEventListener('click', this.storeUser.bind(this))
    this.messageInput.addEventListener('keydown', this.sendText.bind(this))
  }
}
window.customElements.define('chat-app', Chat)