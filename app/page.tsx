'use client'

import { useState, useEffect, useMemo } from 'react'
import questionsData from '@/data/questions.json'

interface Question {
  id: number
  question: string
  answer: string
  category: string
}

interface ParsedQuestion {
  questionText: string
  options: { letter: string; text: string }[]
  correctAnswer: string
  explanation: string
}

export default function StudyApp() {
  const allQuestions = questionsData as Question[]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffled, setShuffled] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string>('All')
  const [quizMode, setQuizMode] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)
  const [questionCount, setQuestionCount] = useState<number | null>(null)

  // Get all unique sections from questions
  const sections = useMemo(() => {
    const uniqueSections = Array.from(new Set(allQuestions.map(q => q.category)))
    return ['All', ...uniqueSections.sort()]
  }, [allQuestions])

  // Filter questions based on selected section
  const questions = useMemo(() => {
    let filtered = selectedSection === 'All' 
      ? allQuestions 
      : allQuestions.filter(q => q.category === selectedSection)
    
    // If in quiz mode and "All" section, and questionCount is set, randomly select that many questions
    if (quizMode && selectedSection === 'All' && questionCount !== null && questionCount > 0) {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, Math.min(questionCount, filtered.length))
    }
    
    // If shuffled (and not in "All" quiz mode with questionCount), return shuffled copy, otherwise return original order
    if (shuffled && !(quizMode && selectedSection === 'All' && questionCount !== null)) {
      return [...filtered].sort(() => Math.random() - 0.5)
    }
    
    return filtered
  }, [selectedSection, allQuestions, shuffled, quizMode, questionCount])

  // Parse question to extract options and correct answer
  const parseQuestion = (q: Question): ParsedQuestion => {
    const lines = q.question.split('\n')
    const questionText = lines[0]
    const options: { letter: string; text: string }[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      const match = line.match(/^([A-D])\.\s*(.+)$/)
      if (match) {
        options.push({ letter: match[1], text: match[2] })
      }
    }

    // Extract correct answer from answer field
    const answerMatch = q.answer.match(/^([A-D])\./)
    const correctAnswer = answerMatch ? answerMatch[1] : ''
    const explanation = q.answer.replace(/^[A-D]\.\s*/, '').split(' - ')[1] || q.answer

    return { questionText, options, correctAnswer, explanation }
  }

  // Reset when section or mode changes
  useEffect(() => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setSelectedAnswers({})
    setShowResults(false)
    // Reset question count when switching away from "All" section or out of quiz mode
    if (selectedSection !== 'All' || !quizMode) {
      setQuestionCount(null)
    }
  }, [selectedSection, quizMode])

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const parsedQuestion = currentQuestion ? parseQuestion(currentQuestion) : null

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * totalQuestions)
    setCurrentIndex(randomIndex)
    setShowAnswer(false)
  }

  const handleShuffle = () => {
    setShuffled(true)
    setCurrentIndex(0)
    setShowAnswer(false)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleReset = () => {
    setShuffled(false)
    setCurrentIndex(0)
    setShowAnswer(false)
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleAnswerSelect = (letter: string) => {
    if (quizMode && !showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: letter
      })
    }
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(q => {
      const parsed = parseQuestion(q)
      const userAnswer = selectedAnswers[q.id]
      if (userAnswer === parsed.correctAnswer) {
        correct++
      }
    })
    return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) }
  }

  const score = showResults ? calculateScore() : null

  if (totalQuestions === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>COMPE 561 Study App</h1>
          <div style={styles.sectionContainer}>
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                style={{
                  ...styles.sectionButton,
                  ...(selectedSection === section && styles.activeSectionButton),
                }}
              >
                {section}
              </button>
            ))}
          </div>
          <p style={styles.emptyMessage}>
            No questions found in the "{selectedSection}" section. Please add questions to data/questions.json
          </p>
        </div>
      </div>
    )
  }

  // Quiz Results View
  if (quizMode && showResults) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Quiz Results</h1>
          
          <div style={styles.scoreContainer}>
            <div style={styles.scoreCircle}>
              <div style={styles.scoreNumber}>{score?.percentage}%</div>
              <div style={styles.scoreLabel}>Score</div>
            </div>
            <div style={styles.scoreDetails}>
              <div style={styles.scoreText}>
                <strong>{score?.correct}</strong> out of <strong>{score?.total}</strong> correct
              </div>
            </div>
          </div>

          <div style={styles.resultsList}>
            {questions.map((q, idx) => {
              const parsed = parseQuestion(q)
              const userAnswer = selectedAnswers[q.id]
              const isCorrect = userAnswer === parsed.correctAnswer
              
              return (
                <div key={q.id} style={{
                  ...styles.resultItem,
                  ...(isCorrect ? styles.correctItem : styles.incorrectItem)
                }}>
                  <div style={styles.resultHeader}>
                    <span style={styles.resultNumber}>Question {idx + 1}</span>
                    <span style={{
                      ...styles.resultBadge,
                      ...(isCorrect ? styles.correctBadge : styles.incorrectBadge)
                    }}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <div style={styles.resultQuestion}>{parsed.questionText}</div>
                  <div style={styles.resultAnswers}>
                    <div style={styles.resultAnswerRow}>
                      <strong>Your answer:</strong> {userAnswer ? `${userAnswer}. ${parsed.options.find(o => o.letter === userAnswer)?.text || ''}` : 'Not answered'}
                    </div>
                    <div style={styles.resultAnswerRow}>
                      <strong>Correct answer:</strong> {parsed.correctAnswer}. {parsed.options.find(o => o.letter === parsed.correctAnswer)?.text || ''}
                    </div>
                    <div style={styles.resultExplanation}>{parsed.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={styles.buttonContainer}>
            <button
              onClick={() => {
                setShowResults(false)
                setSelectedAnswers({})
                setCurrentIndex(0)
              }}
              style={{
                ...styles.button,
                ...styles.primaryButton,
              }}
            >
              Retake Quiz
            </button>
            <button
              onClick={() => setQuizMode(false)}
              style={{
                ...styles.button,
                ...styles.secondaryButton,
              }}
            >
              Back to Study Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>COMPE 561 Final Study</h1>
          <div style={styles.progress}>
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <button
            onClick={() => setQuizMode(false)}
            style={{
              ...styles.modeButton,
              ...(!quizMode && styles.activeModeButton),
            }}
          >
            📚 Study Mode
          </button>
          <button
            onClick={() => {
              setQuizMode(true)
              setShowResults(false)
              setSelectedAnswers({})
            }}
            style={{
              ...styles.modeButton,
              ...(quizMode && styles.activeModeButton),
            }}
          >
            ✏️ Quiz Mode
          </button>
        </div>

        {/* Section Selector */}
        <div style={styles.sectionContainer}>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => {
                setSelectedSection(section)
                setShuffled(false)
              }}
              style={{
                ...styles.sectionButton,
                ...(selectedSection === section && styles.activeSectionButton),
              }}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Question Count Selector for "All" Quiz Mode */}
        {quizMode && selectedSection === 'All' && !showResults && (
          <div style={styles.questionCountContainer}>
            <label style={styles.questionCountLabel}>
              Number of Questions:
              <select
                value={questionCount || ''}
                onChange={(e) => {
                  const count = e.target.value ? parseInt(e.target.value) : null
                  setQuestionCount(count)
                  setCurrentIndex(0)
                  setSelectedAnswers({})
                  setShowResults(false)
                }}
                style={styles.questionCountSelect}
              >
                <option value="">All ({allQuestions.length})</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
            </label>
            {questionCount && (
              <div style={styles.questionCountInfo}>
                {questionCount} random questions selected
              </div>
            )}
          </div>
        )}

        {shuffled && (
          <div style={styles.shuffledBadge}>
            🔀 Shuffled Mode
          </div>
        )}

        {currentQuestion && parsedQuestion && (
          <>
            <div style={styles.category}>
              {currentQuestion.category}
            </div>

            <div style={styles.questionContainer}>
              <h2 style={styles.questionLabel}>Question:</h2>
              <p style={styles.question}>{parsedQuestion.questionText}</p>
            </div>

            {/* Quiz Mode: Show selectable options */}
            {quizMode ? (
              <div style={styles.optionsContainer}>
                {parsedQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.letter
                  const showCorrect = showResults && option.letter === parsedQuestion.correctAnswer
                  const showIncorrect = showResults && isSelected && option.letter !== parsedQuestion.correctAnswer
                  
                  return (
                    <button
                      key={option.letter}
                      onClick={() => handleAnswerSelect(option.letter)}
                      disabled={showResults}
                      style={{
                        ...styles.optionButton,
                        ...(isSelected && !showResults && styles.selectedOption),
                        ...(showCorrect && styles.correctOption),
                        ...(showIncorrect && styles.incorrectOption),
                        ...(showResults && styles.disabledOption),
                      }}
                    >
                      <span style={styles.optionLetter}>{option.letter}.</span>
                      <span style={styles.optionText}>{option.text}</span>
                      {showCorrect && <span style={styles.checkmark}>✓</span>}
                      {showIncorrect && <span style={styles.crossmark}>✗</span>}
                    </button>
                  )
                })}
              </div>
            ) : (
              // Study Mode: Show options and answer when toggled
              <>
                {/* Display options in study mode */}
                {parsedQuestion.options.length > 0 && (
                  <div style={styles.studyOptionsContainer}>
                    <h2 style={styles.optionsLabel}>Options:</h2>
                    {parsedQuestion.options.map((option) => {
                      const isCorrect = option.letter === parsedQuestion.correctAnswer
                      return (
                        <div
                          key={option.letter}
                          style={{
                            ...styles.studyOption,
                            ...(showAnswer && isCorrect && styles.correctStudyOption),
                          }}
                        >
                          <span style={styles.optionLetter}>{option.letter}.</span>
                          <span style={styles.optionText}>{option.text}</span>
                          {showAnswer && isCorrect && <span style={styles.checkmark}>✓</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
                {showAnswer && (
                  <div style={styles.answerContainer}>
                    <h2 style={styles.answerLabel}>Answer:</h2>
                    <p style={styles.answer}>{currentQuestion.answer}</p>
                  </div>
                )}
                <div style={styles.buttonContainer}>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                    }}
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                </div>
              </>
            )}

            {/* Quiz Mode: Submit button and progress */}
            {quizMode && !showResults && (
              <div style={styles.buttonContainer}>
                <div style={styles.quizProgress}>
                  Answered: {Object.keys(selectedAnswers).length} / {totalQuestions}
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(Object.keys(selectedAnswers).length === 0 && styles.disabledButton),
                  }}
                >
                  Submit Quiz
                </button>
              </div>
            )}

            <div style={styles.navigationContainer}>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{
                  ...styles.button,
                  ...styles.navButton,
                  ...(currentIndex === 0 && styles.disabledButton),
                }}
              >
                ← Previous
              </button>

              {!quizMode && (
                <button
                  onClick={handleRandom}
                  style={{
                    ...styles.button,
                    ...styles.navButton,
                  }}
                >
                  🎲 Random
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={currentIndex === totalQuestions - 1}
                style={{
                  ...styles.button,
                  ...styles.navButton,
                  ...(currentIndex === totalQuestions - 1 && styles.disabledButton),
                }}
              >
                Next →
              </button>
            </div>

            {!quizMode && (
              <div style={styles.utilityContainer}>
                <button
                  onClick={handleShuffle}
                  style={{
                    ...styles.button,
                    ...styles.utilityButton,
                  }}
                >
                  🔀 Shuffle All
                </button>
                {shuffled && (
                  <button
                    onClick={handleReset}
                    style={{
                      ...styles.button,
                      ...styles.utilityButton,
                    }}
                  >
                    ↻ Reset Order
                  </button>
                )}
              </div>
            )}

            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
    margin: 0,
  },
  progress: {
    fontSize: '1rem',
    color: '#666',
    fontWeight: '500',
  },
  modeToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  modeButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    backgroundColor: 'white',
    color: '#495057',
    transition: 'all 0.2s ease',
    flex: 1,
    maxWidth: '200px',
  },
  activeModeButton: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  shuffledBadge: {
    backgroundColor: '#f0f0f0',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    marginBottom: '20px',
    display: 'inline-block',
  },
  category: {
    fontSize: '0.9rem',
    color: '#764ba2',
    fontWeight: '600',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  questionContainer: {
    marginBottom: '30px',
  },
  questionLabel: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '10px',
    fontWeight: '600',
  },
  question: {
    fontSize: '1.25rem',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '20px',
  },
  optionsContainer: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  studyOptionsContainer: {
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionsLabel: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '10px',
    fontWeight: '600',
  },
  studyOption: {
    padding: '16px 20px',
    fontSize: '1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  correctStudyOption: {
    borderColor: '#28a745',
    backgroundColor: '#d4edda',
  },
  optionButton: {
    padding: '16px 20px',
    fontSize: '1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'white',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  selectedOption: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  correctOption: {
    borderColor: '#28a745',
    backgroundColor: '#d4edda',
  },
  incorrectOption: {
    borderColor: '#dc3545',
    backgroundColor: '#f8d7da',
  },
  disabledOption: {
    cursor: 'not-allowed',
  },
  optionLetter: {
    fontWeight: 'bold',
    color: '#667eea',
    minWidth: '24px',
  },
  optionText: {
    flex: 1,
  },
  checkmark: {
    color: '#28a745',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  crossmark: {
    color: '#dc3545',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  answerContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    borderLeft: '4px solid #667eea',
  },
  answerLabel: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '10px',
    fontWeight: '600',
  },
  answer: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#444',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  navigationContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  utilityContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    color: 'white',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    width: '100%',
    marginTop: '10px',
  },
  navButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    flex: 1,
    minWidth: '120px',
  },
  utilityButton: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    flex: 1,
    minWidth: '150px',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '20px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    transition: 'width 0.3s ease',
  },
  emptyMessage: {
    fontSize: '1.1rem',
    color: '#666',
    textAlign: 'center',
    padding: '40px 20px',
  },
  sectionContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    paddingBottom: '20px',
    borderBottom: '2px solid #e9ecef',
  },
  sectionButton: {
    padding: '10px 20px',
    fontSize: '0.95rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    backgroundColor: 'white',
    color: '#495057',
    transition: 'all 0.2s ease',
  },
  activeSectionButton: {
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  scoreNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: '0.9rem',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  scoreDetails: {
    textAlign: 'center',
  },
  scoreText: {
    fontSize: '1.2rem',
    color: '#333',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  resultItem: {
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #e9ecef',
  },
  correctItem: {
    borderColor: '#28a745',
    backgroundColor: '#f8fff9',
  },
  incorrectItem: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f8',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  resultNumber: {
    fontWeight: 'bold',
    color: '#333',
  },
  resultBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  correctBadge: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  incorrectBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  resultQuestion: {
    fontSize: '1.1rem',
    marginBottom: '15px',
    color: '#333',
  },
  resultAnswers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  resultAnswerRow: {
    fontSize: '0.95rem',
    color: '#555',
  },
  resultExplanation: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#666',
    fontStyle: 'italic',
  },
  quizProgress: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: '500',
  },
  questionCountContainer: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid #667eea',
  },
  questionCountLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  questionCountSelect: {
    padding: '8px 12px',
    fontSize: '1rem',
    border: '2px solid #e9ecef',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#333',
    cursor: 'pointer',
    fontWeight: '500',
    minWidth: '120px',
  },
  questionCountInfo: {
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: '500',
    marginTop: '5px',
  },
}
