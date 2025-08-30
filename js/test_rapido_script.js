// alebasti/ale-clase-b/ale-clase-b-eda16e9bea2d81467c8ccd321a2963c061/js/test_rapido_script.js
// --- Variables del Estado del Test Rápido ---
let currentQuizQuestions = []; // Array para las preguntas de la sesión actual
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let selectedOptionButton = null; // Para preguntas de respuesta única
let selectedOptions = [];      // Para preguntas de respuesta múltiple

// --- Elementos del DOM ---
const questionCounterEl = document.getElementById('question-counter');
const correctCountEl = document.getElementById('correct-count');
const incorrectCountEl = document.getElementById('incorrect-count');
const questionAreaEl = document.getElementById('question-area'); // Contenedor para texto e imagen
const multiAnswerIndicatorEl = document.getElementById('multi-answer-indicator');
const optionsAreaEl = document.getElementById('options-area');
const feedbackAreaEl = document.getElementById('feedback-area');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const restartButton = document.getElementById('restart-button');
const dynamicResultsContentEl = document.getElementById('dynamic-results-content');

// --- Funciones ---

/**
 * Mezcla un array en el lugar (Algoritmo Fisher-Yates).
 * @param {Array} array - El array a mezclar.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio con desestructuración ES6
    }
}

/**
 * Inicia una nueva sesión de test.
 * Selecciona un subconjunto aleatorio de preguntas de la lista principal.
 */
function startNewTest() {
    const numberOfQuestionsToShow = 10;
    let availableQuestions = [...allQuestions];
    shuffleArray(availableQuestions);
    currentQuizQuestions = availableQuestions.slice(0, Math.min(numberOfQuestionsToShow, availableQuestions.length));

    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    correctCountEl.textContent = `Correctas: ${correctCount}`;
    incorrectCountEl.textContent = `Incorrectas: ${incorrectCount}`;
    selectedOptionButton = null;
    selectedOptions = [];

    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    checkButton.classList.add('invisible');
    nextButton.classList.add('invisible');

    if (currentQuizQuestions.length > 0) {
        loadQuestion();
    } else {
        quizContainer.innerHTML = '<p class="text-center text-red-500">No hay preguntas disponibles para mostrar.</p>';
    }
}


/**
 * Carga la pregunta actual y sus opciones en la UI.
 */
function loadQuestion() {
    selectedOptionButton = null;
    selectedOptions = [];

    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);

    // Limpia el área completa de la pregunta (para texto e imagen)
    questionAreaEl.innerHTML = '';

    // Crea y añade el texto de la pregunta
    const questionText = document.createElement('p');
    questionText.id = 'question-text';
    questionText.className = 'text-lg text-gray-700 font-medium mb-4';
    questionText.textContent = currentQuestion.question;
    questionAreaEl.appendChild(questionText);

    // *** INICIO DE LA CORRECCIÓN ***
    // Si la pregunta tiene una imagen, la crea y la añade
    if (currentQuestion.image) {
        const img = document.createElement('img');
        img.src = currentQuestion.image;
        img.alt = `Imagen para la pregunta ${currentQuestionIndex + 1}`;
        img.className = 'mt-4 rounded-lg mx-auto'; // Estilos para la imagen
        questionAreaEl.appendChild(img);
    }
    // *** FIN DE LA CORRECCIÓN ***

    questionCounterEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${currentQuizQuestions.length}`;
    multiAnswerIndicatorEl.classList.toggle('hidden', !isMultiAnswer);

    optionsAreaEl.innerHTML = '';
    feedbackAreaEl.textContent = '';
    feedbackAreaEl.className = 'mt-4 text-center font-medium h-6';

    checkButton.classList.add('invisible');
    nextButton.classList.add('invisible');

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        const optionLetter = option.match(/^([a-e])\)/i)?.[1].toLowerCase();
        button.textContent = option;
        button.classList.add('block', 'w-full', 'text-left', 'p-3', 'border', 'border-gray-300', 'rounded-lg', 'hover:bg-gray-100', 'transition', 'duration-150', 'ease-in-out');
        button.dataset.option = optionLetter;
        button.onclick = handleOptionSelect;
        optionsAreaEl.appendChild(button);
    });
}

/**
 * Maneja el evento click en un botón de opción.
 * Gestiona selecciones únicas y múltiples.
 * @param {Event} event - El objeto del evento click.
 */
function handleOptionSelect(event) {
    const clickedButton = event.target;
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);

    optionsAreaEl.querySelectorAll('button').forEach(btn => {
         if (!isMultiAnswer || (isMultiAnswer && !selectedOptions.includes(btn) && btn !== clickedButton)) {
             btn.classList.remove('selected');
         }
    });

    if (isMultiAnswer) {
        const index = selectedOptions.indexOf(clickedButton);
        if (index > -1) {
            selectedOptions.splice(index, 1);
            clickedButton.classList.remove('selected');
        } else if (selectedOptions.length < 2) {
            selectedOptions.push(clickedButton);
            clickedButton.classList.add('selected');
        }
        checkButton.classList.toggle('invisible', selectedOptions.length !== 2);
    } else {
        if (selectedOptionButton) {
            selectedOptionButton.classList.remove('selected');
        }
        selectedOptionButton = clickedButton;
        selectedOptionButton.classList.add('selected');
        checkButton.classList.remove('invisible');
    }
}

/**
 * Verifica la(s) respuesta(s) seleccionada(s) contra la(s) correcta(s).
 * Proporciona feedback visual y actualiza puntajes.
 */
function checkAnswer() {
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);
    let isCorrect = false;

    optionsAreaEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
    });

    if (isMultiAnswer) {
        const selectedAnswers = selectedOptions.map(btn => btn.dataset.option).sort();
        const correctAnswers = [...currentQuestion.correctAnswer].sort();
        if (JSON.stringify(selectedAnswers) === JSON.stringify(correctAnswers)) {
            isCorrect = true;
        }
    } else {
        const selectedAnswerLetter = selectedOptionButton?.dataset.option;
        if (selectedAnswerLetter === currentQuestion.correctAnswer.toLowerCase()) {
            isCorrect = true;
        }
    }

    if (isCorrect) {
        correctCount++;
        feedbackAreaEl.textContent = '¡Correcto!';
        feedbackAreaEl.classList.add('text-green-600');
        feedbackAreaEl.classList.remove('text-red-600');
    } else {
        incorrectCount++;
        const correctText = Array.isArray(currentQuestion.correctAnswer)
                            ? currentQuestion.correctAnswer.join(' y ').toUpperCase()
                            : currentQuestion.correctAnswer.toUpperCase();
        feedbackAreaEl.textContent = `Incorrecto. Respuesta(s) correcta(s): ${correctText}`;
        feedbackAreaEl.classList.add('text-red-600');
         feedbackAreaEl.classList.remove('text-green-600');
    }

    correctCountEl.textContent = `Correctas: ${correctCount}`;
    incorrectCountEl.textContent = `Incorrectas: ${incorrectCount}`;

     const correctAnswersArray = isMultiAnswer ? currentQuestion.correctAnswer : [currentQuestion.correctAnswer.toLowerCase()];
    optionsAreaEl.querySelectorAll('button').forEach(btn => {
        const optionLetter = btn.dataset.option;
        const wasSelectedByUser = isMultiAnswer ? selectedOptions.includes(btn) : btn === selectedOptionButton;
        const isCorrectOption = correctAnswersArray.includes(optionLetter);

        btn.classList.remove('selected');

        if (isCorrectOption) {
            btn.classList.add('correct');
             if (wasSelectedByUser) {
                 btn.classList.add('selected-correct');
            }
        } else if (wasSelectedByUser) {
            btn.classList.add('incorrect');
        }
    });

    checkButton.classList.add('invisible');
    nextButton.classList.remove('invisible');
}


/**
 * Avanza a la siguiente pregunta o muestra los resultados finales.
 */
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
         optionsAreaEl.querySelectorAll('button').forEach(btn => {
             btn.disabled = false;
             btn.classList.remove('correct', 'incorrect', 'selected-correct');
         });
        loadQuestion();
    } else {
        showResults();
    }
}

/**
 * Muestra los resultados finales del test.
 */
function showResults() {
    const resultsContent = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Test Rápido Completado!</h2>
        <p class="text-xl text-gray-700 mb-2">Resultados (${currentQuizQuestions.length} preguntas):</p>
        <p class="text-lg text-green-600 font-medium">Respuestas Correctas: ${correctCount}</p>
        <p class="text-lg text-red-600 font-medium mb-6">Respuestas Incorrectas: ${incorrectCount}</p>
    `;
    dynamicResultsContentEl.innerHTML = resultsContent;
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
}

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', startNewTest);

// --- Inicialización ---
window.onload = startNewTest;