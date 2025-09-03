'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { allQuestions } from '@/lib/questions';
import { Question } from '@/lib/types';

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function TestRapidoQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    startNewTest();
  }, []);

  const startNewTest = () => {
    const numberOfQuestionsToShow = 10;
    let availableQuestions = [...allQuestions];
    shuffleArray(availableQuestions);
    const quizQuestions = availableQuestions.slice(0, Math.min(numberOfQuestionsToShow, availableQuestions.length));

    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSelectedAnswers([]);
    setIsAnswerChecked(false);
    setShowResults(false);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswerChecked) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);

    if (isMultiAnswer) {
      const newSelectedAnswers = selectedAnswers.includes(option)
        ? selectedAnswers.filter(a => a !== option)
        : [...selectedAnswers, option].slice(0, (currentQuestion.correctAnswer as string[]).length);
      setSelectedAnswers(newSelectedAnswers);
    } else {
      setSelectedAnswers([option]);
    }
  };

  const checkAnswer = () => {
    if (isAnswerChecked) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.map(a => a.toLowerCase())
      : [currentQuestion.correctAnswer.toLowerCase()];

    const isCorrect = selectedAnswers.length === correctAnswers.length && selectedAnswers.every(a => correctAnswers.includes(a));

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

    setIsAnswerChecked(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setIsAnswerChecked(false);
    } else {
      setShowResults(true);
    }
  };

  if (questions.length === 0) {
    return <div>Cargando...</div>;
  }

  if (showResults) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Test Rápido Completado!</h2>
        <p className="text-xl text-gray-700 mb-2">Resultados ({questions.length} preguntas):</p>
        <p className="text-lg text-green-600 font-medium">Respuestas Correctas: {correctCount}</p>
        <p className="text-lg text-red-600 font-medium mb-6">Respuestas Incorrectas: {incorrectCount}</p>
        <button onClick={startNewTest} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out inline-block mt-4">
          Reintentar Test Rápido
        </button>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out inline-block mt-4 ml-4">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMultiAnswer = Array.isArray(currentQuestion.correctAnswer);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
      <div className="text-right mb-4">
        <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out text-sm inline-block">
          Volver al Inicio
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Test Rápido Licencia Clase B</h1>

      <div id="quiz-container">
        <div className="mb-4 text-sm text-gray-600 flex justify-between items-center">
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
          <div>
            <span className="mr-2">Correctas: {correctCount}</span>
            <span>Incorrectas: {incorrectCount}</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700 font-medium">{currentQuestion.question}</p>
          {currentQuestion.image && (
            <Image
              src={`/${currentQuestion.image}`}
              alt={`Imagen para la pregunta`}
              width={500}
              height={300}
              className="mt-4 rounded-lg mx-auto"
            />
          )}
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const optionLetter = option.match(/^([a-e])\)/i)?.[1].toLowerCase();
            const isSelected = selectedAnswers.includes(optionLetter);
            let buttonClass = 'block w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 ease-in-out';
            if (isAnswerChecked) {
              const correctAnswers = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer.map(a => a.toLowerCase()) : [currentQuestion.correctAnswer.toLowerCase()];
              if (correctAnswers.includes(optionLetter)) {
                buttonClass += ' bg-green-500 border-green-700 text-white';
              } else if (isSelected) {
                buttonClass += ' bg-red-500 border-red-700 text-white';
              }
            } else if (isSelected) {
              buttonClass += ' border-blue-500 bg-blue-100 border-2';
            }

            return (
              <button key={index} onClick={() => handleOptionSelect(optionLetter)} className={buttonClass} disabled={isAnswerChecked}>
                {option}
                {isAnswerChecked && Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.map(a => a.toLowerCase()).includes(optionLetter) && <span className="font-bold ml-2">✓</span>}
                {isAnswerChecked && !Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.toLowerCase() === optionLetter && <span className="font-bold ml-2">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center font-medium h-6">
          {isAnswerChecked && (
            <p className={correctCount > 0 ? 'text-green-600' : 'text-red-600'}>
              {/* Feedback can be improved */}
            </p>
          )}
        </div>

        <div className="mt-6 text-center space-x-4">
          {!isAnswerChecked ? (
            <button onClick={checkAnswer} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out">
              Revisar
            </button>
          ) : (
            <button onClick={nextQuestion} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 ease-in-out">
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
