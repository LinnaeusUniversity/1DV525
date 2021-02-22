// 'http://courselab.lnu.se/question/1'
const template = document.createElement('template')
{
  /* <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"> */
}
// <i id="quizAppTerminate" class="left floated lock icon link"></i>
template.innerHTML = `
<aside id="quiz-app" class="ui card">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ==" crossorigin="anonymous" />
<link rel="stylesheet" href="css/style.css">

  <aside id="header" class="content">
  <i class="question circle icon"></i>Quiz App
  <i  id="quizAppTerminate" class=" right floated window close outline icon"></i>
  </aside>
  <aside id="quiz-content">
    <h1></h1>
    
    <label id="timer" type="text"></label>
    <p id="questionQuiz"></p>
    <p id="messageReply"></p>
    <form> 
      <aside id="answerSection">
        <label class="textLabel">
        <input type="text" id="inputText">            
        </label>
      </aside>
      <aside id="radioBtnAlternatives">  
        <input type="radio" class="radios" id="radio1" value="alt1">    
        <label class="radios" id="radioLabel1"></label>
        <input type="radio" class="radios" id="radio2" value="alt2">
        <label class="radios" id="radioLabel2"></label>
        <input type="radio" class="radios" id="radio3"  value="alt3">
        <label class="radios" id="radioLabel3"></label>
        <input type="radio" id="radio4" value="alt4">
        <label id="radioLabel4"></label>
      </aside>   
      <aside id="high-score">
        <h1>High-Scores</h1>
        <ol>
          <li>--</li><li>--</li><li>--</li><li>--</li><li>--</li>
        </ol>
      </aside> 
      <aside id="game-over">
        <button id="restart-btn">Close</button>
      </aside>
    <button id="btn" type="button"></button> 
    </form>
  </aside>
</aside>
`

class Quiz extends window.HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
// The Node.cloneNode() method returns a duplicate of the node on which this method was called.

    this._header = this.shadowRoot.querySelector('#header')
    this._title = this.shadowRoot.querySelector('h1')
    this._question = this.shadowRoot.querySelector('p')
    this._message = this.shadowRoot.querySelector('p')//****** */
    this.userAnswer = ''
    this.isfirstQuestion = true
    this.username = ''
    this.response = ''
    this.alternatives = null
    this._button = this.shadowRoot.querySelector('#btn')
    this._inputText = this.shadowRoot.querySelector('#inputText')
    this.scoreboard = this.shadowRoot.querySelector('#high-score')
    this._reset = this.shadowRoot.querySelector('#game-over')
    this._url = 'http://courselab.lnu.se/question/1'

    this.totalTime = 20
    this.countdown = this.totalTime
    this.timeUsed = 0
    this._timer = this.shadowRoot.querySelector('#timer')
    this._interval = null

    this._app = this.shadowRoot.querySelector('#quiz-app')
  }
  static get observedAttributes() {
    return ['src']
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      this._url = newValue
    }
  }
  /**
   * @param  {} {this.welcomeScreen(
   * @param  {} this._button.addEventListener('click'
   * @param  {} asynce=>{if(this.isfirstQuestion
   * @param  {} {this.getUsername(
   * @param  {} this.updateQuestionView(
   * @param  {} return}this.getAnswer(
   * @param  {} this.getResponse(
   * @param  {} }
   * @param  {} this.addEventToElements(
   */
  connectedCallback() {
    this.welcomeScreen()
    this._button.addEventListener('click', async e => {
      if (this.isfirstQuestion) {
        this.getUsername()
        this.updateQuestionView()
        return
      }
      this.getAnswer()
      this.getResponse()
    })
    this.addEventToElements()
  }

  async updateQuestionView() {
    this.response = await this.loadUrl()
    this._question.innerText = this.response.question
    if (this.response.alternatives) {
      this.showAlternatives()
    } else {
      this.showTextbox()
    }
    this.startTimer()
    this.clearBox()
  }
       // The Node.cloneNode() method returns a duplicate of the node on which this method was called.

// if there are multiple choice or alternavtive a the end of the documents
  async loadUrl(url) {
    let fetcher = await window.fetch(`${this._url}`)
    fetcher = await fetcher.json()
    if (fetcher.nextURL) {
      this._nextUrl = fetcher.nextURL
     
    } else {
      this.isfirstQuestion = false
      this.gameOver()
    }
    return fetcher
  }

  /**
   * copied from mozilla web.
   */
  /**
   * @param  {} {this.stopTimer(
   * @param  {} returnwindow.fetch(`${this.response.nextURL}`
   * @param  {'POST'} {method
   * @param  {{'Content-Type':'application/json;charset=utf-8'}} headers
   * @param  {JSON.stringify({answer:this.userAnswer}} body
   */
  getResponse() {
    this.stopTimer()
    return window.fetch(`${this.response.nextURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ answer: this.userAnswer })
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          console.log('wrong answer buddy')
          throw new Error(`HTTP error! status: ${this.response}`)
        }
      })
      .then(data => {
        this.response = data
        this._url = this.response.nextURL
        if ((this.response = data).nextURL) {
          this.updateQuestionView()
        } else {
        
          this.gameOver()
        }
      })
      .catch(() => this.gameOver())
  }
 /**
   * An array of all its children of radio container.
   * if radio is checked assign that value and terminate the loop
   * 
   * 
   */
  getAnswer() {
    if (this.response.alternatives) {
      let parent = this.shadowRoot.querySelector('#radioBtnAlternatives').children
      Array.from(parent).some((element) => {
        if (element.checked) {
          console.log('getRadioAnswer:' + element.value)
          this.userAnswer = element.value
          return true
        } else return false
      })
    } else {
      this.userAnswer = this._inputText.value
    }
  }
  /**
   * @param  {} {this._header.style.display=''this.hideAlternatives(
   */
  welcomeScreen() {
    this._header.style.display = ''
    this.hideAlternatives()
    this._reset.style.display = 'none'
    this.scoreboard.style.display = 'none'
    this._question.innerText = 'Enter your name'
    this._button.innerText = 'Continue'
    this._inputText.style.display = ''
  }
  /**
   */
  getUsername() {
    this.username = this._inputText.value
    this._title.innerText = `${this.username} is Playing!`
    this.isfirstQuestion = false
  }
  clearBox() {
    this._inputText.value = ''
  }
  hideAlternatives() {
    let parent = this.shadowRoot.querySelector('#radioBtnAlternatives')
    Array.from(parent.children).forEach((radio) => {
      radio.style.display = 'none'
    })
  }
  hideTextbox() {
    this._inputText.style.display = 'none'
  }
  showTextbox() {
    this._inputText.style.display = 'block'
    this.hideAlternatives()
  }
  /**
   * @param  {} {letshowRadio=this.shadowRoot.querySelector('#radioLabel1'
   * @param  {} showRadio.style.display=''showRadio.innerText=this.response.alternatives.alt1showRadio=this.shadowRoot.querySelector('#radioLabel2'
   * @param  {} showRadio.style.display=''showRadio.innerText=this.response.alternatives.alt2showRadio=this.shadowRoot.querySelector('#radioLabel3'
   * @param  {} showRadio.style.display=''showRadio.innerText=this.response.alternatives.alt3if(this.response.alternatives.alt4
   * @param  {} {showRadio=this.shadowRoot.querySelector('#radioLabel4'
   * @param  {} showRadio.style.display=''showRadio.innerText=this.response.alternatives.alt4}letparent=this.shadowRoot.querySelector('#radioBtnAlternatives'
   * @param  {} Array.from(parent.children
   * @param  {} .forEach((radio
   * @param  {} =>{radio.style.display=''radio.checked=falseif(!this.response.alternatives.alt4
   * @param  {} {showRadio=this.shadowRoot.querySelector('#radio4'
   * @param  {} showRadio.style.display='none'showRadio=this.shadowRoot.querySelector('#radioLabel4'
   * @param  {} showRadio.style.display='none'}}
   * @param  {} this.hideTextbox(
   */
  showAlternatives() {
   
    let showRadio = this.shadowRoot.querySelector('#radioLabel1')
    showRadio.style.display = ''
    showRadio.innerText = this.response.alternatives.alt1
    showRadio = this.shadowRoot.querySelector('#radioLabel2')
    showRadio.style.display = ''
    showRadio.innerText = this.response.alternatives.alt2
    showRadio = this.shadowRoot.querySelector('#radioLabel3')
    showRadio.style.display = ''
    showRadio.innerText = this.response.alternatives.alt3
    if (this.response.alternatives.alt4) {
      showRadio = this.shadowRoot.querySelector('#radioLabel4')
      showRadio.style.display = ''
      showRadio.innerText = this.response.alternatives.alt4
    }
  
    let parent = this.shadowRoot.querySelector('#radioBtnAlternatives')
    Array.from(parent.children).forEach((radio) => {
      radio.style.display = ''
      radio.checked = false
      if (!this.response.alternatives.alt4) {
        showRadio = this.shadowRoot.querySelector('#radio4')
        showRadio.style.display = 'none'
        showRadio = this.shadowRoot.querySelector('#radioLabel4')
        showRadio.style.display = 'none'
      }
    })
    this.hideTextbox()
  }

//  when you answered all the question then socre board
  // will be displayed
  gameOver() {
    this.stopTimer()
    if (!this.response.nextURL) {
      this.getScoreBoard()
      this._reset.style.display = ''
    } else {
      // hide all unnecessary stuff
      this._timer.textContent = ''
      this._button.style.display = 'none'
      this._question.style.display = 'none'
      this.hideTextbox()
      this.hideAlternatives()
      this._title.innerText = 'nice try but you lost try again'
      this._reset.style.display = ''
    }
  }
  
  // hide the score board until the user wins the game
  // if the user answer all the question. the user total time, high-score list with 5 fastest time 
  // will be displayed. all of these files are stored in local storage
  getScoreBoard() {
    // hide all unnecessary stuff
    this._title.innerText = `${this.username} Finished!`
    this.hideAlternatives()
    this._timer.style.display = 'none'
    this._question.style.display = 'none'
    this._button.style.display = 'none'
    // source: https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
    let users = JSON.parse(window.localStorage.getItem('users')) === null ? [] : JSON.parse(window.localStorage.getItem('users'))
    users.push({ name: this.username, score: this.timeUsed })
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    users.sort((u1, u2) => {
      return u1.score - u2.score
    })
    users.splice(5, 1)
    this.elements = this.shadowRoot.querySelectorAll('#high-score ol li')
    users.forEach((user, row) => {
      this.elements[row].textContent = user.name + ': ' + user.score + ' seconds'
    })
    this.scoreboard.style.display = ''
    window.localStorage.setItem('users', JSON.stringify(users))
  }

  startTimer() {
    this._timer.textContent = (this.countdown = this.totalTime)
    this._interval = setInterval(() => {
      this._timer.textContent = --this.countdown
      if (this.countdown <= 0) {
        this.gameOver()
      }
    }, 1000)
  }

  // stops the timmer, for infinite looping
  stopTimer() {
    clearInterval(this._interval)
    this.timeUsed += this.totalTime - this.countdown
  }

  close() {
    if (this._interval !== null) {
      this.stopTimer()
    }

    this._app.remove()
  }
  /**
   * @param  {} {this._close=this.shadowRoot.querySelector('#quizAppTerminate'
   * @param  {} this._close.addEventListener('click'
   * @param  {} this.close.bind(this
   */
  addEventToElements() {
    this._close = this.shadowRoot.querySelector('#quizAppTerminate')
    this._close.addEventListener('click', this.close.bind(this))
  }
}

window.customElements.define('quiz-app', Quiz)
