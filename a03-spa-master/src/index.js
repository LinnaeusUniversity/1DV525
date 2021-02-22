import './js/quiz-app'
import './js/memoryGame'
import './js/chat'
// import './js/hang-index'


/*
The counter is keep updating the z-index on each window  when the user clicks on  Hangman, quiz or chat this counter keeps the new create window on top .

*/
let counter = 0
/**
 * templateHandler handling imports from the shadow templates to the main section in index html
 * event.target.tagName switches as per user click.
 */
const templateHandler = () => {
  document.querySelector('nav').addEventListener('click', event => {
    if (event.target.tagName === 'I') {
      event.target.id = event.target.parentElement.id
      console.log(event.target.parentElement.id)
    }
    switch (event.target.id) {
      case 'quiz':
        let quizApp = document.createElement('quiz-app')
        addDragAndDrop(quizApp.shadowRoot.querySelector('#quiz-app'))
        document.querySelector('#main').appendChild(quizApp)
        break
      case 'memory':
        let memoryApp = document.createElement('memory-app')
        document.querySelector('#main').appendChild(memoryApp)
        addDragAndDrop(memoryApp.shadowRoot.querySelector('#memory-app'))
        break

      case 'chat':
        let chatApp = document.createElement('chat-app')
        addDragAndDrop(chatApp.shadowRoot.querySelector('#chat-app'))
        document.querySelector('#main').appendChild(chatApp)
        break
      // case 'hangman':
      //   let hangmanApp = document.createElement('hangman-app')
      //   document.querySelector('#main').appendChild(memoryApp)
      //   addDragAndDrop(hangmanApp.shadowRoot.querySelector('#hangman-app'))
      //   console.log('hangman')
      //   break
    }
  })
}


// https://www.w3schools.com/howto/howto_js_draggable.asp
// accessed in 26 oct
// 
const addDragAndDrop = (app) => {
  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0
  // otherwise, move the DIV from anywhere inside the DIV:
  app.onmousedown = dragMouseDown

  function dragMouseDown(e) {
    // zIndex++ to increase the index so that the window is
    // focused
    app.style.zIndex = counter++
    e = e || window.event

    // get the mouse cursor position at startup
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag
  }

  /*
  * when the div is dragged, update position
  */
  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position
    app.style.top = (app.offsetTop - pos2) + 'px'
    app.style.left = (app.offsetLeft - pos1) + 'px'
  }

  /*
  * stop moving the the div on mouse up event
  */
  function closeDragElement() {
    // stop moving when mouse button is released
    document.onmouseup = null
    document.onmousemove = null
  }
}
templateHandler()
