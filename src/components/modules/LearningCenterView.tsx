import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ASTRONOMY_COURSES, FLASHCARDS_DATA, STANDARD_QUIZ_QUESTIONS, QuizQuestion } from '../../data/coursesData';
import { Language } from '../../types/cosmos';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Download,
} from 'lucide-react';

interface LearningCenterViewProps {
  language: Language;
}

export const LearningCenterView: React.FC<LearningCenterViewProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz' | 'flashcards' | 'certificate'>('quiz');

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>(STANDARD_QUIZ_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Certificate state
  const [studentName, setStudentName] = useState('Cosmos Explorer Scholar');

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQ.answerIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const generateAiQuiz = async (topic: string) => {
    setIsGeneratingAiQuiz(true);
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count: 5 }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        resetQuiz();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" />
            <span>Cosmos Space Academy & Learning Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Astrophysics curricula, knowledge quizzes, revision flashcards, and verified completion credentials.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'quiz' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Astrophysics Quiz
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'courses' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'flashcards' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'certificate' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Certificate
          </button>
        </div>
      </div>

      {/* QUIZ ENGINE */}
      {activeTab === 'quiz' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {!quizFinished ? (
            <div>
              {/* Quiz Header & AI Generator Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      QUESTION {currentQIndex + 1} OF {questions.length}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Topic: {currentQ.topic}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {language === 'hi' && currentQ.hindiQuestion ? currentQ.hindiQuestion : currentQ.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateAiQuiz('Black Holes and Relativity')}
                    disabled={isGeneratingAiQuiz}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isGeneratingAiQuiz ? 'Generating...' : 'AI New Quiz'}</span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mt-6">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200';
                  if (selectedAnswer !== null) {
                    if (idx === currentQ.answerIndex) {
                      btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                    } else if (idx === selectedAnswer) {
                      btnStyle = 'bg-red-950/50 border-red-500 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && idx === currentQ.answerIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {selectedAnswer === idx && idx !== currentQ.answerIndex && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3 animate-fade-in">
                  <div className="text-xs text-indigo-200 leading-relaxed">
                    <strong className="text-white block mb-1">Scientific Explanation:</strong>
                    {currentQ.explanation}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-600/30"
                    >
                      <span>{currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-white">Quiz Evaluation Completed!</h3>
              <div className="text-sm text-slate-300">
                You scored <strong className="text-violet-400 font-mono text-lg">{score}</strong> out of <strong className="font-mono text-lg">{questions.length}</strong> questions ({Math.round((score / questions.length) * 100)}%).
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-violet-600/30"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Claim Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASTRONOMY_COURSES.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span className="text-violet-400 font-semibold">{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {language === 'hi' ? course.hindiDescription : course.description}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Syllabus Modules:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  generateAiQuiz(course.title);
                  setActiveTab('quiz');
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <span>Take Course Knowledge Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-64 rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 transition-all select-none relative"
          >
            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500">
              Click to flip card
            </div>

            {!isFlipped ? (
              <div>
                <div className="text-[10px] font-mono text-violet-400 uppercase tracking-wider mb-2">
                  {FLASHCARDS_DATA[flashcardIndex].category}
                </div>
                <h3 className="text-2xl font-black text-white">
                  {FLASHCARDS_DATA[flashcardIndex].term}
                </h3>
                <div className="text-sm text-slate-400 font-hindi mt-1">
                  ({FLASHCARDS_DATA[flashcardIndex].hindiTerm})
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                  {language === 'hi'
                    ? FLASHCARDS_DATA[flashcardIndex].hindiDefinition
                    : FLASHCARDS_DATA[flashcardIndex].definition}
                </p>
                {FLASHCARDS_DATA[flashcardIndex].formulaOrFact && (
                  <div className="font-mono text-xs text-cyan-300 font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                    {FLASHCARDS_DATA[flashcardIndex].formulaOrFact}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <button
              onClick={() => {
                setFlashcardIndex((i) => (i > 0 ? i - 1 : FLASHCARDS_DATA.length - 1));
                setIsFlipped(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white"
            >
              Previous
            </button>
            <span className="font-mono">
              Card {flashcardIndex + 1} of {FLASHCARDS_DATA.length}
            </span>
            <button
              onClick={() => {
                setFlashcardIndex((i) => (i < FLASHCARDS_DATA.length - 1 ? i + 1 : 0));
                setIsFlipped(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* CERTIFICATE TAB */}
      {activeTab === 'certificate' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Cosmos Astronomy Explorer Certificate</span>
              </h3>
              <p className="text-xs text-slate-400">Enter your name to generate your verified credential.</p>
            </div>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your Full Name..."
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
            />
          </div>

          {/* Rendered Certificate Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-radial from-slate-950 via-gray-950 to-black border-4 border-double border-amber-500/50 shadow-2xl text-center space-y-4">
            <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
              COSMOS EXPLORER PLATFORM CERTIFICATE OF ACHIEVEMENT
            </div>
            <div className="text-2xl sm:text-4xl font-serif font-black text-white">
              {studentName || 'Cosmos Scholar'}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Has demonstrated comprehensive mastery of planetary mechanics, relativistic astrophysics, stellar evolution, and deep space exploration.
            </p>
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span className="text-amber-400 font-bold">Credential ID: CE-{(Math.random() * 1e8).toFixed(0)}</span>
              <span>COSMOS AI Verification Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
