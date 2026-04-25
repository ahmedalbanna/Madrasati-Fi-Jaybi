import { MicroLesson } from '../types';

export const LESSONS: MicroLesson[] = [
  {
    id: 'math-1',
    title: 'عد الأغنام (الأرقام 1-5)',
    type: 'math',
    description: 'تعلم كيف نعد الأغنام في المرعى.',
    teacherVoicePrompt: 'أهلاً يا بطل، أنا أستاذك عمار. خلينا نعد كم أغنام معانا في هذا الحوش اليوم.',
    content: 'في الصورة لدينا مجموعة من الأغنام. ابدأ العد معي: واحد، اثنان، ثلاثة...',
    image: '🐏',
    quiz: {
      question: 'كم أغنام ترى في الصورة؟',
      options: [
        { id: 'a', text: 'ثلاثة', isCorrect: true, explanation: 'هناك ثلاثة رؤوس بيضاء في الصورة.' },
        { id: 'b', text: 'خمسة', isCorrect: false, explanation: 'خمسة رقم كبير جداً لعدد هذه الأغنام.' },
        { id: 'c', text: 'واحد', isCorrect: false, explanation: 'هناك أكثر من خروف واحد.' }
      ],
      feedbackSuccess: 'ممتاز! أنت شطور فعلاً.',
      feedbackFailure: 'حاول مرة أخرى، أنت تستطيع فعلها!'
    },
    adaptiveContent: {
      content: 'يبدو أن الأمور بحاجة لتوضيح أكثر. دعنا نعد أصابع اليد الواحدة معاً: 1، 2، 3! الآن، لكل إصبع خروف. كم خروف لدينا إذن؟',
      quiz: {
        question: 'بعد عد الأصابع.. كم خروف لدينا؟',
        options: [
          { id: 'a', text: 'اثنان', isCorrect: false },
          { id: 'b', text: 'خمسة', isCorrect: false },
          { id: 'c', text: 'ثلاثة', isCorrect: true }
        ],
        feedbackSuccess: 'رائع جداً! الإصبع الواحد لخروف واحد.',
        feedbackFailure: 'لا عليك، سنتعلم معاً بالتكرار.'
      }
    }
  },
  {
    id: 'read-1',
    title: 'حرف الألف (أ)',
    type: 'reading',
    description: 'أ كما في كلمة أرنب.',
    teacherVoicePrompt: 'تعرف يا بطل كيف نكتب حرف الألف؟ هو مثل العصا واقفة.',
    content: 'الألف هو أول الحروف. ننطقه "أَ" كما في كلمة "أسد" و "أرنب".',
    image: '🦁',
    quiz: {
      question: 'أي من هؤلاء يبدأ بحرف الألف؟',
      options: [
        { id: 'a', text: 'جمل', isCorrect: false },
        { id: 'b', text: 'أسد', isCorrect: true },
        { id: 'c', text: 'بنت', isCorrect: false }
      ],
      feedbackSuccess: 'رائع يا بطل!',
      feedbackFailure: 'انظر جيداً للأحرف، حاول مرة أخرى.'
    },
    spokenQuizPrompt: "اقرأ الآية الأولى من سورة الإخلاص بصوتك وسنستمع إليك."
  },
  {
    id: 'sci-1',
    title: 'الشمس والقمر',
    type: 'science',
    description: 'لماذا تطلع الشمس كل صباح؟',
    teacherVoicePrompt: 'شف الشمس يا بطل، هي اللي تعطينا الضوء والحرارة عشان نكبر.',
    content: 'الشمس نجم كبير جداً يضيء لنا في النهار، وفي الليل يظهر القمر الجميل.',
    image: '☀️',
    quiz: {
      question: 'متى تظهر الشمس؟',
      options: [
        { id: 'a', text: 'في الليل', isCorrect: false },
        { id: 'b', text: 'في النهار', isCorrect: true }
      ],
      feedbackSuccess: 'صحيح! الشمس ضياء النهار.',
      feedbackFailure: 'فكر مرة ثانية، متى نحتاج للنور الكبير؟'
    }
  },
  {
    id: 'math-2',
    title: 'سعة الجركان (القياس)',
    type: 'math',
    description: 'تعلم كيف نقيس كمية الماء.',
    teacherVoicePrompt: 'لما تعبي الجركان ماء، لازم تعرف كم هو يشيل. خلينا نشوف.',
    content: 'الجركان الكبير يشيل ماء أكثر من الكوب الصغير. هذا نسميه سعته.',
    image: '🚰',
    quiz: {
      question: 'أين نضع ماء أكثر؟',
      options: [
        { id: 'a', text: 'القدح', isCorrect: false },
        { id: 'b', text: 'الجركان', isCorrect: true }
      ],
      feedbackSuccess: 'برافو! الجركان يسع الكثير.',
      feedbackFailure: 'انظر للحجم، أيهما أكبر؟'
    }
  },
  {
    id: 'story-1',
    title: 'حكاية الهدهد الحكيم',
    type: 'story',
    description: 'قصة مسموعة لقبل النوم.',
    teacherVoicePrompt: 'غمض عيونك يا صغيري واسمع حكاية الهدهد الذي طار فوق الجبال.',
    content: 'كان يا ما كان في قديم الزمان، هدهد جميل يعيش في وادي يمني كبير يسمى وادي سبأ. كان الهدهد يحب استكشاف المناطق ومساعدة الطيور الأخرى على إيجاد الماء والطعام. في ليلة من الليالي، رأى سحاباً غريباً...',
    image: '🐦'
  }
];
