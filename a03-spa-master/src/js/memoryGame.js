/**
 * These are the requirements for the Memory application that should exists as a window application in the PWD.

The user should be able to open and play multiple memory games simultaneously.

The user should be able to play the game using only the keyboard.

One, by you decided, extended feature
 */
const template = document.createElement('template')
template.innerHTML = `
<aside id="memory-app" class="ui card">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ==" crossorigin="anonymous" />
<link rel="stylesheet" href="css/style.css">

  <aside id="header" class="content">
    <i class=" gamepad icon"></i>Memory
    <i  id="quizAppTerminate" class=" right floated window close outline icon"></i>
  </aside>
  <aside id='memory-content' class='content center'>
  <h1>You have 30 seconds to finish</h1>
    <label id="timer" type="text"></label>
    <aside id="memory-images">
      <template id="image">
        <a href="#"><img src="image/0.png" alt="question brick pic" /></a>
        <h2>You have 30 seconds to finish</h2>
        <label id="timer" type="text"></label>
      </template>
    </aside>
  </aside>
</aside>
`

class Memory extends window.HTMLElement {
  /**
   * @param  {} {super(
   * @param  {'open'}} this.attachShadow({mode
   */
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._application = this.shadowRoot.querySelector('#memory-app')
    this.header = this.shadowRoot.querySelector('#header')
    this.content = this.shadowRoot.querySelector('#memory-content')
    this._imgs = this.shadowRoot.querySelector('#memory-images')
    this._hideImgs = this.shadowRoot.querySelector('#memory-images')

    this.titles = []
  }
  /**
   */
  static get obsAttributes() {
    return ['']
  }
  /**
   * @param  {} {this.addEventToElements(
   * @param  {} this.buildMemoryBoard(4
   * @param  {} 4
   * @param  {} this._imgs
   */
  connectedCallback() {
    this.addEventToElements()
    this.buildMemoryBoard(4, 4, this._imgs)
  }
  changedAttributeCB(name, newValue) {
  }

  /**
   * @param  {} rows
   * @param  {} columns
   * @param  {} container
   */
  buildMemoryBoard(rows, columns, container) {
    var a
    var turn1
    var turn2
    var lastTitle
    var pairs = 0
    var tries = 0
    // given time to finish to reveal the puzzles
    var totalTime = 30
    var countdown = totalTime
    var interval = null
    /**
     * @param  {} rows
     * @param  {} columns
     * @param  {} lettemplateDiv=this.shadowRoot.querySelectorAll('#memory-imagestemplate'
     * @param  {} [0].content.firstElementChildletdiv=document.importNode(templateIndex
     * @param  {} false
     */
    this.titles = this.getImagesArr(rows, columns)
    /**
     * Import template index file at 0 p.
     * and keep separet each memory game from each other
     */
    let templateIndex = this.shadowRoot.querySelectorAll('#memory-images template')[0].content.firstElementChild
    let div = document.importNode(templateIndex, false)
/**
 * 
 * Winer and game over related features
 * 
 */


    let title = this.shadowRoot.querySelector('h1')
    title.innerText = 'You have 30secs'
    let timer = this.shadowRoot.querySelector('#timer')
    timer.textContent = (countdown = totalTime)
    interval = setInterval(() => {
      timer.textContent = --countdown
      // when time is over the user cannot play any longer
      if (countdown <= 0) {
        clearInterval(interval)
        // clear the timer
        timer.textContent = ''
        title.innerText = 'Time is up and Game Over'
        this.hideTextbox()
      }
    }, 1000)
    /**
     * @param  {} function(tile
     * @param  {} index
     */
    /**
     * loop title from 0 to 15 title and assign values for each image index
     */
    this.titles.forEach(function (tile, index) {
      a = document.importNode(templateIndex, true)
      /**
       * @param  {} a
       * @param  {} a.addEventListener('click'
       */
      div.appendChild(a)
      a.addEventListener('click', function (event) {
        event.preventDefault()
        var img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild

        turnBrick(tile, index, img)
      })
      if ((index + 1) % columns === 0) {
        div.appendChild(document.createElement('br'))
      }
    })
    container.appendChild(div)
    /**
     * @param  {} tile
     * @param  {} index
     * @param  {} img
     * @param  {} {if(turn2
     */
    function turnBrick(tile, index, img) {
      if (turn2) { return }
      img.src = 'image/' + tile + '.png'
      // firts brick image is clicked
      if (!turn1) {
        turn1 = img
        lastTitle = tile
        // second brick image is clicked
      } else {
        if (img === turn1) { return }
        tries += 1
        turn2 = img
        if (tile === lastTitle) {
          // found the the match
          pairs += 1

          // condition win: all pairs matched
          if (pairs === (columns * rows) / 2) {
            clearInterval(interval)
            title.innerText = 'Finished on ' + tries + ' number of tries'
            timer.textContent = ''
          }
          /**
           * removes the match pair
           */
          window.setTimeout(function () {
            turn1.parentNode.classList.add('removed')
            turn2.parentNode.classList.add('removed')
            turn1 = null
            turn2 = null
          }, 300)
        } else {
          // if not matched then turn them back to its position hide it
          window.setTimeout(function () {
            turn1.src = 'image/0.png'
            turn2.src = 'image/0.png'

            turn1 = null
            turn2 = null
          }, 500)
        }
      }
    }
  }

  hideTextbox() {
    this._hideImgs.style.display = 'none'
  }

  getImagesArr(rows, columns) {
    var array = []
    var i
    // puts an image twice in the array
    for (i = 1; i <= (rows * columns) / 2; i += 1) {
      array.push(i)
      array.push(i)
    }
    // Shuffling the images
    for (i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  close() {
    this._application.remove()
  }

  addEventToElements() {
    this._close = this.shadowRoot.querySelector('#quizAppTerminate')
    this._close.addEventListener('click', this.close.bind(this))
  }
}
window.customElements.define('memory-app', Memory)
