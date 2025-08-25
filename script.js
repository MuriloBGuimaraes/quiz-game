const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const rankingScreen = document.getElementById("ranking-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const saveBtn = document.getElementById("save-btn");
const rankingBtn = document.getElementById("ranking-btn");
const backHomeBtn = document.getElementById("back-home-btn");

const categorySelect = document.getElementById("category-select");
const playerNameInput = document.getElementById("player-name");

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const scoreElement = document.getElementById("score");
const rankingList = document.getElementById("ranking-list");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";

// Mostrar tela
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

// Iniciar Quiz
startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Digite seu nome antes de começar!");
    return;
  }
  const category = categorySelect.value;
  fetchQuestions(category);
});

// Buscar perguntas
function fetchQuestions(category) {
  fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple&encode=url3986`)
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => ({
        question: decodeURIComponent(q.question),
        correct_answer: decodeURIComponent(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(ans => decodeURIComponent(ans))
      }));
      currentQuestionIndex = 0;
      score = 0;
      showScreen(quizScreen);
      showQuestion();
    })
    .catch(err => console.error("Erro ao carregar perguntas:", err));
}

// Exibir pergunta
function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = currentQuestion.question;

  let answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.addEventListener("click", () => selectAnswer(answer, currentQuestion.correct_answer));
    answersElement.appendChild(button);
  });
}

// Reset
function resetState() {
  nextBtn.disabled = true;
  answersElement.innerHTML = "";
}

// Selecionar resposta
function selectAnswer(answer, correctAnswer) {
  const buttons = answersElement.querySelectorAll("button");
  buttons.forEach(btn => {
    if (btn.innerHTML === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });

  if (answer === correctAnswer) {
    score++;
  }

  nextBtn.disabled = false;
}

// Próxima
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

// Fim do Quiz
function endQuiz() {
  scoreElement.textContent = `${score} / ${questions.length}`;
  showScreen(resultScreen);
}

// Salvar no Ranking
saveBtn.addEventListener("click", () => {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ name: playerName, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  alert("Pontuação salva no ranking!");
});

// Ver Ranking
rankingBtn.addEventListener("click", () => {
  showRanking();
});

function showRanking() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  rankingList.innerHTML = "";
  ranking.slice(0, 10).forEach((player, index) => {
    let li = document.createElement("li");
    li.textContent = `${index + 1}. ${player.name} - ${player.score} pontos`;
    rankingList.appendChild(li);
  });
  showScreen(rankingScreen);
}

// Voltar ao início
restartBtn.addEventListener("click", () => {
  showScreen(startScreen);
});

homeBtn.addEventListener("click", () => {
  showScreen(startScreen);
});

backHomeBtn.addEventListener("click", () => {
  showScreen(startScreen);
});


