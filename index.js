const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const userInput = document.getElementById("userInput");
const messageEle = document.getElementById("message");
const speedEle = document.getElementById("speed");
const quoteEle = document.getElementById("quote");
const greetEle = document.getElementById("greetUser");

const nameModalEle = document.querySelector(".nameModal");

nameModalEle.style.display='none';
userInputBox.style.display = 'none';
messages.style.display = 'none';
resetBtn.style.display = 'none';
startBtn.style.display='none';

let extracted_words = [];
let words = "";
let wordIndex = 0, extracted_words_length = 0, quoteLength = 0;
let startTime = Date.now();

// generating words
const makeword = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
        console.log(new Date().getTime() - startTime);
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
        startBtn.style.display="block";
    }
    else{
        nameModalEle.style.display="block";
    }
};

nameSubmitBtn.addEventListener("click", () => {
    localStorage.setItem("typerName", nameInput.value);
    nameModalEle.style.display="none";
    startBtn.style.display="block";
    getAndSetUserName();
})

getAndSetUserName();

// History Saver
const saveHistory = () =>{
    const history = localStorage.getItem("typerHistory");
    if(history){
        const historyArray = JSON.parse(history);
        historyArray.push({extracted_words_length, words_length, timeTaken: (new Date().getTime() - startTime) / 1000});
        localStorage.setItem("typerHistory", JSON.stringify(historyArray));
    }
    else{
        localStorage.setItem("typerHistory", JSON.stringify([{extracted_words_length, words_length, timeTaken: (new Date().getTime() - startTime) / 1000}]));
    }
    showHistory();
}

// History Viewer
const historyBody = document.getElementById("historyTableBody");

const showHistory = () =>{
    const history = localStorage.getItem("typerHistory");
    const userName = localStorage.getItem("typerName");
    if(history){
        document.getElementsByClassName("history")[0].style.display = "block";
        const historyArray = JSON.parse(history);
        historyBody.innerHTML = "";
        historyArray.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${userName}</td><td>${Math.ceil(item.extracted_words_length / (item.timeTaken / 60))}</td><td>${item.timeTaken}</td>`;
            historyBody.appendChild(row);
        });
    }
    else{
        document.getElementsByClassName("history")[0].style.display = "none";
    }
};

showHistory();