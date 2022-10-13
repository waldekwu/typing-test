const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const userInput = document.getElementById("userInput");
const messageEle = document.getElementById("message");
const speedEle = document.getElementById("speed");
const quoteEle = document.getElementById("quote");
const greetEle = document.getElementById("greetUser");

const nameModalEle = document.querySelector(".nameModal");
const levelModalEle = document.querySelector(".levelModal")

nameModalEle.style.display = 'none';
levelModalEle.style.display = 'none';
userInputBox.style.display = 'none';
messages.style.display = 'none';
resetBtn.style.display = 'none';
startBtn.style.display = 'none';

let extracted_words = [];
let words = "";
let wordIndex = 0, extracted_words_length = 0, quoteLength = 0;
let startTime = Date.now();

// To encode the string
function htmlEncode(str) {
    return String(str).replace(/[^\w. ]/gi, function(c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
  }

// generating words
const makeword = (length) => {
    let result = '';
    let level = getAndSetLevel();
    let characters = characters_dict[level];
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const getAndSetLevel = () => {
    return document.querySelector('input[name="levelForm"]:checked')?.value || "one";
}

const characters_dict = {
    "one" : "abcdefghijklmnopqrstuvwxyz",
    "two" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "three" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
}

// making the quote from the words
const makequote = () => {
    const characters = '123456789';
    quoteLength = characters.charAt(Math.floor(Math.random() * characters.length));
    quoteLength = Number(quoteLength);

    for (let i = 0; i < quoteLength; i++) {
        words += makeword(Math.floor(Math.random() * 10) + 1) + " ";
    }
    words_length = words.length;
    return words;
};

// start the typing game
startBtn.addEventListener("click", () => {
    const quote = makequote();
    extracted_words = quote.split(' ');
    extracted_words_length = extracted_words.length;
    wordIndex = 0;

    userInputBox.style.display = 'block';
    userInput.style.display = 'inline';
    startBtn.style.display = 'none';
    levelModalEle.style.display = "none";
    resetBtn.style.display = 'inline-block';

    const spanWords = extracted_words.map(word => {
        return `<span>${word} </span>`;
    });
    quoteEle.innerHTML = spanWords.join('');
    quoteEle.childNodes[0].className = 'highlight';
    userInput.innerText = '';
    userInput.focus();
    startTime = new Date().getTime();
});

// change the highlight class to the next word on user input
userInput.addEventListener('input', () => {
    const curWord = extracted_words[wordIndex];
    const input = userInput.value;

    if (input === curWord && wordIndex === (extracted_words.length - 2)) {
        const timeTaken = (new Date().getTime() - startTime) / 1000;
        const speed_char = words.length / timeTaken;
        const speed_word_pm = Math.ceil(extracted_words.length / (timeTaken / 60));
        const message = `Congratulations! You have typed in ${timeTaken} seconds`;
        const speedMessage = `Your speed is ${speed_word_pm} words per minutes OR ${speed_char.toFixed(3)} characters per second`;
        messages.style.display = 'inline';
        messageEle.innerText = message;
        speedEle.innerText = speedMessage;
        userInput.style.display = 'none';
        saveHistory();
    }
    else if (input.endsWith(' ') && input.trim() === curWord) {
        userInput.value = '';
        wordIndex++;
        for (const wordEle of quoteEle.childNodes) {
            wordEle.className = '';
        }
        quoteEle.childNodes[wordIndex].className = 'highlight';
    }
    else if (curWord.startsWith(input)) {
        userInput.className = '';
    }
    else {
        userInput.className = 'error';
    }
});

// Reset the typing game
resetBtn.addEventListener("click", () => {
    startBtn.style.display = 'block';
    resetBtn.style.display = 'none';
    quoteEle.innerText = "";
    words = "";
    userInput.value = '';
    userInput.style.display = 'none';
    userInputBox.style.display = 'none';
    messages.style.display = 'none';
})

// Popup to ask for Name of user 
// if not entered before & display name from local Storage

const nameInput = document.getElementById("userName");
const nameSubmitBtn = document.getElementById("nameSubmitBtn");

const getAndSetUserName = () => {
    const name = localStorage.getItem("typerName");
    if (name) {
        greetEle.innerText = `Hello, ${name}!`;
        startBtn.style.display = "block";
        levelModalEle.style.display = "block";
    }
    else {
        nameModalEle.style.display = "block";
    }
};

nameSubmitBtn.addEventListener("click", () => {
    console.log(nameInput.value);
    if (nameInput.value != null && nameInput.value != "") {
        localStorage.setItem("typerName", nameInput.value);
        nameModalEle.style.display = "none";
        startBtn.style.display = "block";
        levelModalEle.style.display = "block";
        getAndSetUserName();
    }
    else {
        console.log("Enter Username");
    }
})

getAndSetUserName();

let history = [];
let historyArray = [];

// History Saver
const saveHistory = () => {
    history = localStorage.getItem("typerHistory");
    if (history) {
        historyArray = JSON.parse(history);
        historyArray.push({ extracted_words_length, words_length, timeTaken: (new Date().getTime() - startTime) / 1000 });
        localStorage.setItem("typerHistory", JSON.stringify(historyArray));
    }
    else {
        localStorage.setItem("typerHistory", JSON.stringify([{ extracted_words_length, words_length, timeTaken: (new Date().getTime() - startTime) / 1000 }]));
    }
    showHistory();
}

// History Viewer
const historyBody = document.getElementById("historyTableBody");

const showHistory = () => {
    history = localStorage.getItem("typerHistory");
    userName = localStorage.getItem("typerName");
    if (history != null) {
        document.getElementsByClassName("history")[0].style.display = "block";
        historyArray = JSON.parse(history);
        historyBody.innerHTML = "";
        historyArray.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${htmlEncode(userName)}</td><td>${Math.ceil(item.extracted_words_length / (item.timeTaken / 60))}</td><td>${item.timeTaken}</td>`;
            historyBody.appendChild(row);
        });
    }
    else {
        document.getElementsByClassName("history")[0].style.display = "none";
    }
};

showHistory();

// History Reset Button
const historyResetBtn = document.getElementById("historyResetBtn");
historyResetBtn.addEventListener("click", () => {
    localStorage.removeItem("typerName");
    localStorage.removeItem("typerHistory");
    showHistory();
    window.location.reload();
})
