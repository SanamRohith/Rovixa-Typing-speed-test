// =========================
// PARAGRAPH BANK
// =========================

const paragraphs = [

    "Technology is changing the way people communicate and learn every day. Modern devices allow students to access information quickly and improve their skills through online platforms and digital tools.",

    "Typing regularly can improve focus, accuracy, and overall productivity. Many professional developers and writers practice typing daily to increase their speed and reduce mistakes while working.",

    "Artificial intelligence is becoming one of the most important innovations in the modern world. From smart assistants to self driving vehicles, AI is transforming industries rapidly.",

    "Healthy habits such as exercising, sleeping properly, and eating nutritious food can improve both physical and mental performance. Small consistent efforts often create long term success.",

    "Web development combines creativity and logic to build interactive websites and applications. Developers use HTML, CSS, and JavaScript together to create responsive user experiences.",

    "Learning programming requires patience, consistency, and practical experience. Building small projects helps beginners understand concepts more effectively and develop problem solving skills.",

    "Traveling to new places allows people to experience different cultures, traditions, and lifestyles. Exploring nature and historical landmarks often creates unforgettable memories.",

    "Students who manage their time efficiently can balance studies, personal activities, and career preparation more successfully. Discipline and planning are important for achieving goals.",

    "Video games have evolved from simple entertainment into competitive esports and immersive storytelling experiences. Modern games often include realistic graphics and multiplayer interaction.",

    "Reading books regularly improves vocabulary, imagination, and critical thinking abilities. Many successful individuals develop the habit of reading every day to continue learning."

];


// =========================
// GAME VARIABLES
// =========================

let currentParagraph = '';

let startTime;

let timerInterval;

let timeLeft = 60;

let isTestActive = false;

let correctChars = 0;

let totalChars = 0;

let mistakes = 0;


// =========================
// DOM ELEMENTS
// =========================

const paragraphDisplay =
    document.getElementById('paragraph-display');

const typingArea =
    document.getElementById('typing-area');

const timeSelect =
    document.getElementById('time-select');

const timerDisplay =
    document.getElementById('timer');

const wpmDisplay =
    document.getElementById('wpm');

const accuracyDisplay =
    document.getElementById('accuracy');

const scoreDisplay =
    document.getElementById('score');

const resultsScreen =
    document.getElementById('results');

const finalWpm =
    document.getElementById('final-wpm');

const finalAccuracy =
    document.getElementById('final-accuracy');

const finalScore =
    document.getElementById('final-score');


// =========================
// SOUND EFFECTS
// =========================

const wrongSound =
    new Audio('sounds/wrong.mp3');

const completeSound =
    new Audio('sounds/complete.mp3');

wrongSound.volume = 0.2;

completeSound.volume = 0.4;


// =========================
// INITIALIZE TEST
// =========================

function initTest() {

    // stop success sound
    completeSound.pause();

    completeSound.currentTime = 0;

    currentParagraph =
        paragraphs[Math.floor(Math.random() * paragraphs.length)];

    paragraphDisplay.innerHTML =
        currentParagraph
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('');

    typingArea.value = '';

    typingArea.disabled = false;

    typingArea.style.display = 'block';

    typingArea.focus();

    timeLeft =
        parseInt(timeSelect.value);

    timerDisplay.textContent =
        `Time: ${timeLeft}s`;

    isTestActive = false;

    correctChars = 0;

    totalChars = 0;

    mistakes = 0;

    resultsScreen.style.display = 'none';

    clearInterval(timerInterval);

    // first cursor
    paragraphDisplay
        .querySelector('span')
        .classList.add('current');

    updateDisplays();
}


// =========================
// START TIMER
// =========================

function startTimer() {

    if (!isTestActive) {

        isTestActive = true;

        startTime = Date.now();

        timerInterval =
            setInterval(updateTimer, 1000);
    }
}


// =========================
// UPDATE TIMER
// =========================

function updateTimer() {

    timeLeft--;

    timerDisplay.textContent =
        `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {

        timeLeft = 0;

        timerDisplay.textContent =
            `Time: 0s`;

        clearInterval(timerInterval);

        endTest();

        return;
    }
}


// =========================
// PREVENT ENTER
// =========================

typingArea.addEventListener('keydown', (e) => {

    if (e.key === 'Enter') {

        e.preventDefault();
    }
});


// =========================
// WRONG SOUND ONLY
// =========================

typingArea.addEventListener('keydown', (e) => {

    if (!isTestActive && timeLeft <= 0) return;

    // ignore special/function keys
    if (

        e.key.length > 1 ||

        e.ctrlKey ||
        e.altKey ||
        e.metaKey

    ) {
        return;
    }

    const currentIndex =
        typingArea.value.length;

    const expectedChar =
        currentParagraph[currentIndex];

    // wrong sound only
    if (e.key !== expectedChar) {

        wrongSound.currentTime = 0;

        wrongSound.play();
    }
});


// =========================
// MAIN TYPING LOGIC
// =========================

typingArea.addEventListener('input', () => {

    if (!isTestActive && timeLeft <= 0) return;

    // start timer
    if (!isTestActive) {

        startTimer();
    }

    const enteredText =
        typingArea.value;

    const spanChars =
        paragraphDisplay.querySelectorAll('span');

    correctChars = 0;

    spanChars.forEach((charSpan, index) => {

        const typedChar =
            enteredText[index];

        // reset chars
        if (typedChar == null) {

            charSpan.classList.remove('correct');

            charSpan.classList.remove('incorrect');
        }

        // correct char
        else if (typedChar === charSpan.innerText) {

            charSpan.classList.add('correct');

            charSpan.classList.remove('incorrect');

            correctChars++;
        }

        // wrong char
        else {

            charSpan.classList.add('incorrect');

            charSpan.classList.remove('correct');
        }

        // cursor
        charSpan.classList.remove('current');

        if (index === enteredText.length) {

            charSpan.classList.add('current');
        }
    });

    // mistakes
    mistakes =
        Math.max(0, enteredText.length - correctChars);

    // total chars
    totalChars =
        correctChars + mistakes;

    updateDisplays();
});


// =========================
// UPDATE DISPLAY
// =========================

function updateDisplays() {

    const accuracy =
        totalChars > 0
        ? Math.round((correctChars / totalChars) * 100)
        : 100;

    accuracyDisplay.textContent =
        `Accuracy: ${accuracy}%`;

    document.getElementById('mistakes').textContent =
        `Mistakes: ${mistakes}`;

    if (isTestActive) {

        const timeElapsed =
            (Date.now() - startTime) / 1000 / 60;

        const wpm =
            timeElapsed > 0
            ? Math.round((correctChars / 5) / timeElapsed)
            : 0;

        wpmDisplay.textContent =
            `WPM: ${wpm}`;

        const score =
            Math.round(wpm * (accuracy / 100) * 10);

        scoreDisplay.textContent =
            `Score: ${score}`;
    }

    else {

        wpmDisplay.textContent =
            'WPM: 0';

        scoreDisplay.textContent =
            'Score: 0';
    }
}


// =========================
// END TEST
// =========================

function endTest() {

    clearInterval(timerInterval);

    typingArea.disabled = true;

    typingArea.style.display = 'none';

    isTestActive = false;

    // remove cursor
    document
        .querySelectorAll('.current')
        .forEach(el => {

            el.classList.remove('current');
        });

    const timeElapsed =
        (Date.now() - startTime) / 1000 / 60;

    const wpm =
        timeElapsed > 0
        ? Math.round((correctChars / 5) / timeElapsed)
        : 0;

    const accuracy =
        totalChars > 0
        ? Math.round((correctChars / totalChars) * 100)
        : 100;

    const score =
        Math.round(wpm * (accuracy / 100) * 10);

    finalWpm.textContent =
        `Final WPM: ${wpm}`;

    finalAccuracy.textContent =
        `Final Accuracy: ${accuracy}%`;

    finalScore.textContent =
        `Final Score: ${score}`;

    resultsScreen.style.display = 'block';

    // success sound
    completeSound.currentTime = 0;

    completeSound.play();
}


// =========================
// TIME CHANGE
// =========================

timeSelect.addEventListener('change', () => {

    if (!isTestActive) {

        timeLeft =
            parseInt(timeSelect.value);

        timerDisplay.textContent =
            `Time: ${timeLeft}s`;
    }
});


// =========================
// START ON LOAD
// =========================

window.addEventListener('load', initTest);