const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const startButton = document.getElementById('startButton');
const timeDisplay = document.getElementById('timeDisplay');
const wpmDisplay = document.getElementById('wpmDisplay');
const accuracyDisplay = document.getElementById('accuracyDisplay');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
    "Programming is the art of telling another human what one wants the computer to do. It involves breaking down complex problems into smaller, manageable pieces.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Every day presents a new opportunity to improve.",
    "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower in today's digital age."
];

let timeLeft = 60;
let timer = null;
let currentText = '';
let isTestActive = false;

function getRandomText() {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

function updateDisplayText() {
    const inputText = inputArea.value;
    const originalText = currentText;
    let displayHtml = '';

    for (let i = 0; i < originalText.length; i++) {
        if (i < inputText.length) {
            if (inputText[i] === originalText[i]) {
                displayHtml += `<span class="correct">${originalText[i]}</span>`;
            } else {
                displayHtml += `<span class="incorrect">${originalText[i]}</span>`;
            }
        } else {
            displayHtml += originalText[i];
        }
    }
    textDisplay.innerHTML = displayHtml;
}

function calculateWPM() {
    const words = inputArea.value.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60;
    return Math.round(words / minutes);
}

function calculateAccuracy() {
    const inputText = inputArea.value;
    let correct = 0;
    const minLength = Math.min(inputText.length, currentText.length);
    
    for (let i = 0; i < minLength; i++) {
        if (inputText[i] === currentText[i]) {
            correct++;
        }
    }
    
    return Math.round((correct / currentText.length) * 100);
}

function startTest() {
    currentText = getRandomText();
    textDisplay.textContent = currentText;
    inputArea.value = '';
    inputArea.disabled = false;
    startButton.disabled = true;
    timeLeft = 60;
    isTestActive = true;
    inputArea.focus();

    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    inputArea.disabled = true;
    startButton.disabled = false;
    isTestActive = false;
    startButton.textContent = 'Restart Test';

    // Calculate final stats
    const finalWPM = calculateWPM();
    const finalAccuracy = calculateAccuracy();

    wpmDisplay.textContent = finalWPM;
    accuracyDisplay.textContent = finalAccuracy + '%';
}

inputArea.addEventListener('input', () => {
    if (isTestActive) {
        updateDisplayText();
        wpmDisplay.textContent = calculateWPM();
        accuracyDisplay.textContent = calculateAccuracy() + '%';

        // End test if user completes the text
        if (inputArea.value.length === currentText.length) {
            endTest();
        }
    }
});

startButton.addEventListener('click', startTest);