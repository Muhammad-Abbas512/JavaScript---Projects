const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progressBar");
const categorySelect = document.getElementById("category");
const themeToggle = document.getElementById("themeToggle");
const startBtn = document.getElementById("startBtn");
const amountInput = document.getElementById("amount");
const dashboard = document.getElementById("dashboard");
const quiz = document.getElementById("quiz");
const highScoreEl = document.getElementById("highScore");

let state = {
  questions: [],
  index: 0,
  score: 0,
  timer: 30
};

let interval;

// Initialize high score
highScoreEl.textContent = localStorage.getItem("highScore") || 0;

// Load theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// 🌐 Fetch from API
async function fetchQuestions() {
  const category = categorySelect.value;
  const amount = amountInput.value;
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`
  );
  const data = await res.json();
  state.questions = data.results;
  loadQuestion();
}

function loadQuestion() {
  reset();
  startTimer();

  const q = state.questions[state.index];
  questionEl.innerHTML = q.question;

  const answers = [...q.incorrect_answers, q.correct_answer]
    .sort(() => Math.random() - 0.5);

  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.innerHTML = ans;
    btn.onclick = () => checkAnswer(btn, ans === q.correct_answer);
    optionsEl.appendChild(btn);
  });

  progressBar.style.width =
    ((state.index + 1) / state.questions.length) * 100 + "%";
}

function checkAnswer(btn, correct) {
  stopTimer();

  if (correct) {
    btn.classList.add("correct");
    state.score++;
  } else {
    btn.classList.add("wrong");
  }

  scoreEl.textContent = `Score: ${state.score}`;

  [...optionsEl.children].forEach(b => {
    b.disabled = true;
    if (b.innerHTML === state.questions[state.index].correct_answer) {
      b.classList.add("correct");
    }
  });

  nextBtn.style.display = "block";
}

function startTimer() {
  state.timer = 30;
  timerEl.textContent = "30s";

  interval = setInterval(() => {
    state.timer--;
    timerEl.textContent = state.timer + "s";
    if (state.timer === 0) {
      stopTimer();
      nextBtn.style.display = "block";
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function reset() {
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
}

nextBtn.onclick = () => {
  state.index++;
  state.index < state.questions.length ? loadQuestion() : finish();
};

function finish() {
  const high = localStorage.getItem("highScore") || 0;
  if (state.score > high) {
    localStorage.setItem("highScore", state.score);
    highScoreEl.textContent = state.score;
  }

  questionEl.innerHTML = `
    🎉 Final Score: ${state.score}<br>
    🏆 High Score: ${localStorage.getItem("highScore")}
  `;
  optionsEl.innerHTML = "";
  nextBtn.innerText = "Back to Dashboard";
  nextBtn.style.display = "block";
  nextBtn.onclick = () => {
    dashboard.style.display = "flex";
    quiz.style.display = "none";
    resetState();
  };
}

function resetState() {
  state.questions = [];
  state.index = 0;
  state.score = 0;
  scoreEl.textContent = "Score: 0";
  progressBar.style.width = "0%";
  nextBtn.innerText = "Next";
}

// 🌗 Theme Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

// Start Quiz
startBtn.onclick = () => {
  dashboard.style.display = "none";
  quiz.style.display = "block";
  fetchQuestions();
};
