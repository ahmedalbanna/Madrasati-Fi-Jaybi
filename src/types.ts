export type LessonType = 'math' | 'reading' | 'science' | 'story';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  image?: string;
  explanation?: string;
}

export interface Quiz {
  question: string;
  voiceUrl?: string; // Placeholder for future audio
  options: QuizOption[];
  feedbackSuccess: string;
  feedbackFailure: string;
}

export interface MicroLesson {
  id: string;
  title: string;
  type: LessonType;
  description: string;
  content: string;
  teacherVoicePrompt: string;
  image?: string;
  quiz?: Quiz;
  adaptiveContent?: {
    content: string;
    quiz: Quiz;
  };
  spokenQuizPrompt?: string;
}

export interface UserProgress {
  completedLessons: string[];
  totalPoints: number;
  quizScores: Record<string, number>;
  badges: string[];
  favoritedLessons: string[];
  hiddenLessons: string[];
}
