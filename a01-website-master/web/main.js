let fruits = [
  "Apple",
  "Banana",
  "Watermelon",
  "Mangos",
  "Kiwis",
  "Cherries",
  "Oranges",
  "Grapes",
  "Guava",
  "Cantaloupe",
  "Strawberries",
  "Grapefruit",
  "Blackberries",
  "Avocados",
  "Plums",
  "Blueberries",
  "Lemons",
  "Raspberries",
  "Pears",
  "Pomegranate",
];
console.log(" The list contains : " + fruits.length + " elements");

let getRandomArrayIndex;
let word;
let countVowelsConsnats;
let answer;

// get randomized word from the array list
function randomizedFruitLists() {
  getRandomArrayIndex = Math.floor(
    Math.random() * Math.floor(fruits.length + 1)
  );
  word = fruits[getRandomArrayIndex];
  return word;
}

function getRandomWordFunction() {
  randomizedFruitLists();
  countVowelsConsnats = word;
  document.getElementById(
    "fruit-lists-uppercase"
  ).innerText = word.toUpperCase();

  document.getElementById(
    "fruit-lists-lowercase"
  ).innerText = word.toLowerCase();

  document.getElementById("string-length").innerText = word.length;

  document.getElementById("string-vowels").innerText = vowelsConsnats();

  document.getElementById("string-consonants").innerText =
    word.length - vowelsConsnats();
  ifCharachterExsits();
}

function vowelsConsnats() {
  let vowels = 0;
  for (let i = 0; i < countVowelsConsnats.length; i++) {
    // if (countVowelsConsnats[i] === 'a' || countVowelsConsnats[i] === 'e' || countVowelsConsnats[i] === 'i' || countVowelsConsnats[i] === 'o' || countVowelsConsnats[i] === 'u') {
    //   vowels += 1;
    // }
    if (
      countVowelsConsnats.charAt(i) === "a" ||
      countVowelsConsnats.charAt(i) === "e" ||
      countVowelsConsnats.charAt(i) === "i" ||
      countVowelsConsnats.charAt(i) === "o" ||
      countVowelsConsnats.charAt(i) === "u"
    ) {
      vowels++;
    } else {
    }
  }
  return vowels;
}
// checks if the user input matches the randomized word
function ifCharachterExsits() {
  // randomizedFruitLists();
  // console.log(word);
  let firstChar = document.getElementById("get-char").value.toLowerCase();
  // console.log(firstChar + ':user input');

  for (let i = 0; i < word.length; i++) {
    if (word.length !== null)
      if (word.charAt(i) === firstChar) {
        answer = "Yes";
        // console.log(word);
        break;
      } else {
        // console.log(word);
        answer = "No";
      }
  }

  console.log(answer);
  const str = word;
  let newLenght;
  let foundIndiceArray = [];
  let count = 0;
  let position = str.length;
  // console.log(position + ' position')
  for (let i = 0; i < position; i++) {
    if (firstChar === word[i]) {
      newLenght = foundIndiceArray.push(i);
      count++;
    }
  }
  document.getElementById("answer").innerText = answer.toUpperCase();

  document.getElementById("randomizedWord").innerText = word;
  document.getElementById("charaters-hit").innerText = foundIndiceArray;

  document.getElementById("characters-count").innerText =
    foundIndiceArray.length;
}
