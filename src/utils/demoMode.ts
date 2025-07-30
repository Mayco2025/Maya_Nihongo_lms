import { ClassInfo, Material, Question, User } from '../types';

// Demo user
export const DEMO_USER: User = {
  uid: 'demo-user-123',
  displayName: 'Demo Student',
  email: 'demo@example.com',
  role: 'teacher', // Changed to teacher so you can test teacher features
  createdAt: new Date(),
  lastLoginAt: new Date()
};

// Demo data for when Firebase is not available
export const DEMO_SCHEDULE: ClassInfo[] = [
  {
    id: 'class1',
    name: 'N5 Grammar - Lesson 1: Basic Sentence Structure',
    teacher: 'Tanaka Sensei',
    teacherId: 'teacher-1',
    dateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() - 2) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/abc-defg-hij',
    duration: 60,
    classGroup: 'Nihongo-Et-1',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-2', 'student-3'],
    isActive: true,
    recordingLink: 'https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing',
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class2',
    name: 'N5 Vocabulary & Kanji: Numbers and Time',
    teacher: 'Sato Sensei',
    teacherId: 'teacher-2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 1) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/xyz-uvwq-rst',
    duration: 60,
    classGroup: 'Nihongo-Jp-1',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-4', 'student-5'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class3',
    name: 'N5 Grammar - Lesson 2: Particles は, が, を',
    teacher: 'Tanaka Sensei',
    teacherId: 'teacher-1',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 4) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/mno-pqrs-tuv',
    duration: 60,
    classGroup: 'Nihongo-Et-2',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class4',
    name: 'N4 Grammar - Advanced Particles',
    teacher: 'Yamamoto Sensei',
    teacherId: 'teacher-3',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 2) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/def-ghij-klm',
    duration: 90,
    classGroup: 'Private-Lesson-1',
    level: 'N4',
    maxStudents: 1,
    enrolledStudents: ['demo-user-123'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class5',
    name: 'N5 Speaking Practice: Daily Conversations',
    teacher: 'Sato Sensei',
    teacherId: 'teacher-2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 3) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/ghi-jklm-nop',
    duration: 45,
    classGroup: 'Nihongo-Jp-2',
    level: 'N5',
    maxStudents: 12,
    enrolledStudents: ['demo-user-123', 'student-6'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class6',
    name: 'N5 Kanji Practice: Numbers and Time',
    teacher: 'Tanaka Sensei',
    teacherId: 'teacher-1',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 5) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/kanji-123-456',
    duration: 60,
    classGroup: 'Nihongo-Et-2',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-7', 'student-8'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class7',
    name: 'N4 Advanced Grammar: Conditional Sentences',
    teacher: 'Yamamoto Sensei',
    teacherId: 'teacher-3',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 6) + 5400000).toISOString(),
    googleMeetLink: 'https://meet.google.com/private-789-012',
    duration: 90,
    classGroup: 'Private-Lesson-1',
    level: 'N4',
    maxStudents: 1,
    enrolledStudents: ['demo-user-123'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class8',
    name: 'N5 Vocabulary: Family and Relationships',
    teacher: 'Sato Sensei',
    teacherId: 'teacher-2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 7) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/vocab-345-678',
    duration: 60,
    classGroup: 'Nihongo-Jp-1',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-4', 'student-5', 'student-9'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class9',
    name: 'N5 Listening Practice: Basic Conversations',
    teacher: 'Tanaka Sensei',
    teacherId: 'teacher-1',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 8) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/listen-567-890',
    duration: 60,
    classGroup: 'Nihongo-Et-1',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-2', 'student-3', 'student-10'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class10',
    name: 'N5 Writing Practice: Hiragana and Katakana',
    teacher: 'Sato Sensei',
    teacherId: 'teacher-2',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 9) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/write-901-234',
    duration: 60,
    classGroup: 'Nihongo-Jp-2',
    level: 'N5',
    maxStudents: 12,
    enrolledStudents: ['demo-user-123', 'student-6', 'student-11'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class11',
    name: 'N4 Reading Comprehension: Short Stories',
    teacher: 'Yamamoto Sensei',
    teacherId: 'teacher-3',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 10) + 5400000).toISOString(),
    googleMeetLink: 'https://meet.google.com/read-123-456',
    duration: 90,
    classGroup: 'Private-Lesson-1',
    level: 'N4',
    maxStudents: 1,
    enrolledStudents: ['demo-user-123'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  },
  {
    id: 'class12',
    name: 'N5 Culture Lesson: Japanese Festivals',
    teacher: 'Tanaka Sensei',
    teacherId: 'teacher-1',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 11)).toISOString(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 11) + 3600000).toISOString(),
    googleMeetLink: 'https://meet.google.com/culture-789-012',
    duration: 60,
    classGroup: 'Nihongo-Et-2',
    level: 'N5',
    maxStudents: 20,
    enrolledStudents: ['demo-user-123', 'student-7', 'student-8', 'student-12'],
    isActive: true,
    recordingAccessLevel: 'students-only'
  }
];

export const DEMO_MATERIALS: Material[] = [
  {
    id: 'mat1',
    lessonName: 'Lesson 1: Greetings & Introductions (Amharic Instructions)',
    classGroup: 'Nihongo-Et-1',
    fileUrl: 'https://docs.google.com/presentation/d/1ABC123DEF456/edit?usp=sharing',
    fileType: 'ppt',
    fileSize: 2048000,
    uploadedBy: 'Tanaka Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Et-1'],
    description: 'Complete lesson on basic Japanese greetings with Amharic explanations. Includes こんにちは, おはようございます, こんばんは, and さようなら',
    tags: ['greetings', 'basics', 'N5', 'speaking', 'amharic'],
    isActive: true
  },
  {
    id: 'mat2',
    lessonName: 'Lesson 2: Particles は, が, を - Complete Guide (Japanese Instructions)',
    classGroup: 'Nihongo-Jp-1',
    fileUrl: 'https://docs.google.com/presentation/d/1XYZ789GHI012/edit?usp=sharing',
    fileType: 'ppt',
    fileSize: 3072000,
    uploadedBy: 'Tanaka Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Jp-1'],
    description: 'Comprehensive guide to Japanese particles with Japanese explanations. Includes examples, exercises, and practice sentences',
    tags: ['particles', 'grammar', 'N5', 'writing', 'japanese'],
    isActive: true
  },
  {
    id: 'mat3',
    lessonName: 'N5 Kanji Workbook - Numbers 1-10 (Amharic Instructions)',
    classGroup: 'Nihongo-Et-2',
    fileUrl: 'https://drive.google.com/file/d/1KANJI456789/view?usp=sharing',
    fileType: 'pdf',
    fileSize: 5120000,
    uploadedBy: 'Sato Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Et-2'],
    description: 'Practice workbook for learning kanji numbers 一, 二, 三, 四, 五, 六, 七, 八, 九, 十 with Amharic explanations',
    tags: ['kanji', 'numbers', 'N5', 'writing', 'amharic'],
    isActive: true
  },
  {
    id: 'mat4',
    lessonName: 'Japanese Pronunciation Guide - Audio Files',
    classGroup: 'N5-Beginners',
    fileUrl: 'https://drive.google.com/drive/folders/1AUDIO123456?usp=sharing',
    fileType: 'audio',
    fileSize: 15360000,
    uploadedBy: 'Yamamoto Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    accessLevel: 'public',
    description: 'Audio recordings for proper Japanese pronunciation including hiragana, katakana, and basic vocabulary',
    tags: ['pronunciation', 'audio', 'N5', 'speaking'],
    isActive: true
  },
  {
    id: 'mat5',
    lessonName: 'N4 Grammar - Advanced Particles に, で, へ (Private Lesson)',
    classGroup: 'Private-Lesson-1',
    fileUrl: 'https://docs.google.com/presentation/d/1N4GRAM789012/edit?usp=sharing',
    fileType: 'ppt',
    fileSize: 4096000,
    uploadedBy: 'Yamamoto Sensei',
    uploadedAt: new Date(),
    accessLevel: 'class-specific',
    allowedClasses: ['Private-Lesson-1'],
    description: 'Advanced particle usage for N4 level students with personalized instruction and complex sentence structures',
    tags: ['particles', 'grammar', 'N4', 'advanced', 'private'],
    isActive: true
  },
  {
    id: 'mat6',
    lessonName: 'Japanese Culture & Etiquette - Video Lesson',
    classGroup: 'N5-Beginners',
    fileUrl: 'https://www.youtube.com/watch?v=japanese-culture-123',
    fileType: 'video',
    fileSize: 25600000,
    uploadedBy: 'Sato Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    accessLevel: 'public',
    description: 'Cultural lesson covering Japanese customs, bowing, gift-giving, and social etiquette',
    tags: ['culture', 'etiquette', 'video', 'N5'],
    isActive: true
  },
  {
    id: 'mat7',
    lessonName: 'Speaking Practice - Daily Conversations (Japanese Instructions)',
    classGroup: 'Nihongo-Jp-2',
    fileUrl: 'https://docs.google.com/presentation/d/1SPEAK789012/edit?usp=sharing',
    fileType: 'ppt',
    fileSize: 2048000,
    uploadedBy: 'Sato Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Jp-2'],
    description: 'Speaking practice materials with Japanese instructions for daily conversations and role-playing exercises',
    tags: ['speaking', 'conversation', 'N5', 'japanese'],
    isActive: true
  },
  {
    id: 'mat8',
    lessonName: 'Kanji Numbers 1-10 Practice Sheets (Amharic Instructions)',
    classGroup: 'Nihongo-Et-2',
    fileUrl: 'https://drive.google.com/file/d/1KANJI789012/view?usp=sharing',
    fileType: 'pdf',
    fileSize: 3072000,
    uploadedBy: 'Tanaka Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Et-2'],
    description: 'Practice sheets for kanji numbers with Amharic explanations and stroke order guides',
    tags: ['kanji', 'numbers', 'writing', 'N5', 'amharic'],
    isActive: true
  },
  {
    id: 'mat9',
    lessonName: 'Family Vocabulary List (Japanese Instructions)',
    classGroup: 'Nihongo-Jp-1',
    fileUrl: 'https://docs.google.com/document/d/1FAMILY123456/edit?usp=sharing',
    fileType: 'doc',
    fileSize: 1024000,
    uploadedBy: 'Sato Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Jp-1'],
    description: 'Complete vocabulary list for family members with Japanese explanations and example sentences',
    tags: ['vocabulary', 'family', 'N5', 'japanese'],
    isActive: true
  },
  {
    id: 'mat10',
    lessonName: 'Advanced Grammar Notes - Conditional Sentences (Private)',
    classGroup: 'Private-Lesson-1',
    fileUrl: 'https://docs.google.com/document/d/1CONDITIONAL789/edit?usp=sharing',
    fileType: 'doc',
    fileSize: 4096000,
    uploadedBy: 'Yamamoto Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    accessLevel: 'class-specific',
    allowedClasses: ['Private-Lesson-1'],
    description: 'Comprehensive notes on conditional sentences (たら, ば, なら) with detailed explanations and examples',
    tags: ['grammar', 'conditionals', 'N4', 'advanced', 'private'],
    isActive: true
  },
  {
    id: 'mat11',
    lessonName: 'Listening Practice Audio Files (Amharic Instructions)',
    classGroup: 'Nihongo-Et-1',
    fileUrl: 'https://drive.google.com/drive/folders/1LISTEN456789?usp=sharing',
    fileType: 'audio',
    fileSize: 20480000,
    uploadedBy: 'Tanaka Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Et-1'],
    description: 'Audio files for listening practice with Amharic instructions and transcripts',
    tags: ['listening', 'audio', 'N5', 'amharic'],
    isActive: true
  },
  {
    id: 'mat12',
    lessonName: 'Hiragana Writing Practice Sheets (Japanese Instructions)',
    classGroup: 'Nihongo-Jp-2',
    fileUrl: 'https://drive.google.com/file/d/1HIRAGANA123/edit?usp=sharing',
    fileType: 'pdf',
    fileSize: 1536000,
    uploadedBy: 'Sato Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Jp-2'],
    description: 'Writing practice sheets for hiragana with stroke order guides and Japanese instructions',
    tags: ['writing', 'hiragana', 'N5', 'japanese'],
    isActive: true
  },
  {
    id: 'mat13',
    lessonName: 'Japanese Culture Presentation - Festivals (Amharic Instructions)',
    classGroup: 'Nihongo-Et-2',
    fileUrl: 'https://docs.google.com/presentation/d/1CULTURE456789/edit?usp=sharing',
    fileType: 'ppt',
    fileSize: 8192000,
    uploadedBy: 'Tanaka Sensei',
    uploadedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    accessLevel: 'class-specific',
    allowedClasses: ['Nihongo-Et-2'],
    description: 'Presentation about Japanese festivals and cultural events with Amharic explanations',
    tags: ['culture', 'festivals', 'N5', 'amharic'],
    isActive: true
  },
  {
    id: 'mat14',
    lessonName: 'Reading Comprehension - Short Stories (Private)',
    classGroup: 'Private-Lesson-1',
    fileUrl: 'https://drive.google.com/file/d/1READING789012/edit?usp=sharing',
    fileType: 'pdf',
    fileSize: 6144000,
    uploadedBy: 'Yamamoto Sensei',
    uploadedAt: new Date(),
    accessLevel: 'class-specific',
    allowedClasses: ['Private-Lesson-1'],
    description: 'Short stories for reading comprehension practice with vocabulary lists and discussion questions',
    tags: ['reading', 'comprehension', 'N4', 'private'],
    isActive: true
  }
];

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'What is the difference between は and が particles? I\'m confused about when to use each one.',
    studentId: 'demo-user-123',
    studentName: 'Demo Student',
    classGroup: 'Nihongo-Et-1',
    timestamp: { toMillis: () => Date.now() - 86400000 }, // 1 day ago
    answer: 'は (wa) is used for the topic of the sentence, while が (ga) marks the subject. は can be used to introduce new topics or emphasize contrast. For example: 私は学生です (I am a student) - は introduces the topic "I". 雨が降っています (It is raining) - が marks the subject "rain".',
    answeredBy: 'Tanaka Sensei',
    answeredAt: { toMillis: () => Date.now() - 82800000 }, // 23 hours ago
    status: 'answered',
    priority: 'medium',
    tags: ['grammar', 'particles', 'N5']
  },
  {
    id: 'q2',
    question: 'How do I conjugate verbs in the past tense? For example, how do I say "I ate" and "I went"?',
    studentId: 'demo-user-123',
    studentName: 'Demo Student',
    classGroup: 'Nihongo-Jp-1',
    timestamp: { toMillis: () => Date.now() - 3600000 }, // 1 hour ago
    answer: null,
    status: 'pending',
    priority: 'high',
    tags: ['grammar', 'verbs', 'N5']
  },
  {
    id: 'q3',
    question: 'Can someone help me with the kanji for numbers? I\'m having trouble remembering 七 and 八.',
    studentId: 'student-2',
    studentName: 'Sarah Johnson',
    classGroup: 'Nihongo-Et-2',
    timestamp: { toMillis: () => Date.now() - 7200000 }, // 2 hours ago
    answer: '七 (nana/shichi) means 7 and 八 (hachi) means 8. A helpful memory trick: 七 looks like a "7" with a line through it, and 八 looks like two lines crossing each other. Practice writing them multiple times to remember the stroke order!',
    answeredBy: 'Sato Sensei',
    answeredAt: { toMillis: () => Date.now() - 3600000 }, // 1 hour ago
    status: 'answered',
    priority: 'low',
    tags: ['kanji', 'numbers', 'N5']
  },
  {
    id: 'q4',
    question: 'What\'s the proper way to bow in Japanese? I want to make sure I\'m doing it correctly.',
    studentId: 'student-3',
    studentName: 'Michael Chen',
    classGroup: 'Private-Lesson-1',
    timestamp: { toMillis: () => Date.now() - 1800000 }, // 30 minutes ago
    answer: null,
    status: 'pending',
    priority: 'medium',
    tags: ['culture', 'etiquette', 'N5']
  },
  {
    id: 'q5',
    question: 'I\'m confused about the difference between おはようございます and こんにちは. When should I use each one?',
    studentId: 'student-4',
    studentName: 'Emma Wilson',
    classGroup: 'Nihongo-Jp-2',
    timestamp: { toMillis: () => Date.now() - 5400000 }, // 1.5 hours ago
    answer: 'おはようございます (ohayou gozaimasu) is used in the morning until around 10-11 AM. こんにちは (konnichiwa) is used during the day, typically from late morning until early evening (around 5 PM). After that, you would use こんばんは (konbanwa) for evening greetings.',
    answeredBy: 'Yamamoto Sensei',
    answeredAt: { toMillis: () => Date.now() - 3000000 }, // 50 minutes ago
    status: 'answered',
    priority: 'medium',
    tags: ['greetings', 'speaking', 'N5']
  },
  {
    id: 'q6',
    question: 'Can someone explain the particle を? I see it used with verbs but I\'m not sure when to use it.',
    studentId: 'student-5',
    studentName: 'David Kim',
    classGroup: 'Nihongo-Et-1',
    timestamp: { toMillis: () => Date.now() - 900000 }, // 15 minutes ago
    answer: null,
    status: 'pending',
    priority: 'high',
    tags: ['grammar', 'particles', 'N5']
  },
  {
    id: 'q7',
    question: 'What\'s the best way to practice Japanese pronunciation? I\'m having trouble with the "r" sound.',
    studentId: 'student-6',
    studentName: 'Lisa Rodriguez',
    classGroup: 'Nihongo-Jp-2',
    timestamp: { toMillis: () => Date.now() - 1200000 }, // 20 minutes ago
    answer: 'The Japanese "r" sound is between "r" and "l" in English. Try placing your tongue behind your upper teeth and lightly tapping it. Practice with words like ら、り、る、れ、ろ. I\'ve uploaded audio files in the materials section that you can use for practice.',
    answeredBy: 'Sato Sensei',
    answeredAt: { toMillis: () => Date.now() - 600000 }, // 10 minutes ago
    status: 'answered',
    priority: 'medium',
    tags: ['pronunciation', 'speaking', 'N5']
  },
  {
    id: 'q8',
    question: 'How do I say "I want to eat sushi" in Japanese?',
    studentId: 'student-7',
    studentName: 'Ahmed Hassan',
    classGroup: 'Nihongo-Et-2',
    timestamp: { toMillis: () => Date.now() - 300000 }, // 5 minutes ago
    answer: 'You can say "寿司を食べたいです" (sushi wo tabetai desu). The pattern is [object] + を + [verb stem] + たいです. This expresses desire to do something.',
    answeredBy: 'Tanaka Sensei',
    answeredAt: { toMillis: () => Date.now() - 120000 }, // 2 minutes ago
    status: 'answered',
    priority: 'low',
    tags: ['grammar', 'desire', 'N5']
  },
  {
    id: 'q9',
    question: 'What\'s the difference between です and だ? When should I use each one?',
    studentId: 'student-8',
    studentName: 'Maria Garcia',
    classGroup: 'Nihongo-Et-1',
    timestamp: { toMillis: () => Date.now() - 1800000 }, // 30 minutes ago
    answer: null,
    status: 'pending',
    priority: 'high',
    tags: ['grammar', 'copula', 'N5']
  },
  {
    id: 'q10',
    question: 'Can someone explain the kanji for family members? I\'m confused about 父, 母, 兄, 姉.',
    studentId: 'student-9',
    studentName: 'James Wilson',
    classGroup: 'Nihongo-Jp-1',
    timestamp: { toMillis: () => Date.now() - 2400000 }, // 40 minutes ago
    answer: '父 (chichi) = father, 母 (haha) = mother, 兄 (ani) = older brother, 姉 (ane) = older sister. These are the humble forms used when talking about your own family. When talking about someone else\'s family, you use お父さん, お母さん, お兄さん, お姉さん.',
    answeredBy: 'Sato Sensei',
    answeredAt: { toMillis: () => Date.now() - 1800000 }, // 30 minutes ago
    status: 'answered',
    priority: 'medium',
    tags: ['kanji', 'family', 'vocabulary', 'N5']
  },
  {
    id: 'q11',
    question: 'How do I conjugate する verbs? For example, how do I say "I study" and "I studied"?',
    studentId: 'student-10',
    studentName: 'Fatima Al-Zahra',
    classGroup: 'Nihongo-Et-1',
    timestamp: { toMillis: () => Date.now() - 3600000 }, // 1 hour ago
    answer: null,
    status: 'pending',
    priority: 'high',
    tags: ['grammar', 'verbs', 'conjugation', 'N5']
  },
  {
    id: 'q12',
    question: 'What\'s the proper way to write hiragana? I\'m having trouble with stroke order.',
    studentId: 'student-11',
    studentName: 'Chen Wei',
    classGroup: 'Nihongo-Jp-2',
    timestamp: { toMillis: () => Date.now() - 4800000 }, // 1.3 hours ago
    answer: 'Hiragana stroke order follows these general rules: 1) Top to bottom, 2) Left to right, 3) Horizontal strokes before vertical, 4) Center strokes last. I recommend using grid paper and practicing each character multiple times. There are great apps like "Hiragana Quest" that show stroke order animations.',
    answeredBy: 'Sato Sensei',
    answeredAt: { toMillis: () => Date.now() - 3600000 }, // 1 hour ago
    status: 'answered',
    priority: 'medium',
    tags: ['writing', 'hiragana', 'stroke-order', 'N5']
  },
  {
    id: 'q13',
    question: 'When do I use は vs が in questions? I\'m confused about 何は and 何が.',
    studentId: 'student-12',
    studentName: 'Yuki Tanaka',
    classGroup: 'Private-Lesson-1',
    timestamp: { toMillis: () => Date.now() - 6000000 }, // 1.7 hours ago
    answer: 'In questions, が is used to ask "what" is the subject doing something, while は is used to ask "what" about a specific topic. 何が好きですか？ (What do you like?) vs これは何ですか？ (What is this?). The key is understanding the grammatical role of the question word.',
    answeredBy: 'Yamamoto Sensei',
    answeredAt: { toMillis: () => Date.now() - 4800000 }, // 1.3 hours ago
    status: 'answered',
    priority: 'high',
    tags: ['grammar', 'particles', 'questions', 'N4']
  },
  {
    id: 'q14',
    question: 'How do I say "I can speak Japanese" in Japanese?',
    studentId: 'student-13',
    studentName: 'Alex Johnson',
    classGroup: 'Nihongo-Et-2',
    timestamp: { toMillis: () => Date.now() - 7200000 }, // 2 hours ago
    answer: 'You can say "日本語が話せます" (nihongo ga hanasemasu). The pattern is [object] + が + [potential form of verb]. The potential form of 話す (hanasu) is 話せる (hanaseru), and in polite form it becomes 話せます (hanasemasu).',
    answeredBy: 'Tanaka Sensei',
    answeredAt: { toMillis: () => Date.now() - 6000000 }, // 1.7 hours ago
    status: 'answered',
    priority: 'medium',
    tags: ['grammar', 'potential-form', 'ability', 'N5']
  },
  {
    id: 'q15',
    question: 'What\'s the difference between 大きい and 大きな? When should I use each one?',
    studentId: 'student-14',
    studentName: 'Sofia Rodriguez',
    classGroup: 'Nihongo-Jp-1',
    timestamp: { toMillis: () => Date.now() - 9000000 }, // 2.5 hours ago
    answer: null,
    status: 'pending',
    priority: 'low',
    tags: ['grammar', 'adjectives', 'N5']
  }
];

// Demo mode utilities
export const isDemoMode = (): boolean => {
  return !process.env.REACT_APP_FIREBASE_API_KEY && 
         typeof window === 'undefined' && 
         typeof __firebase_config === 'undefined';
};

// Demo class groups
export const DEMO_CLASS_GROUPS = [
  {
    id: 'Nihongo-Et-1',
    name: 'Nihongo Ethiopian Group 1',
    type: 'ethiopian' as const,
    level: 'N5' as const,
    teacherId: 'teacher-1',
    teacherName: 'Tanaka Sensei',
    students: ['demo-user-123', 'student-2', 'student-3'],
    maxStudents: 20,
    schedule: 'Monday & Wednesday 10:00 AM',
    startDate: new Date('2024-01-15'),
    isActive: true,
    description: 'Beginner Japanese class for Ethiopian students with Amharic instruction',
    language: 'amharic' as const
  },
  {
    id: 'Nihongo-Et-2',
    name: 'Nihongo Ethiopian Group 2',
    type: 'ethiopian' as const,
    level: 'N5' as const,
    teacherId: 'teacher-1',
    teacherName: 'Tanaka Sensei',
    students: ['demo-user-123'],
    maxStudents: 20,
    schedule: 'Tuesday & Thursday 2:00 PM',
    startDate: new Date('2024-01-20'),
    isActive: true,
    description: 'Intermediate Japanese class for Ethiopian students with Amharic instruction',
    language: 'amharic' as const
  },
  {
    id: 'Nihongo-Jp-1',
    name: 'Nihongo Japanese Group 1',
    type: 'japanese' as const,
    level: 'N5' as const,
    teacherId: 'teacher-2',
    teacherName: 'Sato Sensei',
    students: ['demo-user-123', 'student-4', 'student-5'],
    maxStudents: 20,
    schedule: 'Monday & Wednesday 3:00 PM',
    startDate: new Date('2024-01-10'),
    isActive: true,
    description: 'Beginner Japanese class for Japanese students with Japanese instruction',
    language: 'japanese' as const
  },
  {
    id: 'Nihongo-Jp-2',
    name: 'Nihongo Japanese Group 2',
    type: 'japanese' as const,
    level: 'N5' as const,
    teacherId: 'teacher-2',
    teacherName: 'Sato Sensei',
    students: ['demo-user-123', 'student-6'],
    maxStudents: 12,
    schedule: 'Friday 4:00 PM',
    startDate: new Date('2024-01-25'),
    isActive: true,
    description: 'Speaking practice class for Japanese students',
    language: 'japanese' as const
  },
  {
    id: 'Private-Lesson-1',
    name: 'Private Lesson - Advanced N4',
    type: 'private' as const,
    level: 'N4' as const,
    teacherId: 'teacher-3',
    teacherName: 'Yamamoto Sensei',
    students: ['demo-user-123'],
    maxStudents: 1,
    schedule: 'Flexible Schedule',
    startDate: new Date('2024-02-01'),
    isActive: true,
    description: 'One-on-one private lesson for advanced students',
    language: 'english' as const
  }
];

export const getDemoData = () => ({
  schedule: DEMO_SCHEDULE,
  materials: DEMO_MATERIALS,
  questions: DEMO_QUESTIONS,
  classGroups: DEMO_CLASS_GROUPS,
  user: DEMO_USER
}); 