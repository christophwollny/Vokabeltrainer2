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

function liftString(pointer) {
  if (!pointer) return '';
  const memory = new Uint32Array(wasm.memory.buffer);
  const length = memory[pointer - 4 >>> 2];
  const u16 = new Uint16Array(wasm.memory.buffer);
  const start = pointer >>> 1;
  const end = (pointer + length) >>> 1;
  let string = '';
  let pos = start;
  while (end - pos > 1024) {
    string += String.fromCharCode(...u16.subarray(pos, pos + 1024));
    pos += 1024;
  }
  return string + String.fromCharCode(...u16.subarray(pos, end));
}

function newString(value) {
  const length = value.length;
  const pointer = wasm.__new(length << 1, 2);
  const u16 = new Uint16Array(wasm.memory.buffer);
  let offset = pointer >>> 1;
  for (let i = 0; i < length; i++) {
    u16[offset + i] = value.charCodeAt(i);
  }
  return pointer;
}

function nextQuestion() {
  if (maxIndex === 0) return;
  currentIndex = Math.floor(Math.random() * maxIndex);
  const questionPtr = wasm.getEnglish(currentIndex);
  questionLabel.textContent = liftString(questionPtr);
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
  const result = await WebAssembly.instantiate(bytes, {
    env: {
      abort(_msg, _file, line, col) {
        console.error('abort called at ' + line + ':' + col);
      }
    }
  });
  wasm = result.instance.exports;
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
  const answerPtr = newString(answer);
  const correct = wasm.checkGerman(currentIndex, answerPtr);
  if (correct) {
    feedback.textContent = '✅ Richtig! Weiter zur nächsten Karte.';
    feedback.style.color = '#15803d';
    correctCount += 1;
  } else {
    const correctPtr = wasm.getGerman(currentIndex);
    feedback.textContent = `❌ Falsch. Richtige Antwort: ${liftString(correctPtr)}`;
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
