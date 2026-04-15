import { instantiate } from './build/vocab.js';

let wasm;
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let maxIndex = 0;

const questionLabel = document.getElementById('question');
const answerInput = document.getElementById('answer');
const checkButton = document.getElementById('check');
const feedback = document.getElementById('feedback');
const progress = document.getElementById('progress');
const correctLabel = document.getElementById('correct');
const wrongLabel = document.getElementById('wrong');

function nextQuestion() {
  if (maxIndex === 0) return;
  currentIndex = Math.floor(Math.random() * maxIndex);
  questionLabel.textContent = wasm.getEnglish(currentIndex);
  progress.textContent = `Karte ${currentIndex + 1} / ${maxIndex}`;
  answerInput.value = '';
  feedback.textContent = '';
  answerInput.focus();
}

function updateCounters() {
  correctLabel.textContent = `Richtig: ${correctCount}`;
  wrongLabel.textContent = `Falsch: ${wrongCount}`;
}

async function loadWasm() {
  const response = await fetch('build/vocab.wasm');
  const bytes = await response.arrayBuffer();
  wasm = await instantiate(bytes);
  maxIndex = wasm.maxIndex();
  nextQuestion();
}

checkButton.addEventListener('click', () => {
  if (!wasm) return;
  const answer = answerInput.value.trim();
  if (!answer) {
    feedback.textContent = 'Bitte eine Übersetzung eingeben.';
    feedback.style.color = '#b91c1c';
    return;
  }
  const correct = wasm.checkGerman(currentIndex, answer);
  if (correct) {
    feedback.textContent = '✅ Richtig! Weiter zur nächsten Karte.';
    feedback.style.color = '#15803d';
    correctCount += 1;
  } else {
    feedback.textContent = `❌ Falsch. Richtige Antwort: ${wasm.getGerman(currentIndex)}`;
    feedback.style.color = '#b91c1c';
    wrongCount += 1;
  }
  updateCounters();
  setTimeout(nextQuestion, 1200);
});

answerInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    checkButton.click();
  }
});

loadWasm().catch(error => {
  questionLabel.textContent = 'Fehler beim Laden der WebAssembly-Datei.';
  feedback.textContent = error.message || error;
  feedback.style.color = '#b91c1c';
});
