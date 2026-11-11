import React, { useState } from 'react';
import { 
  MessageSquare, 
  PlusCircle, 
  ThumbsUp, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Tag, 
  Send, 
  Code2, 
  User, 
  HelpCircle,
  Lightbulb,
  X,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ForumAnswer, ForumQuestion, LanguageTone, UserProgress } from '../types';

interface ForumViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  languageTone: LanguageTone;
  onAskInAIView?: (question: string) => void;
}

const INITIAL_QUESTIONS: ForumQuestion[] = [
  {
    id: 'q-1',
    title: 'Why do Python lists use 0-indexed positions instead of starting from 1?',
    body: 'I am a beginner learning Python. Why does `items[0]` give the first item instead of `items[1]`? It feels so counterintuitive when counting objects in real life!',
    author: 'Priya Sharma',
    authorRole: 'Student',
    category: 'Python',
    createdAt: '2 hours ago',
    upvotes: 24,
    isSolved: true,
    answers: [
      {
        id: 'ans-1',
        author: 'Prof. Vikram (SkillGraph Senior Instructor)',
        authorRole: 'Instructor',
        createdAt: '1 hour ago',
        upvotes: 38,
        analogy: 'Think of a measuring tape or ruler: the very first inch mark is at distance 0 from the left edge. The index is not a count; it is the "offset distance" from the start of memory!',
        content:
          'In computer memory, an array or list is a continuous block of memory addresses. The variable points to the starting gate. `items[0]` means: "Take ZERO steps forward from the starting gate." `items[1]` means: "Take 1 step forward." So 0-indexing measures distance from the start, not human quantity count!',
        codeSnippet: `# Offset distance in Python
my_list = ["Apple", "Banana", "Cherry"]
# my_list[0] -> 0 steps offset -> "Apple"
# my_list[1] -> 1 step offset  -> "Banana"`,
      },
      {
        id: 'ans-1-ai',
        author: 'SkillGraph AI Tutor',
        authorRole: 'AI Mentor',
        createdAt: '45 mins ago',
        upvotes: 19,
        analogy: 'Imagine hotel floors in Europe or India: the entrance level is the "Ground Floor" (Floor 0). You only climb 1 flight of stairs to reach Floor 1!',
        content:
          'E.W. Dijkstra (one of the fathers of computer science) wrote a famous paper showing that counting from 0 makes mathematical intervals `[0 <= i < N]` vastly cleaner without ugly `+1` or `-1` arithmetic errors everywhere.',
      },
    ],
  },
  {
    id: 'q-2',
    title: 'What is the easiest way to understand Neural Network Weights and Bias?',
    body: 'I am learning artificial intelligence and deep learning. Every tutorial uses formulas like y = W*X + b, but I cannot picture what weights and bias actually DO inside a neuron.',
    author: 'Daniel Chen',
    authorRole: 'Student',
    category: 'Neural Networks',
    createdAt: '5 hours ago',
    upvotes: 31,
    isSolved: true,
    answers: [
      {
        id: 'ans-2',
        author: 'SkillGraph AI Mentor',
        authorRole: 'AI Mentor',
        createdAt: '4 hours ago',
        upvotes: 42,
        analogy: 'Imagine deciding whether to go swimming on the weekend. You look at two inputs: Temperature (x1) and Rain probability (x2).',
        content:
          '1. WEIGHTS (W) represent how much you CARE about that input. If you love heat, the temperature weight is huge (+0.9). If you hate rain, the rain weight is strongly negative (-0.8).\n2. BIAS (b) is your personal default mood before even looking at the weather. If you are naturally adventurous, you have a high positive bias (+2.0). If you are lazy, you have a negative bias (-1.5) that requires great weather to overcome!\n\nDuring training, the neural network adjusts those weights and biases so its decisions match real outcomes.',
        codeSnippet: `def should_go_swimming(temp, rain_prob):
    # Weights: care a lot about heat, dislike rain
    w_temp = 0.8
    w_rain = -1.2
    bias = -0.5 # default hesitation
    
    score = (temp * w_temp) + (rain_prob * w_rain) + bias
    return score > 0`,
      },
    ],
  },
  {
    id: 'q-3',
    title: 'JavaScript: Difference between == and === with a real life example?',
    body: 'I keep getting bugs where "5" == 5 returns true, but "5" === 5 returns false. When should I strictly use === ?',
    author: 'Neha Verma',
    authorRole: 'Student',
    category: 'JavaScript',
    createdAt: '1 day ago',
    upvotes: 18,
    isSolved: true,
    answers: [
      {
        id: 'ans-3',
        author: 'Arjun Das (Full-Stack Engineer)',
        authorRole: 'Instructor',
        createdAt: '22 hours ago',
        upvotes: 27,
        analogy: 'A $5 paper bill vs a $5 gift voucher card.',
        content:
          '`==` (Loose equality) asks: "Can these two buy the same cup of coffee?" Yes, so it returns true by forcibly converting types.\n`===` (Strict equality) asks: "Are these the exact same physical object made of the exact same material?" No! One is paper green currency, the other is plastic magnetic card.\n\nAlways use `===` in production code to avoid accidental type coercion nightmares!',
        codeSnippet: `console.log("5" == 5);  // true (type coercion converted string to number)
console.log("5" === 5); // false (string is not a number!)`,
      },
    ],
  },
];

export const ForumView: React.FC<ForumViewProps> = ({
  progress,
  onUpdateProgress,
  languageTone,
}) => {
  const [questions, setQuestions] = useState<ForumQuestion[]>(INITIAL_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ask Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumQuestion['category']>('Python');
  const [newBody, setNewBody] = useState('');
  const [newCode, setNewCode] = useState('');
  const [requestAIAnswer, setRequestAIAnswer] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // Active expanded question
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(INITIAL_QUESTIONS[0].id);

  // Reply state
  const [replyText, setReplyText] = useState('');

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.body.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  // Upvote Question
  const handleUpvoteQuestion = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  // Upvote Answer
  const handleUpvoteAnswer = (qId: string, ansId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          answers: q.answers.map((a) =>
            a.id === ansId ? { ...a, upvotes: a.upvotes + 1 } : a
          ),
        };
      })
    );
  };

  // Post New Question
  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsPosting(true);

    const newQId = `q-${Date.now()}`;
    const answersList: ForumAnswer[] = [];

    // If requested instant AI Instructor Answer
    if (requestAIAnswer) {
      try {
        const res = await fetch('/api/forum-ai-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionTitle: newTitle,
            questionBody: newBody,
            category: newCategory,
            codeSnippet: newCode,
            languageTone,
          }),
        });

        if (res.ok) {
          const aiData = await res.json();
          answersList.push({
            id: `ans-ai-${Date.now()}`,
            author: 'SkillGraph AI Instructor',
            authorRole: 'AI Mentor',
            createdAt: 'Just now',
            upvotes: 1,
            analogy: aiData.analogy,
            content: `${aiData.summary}\n\n${aiData.stepByStep?.join('\n') || ''}\n\n💡 Key Rule: ${aiData.takeaway || ''}`,
            codeSnippet: aiData.codeSolution,
          });
        }
      } catch (err) {
        console.warn('AI forum answer failed, posting without instant AI reply', err);
      }
    }

    const createdQuestion: ForumQuestion = {
      id: newQId,
      title: newTitle.trim(),
      body: newBody.trim(),
      author: 'You (Learner)',
      authorRole: 'Student',
      category: newCategory,
      codeSnippet: newCode.trim() ? newCode.trim() : undefined,
      createdAt: 'Just now',
      upvotes: 1,
      answers: answersList,
      isSolved: answersList.length > 0,
    };

    setQuestions((prev) => [createdQuestion, ...prev]);
    setActiveQuestionId(newQId);
    setShowAskModal(false);
    setNewTitle('');
    setNewBody('');
    setNewCode('');
    setIsPosting(false);

    // Reward XP for participating in the community
    onUpdateProgress({
      ...progress,
      xp: progress.xp + 25,
    });
  };

  // Submit manual reply
  const handlePostReply = (qId: string) => {
    if (!replyText.trim()) return;

    const newAns: ForumAnswer = {
      id: `ans-${Date.now()}`,
      author: 'You (Learner)',
      authorRole: 'Student',
      createdAt: 'Just now',
      upvotes: 1,
      content: replyText.trim(),
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          answers: [...q.answers, newAns],
          isSolved: true,
        };
      })
    );

    setReplyText('');
    onUpdateProgress({
      ...progress,
      xp: progress.xp + 15,
    });
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community & Instructor Q&A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SkillGraph Learning Forum
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Ask any question on Python, JavaScript, AI, and Neural Networks. Get real-life analogies from instructors and the AI Mentor.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/40 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask a New Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Python', 'JavaScript', 'AI & ML', 'Neural Networks', 'Debugging'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Forum Split: List on Left, Active Thread on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Questions ({filteredQuestions.length})
          </div>

          <div className="space-y-2.5">
            {filteredQuestions.map((q) => {
              const active = activeQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {q.category}
                        </span>
                        {q.isSolved && (
                          <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Answered</span>
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-xs sm:text-sm font-bold leading-snug ${
                          active ? 'text-indigo-300' : 'text-slate-100'
                        }`}
                      >
                        {q.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {q.body}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                        <span>By {q.author}</span>
                        <span>•</span>
                        <span>{q.createdAt}</span>
                      </div>
                    </div>

                    {/* Upvote Pill */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvoteQuestion(q.id);
                        }}
                        className="text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-200 mt-1">{q.upvotes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread Detail */}
        <div className="lg:col-span-7 space-y-5">
          {activeQuestion ? (
            <div className="space-y-5">
              {/* Question Header Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {activeQuestion.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Asked by {activeQuestion.author} ({activeQuestion.authorRole}) • {activeQuestion.createdAt}
                    </span>
                  </div>

                  <button
                    onClick={() => handleUpvoteQuestion(activeQuestion.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{activeQuestion.upvotes}</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {activeQuestion.title}
                </h2>

                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeQuestion.body}
                </p>

                {activeQuestion.codeSnippet && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-400">Attached Code:</span>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      <code>{activeQuestion.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Answers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Answers & Explanations ({activeQuestion.answers.length})</span>
                  <span className="text-indigo-400">Instructor Verified</span>
                </div>

                {activeQuestion.answers.map((ans) => {
                  const isAI = ans.authorRole === 'AI Mentor';
                  const isInstructor = ans.authorRole === 'Instructor';

                  return (
                    <div
                      key={ans.id}
                      className={`p-5 rounded-2xl border space-y-3 shadow-lg ${
                        isAI
                          ? 'bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900 border-indigo-500/40'
                          : isInstructor
                          ? 'bg-slate-900 border-emerald-500/30'
                          : 'bg-slate-900/90 border-slate-800'
                      }`}
                    >
                      {/* Answer Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              isAI
                                ? 'bg-indigo-600 text-white'
                                : isInstructor
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{ans.author}</span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  isAI
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : isInstructor
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {ans.authorRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">{ans.createdAt}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUpvoteAnswer(activeQuestion.id, ans.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300"
                        >
                          <ThumbsUp className="w-3 h-3 text-indigo-400" />
                          <span>{ans.upvotes}</span>
                        </button>
                      </div>

                      {/* Real-Life Analogy Box inside answer */}
                      {ans.analogy && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-medium">
                          🌟 <strong className="text-white">Real-Life Analogy: </strong>
                          {ans.analogy}
                        </div>
                      )}

                      {/* Answer Text */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {ans.content}
                      </p>

                      {/* Code Snippet in answer */}
                      {ans.codeSnippet && (
                        <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                          <code>{ans.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Contribute an Answer / Explanation (+15 XP)</span>
                </span>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your explanation or real-life analogy to help fellow learners..."
                  className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  onClick={() => handlePostReply(activeQuestion.id)}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Answer</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
              Select a question to view discussions
            </div>
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Ask the SkillGraph Community</h2>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostQuestion} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Question Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why does Python give an IndentationError when using tabs?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Neural Networks">Neural Networks</option>
                  <option value="Debugging">Debugging</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Detailed Question:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what you are trying to do, what you expected, and where you are getting stuck..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Optional Code Snippet:
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste your code here..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="instant-ai-cb"
                  checked={requestAIAnswer}
                  onChange={(e) => setRequestAIAnswer(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="instant-ai-cb" className="text-xs text-indigo-200 cursor-pointer">
                  ✨ <strong>Request Instant AI Instructor Answer</strong> with Real-Life Analogy
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPosting ? 'Publishing & Generating AI Answer...' : 'Publish Question (+25 XP)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
