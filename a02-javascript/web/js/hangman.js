let fruits = [
  'apple',
  'banana',
  'watermelon',
  'mango',
  'kiwis',
  'cherries',
  'oranges',
  'grapes',
  'guava',
  'cantaloupe',
  'strawberries',
  'grapefruit',
  'blackberries',
  'avocados',
  'plums',
  'blueberries',
  'lemons',
  'raspberries',
  'pears',
  'pomegranate'
]

let answer = ''
let maxWrong = 6
let mistakes = 0
let guessed = []
let wordState = null
// const linkC = document.getElementById("hangTheMan")

/**
 *Get random word from the fruit array
 */
function getRandomWord() {
  answer = fruits[Math.floor(Math.random() * fruits.length)]
  console.log(answer)
  // document.getElementById('answer').innerHTML = answer
}

/**
 *Generates keyboard charachters
 */
function generateAlphabetsButtons() {
  // let buttonsHTML = 'qwertyuiopasdfghjklzxcvbnm'

  let keyboardKeys = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
      <button
        class='btn'
        id='` + letter + `'
        onClick="guessHandler('` + letter + `')"
      >
        ` + letter + `
      </button>
    `).join('')

  document.getElementById('keyboardkeys').innerHTML = keyboardKeys
}

/**
 * handles the guess char
 * @param guessedChar
 */
function guessHandler(guessedChar) {
  guessed.indexOf(guessedChar) === -1 ? guessed.push(guessedChar) : null
  document.getElementById(guessedChar).setAttribute('disabled', true)
  console.log(guessedChar)
  if (answer.indexOf(guessedChar) >= 0) {
    guessedWord()
    ifPlayerWon()
  } else if (answer.indexOf(guessedChar) === -1) {
    mistakes++
    updateMistakes()
    ifPlayerLost()
    updateHangmanState()
  }
}

/**
 * Function that checks if player is wining
 */
function ifPlayerWon() {
  if (wordState === answer) {
    document.getElementById('keyboardkeys').innerHTML = 'You Won!!!'
    document.getElementById('hangmanHangPics').src = './web/img/7.jpg'
  }
}

/**
 * Function that checks if player is losing
 */
function ifPlayerLost() {
  if (mistakes === maxWrong) {
    document.getElementById('word-dashes').innerHTML =
      'The answer was: ' + answer
    document.getElementById('keyboardkeys').innerHTML = 'You Lost!!!'
  }
}

/**
 *Splits the hidden work into number of # equivalent to the number of letters in the hidden word.
 */
function guessedWord() {
  wordState = answer
    .split('')
    .map((letter) => (guessed.indexOf(letter) >= 0 ? letter : " _ "))
    .join('')

  document.getElementById('word-dashes').innerHTML = wordState


}

/**
 *Updates if mistakes happens
 */
function updateMistakes() {
  document.getElementById('mistakes').innerHTML = mistakes
}

/**
 * Update the state of hangman
 */
function updateHangmanState() {
  document.getElementById('hangmanHangPics').src =
    './web/img/' + mistakes + '.jpg'
}
// reset function just resets the randomized word if the player wishes to skip

/**
 * reset function just resets the randomized word if the player wishes to skip
 */
function reset() {
  mistakes = 0
  guessed = []
  document.getElementById('hangmanHangPics').src = './web/img/0.png'

  getRandomWord()
  guessedWord()
  updateMistakes()
  generateAlphabetsButtons()
}
getRandomWord()
guessedWord()
generateAlphabetsButtons()
document.getElementById('max-wrong-guesses').innerHTML = maxWrong
