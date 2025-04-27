// --- Base de Datos Completa de Preguntas ---
const allQuestions = [
    {
        question: "1.- Su vehículo se desvia hacia un lado cuando usted frena. Usted deberia:",
        options: [
            "a) Cambiar los neumáticos de un lado hacia el otro y viceversa.",
            "b) Bombear el pedal al frenar.",
            "c) Usar su freno de mano.",
            "d) Consultar con su mecánico lo antes posible."
        ],
        correctAnswer: "d",
        points: 1
    },
    {
        question: "2.- Su vehículo se desvía hacia un lado cuando usted frena. ¿Cuál es la falla más probable?",
        options: [
            "a) Un bajo nivel del liquido de frenos.",
            "b) Su freno de mano está todavía puesto.",
            "c) Frenos mal ajustados.",
            "d) Neumáticos con presión de aire inadecuada."
        ],
        correctAnswer: "c",
        points: 1
    },
    {
        question: "3.- Mientras conduce usted siente un fuerte olor a gasolina. ¿Qué debería hacer usted?",
        options: [
            "a) No preocuparse, ya que sólo son los gases de escape.",
            "b) Continuar a una velocidad reducida.",
            "c) Continuar porque sabe que se detendrá algunos kilómetros más allá.",
            "d) Detenerse e investigar el problema."
        ],
        correctAnswer: "d",
        points: 1
    },
    {
        question: "4.- ¿Cuáles 2 cosas debe usted hacer si se le revienta un neumático delantero?",
        options: [
            "a) Cambiarse de pista y frenar a fondo.",
            "b) Frenar suavemente o dejar que el vehículo siga hasta detenerse.",
            "c) Sostener firmemente el volante manteniendo la trayectoria.",
            "d) Frenar rápida y firmemente.",
            "e) Sostener el volante con una mano advirtiendo con la otra a los demás que usted se detendrá."
        ],
        correctAnswer: ["b", "d"],
        points: 2
    }
];

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
        ...normalQuestions.slice(0, 3),
        ...doubleQuestions.slice(0, 1)
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
    questionTextEl.textContent = currentQuestion.question;
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
        loadQuestion();
    } else {
        showResults();
    }
}

// Función para mostrar los resultados finales
function showResults() {
    const resultsContent = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Cuestionario Completado!</h2>
        ${score >= 4 ? 
            '<p class="text-2xl font-bold text-green-600 mb-4">¡APROBADO! 🎉</p>' : 
            '<p class="text-2xl font-bold text-red-600 mb-4">¡REPROBADO! 😞</p>'}
        <p class="text-xl text-gray-700 mb-6">Tu puntaje final es: 
        <span class="font-bold">${score}</span> de 5</p>
    `;
    
    document.getElementById('dynamic-results-content').innerHTML = resultsContent;
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
}

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', startNewQuiz); 

// Botón "Comenzar de nuevo" (siempre visible)
startOverButton.addEventListener('click', () => {
    document.getElementById('start-screen').classList.remove('hidden');
    quizContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    startNewQuiz();
});

// Botón de inicio "Comenzar Examen"
startButton.addEventListener('click', startNewQuiz);

// --- Inicialización ---
window.onload = () => {
    quizContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
};