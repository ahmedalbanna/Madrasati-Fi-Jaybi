import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Home, BookOpen, Music, User, ArrowRight, Play, CheckCircle2, ChevronRight, Volume2, Share2, Mic, Settings, Trophy, AlertCircle, WifiOff, Star, Trash2, Download } from 'lucide-react';
import { LESSONS } from './data/curriculum';
import { MicroLesson, UserProgress, LessonType, Quiz } from './types';
import { playAudioBeep } from './lib/audio';

// --- Components ---

const TeacherAvatar = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[40px] p-6 border-2 border-[#E5E0D5] relative mb-8"
  >
    <div className="absolute -top-5 right-8 bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-black border-2 border-white shadow-sm">
      أستاذ عمار
    </div>
    <div className="flex gap-4 items-start pt-2">
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-16 h-16 bg-[#FDF2F0] rounded-2xl flex items-center justify-center text-4xl shrink-0"
      >
        👨‍🏫
      </motion.div>
      <p className="text-lg leading-relaxed font-bold tracking-tight">{text}</p>
    </div>
  </motion.div>
);

interface LessonCardProps {
  lesson: MicroLesson;
  isCompleted: boolean;
  isFavorited: boolean;
  onClick: () => void;
  onShare: (e: React.MouseEvent) => void;
  onFavorite: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, isFavorited, onClick, onShare, onFavorite, onDelete }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dragConstraintsRef = React.useRef(null);

  if (isDeleting) return null;

  return (
    <div className="relative mb-2 w-full" ref={dragConstraintsRef}>
      {/* Background for Swipe to Delete */}
      <div className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-end px-6 border border-red-600">
        <Trash2 className="text-white" size={24} />
      </div>
      
      {/* Draggable Card */}
      <motion.div 
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -80, right: 0 }}
        dragSnapToOrigin={false}
        onDragEnd={(e, info) => {
          if (info.offset.x < -40) {
            if (window.confirm("هل تريد إخفاء هذا الدرس؟")) {
              setIsDeleting(true);
              setTimeout(() => onDelete(), 300);
            }
          }
        }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="lesson-card cursor-pointer group relative z-10 w-full"
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0
          ${lesson.type === 'math' ? 'bg-[#FDF2F0] text-brand-primary' : 
            lesson.type === 'reading' ? 'bg-[#F0F7FD] text-[#3B82D4]' : 'bg-[#F4FDF0] text-[#4AD43B]'}`}>
          {lesson.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-xl truncate pr-2 flex items-center gap-2">
            {lesson.title}
          </h3>
          <p className="text-sm text-[#8C8376] truncate font-medium mt-1">{lesson.description}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          {isCompleted ? (
            <CheckCircle2 className="text-green-500 mb-1" size={24} />
          ) : (
            <ChevronRight className="text-[#E5E0D5] mb-1" size={24} />
          )}
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <button 
              onClick={(e) => onFavorite(e)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isFavorited ? 'bg-yellow-100 text-yellow-600' : 'bg-[#FAF7F2] text-[#8C8376] hover:bg-yellow-50 hover:text-yellow-500'
              }`}
            >
              <Star size={14} fill={isFavorited ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(e) => onShare(e)}
              className="w-7 h-7 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8C8376] hover:bg-brand-primary hover:text-white transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const QuizComponent = ({ quiz, onComplete, onFail }: { quiz: NonNullable<MicroLesson['quiz']>, onComplete: (success: boolean) => void, onFail?: () => void }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExplanation, setShowExplanation] = React.useState(false);

  const handleSelect = (optionId: string, isCorrect: boolean) => {
    if (status !== 'idle' && !showExplanation) return;
    if (showExplanation) {
      // Reset if trying again
      setShowExplanation(false);
      setStatus('idle');
      setSelectedId(null);
      return;
    }
    
    setSelectedId(optionId);
    if (isCorrect) {
      setStatus('correct');
      playAudioBeep('correct');
      setTimeout(() => onComplete(true), 1500);
    } else {
      setStatus('wrong');
      playAudioBeep('wrong');
      setShowExplanation(true);
      if (onFail) onFail();
    }
  };

  const selectedOption = quiz.options.find(o => o.id === selectedId);

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-2xl font-black text-center text-brand-secondary tracking-tight">{quiz.question}</h3>
      <div className="grid gap-4">
        {quiz.options.map((opt) => {
          let extraClasses = '';
          if (status !== 'idle') {
             if (opt.isCorrect && showExplanation) extraClasses = 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200'; // Highlight correct
             else if (selectedId === opt.id) extraClasses = status === 'correct' ? 'correct' : 'wrong';
             else extraClasses = 'opacity-50'; // Dim others
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.isCorrect)}
              className={`quiz-option ${extraClasses}`}
              disabled={status === 'correct'}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-5 rounded-2xl text-center font-bold text-lg border-2 ${status === 'correct' ? 'bg-green-100/50 text-green-700 border-green-200' : 'bg-red-100/50 text-red-700 border-red-200 flex flex-col gap-3'}`}
          >
            {status === 'correct' ? quiz.feedbackSuccess : (
               <>
                 <span>{quiz.feedbackFailure}</span>
                 {showExplanation && selectedOption?.explanation && (
                   <span className="text-sm font-medium opacity-90 border-t border-red-200 pt-2 block mt-1">
                     {selectedOption.explanation}
                   </span>
                 )}
                 {showExplanation && (
                   <button onClick={() => { setShowExplanation(false); setStatus('idle'); setSelectedId(null); }} className="mx-auto mt-2 bg-white text-red-700 px-4 py-2 rounded-xl text-sm border border-red-200 shadow-sm active:scale-95">المحاولة مرة أخرى</button>
                 )}
               </>
            )}
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
    return saved ? JSON.parse(saved) : { completedLessons: [], totalPoints: 0, quizScores: {}, badges: ['مبتدئ المعرفة'], favoritedLessons: [], hiddenLessons: [] };
  });

  const [lessonProgressPercent, setLessonProgressPercent] = React.useState(0);
  const [mathFailCount, setMathFailCount] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isStoryPlaying, setIsStoryPlaying] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareMsg, setShareMsg] = React.useState('');
  const [hasBluetoothUpdate, setHasBluetoothUpdate] = React.useState(true); // Mock update available

  React.useEffect(() => {
    localStorage.setItem('madrasati_progress', JSON.stringify(progress));
  }, [progress]);

  // Handle lesson start/end cleanup
  React.useEffect(() => {
    if (currentLesson) {
      setLessonProgressPercent(10);
      setMathFailCount(0);
      setIsStoryPlaying(false);
      window.scrollTo(0, 0);
    }
  }, [currentLesson]);

  const handleLessonComplete = () => {
    if (currentLesson) {
      setLessonProgressPercent(100);
      setTimeout(() => {
        if (!progress.completedLessons.includes(currentLesson.id)) {
          setProgress(prev => ({
            ...prev,
            completedLessons: [...prev.completedLessons, currentLesson.id],
            totalPoints: prev.totalPoints + 10,
            badges: prev.completedLessons.length === 2 && !prev.badges?.includes('شعلة الذكاء') ? [...prev.badges, 'شعلة الذكاء'] : prev.badges
          }));
        }
        setCurrentLesson(null);
      }, 1000);
    }
  };

  const handleQuizFail = () => {
    if (currentLesson?.type === 'math') {
      setMathFailCount(p => p + 1);
    }
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsSharing(true);
    setShareMsg('يتم تحضير الملف...');
    setTimeout(() => setShareMsg('نقطة البلوتوث نشطة، في انتظار الاستقبال!'), 1500);
    setTimeout(() => {
      setIsSharing(false);
      setShareMsg('');
    }, 4500);
  };

  const toggleRecording = () => {
    if (isRecording) {
      playAudioBeep('stop');
      setIsRecording(false);
      handleLessonComplete();
    } else {
      playAudioBeep('start');
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(curr => {
           if (curr) {
              playAudioBeep('stop');
              handleLessonComplete();
              return false;
           }
           return curr;
        });
      }, 5000); // 5 sec recording mock
    }
  };

  const currentTabLessons = LESSONS.filter(l => view === 'home' ? l.type !== 'story' : l.type === 'story').filter(l => !progress.hiddenLessons?.includes(l.id));

  const showAdaptiveMath = currentLesson?.type === 'math' && mathFailCount >= 2 && currentLesson.adaptiveContent;

  return (
    <div className="min-h-screen relative pb-24 max-w-lg mx-auto bg-brand-bg shadow-2xl">
      {/* Story Screen Off Overlay */}
      <AnimatePresence>
        {isStoryPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white p-6"
          >
            <Volume2 size={80} className="mb-6 opacity-30 animate-pulse text-brand-primary" />
            <p className="text-xl font-bold opacity-60 mb-12 animate-pulse">الشاشة مطفأة لتوفير البطارية...</p>
            <button 
              onClick={() => {
                setIsStoryPlaying(false);
                handleLessonComplete();
              }}
              className="bg-white/10 px-8 py-4 rounded-full font-bold active:bg-white/20 uppercase tracking-widest text-sm border border-white/20"
            >
              استيقاظ وإيقاف الحكاية
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-[#F0EBE3] sticky top-0 z-10 border-b-2 border-[#E5E0D5]">
        <div>
          <h1 className="text-2xl font-black text-brand-secondary tracking-tight">مدرستي <span className="text-brand-primary">في جيبي</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <WifiOff size={14} className="text-[#8C8376]" />
            <span className="text-[10px] text-[#8C8376] font-black tracking-[0.2em] uppercase">بدون إنترنت</span>
          </div>
        </div>
        <div className="bg-white border-2 border-[#E5E0D5] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <Trophy size={16} className="text-brand-primary" />
          <span className="text-brand-secondary font-black text-sm">{progress.totalPoints}</span>
        </div>
      </header>

      {/* Bluetooth Update Banner */}
      <AnimatePresence>
         {hasBluetoothUpdate && view === 'home' && !currentLesson && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="bg-[#EBF5FF] border-b border-[#3B82D4]/20 px-6 py-4 flex items-center justify-between"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#3B82D4]">
                     <Download size={20} />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-[#3B82D4]">حزمة دروس جديدة متوفرة!</h4>
                     <p className="text-xs text-[#3B82D4]/80">حجم الحزمة ٥ ميغابايت - عبر البلوتوث</p>
                  </div>
               </div>
               <button 
                  onClick={() => {
                     alert("جاري الاتصال بنقطة البلوتوث المحيطة وتثبيت الحزمة المجانية...");
                     setHasBluetoothUpdate(false);
                     setProgress(p => ({ ...p, badges: [...p.badges, 'ناشر العلم'] }));
                  }}
                  className="bg-[#3B82D4] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#3B82D4]/90"
               >
                  تثبيت
               </button>
            </motion.div>
         )}
      </AnimatePresence>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {!currentLesson ? (
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {view === 'home' && <TeacherAvatar text="أهلاً يا بطل! جاهز لنتعلم شيئاً جديداً ونجمع نقاط المعرفة؟" />}
              {view === 'library' && <TeacherAvatar text="هنا نكتشف قصصاً جميلة لنسمعها معاً قبل النوم." />}
              
              <div className="grid gap-4">
                {currentTabLessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    isCompleted={progress.completedLessons.includes(lesson.id)}
                    isFavorited={progress.favoritedLessons?.includes(lesson.id)}
                    onClick={() => setCurrentLesson(lesson)}
                    onShare={handleShare}
                    onFavorite={(e) => {
                       e.stopPropagation();
                       setProgress(p => {
                          const fav = p.favoritedLessons || [];
                          return {
                             ...p,
                             favoritedLessons: fav.includes(lesson.id) ? fav.filter(id => id !== lesson.id) : [...fav, lesson.id]
                          };
                       });
                    }}
                    onDelete={() => {
                        setProgress(p => ({
                             ...p,
                             hiddenLessons: [...(p.hiddenLessons || []), lesson.id]
                        }));
                    }}
                  />
                ))}
              </div>

              {view === 'profile' && (
                <div className="space-y-8">
                  {/* Parent Tracker Card */}
                  <div className="bg-white rounded-[40px] border border-[#E5E0D5] p-8 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-xs font-bold text-[#8C8376] uppercase tracking-widest">تتبع الولي والمنجزات</span>
                        <h2 className="text-4xl font-black mt-2">{progress.totalPoints} <span className="text-sm text-[#8C8376] font-bold">نقطة</span></h2>
                      </div>
                      <div className="w-16 h-16 bg-[#FDF2F0] rounded-2xl flex items-center justify-center text-3xl font-black text-brand-primary pb-1 border border-[#E5E0D5]">
                        🏆
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-8 bg-[#FAF7F2] p-4 rounded-3xl border border-[#E5E0D5]">
                      <div className="flex justify-between text-sm font-black text-brand-secondary">
                        <span>الدروس المكتملة</span>
                        <span>{progress.completedLessons.length} / {LESSONS.length}</span>
                      </div>
                      <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-[#E5E0D5]">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(progress.completedLessons.length / LESSONS.length) * 100}%` }}
                          className="h-full bg-brand-accent px-1"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {progress.badges.map((badge, idx) => (
                         <span key={idx} className="bg-[#FAF7F2] border-2 border-[#E5E0D5] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 text-[#8C8376]">
                           🎖️ {badge}
                         </span>
                       ))}
                    </div>
                  </div>

                  {/* Share Component */}
                  <div className="bg-brand-secondary p-8 rounded-[40px] text-white overflow-hidden relative shadow-lg">
                    <div className="relative z-10">
                      <h3 className="font-black mb-2 flex items-center gap-2 text-xl">
                        <Share2 size={24} className="text-brand-primary" /> شارك التطبيق
                      </h3>
                      <p className="text-sm text-white/50 mb-8 font-medium leading-relaxed">
                        انشر العلم لجيرانك عبر البلوتوث مجاناً دون إنترنت.
                      </p>
                      <button 
                        onClick={() => handleShare()}
                        disabled={isSharing}
                        className="w-full bg-white text-brand-secondary py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-80 text-lg border-2 border-transparent active:border-white/20 active:bg-transparent active:text-white"
                      >
                        {isSharing ? (
                          <span className="animate-pulse">{shareMsg}</span>
                        ) : (
                          <>
                            تفعيل نقطة النشر
                          </>
                        )}
                      </button>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 border-[16px] border-white/5 rounded-full pointer-events-none"></div>
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
              className="bg-white rounded-[40px] border border-[#E5E0D5] p-8 shadow-xl min-h-[75vh] flex flex-col relative overflow-hidden"
              onScroll={(e) => {
                 const target = e.currentTarget;
                 const scrolled = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
                 setLessonProgressPercent(Math.max(10, scrolled));
              }}
            >
              {/* Top Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#F0EBE3]">
                <div 
                  className="h-full bg-brand-accent transition-all duration-300"
                  style={{ width: `${lessonProgressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center mb-8 mt-2">
                <button 
                  onClick={() => setCurrentLesson(null)}
                  className="font-bold text-[#8C8376] hover:text-brand-secondary flex items-center gap-2 bg-[#FAF7F2] px-4 py-2 rounded-full border border-[#E5E0D5] active:scale-95 transition-transform"
                >
                  <ArrowRight size={18} /> عودة
                </button>
                <div className="flex gap-2">
                   <button onClick={(e) => handleShare(e)} className="bg-[#FAF7F2] w-10 h-10 rounded-full flex items-center justify-center border border-[#E5E0D5] text-[#8C8376]"><Share2 size={16} /></button>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-7xl text-center mb-8 mt-4 bg-[#FAF7F2] w-32 h-32 flex items-center justify-center rounded-[32px] mx-auto border-2 border-[#E5E0D5]">
                  {currentLesson.image}
                </div>
                <h2 className="text-3xl font-black mb-10 tracking-tight text-center">{currentLesson.title}</h2>
                <TeacherAvatar text={currentLesson.teacherVoicePrompt} />
                
                <div className="prose prose-lg text-[#8C8376] font-medium leading-relaxed mb-10 text-center">
                  {currentLesson.content}
                </div>

                {/* Adaptive Math Learning block */}
                {showAdaptiveMath && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#FDF2F0] border-2 border-brand-primary rounded-3xl p-6 mb-8"
                  >
                    <div className="flex gap-2 items-center text-brand-primary font-black mb-4">
                      <AlertCircle size={24} />
                      توضيح إضافي للمساعدة
                    </div>
                    <p className="font-bold text-brand-secondary mb-6 leading-relaxed">
                      {currentLesson.adaptiveContent?.content}
                    </p>
                    <QuizComponent quiz={currentLesson.adaptiveContent!.quiz!} onComplete={handleLessonComplete} />
                  </motion.div>
                )}

                {/* Standard Quiz */}
                {currentLesson.quiz && !showAdaptiveMath && (
                  <QuizComponent quiz={currentLesson.quiz} onComplete={handleLessonComplete} onFail={handleQuizFail} />
                )}

                {/* Spoken Quiz for Reading */}
                {currentLesson.spokenQuizPrompt && (
                  <div className="mt-8 bg-[#F0F7FD] border-2 border-[#3B82D4] p-8 rounded-3xl text-center">
                    <h3 className="font-black text-xl mb-3 text-[#3B82D4] flex items-center justify-center gap-2"><Mic size={24}/> تمرين صوتي</h3>
                    <p className="text-brand-secondary font-bold mb-8 leading-relaxed">{currentLesson.spokenQuizPrompt}</p>
                    <button 
                      onClick={toggleRecording}
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white shadow-xl transition-all ${isRecording ? 'bg-brand-primary animate-pulse scale-110 shadow-brand-primary/50' : 'bg-[#3B82D4] hover:scale-105 shadow-[#3B82D4]/50'}`}
                    >
                      <Mic size={40} />
                    </button>
                    <p className="text-sm text-brand-secondary/60 mt-6 font-bold">
                      {isRecording ? "جاري التسجيل... انقر للإيقاف" : "انقر للتسجيل"}
                    </p>
                  </div>
                )}

                {/* Story specific player view */}
                {currentLesson.type === 'story' && (
                  <div className="mt-12 flex flex-col items-center gap-6">
                    <button 
                      onClick={() => setIsStoryPlaying(true)}
                      className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Play size={24} fill="currentColor" /> استماع الآن
                    </button>
                    <p className="text-xs font-bold text-[#8C8376] text-center max-w-xs leading-relaxed opacity-60">سيقوم التطبيق بإطفاء الشاشة أثناء القصة للحفاظ على بطارية الهاتف ولتخفيض التشتت.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t-2 border-[#E5E0D5] px-6 py-4 flex justify-between items-center z-40 shadow-[0_-10px_40px_rgba(45,36,36,0.05)] pb-safe">
        <button onClick={() => setView('home')} className={`nav-item flex-1 ${view === 'home' ? 'active' : ''}`}>
          <BookOpen size={28} className="mb-2" />
          <span className="text-[10px] font-black tracking-widest uppercase">الدروس</span>
        </button>
        <button onClick={() => setView('library')} className={`nav-item flex-1 ${view === 'library' ? 'active' : ''}`}>
          <Music size={28} className="mb-2" />
          <span className="text-[10px] font-black tracking-widest uppercase">الحكايات</span>
        </button>
        <button onClick={() => setView('profile')} className={`nav-item flex-1 ${view === 'profile' ? 'active' : ''}`}>
          <User size={28} className="mb-2" />
          <span className="text-[10px] font-black tracking-widest uppercase">البطل</span>
        </button>
      </nav>
    </div>
  );
}
