
    


// --- Variables del Estado del Quiz ---
let currentQuizQuestions = []; // Preguntas seleccionadas para esta ronda
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionButton = null; // Guarda el botón de opción seleccionado
let selectedOptions = []; // Array para guardar múltiples selecciones

// --- Elementos del DOM ---
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const questionCounterEl = document.getElementById('question-counter');
const scoreEl = document.getElementById('score');
const questionTextEl = document.getElementById('question-text');
const questionAreaEl = document.getElementById('question-area'); // Contenedor para texto e imagen
const optionsAreaEl = document.getElementById('options-area');
const feedbackAreaEl = document.getElementById('feedback-area');
const checkButton = document.getElementById('check-button'); // Nuevo botón Revisar
const nextButton = document.getElementById('next-button'); // Botón Siguiente
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const restartButton = document.getElementById('restart-button'); // Botón en pantalla final
const startOverButton = document.getElementById('start-over-button'); // Botón siempre visible

// --- Funciones ---

// Función para barajar un array (Algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para iniciar un nuevo cuestionario
function startNewQuiz() {
    // Separar preguntas por puntos
    const normalQuestions = allQuestions.filter(q => q.points === 1);
    const doubleQuestions = allQuestions.filter(q => q.points === 2);
    
    // Mezclar y seleccionar
    shuffleArray(normalQuestions);
    shuffleArray(doubleQuestions);
    
    currentQuizQuestions = [
        ...normalQuestions.slice(0, 32),
        ...doubleQuestions.slice(0, 3)
    ];
    shuffleArray(currentQuizQuestions); // Mezclar el orden final
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.textContent = `Puntaje: ${score}`;
    selectedOptionButton = null;
    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    checkButton.classList.add('invisible'); // Ocultar Revisar al inicio
    nextButton.classList.add('invisible'); // Ocultar Siguiente al inicio
    loadQuestion();
}

// Función para cargar una pregunta
function loadQuestion() {
    selectedOptionButton = null; // Resetear selección
    selectedOptions = []; // Limpiar array de múltiples selecciones
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];

    // Limpia el área de la pregunta
    questionAreaEl.innerHTML = '';

    // Añade el texto de la pregunta
    const questionText = document.createElement('p');
    questionText.id = 'question-text';
    questionText.className = 'text-lg text-gray-700 font-medium mb-4';
    questionText.textContent = currentQuestion.question;
    questionAreaEl.appendChild(questionText);

    // Si la pregunta tiene una imagen, la añade
    if (currentQuestion.image) {
        const img = document.createElement('img');
        img.src = currentQuestion.image;
        img.alt = `Imagen para la pregunta ${currentQuestionIndex + 1}`;
        img.className = 'mt-4 rounded-lg mx-auto'; // Estilos para la imagen
        questionAreaEl.appendChild(img);
    }
    
    optionsAreaEl.innerHTML = '';
    feedbackAreaEl.textContent = '';
    feedbackAreaEl.className = 'mt-4 text-center font-medium h-6'; // Resetear clases feedback
    checkButton.classList.add('invisible'); // Ocultar botón Revisar
    nextButton.classList.add('invisible'); // Ocultar botón Siguiente

    questionCounterEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${currentQuizQuestions.length}`;

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        const optionLetter = option.match(/^([a-e])\)/i)?.[1].toLowerCase();
        button.textContent = option;
        button.classList.add('block', 'w-full', 'text-left', 'p-3', 'border', 'border-gray-300', 'rounded-lg', 'hover:bg-gray-100', 'transition', 'duration-150', 'ease-in-out');
        button.dataset.option = optionLetter;
        button.onclick = handleOptionSelect; // Cambiado a handleOptionSelect
        optionsAreaEl.appendChild(button);
    });
}

// Función para manejar la selección de una opción (sin revisar aún)
function handleOptionSelect(event) {
    const clickedButton = event.target;
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);

    if (isMultiAnswer) {
        // Si ya está seleccionado, deseleccionar
        if (selectedOptions.includes(clickedButton)) {
            clickedButton.classList.remove('selected');
            selectedOptions = selectedOptions.filter(btn => btn !== clickedButton);
        } 
        // Si no está seleccionado y hay menos de 2, agregar
        else if (selectedOptions.length < 2) {
            clickedButton.classList.add('selected');
            selectedOptions.push(clickedButton);
        }
        // Si ya hay 2 seleccionados, reemplazar el más antiguo
        else {
            const oldestSelection = selectedOptions.shift(); // Quitar el primero
            oldestSelection.classList.remove('selected');
            clickedButton.classList.add('selected');
            selectedOptions.push(clickedButton); // Agregar el nuevo
        }
    } else {
        // Lógica original de 1 selección
        if (selectedOptionButton) selectedOptionButton.classList.remove('selected');
        selectedOptionButton = clickedButton;
        clickedButton.classList.add('selected');
    }

    checkButton.classList.toggle('invisible', !(isMultiAnswer ? selectedOptions.length === 2 : selectedOptionButton));
}

// Función para revisar la respuesta seleccionada
function checkAnswer() {
    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);
    
    // Obtener respuestas seleccionadas y correctas
    const selected = isMultiAnswer 
        ? selectedOptions.map(btn => btn.dataset.option).sort()
        : [selectedOptionButton?.dataset.option];
        
    const correct = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer.slice().sort()
        : [currentQuestion.correctAnswer.toLowerCase()];

    // Deshabilitar y limpiar selección
    optionsAreaEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });

    // Verificar y sumar puntos
    if (JSON.stringify(selected) === JSON.stringify(correct)) {
        score += currentQuestion.points; // Usar points de la pregunta
        scoreEl.textContent = `Puntaje: ${score}`;
        feedbackAreaEl.textContent = '¡Correcto!';
        feedbackAreaEl.classList.add('text-green-600');
    } else {
        feedbackAreaEl.textContent = `Incorrecto. Respuestas correctas: ${correct.join(' y ').toUpperCase()}`;
        feedbackAreaEl.classList.add('text-red-600');
    }

    // Resaltar opciones
    optionsAreaEl.querySelectorAll('button').forEach(btn => {
        const option = btn.dataset.option;
        if (correct.includes(option)) {
            btn.classList.add('correct');
            if (selected.includes(option)) {
                btn.classList.add('selected-correct');
            }
        } else if (selected.includes(option)) {
            btn.classList.add('incorrect');
        }
    });

    checkButton.classList.add('invisible');
    nextButton.classList.remove('invisible');
}

// Función para ir a la siguiente pregunta o mostrar resultados
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        // Habilita los botones para la siguiente pregunta
        optionsAreaEl.querySelectorAll('button').forEach(btn => btn.disabled = false);
        loadQuestion();
    } else {
        showResults();
    }
}

// Función para mostrar los resultados finales
function showResults() {
    const resultsContent = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Cuestionario Completado!</h2>
        ${score >= 33 ? 
            '<p class="text-2xl font-bold text-green-600 mb-4">¡APROBADO! 🎉</p>' : 
            '<p class="text-2xl font-bold text-red-600 mb-4">¡REPROBADO! 😞</p>'}
        <p class="text-xl text-gray-700 mb-6">Tu puntaje final es: 
        <span class="font-bold">${score}</span> de 38</p>
    `;
    
    document.getElementById('dynamic-results-content').innerHTML = resultsContent;
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
}

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);
// Asegúrate de que el botón de reinicio en la pantalla de resultados tenga el id 'restart-button'
if (restartButton) {
    restartButton.addEventListener('click', startNewQuiz); 
}

// Botón "Comenzar de nuevo" (siempre visible)
startOverButton.addEventListener('click', () => {
    document.getElementById('start-screen').classList.remove('hidden');
    quizContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    startNewQuiz();
});

// Botón de inicio "Comenzar Examen"
if (startButton) {
    startButton.addEventListener('click', startNewQuiz);
}

// --- Inicialización ---
window.onload = () => {
    // Esta lógica podría estar en `examen.html` en lugar de aquí.
    // Si este script es solo para `quiz.html`, puedes quitar el manejo de la pantalla de inicio.
    if(quizContainer && resultsContainer && startScreen) {
        quizContainer.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        startScreen.classList.remove('hidden');
    }
};