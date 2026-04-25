import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, Music, User, ArrowRight, Play, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';
import { LESSONS } from './data/curriculum';
import { MicroLesson, UserProgress, LessonType } from './types';

// --- Components ---

const TeacherAvatar = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-brand-secondary/20 relative mb-8"
  >
    <div className="absolute -top-6 right-8 bg-brand-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
      أستاذ عمار
    </div>
    <div className="flex gap-4 items-start">
      <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center text-4xl shrink-0">
        👨‍🏫
      </div>
      <p className="text-lg leading-relaxed text-gray-700">{text}</p>
    </div>
    <button className="absolute -bottom-4 left-8 bg-brand-accent text-white p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform">
      <Volume2 size={24} />
    </button>
  </motion.div>
);

const LessonCard = ({ lesson, isCompleted, onClick }: { lesson: MicroLesson, isCompleted: boolean, onClick: () => void }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="lesson-card flex items-center gap-4 cursor-pointer"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl 
      ${lesson.type === 'math' ? 'bg-blue-50 text-blue-600' : 
        lesson.type === 'reading' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
      {lesson.image}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-gray-900 truncate">{lesson.title}</h3>
      <p className="text-sm text-gray-500 truncate">{lesson.description}</p>
    </div>
    {isCompleted ? (
      <CheckCircle2 className="text-green-500" size={24} />
    ) : (
      <ChevronRight className="text-gray-300" size={24} />
    )}
  </motion.div>
);

const QuizComponent = ({ quiz, onComplete }: { quiz: NonNullable<MicroLesson['quiz']>, onComplete: (success: boolean) => void }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (status !== 'idle') return;
    setSelectedId(optionId);
    if (isCorrect) {
      setStatus('correct');
      setTimeout(() => onComplete(true), 1500);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        setSelectedId(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-bold text-center text-gray-800">{quiz.question}</h3>
      <div className="grid gap-3">
        {quiz.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id, opt.isCorrect)}
            className={`quiz-option ${selectedId === opt.id ? (status === 'correct' ? 'correct' : 'wrong') : ''}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-center font-bold ${status === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {status === 'correct' ? quiz.feedbackSuccess : quiz.feedbackFailure}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = React.useState<'home' | 'library' | 'profile'>('home');
  const [currentLesson, setCurrentLesson] = React.useState<MicroLesson | null>(null);
  const [progress, setProgress] = React.useState<UserProgress>(() => {
    const saved = localStorage.getItem('madrasati_progress');
    return saved ? JSON.parse(saved) : { completedLessons: [], totalPoints: 0 };
  });

  React.useEffect(() => {
    localStorage.setItem('madrasati_progress', JSON.stringify(progress));
  }, [progress]);

  const handleLessonComplete = () => {
    if (currentLesson) {
      if (!progress.completedLessons.includes(currentLesson.id)) {
        setProgress(prev => ({
          completedLessons: [...prev.completedLessons, currentLesson.id],
          totalPoints: prev.totalPoints + 10
        }));
      }
      setCurrentLesson(null);
    }
  };

  const currentTabLessons = LESSONS.filter(l => view === 'home' ? l.type !== 'story' : l.type === 'story');

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-brand-primary">مدرستي في جيبي</h1>
          <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">اليمن السعيد 🇾🇪</p>
        </div>
        <div className="bg-brand-secondary/10 px-3 py-1 rounded-full flex items-center gap-2">
          <span className="text-brand-secondary font-bold">{progress.totalPoints}</span>
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">✨</div>
        </div>
      </header>

      <main className="p-4">
        <AnimatePresence mode="wait">
          {!currentLesson ? (
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {view === 'home' && <TeacherAvatar text="أهلاً يا بطل! جاهز لنتعلم شيئاً جديداً اليوم؟" />}
              {view === 'library' && <TeacherAvatar text="هنا نكتشف قصصاً جميلة لنسمعها معاً." />}
              
              <div className="grid gap-4">
                {currentTabLessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    isCompleted={progress.completedLessons.includes(lesson.id)}
                    onClick={() => setCurrentLesson(lesson)}
                  />
                ))}
              </div>

              {view === 'profile' && (
                <div className="space-y-8">
                  <div className="text-center py-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-brand-secondary/10 rounded-full mx-auto flex items-center justify-center text-5xl mb-4">
                      👤
                    </div>
                    <h2 className="text-2xl font-bold">ملفي الشخصي</h2>
                    <p className="text-gray-500">تم إكمال {progress.completedLessons.length} دروس بنجاح!</p>
                  </div>

                  <div className="bg-brand-accent/10 p-6 rounded-3xl border border-brand-accent/20">
                    <h3 className="font-bold text-brand-accent mb-2 flex items-center gap-2 text-lg">
                      🏴‍☠️ شارك العلم (عبر البلوتوث)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      هل لديك جار يحتاج للتعلم؟ يمكنك مشاركة نسخة من هذا التطبيق معه بسهولة حتى لو لم يكن لديك إنترنت.
                    </p>
                    <button className="w-full bg-brand-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform">
                      <Volume2 size={20} className="rotate-90" />
                      إرسال التطبيق الآن
                    </button>
                    <p className="text-[10px] text-center text-brand-accent/60 mt-3">
                      * اضغط هنا سيقوم هاتفك بتحضير الملف للإرسال عبر البلوتوث.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-sm min-h-[70vh] flex flex-col"
            >
              <button 
                onClick={() => setCurrentLesson(null)}
                className="self-start text-gray-400 hover:text-gray-900 mb-6 flex items-center gap-2"
              >
                <ArrowRight size={20} />
                عودة
              </button>

              <div className="flex-1">
                <div className="text-6xl text-center mb-8 bg-brand-bg w-32 h-32 flex items-center justify-center rounded-3xl mx-auto">
                  {currentLesson.image}
                </div>
                <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                <TeacherAvatar text={currentLesson.teacherVoicePrompt} />
                
                <div className="prose prose-sm text-gray-600 mb-8">
                  {currentLesson.content}
                </div>

                {currentLesson.quiz && (
                  <QuizComponent quiz={currentLesson.quiz} onComplete={handleLessonComplete} />
                )}

                {currentLesson.type === 'story' && (
                  <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        className="bg-brand-secondary h-full"
                      />
                    </div>
                    <button 
                      onClick={handleLessonComplete}
                      className="bg-brand-secondary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg"
                    >
                      <Play size={20} fill="currentColor" />
                      استماع الآن
                    </button>
                    <p className="text-xs text-gray-400">سوف تُطفأ الشاشة تلقائياً لتوفير البطارية بعد دقيقة.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex justify-around items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView('home')} className={`nav-item ${view === 'home' ? 'active' : ''}`}>
          <BookOpen size={24} />
          <span className="text-[10px] font-bold">الدروس</span>
        </button>
        <button onClick={() => setView('library')} className={`nav-item ${view === 'library' ? 'active' : ''}`}>
          <Music size={24} />
          <span className="text-[10px] font-bold">الحكايات</span>
        </button>
        <button onClick={() => setView('profile')} className={`nav-item ${view === 'profile' ? 'active' : ''}`}>
          <User size={24} />
          <span className="text-[10px] font-bold">البطل</span>
        </button>
      </nav>
    </div>
  );
}
