import { YouTubeCourse } from '../types';

export const YOUTUBE_COURSES: YouTubeCourse[] = [
  // ==========================================
  // 1. AI & MACHINE LEARNING
  // ==========================================
  {
    id: 'ai-neural-networks-3blue1brown',
    title: 'Neural Networks & Deep Learning Explained',
    subtitle: 'Understand Deep Learning visually with world-class mathematical animations',
    description: 'Grant Sanderson (3Blue1Brown) breaks down how artificial neural networks work from scratch: neurons, weights, biases, gradient descent, and backpropagation with zero confusing jargon.',
    category: 'ai-ml',
    categoryLabel: 'AI & Deep Learning',
    creator: {
      name: 'Grant Sanderson',
      channelName: '3Blue1Brown',
      channelUrl: 'https://www.youtube.com/@3blue1brown',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      subscribers: '6.4M+'
    },
    language: 'English',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    totalDuration: '1h 45m',
    totalLessons: 4,
    prerequisites: ['Basic High School Math', 'Curiosity about Brain & Machines'],
    syllabusTopics: [
      'What is a Neural Network?',
      'Gradient Descent & Loss Functions',
      'What is Backpropagation Really Doing?',
      'Backpropagation Calculus Intuition'
    ],
    starterPracticeCode: `# Simple Python representation of a single artificial neuron
def artificial_neuron(inputs, weights, bias):
    # Weighted sum: sum(x_i * w_i) + bias
    z = sum(x * w for x, w in zip(inputs, weights)) + bias
    # Activation function (ReLU)
    activation = max(0, z)
    return activation

inputs = [0.8, 0.4, 0.9]
weights = [0.5, -0.2, 0.7]
bias = -0.1

output = artificial_neuron(inputs, weights, bias)
print("Neuron Activated Output:", round(output, 4))`,
    lessons: [
      {
        id: 'nn-lesson-1',
        lessonNumber: 1,
        title: 'But what is a neural network? (Deep learning, chapter 1)',
        youtubeId: 'aircAruvnKk',
        duration: '19:13',
        summary: 'Explore what an artificial neural network actually does by walking through handwritten digit recognition (MNIST). Understand layers, weights, biases, and activation functions.',
        keyConcepts: ['Perceptrons & Neurons', 'Activation Functions (Sigmoid/ReLU)', 'Layer Stacking', 'Feature Recognition Hierarchy'],
        suggestedStarterCode: `# Inspecting pixel activation logic
pixels = [0.0, 0.2, 0.9, 0.8, 0.1]
weights = [0.1, 0.4, 0.8, 0.7, 0.2]
bias = -0.5

weighted_sum = sum(p * w for p, w in zip(pixels, weights)) + bias
print("Weighted sum:", weighted_sum)
print("Neuron fired:", weighted_sum > 0)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'nn-lesson-2',
        lessonNumber: 2,
        title: 'Gradient descent, how neural networks learn (Chapter 2)',
        youtubeId: 'IHZwWFHWa-w',
        duration: '21:01',
        summary: 'How does an algorithm learn from mistakes? Dive into Cost functions, downhill slopes, and how gradient descent systematically adjusts millions of weights.',
        keyConcepts: ['Cost Function (Mean Squared Error)', 'High-Dimensional Slopes', 'Learning Rate', 'Local vs Global Minima'],
        suggestedStarterCode: `# Gradient Descent in 1D
x = 10.0 # Initial guess
learning_rate = 0.1

# Goal: minimize f(x) = x^2 (derivative is 2*x)
for step in range(15):
    gradient = 2 * x
    x = x - (learning_rate * gradient)
    print(f"Step {step+1}: x = {x:.4f}, Cost = {x**2:.6f}")`,
        practiceLanguage: 'Python'
      },
      {
        id: 'nn-lesson-3',
        lessonNumber: 3,
        title: 'What is backpropagation really doing? (Chapter 3)',
        youtubeId: 'Ilg3gGewQ5U',
        duration: '13:54',
        summary: 'Demystifying backpropagation: see how each training example nudges weights backwards through every layer to fix predictions.',
        keyConcepts: ['Error Attribution', 'Nudge Vector', 'Recursive Layer Corrections', 'Batching & Mini-batches'],
        suggestedStarterCode: `# Simple backprop nudge calculation
target = 1.0
prediction = 0.65
error = prediction - target
learning_rate = 0.05
weight = 0.8

# Gradient of MSE with respect to weight
weight -= learning_rate * error * 0.5
print("Updated weight after error nudge:", weight)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'nn-lesson-4',
        lessonNumber: 4,
        title: 'Backpropagation calculus (Chapter 4)',
        youtubeId: 'tIeHLnjs5U8',
        duration: '10:18',
        summary: 'The chain rule in action. Clear, visual step-by-step mathematical proof of how calculus coordinates network adjustments.',
        keyConcepts: ['Chain Rule', 'Partial Derivatives', 'Computational Graphs', 'Matrix Operations'],
        suggestedStarterCode: `# Chain rule intuition
# y = 2*x, z = y^2 -> dz/dx = (dz/dy) * (dy/dx)
x = 3
y = 2 * x
z = y ** 2

dz_dy = 2 * y
dy_dx = 2
dz_dx = dz_dy * dy_dx
print("dz/dx:", dz_dx)`,
        practiceLanguage: 'Python'
      }
    ]
  },

  {
    id: 'ai-gpt-karpathy',
    title: "Let's Build GPT from Scratch (Generative AI)",
    subtitle: 'Build a Generative Pre-trained Transformer token by token in Python with Andrej Karpathy',
    description: 'Andrej Karpathy (former Director of AI at Tesla and OpenAI founding researcher) walks through building nanoGPT from empty file to fully functional transformer architecture.',
    category: 'ai-ml',
    categoryLabel: 'Generative AI & LLMs',
    creator: {
      name: 'Andrej Karpathy',
      channelName: 'Andrej Karpathy',
      channelUrl: 'https://www.youtube.com/@AndrejKarpathy',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.2M+'
    },
    language: 'English',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    totalDuration: '1h 56m',
    totalLessons: 3,
    prerequisites: ['Python Basics', 'Elementary Matrix Multiplication'],
    syllabusTopics: [
      'Tokenization & Character Encoders',
      'Self-Attention Mechanism (Query, Key, Value)',
      'Multi-Head Attention & Transformer Blocks'
    ],
    starterPracticeCode: `# Tokenizer representation from Karpathy's nanoGPT
text = "SkillGraph Machine Learning & AI Systems"
chars = sorted(list(set(text)))
vocab_size = len(chars)

# Mapping characters to integers
char_to_id = { ch: i for i, ch in enumerate(chars) }
id_to_char = { i: ch for i, ch in enumerate(chars) }

encode = lambda s: [char_to_id[c] for c in s]
decode = lambda l: ''.join([id_to_char[i] for i in l])

encoded = encode("SkillGraph")
print("Tokens:", encoded)
print("Decoded back:", decode(encoded))`,
    lessons: [
      {
        id: 'karpathy-gpt-1',
        lessonNumber: 1,
        title: "Let's build GPT: from scratch, in code, spelled out (Part 1)",
        youtubeId: 'kCc8FmEb1nY',
        duration: '50:00',
        summary: 'Start with character-level Bigram Language Model and learn why predicting the next token requires understanding context and sequences.',
        keyConcepts: ['Next Token Prediction', 'Tokenization', 'Bigram Statistics', 'Negative Log-Likelihood Loss'],
        suggestedStarterCode: `# Character-level bigram frequency count
text = "skillgraph proofloop quest learn build explain verify improve"
words = text.split()
print("Total words:", len(words))
print("Vocabulary count:", len(set(text)))`,
        practiceLanguage: 'Python'
      },
      {
        id: 'karpathy-gpt-2',
        lessonNumber: 2,
        title: 'Building the Self-Attention Mechanism (Q, K, V)',
        youtubeId: 'kCc8FmEb1nY',
        duration: '45:00',
        summary: 'Deep dive into Self-Attention. How tokens communicate with tokens from their past via Queries, Keys, and Values without leaking future information.',
        keyConcepts: ['Query, Key, Value Matrices', 'Softmax Scaled Dot-Product', 'Causal Masking (Tril)', 'Positional Encodings'],
        suggestedStarterCode: `# Scaled Dot-Product Attention Intuition
import math

# Simulated Query and Key vectors for 2 tokens
Q = [1.0, 0.5]
K = [0.8, 0.6]

# Dot product
dot_prod = (Q[0]*K[0] + Q[1]*K[1]) / math.sqrt(2)
print("Attention affinity score:", round(dot_prod, 4))`,
        practiceLanguage: 'Python'
      },
      {
        id: 'karpathy-gpt-3',
        lessonNumber: 3,
        title: 'Transformer Blocks, LayerNorm & Text Generation',
        youtubeId: 'kCc8FmEb1nY',
        duration: '21:00',
        summary: 'Assemble Multi-Head Attention, Feed-Forward MLP, Residual Connections, and Layer Normalization into a working Generative Language Model.',
        keyConcepts: ['Residual Highway', 'Layer Normalization', 'Autoregressive Sampling', 'Temperature Scaling'],
        suggestedStarterCode: `# Temperature Sampling Simulation
import math

logits = [2.0, 1.0, 0.1]
temperature = 0.7

scaled = [math.exp(l / temperature) for l in logits]
total = sum(scaled)
probs = [s / total for s in scaled]
print("Token Probabilities with Temp 0.7:", [round(p, 3) for p in probs])`,
        practiceLanguage: 'Python'
      }
    ]
  },

  {
    id: 'ai-ml-freecodecamp',
    title: 'Machine Learning for Everybody (Full Beginner Course)',
    subtitle: 'Zero to Master: Supervised Learning, Scikit-Learn, Feature Engineering',
    description: 'A complete beginner-friendly overview of Machine Learning fundamentals taught by Kylie Ying. Covers classification, regression, SVMs, decision trees, and neural nets.',
    category: 'ai-ml',
    categoryLabel: 'Machine Learning',
    creator: {
      name: 'freeCodeCamp.org',
      channelName: 'freeCodeCamp.org',
      channelUrl: 'https://www.youtube.com/@freecodecamp',
      avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      subscribers: '10M+'
    },
    language: 'English',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3h 53m',
    totalLessons: 3,
    prerequisites: ['Basic Python or No Coding Experience'],
    syllabusTopics: [
      'What is Machine Learning vs Traditional Code',
      'Supervised vs Unsupervised Learning',
      'Linear Regression & Classification',
      'Model Evaluation & Overfitting'
    ],
    starterPracticeCode: `# Simple supervised learning analogy: Training vs Testing
training_data = [
    {"study_hours": 1, "passed": 0},
    {"study_hours": 2, "passed": 0},
    {"study_hours": 4, "passed": 1},
    {"study_hours": 6, "passed": 1},
]

# Simple rule model found by training
threshold = 3.0
predict = lambda hours: 1 if hours >= threshold else 0

test_student = 5
print(f"Student with {test_student}h study passes? -> {predict(test_student)}")`,
    lessons: [
      {
        id: 'ml-fcc-1',
        lessonNumber: 1,
        title: 'Machine Learning for Everybody – Core Concepts',
        youtubeId: 'i_LwzRVP7bg',
        duration: '1:15:00',
        summary: 'Understand the difference between traditional rule-based coding and Machine Learning. Discover how models learn patterns from dataset examples.',
        keyConcepts: ['Data Features & Targets', 'Train/Validation/Test Splits', 'Overfitting vs Underfitting', 'Metrics (Accuracy, Precision, Recall)'],
        suggestedStarterCode: `# Train-test split demo in pure Python
dataset = [i for i in range(10)]
split_ratio = 0.8
split_idx = int(len(dataset) * split_ratio)

train_set = dataset[:split_idx]
test_set = dataset[split_idx:]
print("Train set (80%):", train_set)
print("Test set (20%):", test_set)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'ml-fcc-2',
        lessonNumber: 2,
        title: 'Supervised Learning: Regression and Classification',
        youtubeId: 'i_LwzRVP7bg',
        duration: '1:20:00',
        summary: 'Deep dive into k-Nearest Neighbors (kNN), Naive Bayes, Linear Regression, and Logistic Regression with visual graphs.',
        keyConcepts: ['kNN Distance Metric', 'Logistic Sigmoid Curve', 'Decision Boundaries', 'Feature Scaling'],
        suggestedStarterCode: `# Euclidean distance calculation for kNN
import math

point_a = (2.0, 3.0)
point_b = (5.0, 7.0)

dist = math.sqrt((point_a[0] - point_b[0])**2 + (point_a[1] - point_b[1])**2)
print("Euclidean Distance:", round(dist, 3))`,
        practiceLanguage: 'Python'
      },
      {
        id: 'ml-fcc-3',
        lessonNumber: 3,
        title: 'Decision Trees, SVMs and Neural Network Intro',
        youtubeId: 'i_LwzRVP7bg',
        duration: '1:18:00',
        summary: 'Explore non-linear models: Support Vector Machines, Decision Trees, Random Forests, and building neural networks with TensorFlow.',
        keyConcepts: ['Gini Impurity', 'Hyperplanes & Support Vectors', 'Ensemble Random Forests', 'Model Deployment'],
        suggestedStarterCode: `# Mini Decision Tree Node Logic
def classify_student(attendance_pct, quiz_score):
    if attendance_pct > 75:
        return "Eligible for Exam" if quiz_score >= 50 else "Requires Remedial Quiz"
    else:
        return "Attendance Warning"

print(classify_student(85, 72))`,
        practiceLanguage: 'Python'
      }
    ]
  },

  // ==========================================
  // 2. PYTHON PROGRAMMING
  // ==========================================
  {
    id: 'python-codewithharry',
    title: 'Python for Beginners (Full Course in Hindi)',
    subtitle: '100% Beginner Friendly Python Tutorial with Real-Life Examples & Projects',
    description: 'CodeWithHarry explains Python from absolute zero in easy Hindi and Hinglish. Variables, conditions, loops, functions, lists, dictionaries, and object-oriented programming.',
    category: 'python',
    categoryLabel: 'Python Programming',
    creator: {
      name: 'Haris Khan',
      channelName: 'CodeWithHarry',
      channelUrl: 'https://www.youtube.com/@CodeWithHarry',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      subscribers: '5.8M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    totalDuration: '4h 20m',
    totalLessons: 4,
    prerequisites: ['No Prior Coding Knowledge Required'],
    syllabusTopics: [
      'Python Setup & Variables (Namaste World)',
      'Conditionals (if-elif-else) & Loops',
      'Lists, Tuples, Dictionaries & Sets',
      'Functions & Object Oriented Programming (OOP)'
    ],
    starterPracticeCode: `# Python Variables & String Formatting
name = "Learner"
role = "Software Engineer"
app_name = "SkillGraph"

print(f"Welcome {name} to {app_name}! Role: {role}")

skills = ["Python", "JavaScript", "Generative AI", "Data Science"]
for i, skill in enumerate(skills, 1):
    print(f"Step {i}: Master {skill}")`,
    lessons: [
      {
        id: 'py-harry-1',
        lessonNumber: 1,
        title: 'Python Introduction, Variables & Datatypes in Hindi',
        youtubeId: 'UrsmFxEIp5k',
        duration: '1:05:00',
        summary: 'Installing Python, writing your first script, understanding variables, integers, floats, booleans, and string manipulations.',
        keyConcepts: ['print() and input()', 'Type Casting (int, str, float)', 'String Slicing', 'Comments & Code Hygiene'],
        suggestedStarterCode: `# Python basic calculations
age = 20
next_age = age + 1
greeting = "Hello, Programmer!"
print(greeting.upper())
print("Next year you will be:", next_age)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'py-harry-2',
        lessonNumber: 2,
        title: 'Conditionals (if-else) and Loops (for, while) in Hindi',
        youtubeId: 'UrsmFxEIp5k',
        duration: '1:10:00',
        summary: 'Logic building with if, elif, and else. Iterating with for loops, range(), and while loops.',
        keyConcepts: ['Indentation Rules', 'Comparison Operators (==, !=, <, >)', 'range(start, stop, step)', 'break and continue'],
        suggestedStarterCode: `# Even/Odd & Range loop
for num in range(1, 10):
    if num % 2 == 0:
        print(f"{num} is Even")
    else:
        print(f"{num} is Odd")`,
        practiceLanguage: 'Python'
      },
      {
        id: 'py-harry-3',
        lessonNumber: 3,
        title: 'Data Structures: Lists, Tuples, Dictionaries & Sets',
        youtubeId: 'UrsmFxEIp5k',
        duration: '1:05:00',
        summary: 'Store and organize data effectively using Python collections. Indexing, appending, dictionary keys and values.',
        keyConcepts: ['List Methods (.append, .pop)', 'Mutable vs Immutable', 'Key-Value Pairs', 'Fast Lookups in Dicts'],
        suggestedStarterCode: `# Student Grade Book Dictionary
students = {
    "Rohan": 88,
    "Priya": 95,
    "Rahul": 74
}

for name, score in students.items():
    print(f"{name} scored {score} marks")`,
        practiceLanguage: 'Python'
      },
      {
        id: 'py-harry-4',
        lessonNumber: 4,
        title: 'Functions & Object-Oriented Programming (OOP) in Hindi',
        youtubeId: 'UrsmFxEIp5k',
        duration: '1:00:00',
        summary: 'Write reusable code with functions and create Classes and Objects to model real-world entities.',
        keyConcepts: ['def keyword & return', 'Class, __init__, and self', 'Inheritance & Encapsulation', 'Modular Code'],
        suggestedStarterCode: `# OOP in Python
class Developer:
    def __init__(self, name, language):
        self.name = name
        self.language = language

    def code(self):
        return f"{self.name} is building an app in {self.language}!"

dev = Developer("Ansh", "Python")
print(dev.code())`,
        practiceLanguage: 'Python'
      }
    ]
  },

  {
    id: 'python-chai-aur-code',
    title: 'Chai aur Python: Zero to Pro Course',
    subtitle: 'Concept-first Python course with internal memory architecture explained',
    description: 'Hitesh Choudhary teaches Python by diving under the hood: how Python handles memory allocation, mutable vs immutable references, closures, decorators, and real projects.',
    category: 'python',
    categoryLabel: 'Python Programming',
    creator: {
      name: 'Hitesh Choudhary',
      channelName: 'Chai aur Code',
      channelUrl: 'https://www.youtube.com/@chaiaurcode',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.4M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    totalDuration: '5h 10m',
    totalLessons: 3,
    prerequisites: ['Curiosity to learn how things work internally'],
    syllabusTopics: [
      'Python Inner Working & Bytecode (.pyc)',
      'Memory Management & Reference Counting',
      'Decorators, Generators & Functional Python'
    ],
    starterPracticeCode: `# Python Reference Counting & Identity demo
a = [1, 2, 3]
b = a # b points to the exact same list in memory
b.append(4)

print("Original list a:", a)
print("Are they identical memory objects?", a is b)`,
    lessons: [
      {
        id: 'chai-py-1',
        lessonNumber: 1,
        title: 'How Python Works Internally (Bytecode & Python Virtual Machine)',
        youtubeId: 'x7X9w_GIm1s',
        duration: '1:30:00',
        summary: 'Understand what happens when you click run: compilation to bytecode (.pyc), PVM loop, and memory references.',
        keyConcepts: ['Bytecode Compilation', 'PVM (Python Virtual Machine)', 'CPython vs PyPy', 'Memory Addresses & id()'],
        suggestedStarterCode: `x = 42
print("Value:", x)
print("Memory Address (ID):", hex(id(x)))`,
        practiceLanguage: 'Python'
      },
      {
        id: 'chai-py-2',
        lessonNumber: 2,
        title: 'Deep Dive: Mutability, References & Scopes in Python',
        youtubeId: 'x7X9w_GIm1s',
        duration: '1:45:00',
        summary: 'Why modifying a list inside a function can modify it outside. Understanding the LEGB scope rule (Local, Enclosing, Global, Built-in).',
        keyConcepts: ['LEGB Scope Rule', 'Shallow Copy vs Deep Copy', 'Pass by Object Reference', 'Lambda Expressions'],
        suggestedStarterCode: `# Shallow vs Deep Copy
import copy

original = [[1, 2], [3, 4]]
shallow = list(original)
deep = copy.deepcopy(original)

original[0][0] = 999
print("Shallow copy affected?", shallow[0][0] == 999)
print("Deep copy protected?", deep[0][0] == 1)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'chai-py-3',
        lessonNumber: 3,
        title: 'Decorators and Generators Explained with Chai Analogy',
        youtubeId: 'x7X9w_GIm1s',
        duration: '1:55:00',
        summary: 'Master one of the most powerful features of Python: write timing decorators, authentication checks, and infinite memory-friendly generators.',
        keyConcepts: ['First-Class Functions', 'Function Closures', '@decorator syntax', 'yield vs return'],
        suggestedStarterCode: `# Simple Timing Decorator
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        print(f"Function {func.__name__} took {duration:.6f}s")
        return result
    return wrapper

@timer
def heavy_computation():
    return sum(i*i for i in range(100000))

print("Result:", heavy_computation())`,
        practiceLanguage: 'Python'
      }
    ]
  },

  {
    id: 'python-mosh-english',
    title: 'Python Tutorial for Beginners (Full English Course)',
    subtitle: 'The best English beginner tutorial with 30M+ views by Mosh Hamedani',
    description: 'Programming with Mosh delivers the cleanest, most concise introduction to Python. Perfect for students and professionals stepping into programming for the first time.',
    category: 'python',
    categoryLabel: 'Python Programming',
    creator: {
      name: 'Mosh Hamedani',
      channelName: 'Programming with Mosh',
      channelUrl: 'https://www.youtube.com/@programmingwithmosh',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      subscribers: '3.6M+'
    },
    language: 'English',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80',
    totalDuration: '1h 00m',
    totalLessons: 2,
    prerequisites: ['None'],
    syllabusTopics: [
      'Variables, Receiving Input & Type Conversion',
      'Strings, Arithmetic & If Statements',
      'While Loops, Lists & Tuples'
    ],
    starterPracticeCode: `# Weight Converter Project from Mosh
weight = 72
unit = 'K' # K for Kilos, L for Lbs

if unit.upper() == 'K':
    converted = weight * 2.20462
    print(f"Weight in Lbs: {round(converted, 1)}")
else:
    converted = weight / 2.20462
    print(f"Weight in Kilos: {round(converted, 1)}")`,
    lessons: [
      {
        id: 'mosh-py-1',
        lessonNumber: 1,
        title: 'Python Tutorial for Beginners [Full Course]',
        youtubeId: '_uQrJ0TkZlc',
        duration: '35:00',
        summary: 'Learn Python syntax, variables, operators, and control structures with clean practical exercises.',
        keyConcepts: ['Variables', 'Input & Output', 'Type Conversions', 'Comparison Operators'],
        suggestedStarterCode: `price = 100
is_discounted = True
final_price = price * 0.9 if is_discounted else price
print("Final Price:", final_price)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'mosh-py-2',
        lessonNumber: 2,
        title: 'Python Lists, Dictionaries & Real World Mini-Project',
        youtubeId: '_uQrJ0TkZlc',
        duration: '25:00',
        summary: 'Working with arrays/lists, iterating through collections, and building a mini car game simulation.',
        keyConcepts: ['List Indexing', 'Tuple Immutability', 'Dictionary Lookups', 'Loop Simulation'],
        suggestedStarterCode: `# Car Game State Machine
command = "start"
if command == "start":
    print("Car started... Ready to go!")
elif command == "stop":
    print("Car stopped.")`,
        practiceLanguage: 'Python'
      }
    ]
  },

  // ==========================================
  // 3. JAVASCRIPT & WEB DEVELOPMENT
  // ==========================================
  {
    id: 'js-chai-aur-code',
    title: 'Chai aur JavaScript (Full Modern Course in Hindi)',
    subtitle: 'From Execution Context & Event Loop to DOM, Promises & Async/Await',
    description: 'The definitive Hindi course on Modern JavaScript by Hitesh Choudhary. Learn what really happens behind call stacks, microtask queues, prototypes, and asynchronous APIs.',
    category: 'javascript',
    categoryLabel: 'JavaScript',
    creator: {
      name: 'Hitesh Choudhary',
      channelName: 'Chai aur Code',
      channelUrl: 'https://www.youtube.com/@chaiaurcode',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.4M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    totalDuration: '5h 30m',
    totalLessons: 4,
    prerequisites: ['Basic HTML / Computer Literacy'],
    syllabusTopics: [
      'JS Execution Context & Call Stack',
      'DOM Manipulation & Browser Events',
      'Event Loop & Microtask Queue',
      'Promises, Fetch API & Async/Await'
    ],
    starterPracticeCode: `// Modern JavaScript Async Simulation
const fetchUserProfile = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Alex Developer",
        role: "Full-Stack Engineer",
        status: "Active"
      });
    }, 500);
  });
};

fetchUserProfile(1).then(user => {
  console.log("Fetched User:", user);
});`,
    lessons: [
      {
        id: 'chai-js-1',
        lessonNumber: 1,
        title: 'JavaScript in One Video - Foundations & Variables',
        youtubeId: '7wnove7K-ZQ',
        duration: '1:20:00',
        summary: 'Understanding let, const, var, primitive datatypes, heap vs stack memory, and type coercion in JavaScript.',
        keyConcepts: ['Stack vs Heap Memory', 'Primitive vs Reference', 'Implicit Type Coercion', 'Template Literals'],
        suggestedStarterCode: `const userOne = { email: "ansh@skillgraph.ai", score: 100 };
const userTwo = userOne; // Reference copied
userTwo.score = 250;

console.log("UserOne score changed?", userOne.score); // 250`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'chai-js-2',
        lessonNumber: 2,
        title: 'Execution Context, Hoisting & Call Stack',
        youtubeId: '7wnove7K-ZQ',
        duration: '1:10:00',
        summary: 'How does JavaScript execute code line-by-line? Understand the Memory Creation Phase and Code Execution Phase.',
        keyConcepts: ['Global Execution Context', 'Hoisting Behaviour', 'Temporal Dead Zone (TDZ)', 'Call Stack LIFO'],
        suggestedStarterCode: `console.log("Hoisting demo:");
function calculateTotal(items) {
  return items.reduce((acc, curr) => acc + curr, 0);
}
console.log("Total:", calculateTotal([10, 20, 30]));`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'chai-js-3',
        lessonNumber: 3,
        title: 'DOM Manipulation, Events and Event Bubbling',
        youtubeId: '7wnove7K-ZQ',
        duration: '1:30:00',
        summary: 'Connecting JS to HTML. Querying elements, modifying styles, event listeners, bubbling vs capturing, and event delegation.',
        keyConcepts: ['querySelector & innerHTML', 'addEventListener', 'Event Bubbling & stopPropagation()', 'Event Delegation'],
        suggestedStarterCode: `// Event Delegation Pattern
const clickHandler = (e) => {
  console.log("Element clicked target:", e.target?.tagName);
};`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'chai-js-4',
        lessonNumber: 4,
        title: 'Promises, Async/Await & The Event Loop',
        youtubeId: '7wnove7K-ZQ',
        duration: '1:30:00',
        summary: 'Mastering asynchronous programming: Callback hell, Promise chains, async/await syntax, and error handling with try/catch.',
        keyConcepts: ['Promise states (pending, fulfilled, rejected)', 'Microtask vs Macrotask Queue', 'async/await syntax', 'try...catch...finally'],
        suggestedStarterCode: `async function runTask() {
  try {
    const res = await Promise.resolve("Success from ProofLoop!");
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
runTask();`,
        practiceLanguage: 'JavaScript'
      }
    ]
  },

  {
    id: 'webdev-codewithharry',
    title: 'Full Stack Web Development (HTML, CSS & JS)',
    subtitle: 'Build modern responsive websites from scratch in Hindi',
    description: 'The famous Sigma Web Development course by CodeWithHarry. Covers Semantic HTML5, CSS Flexbox & Grid, Responsive Design, and Modern JavaScript DOM.',
    category: 'web-dev',
    categoryLabel: 'Web Development',
    creator: {
      name: 'Haris Khan',
      channelName: 'CodeWithHarry',
      channelUrl: 'https://www.youtube.com/@CodeWithHarry',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      subscribers: '5.8M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80',
    totalDuration: '6h 15m',
    totalLessons: 3,
    prerequisites: ['None - Start from ground zero'],
    syllabusTopics: [
      'Semantic HTML5 & Page Structure',
      'CSS3 Flexbox, Grid & Media Queries',
      'JavaScript Interactivity & Responsive Layouts'
    ],
    starterPracticeCode: `<!-- Clean Semantic HTML Structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkillGraph Demo</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    .card { background: #1e293b; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #334155; }
    .btn { background: #6366f1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>SkillGraph Video Academy</h2>
    <p>Interactive masterclasses to empower learners worldwide.</p>
    <button class="btn" onclick="alert('Learning Started!')">Start Course</button>
  </div>
</body>
</html>`,
    lessons: [
      {
        id: 'web-harry-1',
        lessonNumber: 1,
        title: 'HTML in One Shot: Semantic Elements, Forms & Tables',
        youtubeId: '6mbwJ2xhgzM',
        duration: '2:00:00',
        summary: 'Learn every vital HTML tag: headers, paragraphs, links, forms, input validation, audio/video embeds, and accessibility.',
        keyConcepts: ['Semantic Tags (header, nav, main, footer)', 'Form Validation & Input Types', 'SEO Meta Tags', 'Accessibility (a11y)'],
        suggestedStarterCode: `<form onsubmit="event.preventDefault(); console.log('Submitted');">
  <label for="username">Learner Name:</label>
  <input id="username" type="text" required placeholder="Learner Name">
  <button type="submit">Enroll</button>
</form>`,
        practiceLanguage: 'HTML'
      },
      {
        id: 'web-harry-2',
        lessonNumber: 2,
        title: 'CSS in One Shot: Box Model, Flexbox & Grid',
        youtubeId: '6mbwJ2xhgzM',
        duration: '2:15:00',
        summary: 'Style web pages like a pro: Margin, Padding, Border box model, positioning, Flexbox alignment, CSS Grid, and responsive breakpoints.',
        keyConcepts: ['Box Sizing: border-box', 'Flexbox (justify-content, align-items)', 'CSS Grid template areas', 'Mobile First Media Queries'],
        suggestedStarterCode: `/* Modern Flexbox Card Container */
.container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}`,
        practiceLanguage: 'HTML'
      },
      {
        id: 'web-harry-3',
        lessonNumber: 3,
        title: 'Connecting HTML, CSS & JavaScript for Dynamic Web Apps',
        youtubeId: '6mbwJ2xhgzM',
        duration: '2:00:00',
        summary: 'Build interactive UI components: modals, accordions, dark mode toggles, and live search bars.',
        keyConcepts: ['classList.toggle()', 'LocalStorage Persistence', 'Dynamic Element Creation', 'Form Handling'],
        suggestedStarterCode: `// Dark mode toggle in JS
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}`,
        practiceLanguage: 'JavaScript'
      }
    ]
  },

  // ==========================================
  // 4. C & C++ PROGRAMMING
  // ==========================================
  {
    id: 'cpp-apna-college',
    title: 'Complete C++ & DSA Course for Placements',
    subtitle: 'From C++ Fundamentals to Pointers, STL & Data Structures with Shradha Khapra',
    description: 'Apna College by Shradha Khapra (ex-Microsoft) covers C++ from the ground up: syntax, pointers, memory allocation, vectors, OOP, and top interview problems.',
    category: 'cpp',
    categoryLabel: 'C & C++',
    creator: {
      name: 'Shradha Khapra',
      channelName: 'Apna College',
      channelUrl: 'https://www.youtube.com/@ApnaCollegeOfficial',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      subscribers: '5.2M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    totalDuration: '5h 45m',
    totalLessons: 3,
    prerequisites: ['Basic logical thinking'],
    syllabusTopics: [
      'C++ Basics, Operators & Flow Control',
      'Functions, Pointers & Memory Allocation',
      'Standard Template Library (STL vectors, maps, sets)'
    ],
    starterPracticeCode: `// C++ STL Vector Example
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    vector<int> numbers = {45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 6, 8};
    sort(numbers.begin(), numbers.end());
    
    cout << "Sorted Numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    return 0;
}`,
    lessons: [
      {
        id: 'cpp-apna-1',
        lessonNumber: 1,
        title: 'C++ Full Course: Variables, Operators & Conditionals',
        youtubeId: 'EAR7De6Goz4',
        duration: '2:00:00',
        summary: 'First steps in C++: #include, namespaces, cout/cin, data types, if-else statements, and loop structures.',
        keyConcepts: ['cout & cin', 'Data Types & Bit Sizes', 'Nested Loops & Patterns', 'Type Casting'],
        suggestedStarterCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to SkillGraph C++ Academy!" << endl;
    int a = 15, b = 25;
    cout << "Sum: " << (a + b) << endl;
    return 0;
}`,
        practiceLanguage: 'C++'
      },
      {
        id: 'cpp-apna-2',
        lessonNumber: 2,
        title: 'Pointers, References & Dynamic Memory in C++',
        youtubeId: 'EAR7De6Goz4',
        duration: '1:45:00',
        summary: 'Master the dreaded pointers: dereference operator (*), address-of (&), pass-by-value vs pass-by-reference, and heap allocation.',
        keyConcepts: ['Pointers (*ptr) and Addresses (&val)', 'Pass by Reference', 'Array decay to pointer', 'new and delete operators'],
        suggestedStarterCode: `#include <iostream>
using namespace std;

void swapByRef(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 10, b = 20;
    swapByRef(a, b);
    cout << "a: " << a << ", b: " << b << endl; // 20, 10
    return 0;
}`,
        practiceLanguage: 'C++'
      },
      {
        id: 'cpp-apna-3',
        lessonNumber: 3,
        title: 'C++ Standard Template Library (STL) Vectors, Sets & Maps',
        youtubeId: 'EAR7De6Goz4',
        duration: '2:00:00',
        summary: 'Stop writing manual linked lists for interviews: Master std::vector, std::unordered_map, std::priority_queue, and sorting algorithms.',
        keyConcepts: ['vector vs raw array', 'unordered_map O(1) lookups', 'Iterators', 'STL sort & binary_search'],
        suggestedStarterCode: `#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> marks;
    marks["Math"] = 98;
    marks["DSA"] = 100;
    
    cout << "DSA Marks: " << marks["DSA"] << endl;
    return 0;
}`,
        practiceLanguage: 'C++'
      }
    ]
  },

  {
    id: 'c-freecodecamp-english',
    title: 'C Programming Tutorial for Beginners (English)',
    subtitle: 'Learn the mother of all modern languages: memory, pointers, and compilation',
    description: 'FreeCodeCamp complete C programming tutorial. Understanding C gives you deep insight into how operating systems, game engines, and languages like Python are built.',
    category: 'cpp',
    categoryLabel: 'C Programming',
    creator: {
      name: 'freeCodeCamp.org',
      channelName: 'freeCodeCamp.org',
      channelUrl: 'https://www.youtube.com/@freecodecamp',
      avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      subscribers: '10M+'
    },
    language: 'English',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3h 45m',
    totalLessons: 2,
    prerequisites: ['None'],
    syllabusTopics: [
      'C Syntax, Printf & Scanf',
      'Arrays, 2D Arrays & Nested Loops',
      'Pointers & Memory Addresses'
    ],
    starterPracticeCode: `/* C Hello World & Memory Pointer */
#include <stdio.h>

int main() {
    int age = 22;
    int *pAge = &age;
    
    printf("Age value: %d\\n", age);
    printf("Memory address of age: %p\\n", pAge);
    printf("Dereferenced value: %d\\n", *pAge);
    return 0;
}`,
    lessons: [
      {
        id: 'c-fcc-1',
        lessonNumber: 1,
        title: 'C Programming Tutorial for Beginners - Full Course',
        youtubeId: 'KJgsSFOSQv0',
        duration: '1:50:00',
        summary: 'Writing your first C program, understanding compilation, variables, printf formatting, scanf user input, and functions.',
        keyConcepts: ['gcc compiler', 'printf format specifiers (%d, %f, %s)', 'scanf address pass (&)', 'Header files'],
        suggestedStarterCode: `#include <stdio.h>

int main() {
    char name[] = "Learner";
    printf("Welcome %s to C programming!\\n", name);
    return 0;
}`,
        practiceLanguage: 'C++'
      },
      {
        id: 'c-fcc-2',
        lessonNumber: 2,
        title: 'Pointers, Structs and File Handling in C',
        youtubeId: 'KJgsSFOSQv0',
        duration: '1:55:00',
        summary: 'Memory manipulation in C: Structs for custom records, pointers, pointer arithmetic, and reading/writing files.',
        keyConcepts: ['struct declaration', 'Pointer dereferencing', 'malloc and free', 'fopen, fprintf, fclose'],
        suggestedStarterCode: `#include <stdio.h>

struct Student {
    char name[50];
    float gpa;
};

int main() {
    struct Student s1 = {"Ansh", 3.9};
    printf("Student: %s, GPA: %.2f\\n", s1.name, s1.gpa);
    return 0;
}`,
        practiceLanguage: 'C++'
      }
    ]
  },

  // ==========================================
  // 5. JAVA PROGRAMMING
  // ==========================================
  {
    id: 'java-apna-college',
    title: 'Complete Java & OOP Tutorial in Hindi',
    subtitle: 'From Java syntax to Object-Oriented Principles (OOP) with Apna College',
    description: 'Shradha Khapra teaches Java from absolute zero: JVM, JRE, JDK, loops, functions, arrays, and the four pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism).',
    category: 'java',
    categoryLabel: 'Java Programming',
    creator: {
      name: 'Shradha Khapra',
      channelName: 'Apna College',
      channelUrl: 'https://www.youtube.com/@ApnaCollegeOfficial',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      subscribers: '5.2M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    totalDuration: '4h 30m',
    totalLessons: 3,
    prerequisites: ['No prior programming needed'],
    syllabusTopics: [
      'JDK, JRE & JVM Architecture',
      'Java Variables, Loops & Functions',
      'The 4 Pillars of OOP in Java'
    ],
    starterPracticeCode: `// Java OOP 4 Pillars Demo
class BankAccount {
    private double balance; // Encapsulation

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount myAccount = new BankAccount(5000);
        myAccount.deposit(1500);
        System.out.println("Current Balance: $" + myAccount.getBalance());
    }
}`,
    lessons: [
      {
        id: 'java-apna-1',
        lessonNumber: 1,
        title: 'Java Tutorial for Beginners: Setup, Variables & Loops',
        youtubeId: 'yRpLlJmRo2w',
        duration: '1:30:00',
        summary: 'Understanding JVM, byte code execution, public static void main, Scanner input, if-else conditions, and loops.',
        keyConcepts: ['JVM vs JRE vs JDK', 'Scanner for User Input', 'Primitive vs Reference types', 'for & while loops'],
        suggestedStarterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("SkillGraph Java Academy!");
    }
}`,
        practiceLanguage: 'Java'
      },
      {
        id: 'java-apna-2',
        lessonNumber: 2,
        title: 'Methods, Arrays and Strings in Java',
        youtubeId: 'yRpLlJmRo2w',
        duration: '1:30:00',
        summary: 'Writing modular code with methods, passing arguments, arrays, multidimensional arrays, and String immutability.',
        keyConcepts: ['Method Overloading', 'Array Traversal', 'String Pool & Immutability', 'StringBuilder for performance'],
        suggestedStarterCode: `public class ArrayDemo {
    public static void main(String[] args) {
        int[] scores = {95, 88, 76, 99};
        int sum = 0;
        for (int s : scores) sum += s;
        System.out.println("Average: " + (sum / (double)scores.length));
    }
}`,
        practiceLanguage: 'Java'
      },
      {
        id: 'java-apna-3',
        lessonNumber: 3,
        title: 'Object-Oriented Programming (OOP) in Java Explained',
        youtubeId: 'yRpLlJmRo2w',
        duration: '1:30:00',
        summary: 'Master Classes, Objects, Constructors, Inheritance (extends), Interfaces (implements), and Polymorphism.',
        keyConcepts: ['Encapsulation (getters/setters)', 'Inheritance (super keyword)', 'Polymorphism (overriding)', 'Interfaces vs Abstract Classes'],
        suggestedStarterCode: `interface Playable {
    void play();
}

class AudioPlayer implements Playable {
    public void play() {
        System.out.println("Playing audio lesson...");
    }
}`,
        practiceLanguage: 'Java'
      }
    ]
  },

  // ==========================================
  // 6. SQL & DATABASES
  // ==========================================
  {
    id: 'sql-freecodecamp',
    title: 'SQL & Relational Databases for Beginners (Full Course)',
    subtitle: 'Learn SQL Queries, Table Schemas, Joins, Keys & Database Normalization',
    description: 'Mike Dane on FreeCodeCamp teaches SQL from scratch: SELECT, WHERE, GROUP BY, INNER JOIN, LEFT JOIN, foreign keys, and designing normalized relational databases.',
    category: 'sql',
    categoryLabel: 'SQL & Databases',
    creator: {
      name: 'freeCodeCamp.org',
      channelName: 'freeCodeCamp.org',
      channelUrl: 'https://www.youtube.com/@freecodecamp',
      avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      subscribers: '10M+'
    },
    language: 'English',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    totalDuration: '4h 20m',
    totalLessons: 3,
    prerequisites: ['None'],
    syllabusTopics: [
      'Relational Database Basics & Tables',
      'SELECT, WHERE, Aggregations & Group By',
      'INNER, LEFT, RIGHT JOINs & Foreign Keys'
    ],
    starterPracticeCode: `-- SQL Schema & Queries for SkillGraph
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    xp_points INT DEFAULT 0
);

CREATE TABLE course_enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_name VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Query to find top learners
SELECT s.name, s.xp_points, COUNT(e.enrollment_id) AS enrolled_courses
FROM students s
LEFT JOIN course_enrollments e ON s.student_id = e.student_id
GROUP BY s.student_id, s.name, s.xp_points
ORDER BY s.xp_points DESC;`,
    lessons: [
      {
        id: 'sql-fcc-1',
        lessonNumber: 1,
        title: 'SQL Tutorial - Full Database Course for Beginners',
        youtubeId: 'HXV3zeQKqGY',
        duration: '1:30:00',
        summary: 'What is a Database? Relational vs Non-relational, primary keys, creating tables, inserting rows, and updating records.',
        keyConcepts: ['RDBMS vs NoSQL', 'Primary & Foreign Keys', 'CREATE TABLE & INSERT INTO', 'UPDATE & DELETE commands'],
        suggestedStarterCode: `CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        practiceLanguage: 'SQL'
      },
      {
        id: 'sql-fcc-2',
        lessonNumber: 2,
        title: 'Querying Data: SELECT, Filters, Ordering & Grouping',
        youtubeId: 'HXV3zeQKqGY',
        duration: '1:25:00',
        summary: 'Filtering data with WHERE, AND/OR logic, LIKE wildcards, ORDER BY, LIMIT, and aggregate functions (COUNT, SUM, AVG).',
        keyConcepts: ['SELECT column1, column2', 'WHERE conditions & LIKE', 'Aggregate functions (COUNT, AVG, MAX)', 'GROUP BY and HAVING'],
        suggestedStarterCode: `SELECT category, COUNT(*) as total_courses, AVG(rating) as avg_rating
FROM courses
WHERE is_active = TRUE
GROUP BY category
HAVING COUNT(*) > 2;`,
        practiceLanguage: 'SQL'
      },
      {
        id: 'sql-fcc-3',
        lessonNumber: 3,
        title: 'Mastering SQL Joins: INNER, LEFT, RIGHT & Full Outer',
        youtubeId: 'HXV3zeQKqGY',
        duration: '1:25:00',
        summary: 'Combine data across multiple relational tables with visual Venn diagrams: INNER JOIN, LEFT JOIN, and subqueries.',
        keyConcepts: ['Relational Entity Modeling', 'INNER JOIN vs LEFT JOIN', 'Handling NULLs in outer joins', 'Subqueries & Nested SELECT'],
        suggestedStarterCode: `SELECT o.order_id, c.customer_name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;`,
        practiceLanguage: 'SQL'
      }
    ]
  },

  // ==========================================
  // 7. DATA STRUCTURES & ALGORITHMS (DSA)
  // ==========================================
  {
    id: 'dsa-cs-dojo',
    title: 'Data Structures & Algorithms for Beginners',
    subtitle: 'Clear, intuitive explanations of Big-O, Arrays, Linked Lists & Trees with YK Sugi',
    description: 'CS Dojo (former Google Software Engineer YK Sugi) teaches Data Structures and Algorithms with simple whiteboard animations and interview problem-solving intuition.',
    category: 'dsa',
    categoryLabel: 'DSA & Algorithms',
    creator: {
      name: 'YK Sugi',
      channelName: 'CS Dojo',
      channelUrl: 'https://www.youtube.com/@CSDojo',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.9M+'
    },
    language: 'English',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2h 30m',
    totalLessons: 3,
    prerequisites: ['Basic loops and functions in any language'],
    syllabusTopics: [
      'Big-O Notation & Time Complexity Intuition',
      'Arrays vs Linked Lists in Memory',
      'Binary Search & Recursion'
    ],
    starterPracticeCode: `# Binary Search: O(log N) Time Complexity
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid # Found index!
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1 # Not found

sorted_nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
index = binary_search(sorted_nums, target)
print(f"Target {target} found at index: {index}")`,
    lessons: [
      {
        id: 'dsa-csd-1',
        lessonNumber: 1,
        title: 'Introduction to Big-O Notation and Time Complexity',
        youtubeId: 'D6xkbGLQesk',
        duration: '15:20',
        summary: 'Why does algorithm speed matter? Understand O(1), O(log N), O(N), O(N log N), and O(N^2) using intuitive real-life scenarios.',
        keyConcepts: ['Time vs Space Complexity', 'Worst-case Analysis', 'Drop Constants & Lower Order Terms', 'Scalability Curve'],
        suggestedStarterCode: `# O(1) Constant vs O(N) Linear
nums = [10, 20, 30, 40, 50]
first = nums[0] # O(1)
has_forty = 40 in nums # O(N)
print("Found 40:", has_forty)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'dsa-csd-2',
        lessonNumber: 2,
        title: 'Data Structures 101: Arrays vs Linked Lists',
        youtubeId: 'WwfhLC16bis',
        duration: '22:15',
        summary: 'How computer RAM stores contiguous memory blocks (Arrays) vs pointer chains (Linked Lists). Compare insertion and lookup trade-offs.',
        keyConcepts: ['Contiguous Memory Allocation', 'Node (Value + Next Pointer)', 'O(1) Insertion vs O(1) Index Access', 'Doubly Linked Lists'],
        suggestedStarterCode: `# Simple Linked List Node
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

head = Node("First")
head.next = Node("Second")
head.next.next = Node("Third")

current = head
while current:
    print(current.value, end=" -> ")
    current = current.next
print("None")`,
        practiceLanguage: 'Python'
      },
      {
        id: 'dsa-csd-3',
        lessonNumber: 3,
        title: 'Recursion and Binary Search Trees',
        youtubeId: '5CU2k1iWn1A',
        duration: '25:40',
        summary: 'Demystifying recursion with the call stack, base cases, and building a Binary Search Tree (BST) for fast logarithmic lookups.',
        keyConcepts: ['Base Case & Recursive Step', 'Stack Overflow Risk', 'Binary Search Tree Property', 'In-Order Traversal'],
        suggestedStarterCode: `# Factorial with recursion
def factorial(n):
    if n <= 1: # Base case
        return 1
    return n * factorial(n - 1)

print("5! =", factorial(5))`,
        practiceLanguage: 'Python'
      }
    ]
  },

  // ==========================================
  // 8. HOW TO BUILD YOUR OWN APP (MOBILE APP DEV & PLAY STORE)
  // ==========================================
  {
    id: 'app-dev-react-native-mastery',
    title: 'Build iOS & Android Mobile Apps with React Native',
    subtitle: 'From zero to building real mobile apps on your phone with Expo & React Native',
    description: 'Learn how to build native cross-platform mobile apps for Android and iOS using React Native. Master mobile layouts, touch gestures, navigation, camera access, and device storage.',
    category: 'app-dev',
    categoryLabel: 'How to Build Your Own App',
    creator: {
      name: 'Mosh Hamedani',
      channelName: 'Programming with Mosh',
      channelUrl: 'https://www.youtube.com/@programmingwithmosh',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subscribers: '3.8M+'
    },
    language: 'English',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2h 15m',
    totalLessons: 4,
    prerequisites: ['Basic JavaScript or HTML/CSS', 'A Smartphone or Emulator'],
    syllabusTopics: [
      'React Native Architecture & Expo Setup',
      'Mobile UI Components (View, Text, Image, Touchable)',
      'Flexbox for Mobile Layouts & Responsive Screens',
      'React Navigation (Stacks & Tabs) & Device Storage'
    ],
    starterPracticeCode: `// React Native Mobile Component Concept
const App = () => {
  const [likes, setLikes] = useState(0);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
        My First Mobile App 📱
      </Text>
      <TouchableOpacity 
        onPress={() => setLikes(likes + 1)}
        style={{ marginTop: 20, padding: 15, backgroundColor: '#6366f1', borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tap Me: {likes} Likes</Text>
      </TouchableOpacity>
    </View>
  );
};`,
    lessons: [
      {
        id: 'rn-app-1',
        lessonNumber: 1,
        title: 'React Native Tutorial for Beginners - Build a React Native App',
        youtubeId: '0-S5a0eXPoc',
        duration: '29:40',
        summary: 'Understand how React Native bridges JavaScript to native Android and iOS views. Setup Expo CLI and run your first app on your physical phone in under 5 minutes.',
        keyConcepts: ['Bridge vs Native Thread', 'Expo Go App', 'JSX for Mobile', 'Hot Reloading on Phone'],
        suggestedStarterCode: `// Expo App Entry Point
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello from SkillGraph Mobile!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#38bdf8', fontSize: 20, fontWeight: 'bold' }
});`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'rn-app-2',
        lessonNumber: 2,
        title: 'Fundamental UI Components & Flexbox Layouts',
        youtubeId: 'obH0Po_RdWk',
        duration: '35:10',
        summary: 'Master Mobile UI: Views, Text, Image, ScrollView, TextInput, and FlatList for smooth scrolling lists. Learn how Flexbox in React Native defaults to flexDirection: column.',
        keyConcepts: ['View vs Div', 'FlatList Optimization', 'flexDirection: column default', 'Platform Specific Styling'],
        suggestedStarterCode: `// FlatList for 60fps scrolling
const courses = [
  { id: '1', title: 'Python AI Masterclass' },
  { id: '2', title: 'React Native App Studio' }
];

const CourseList = () => (
  <FlatList
    data={courses}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <Text style={{ color: '#fff', padding: 10 }}>{item.title}</Text>}
  />
);`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'rn-app-3',
        lessonNumber: 3,
        title: 'Mobile Navigation: Stack & Tab Navigators',
        youtubeId: 'ANdSdIlgsEw',
        duration: '32:15',
        summary: 'Move between screens like a real mobile app. Set up bottom tab navigation (Home, Courses, Profile) and stack navigation for opening lesson detail screens.',
        keyConcepts: ['React Navigation v6', 'Stack.Navigator', 'BottomTabs.Navigator', 'Passing Route Parameters'],
        suggestedStarterCode: `// Stack Navigation Concept
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailScreen} />
    </Stack.Navigator>
  );
}`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'rn-app-4',
        lessonNumber: 4,
        title: 'Publishing Your App: Building APK & App Bundle for Play Store',
        youtubeId: 'b8H-q_rN_dM',
        duration: '38:00',
        summary: 'From local code to an installable Android APK and .aab file. Generate keystore signing, configure app icons & splash screens with EAS Build, and test on Android.',
        keyConcepts: ['EAS Build (Expo Application Services)', 'Android Keystore Credentials', 'App Icons & Adaptive Icons', 'Generating .aab & .apk'],
        suggestedStarterCode: `// app.json Configuration for Play Store
{
  "expo": {
    "name": "SkillGraph Academy",
    "slug": "skillgraph-app",
    "version": "1.0.0",
    "android": {
      "package": "com.anshraj.skillgraph",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#020617"
      }
    }
  }
}`,
        practiceLanguage: 'JavaScript'
      }
    ]
  },

  {
    id: 'app-dev-flutter-dart-complete',
    title: 'Flutter & Dart: Build Beautiful Cross-Platform Apps',
    subtitle: 'Google\'s high-performance mobile UI framework with Hitesh Choudhary & FreeCodeCamp',
    description: 'Learn Flutter and Dart from scratch. Build native-performing apps with pixel-perfect widgets, reactive state management, asynchronous network requests, and smooth 120Hz animations.',
    category: 'app-dev',
    categoryLabel: 'How to Build Your Own App',
    creator: {
      name: 'Hitesh Choudhary',
      channelName: 'Chai aur Code',
      channelUrl: 'https://www.youtube.com/@chaiaurcode',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.2M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2h 40m',
    totalLessons: 4,
    prerequisites: ['Basic computer knowledge', 'Zero coding background required'],
    syllabusTopics: [
      'Dart Language Fundamentals for Mobile',
      'Stateless vs Stateful Widgets in Flutter',
      'Building Material 3 Mobile UIs (Scaffold, AppBar, Cards)',
      'Connecting REST APIs & Building a Full Mobile App'
    ],
    starterPracticeCode: `// Flutter & Dart Entrypoint
import 'package:flutter/material.dart';

void main() => runApp(SkillGraphApp());

class SkillGraphApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: Color(0xFF0F172A),
        appBar: AppBar(title: Text('SkillGraph Studio')),
        body: Center(
          child: Text('Mobile App Running on Flutter!', style: TextStyle(color: Colors.white, fontSize: 18)),
        ),
      ),
    );
  }
}`,
    lessons: [
      {
        id: 'flutter-app-1',
        lessonNumber: 1,
        title: 'Flutter in Hindi: Dart Language Crash Course',
        youtubeId: 'VPvVD8t02U8',
        duration: '42:10',
        summary: 'Understand the Dart language which powers Flutter: variables, functions, null safety, OOP classes, and async/await for mobile app developers.',
        keyConcepts: ['Sound Null Safety', 'Classes & Constructors', 'Future & Async/Await', 'Dart Lists & Maps'],
        suggestedStarterCode: `// Dart basics
void main() {
  String app = "SkillGraph Mobile";
  int activeCourses = 12;
  print("Welcome to $app ($activeCourses courses available)");
}`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'flutter-app-2',
        lessonNumber: 2,
        title: 'Everything is a Widget: StatelessWidget vs StatefulWidget',
        youtubeId: '1ukSR1GRtMU',
        duration: '38:25',
        summary: 'Deep dive into Flutter\'s declarative widget tree. Learn how setState() re-renders UI smoothly, and build interactive buttons, inputs, and cards.',
        keyConcepts: ['Declarative UI Tree', 'setState() Lifecycle', 'Hot Reload in 500ms', 'Scaffold & Themeing'],
        suggestedStarterCode: `// Flutter stateful counter
class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;
  void _increment() => setState(() => _counter++);
}`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'flutter-app-3',
        lessonNumber: 3,
        title: 'Building a Complete Real-World Mobile App with REST API',
        youtubeId: 'CD1Y2DmL5JM',
        duration: '45:30',
        summary: 'Build a production-grade app that fetches data from backend APIs, shows loading skeletons, handles offline states, and displays beautiful cards.',
        keyConcepts: ['http Package in Dart', 'JSON Serialization', 'FutureBuilder Widget', 'Error & Loading States'],
        suggestedStarterCode: `// Fetching data in Flutter
Future<void> fetchCourses() async {
  final response = await http.get(Uri.parse('https://api.skillgraph.in/courses'));
  if (response.statusCode == 200) {
    print("Courses Loaded Successfully");
  }
}`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'flutter-app-4',
        lessonNumber: 4,
        title: 'How to Publish Flutter App to Google Play Store',
        youtubeId: 'zOjov-2OZ0E',
        duration: '34:10',
        summary: 'Step-by-step masterclass on building release APK and .aab files, generating keystore, filling Play Store console privacy policies, and publishing.',
        keyConcepts: ['flutter build appbundle', 'Signing Key & Keytool', 'Play Console Release Tracks', 'Google Play Policy Compliance'],
        suggestedStarterCode: `# Terminal command to build Play Store bundle
flutter build appbundle --release`,
        practiceLanguage: 'JavaScript'
      }
    ]
  },

  // ==========================================
  // 9. WEB DEVELOPMENT (FULL STACK)
  // ==========================================
  {
    id: 'web-sigma-codewithharry',
    title: 'Sigma Web Development Course (HTML, CSS, JS & React)',
    subtitle: 'From zero knowledge to full stack web developer with CodeWithHarry',
    description: 'CodeWithHarry’s acclaimed Sigma Web Development course. Master HTML5 semantic structure, modern CSS3 Flexbox/Grid, JavaScript DOM manipulation, Express backend, and React components.',
    category: 'web-dev',
    categoryLabel: 'Web Development',
    creator: {
      name: 'Harry (Haris Khan)',
      channelName: 'CodeWithHarry',
      channelUrl: 'https://www.youtube.com/@CodeWithHarry',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      subscribers: '6.1M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3h 10m',
    totalLessons: 4,
    prerequisites: ['Computer or mobile browser', 'Zero previous coding required'],
    syllabusTopics: [
      'HTML5 Tags, Forms & Semantic Layout',
      'CSS3 Flexbox, CSS Grid & Responsive Design',
      'JavaScript DOM Manipulation & Events',
      'Building Full Stack Apps with React & Node'
    ],
    starterPracticeCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #020617; color: white; text-align: center; padding: 40px; }
    .card { background: #1e293b; padding: 20px; border-radius: 12px; max-width: 400px; margin: auto; }
    button { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Sigma Web Dev by Harry</h2>
    <p>HTML + CSS + JS in action!</p>
    <button onclick="document.getElementById('msg').innerText = '🔥 You are a Web Developer!'">Click Me</button>
    <p id="msg" style="color: #38bdf8; margin-top: 15px;"></p>
  </div>
</body>
</html>`,
    lessons: [
      {
        id: 'web-harry-1',
        lessonNumber: 1,
        title: 'Introduction to Web Development & HTML5 Basics',
        youtubeId: 'tVzUXW6siu0',
        duration: '31:20',
        summary: 'Understand how the internet works: clients, servers, IP addresses, DNS, and write your first HTML5 webpage with headings, paragraphs, and lists.',
        keyConcepts: ['Client vs Server', 'HTML5 Boilerplate (! tab)', 'Semantic Tags (header, main, footer)', 'Anchor Tags & Links'],
        suggestedStarterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Website</title>
</head>
<body>
  <h1>Welcome to SkillGraph!</h1>
  <p>Learn coding with Chai aur Code & CodeWithHarry.</p>
</body>
</html>`,
        practiceLanguage: 'HTML'
      },
      {
        id: 'web-harry-2',
        lessonNumber: 2,
        title: 'CSS3 Flexbox & Grid for Responsive Websites',
        youtubeId: 'ESnrn1kAD4E',
        duration: '45:10',
        summary: 'Say goodbye to messy CSS floats. Master Flexbox (justify-content, align-items, flex-wrap) and CSS Grid to make layouts look stunning on mobile, tablet, and desktop.',
        keyConcepts: ['Box Model (Margin, Border, Padding)', 'Flexbox Axis & Alignment', 'CSS Grid Template Columns', 'Media Queries (@media)'],
        suggestedStarterCode: `/* Flexbox Navbar Example */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0f172a;
  padding: 1rem 2rem;
}`,
        practiceLanguage: 'HTML'
      },
      {
        id: 'web-harry-3',
        lessonNumber: 3,
        title: 'JavaScript DOM Manipulation & Event Listeners',
        youtubeId: 'on9nwbZngi4',
        duration: '52:15',
        summary: 'Make your webpage come alive! Select elements with querySelector, attach click and input event listeners, dynamically add cards, and handle user interactions.',
        keyConcepts: ['document.querySelector', 'addEventListener', 'Manipulating innerHTML & style', 'Event Bubbling & Capturing'],
        suggestedStarterCode: `// Dynamic DOM Update
const button = document.querySelector('#btn');
button.addEventListener('click', () => {
  const note = document.createElement('div');
  note.textContent = "New Note Added!";
  document.body.appendChild(note);
});`,
        practiceLanguage: 'JavaScript'
      },
      {
        id: 'web-harry-4',
        lessonNumber: 4,
        title: 'Building Interactive React Components & State',
        youtubeId: 'gY5sGvqmA9w',
        duration: '41:40',
        summary: 'Transition from vanilla JavaScript to modern React. Understand JSX, components, useState hook, and build reactive web applications that update instantly.',
        keyConcepts: ['JSX Syntax', 'Component Reusability', 'useState Hook', 'Conditional Rendering'],
        suggestedStarterCode: `// React Functional Component
import React, { useState } from 'react';

export function TodoApp() {
  const [tasks, setTasks] = useState(['Learn HTML', 'Master React']);
  return (
    <ul>
      {tasks.map(t => <li key={t}>{t}</li>)}
    </ul>
  );
}`,
        practiceLanguage: 'JavaScript'
      }
    ]
  },

  // ==========================================
  // 10. AI: BUILD CHATGPT FROM SCRATCH
  // ==========================================
  {
    id: 'ai-llm-karpathy-mastery',
    title: 'Let\'s build GPT: from scratch, in code, spelled out',
    subtitle: 'Andrej Karpathy (former Tesla AI Director & OpenAI co-founder) builds ChatGPT',
    description: 'The world\'s most celebrated deep learning masterclass. Andrej Karpathy builds a generative transformer from scratch in PyTorch, explaining every token, attention head, and residual connection.',
    category: 'ai-ml',
    categoryLabel: 'AI & Deep Learning',
    creator: {
      name: 'Andrej Karpathy',
      channelName: 'Andrej Karpathy',
      channelUrl: 'https://www.youtube.com/@AndrejKarpathy',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.1M+'
    },
    language: 'English',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2h 10m',
    totalLessons: 3,
    prerequisites: ['Basic Python programming', 'Basic math intuition'],
    syllabusTopics: [
      'Bigram Language Model & Tokenization',
      'Self-Attention Mechanism (Queries, Keys, Values)',
      'Multi-Head Attention & Transformer Blocks'
    ],
    starterPracticeCode: `# Simple Bigram Character-Level Model Concept
text = "hello world"
chars = sorted(list(set(text)))
vocab_size = len(chars)

# Mapping characters to integers
char_to_id = { ch:i for i,ch in enumerate(chars) }
id_to_char = { i:ch for i,ch in enumerate(chars) }

encoded = [char_to_id[c] for c in "hello"]
print("Encoded tokens:", encoded)
decoded = ''.join([id_to_char[i] for i in encoded])
print("Decoded string:", decoded)`,
    lessons: [
      {
        id: 'karpathy-1',
        lessonNumber: 1,
        title: 'Building a Bigram Language Model & Tokenizer',
        youtubeId: 'kCc8FmEb1nY',
        duration: '45:00',
        summary: 'Start from character-level tokenization, building training batches of context windows, and measuring Cross-Entropy loss.',
        keyConcepts: ['Vocabulary Mapping', 'Batch & Block Size', 'Cross-Entropy Loss', 'Generating with argmax/multinomial'],
        suggestedStarterCode: `import torch
import torch.nn as nn

# Simple token embedding lookup table
vocab_size = 65
embedding_dim = 32
token_embedding_table = nn.Embedding(vocab_size, embedding_dim)
print("Embedding table created:", token_embedding_table)`,
        practiceLanguage: 'Python'
      },
      {
        id: 'karpathy-2',
        lessonNumber: 2,
        title: 'The Mathematical Core of Self-Attention (Queries, Keys, Values)',
        youtubeId: 'kCc8FmEb1nY',
        duration: '48:30',
        summary: 'Understand why Attention is all you need: queries dot keys divided by square root of head size, masked by lower triangular matrix so tokens only look at past tokens.',
        keyConcepts: ['Queries, Keys & Values', 'Scaled Dot-Product Attention', 'Causal Triangular Mask', 'Softmax Probability Weights'],
        suggestedStarterCode: `# Scaled dot product attention intuition
import math
# Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
print("Attention formula verified")`,
        practiceLanguage: 'Python'
      },
      {
        id: 'karpathy-3',
        lessonNumber: 3,
        title: 'Multi-Head Attention, Residual Connections & Text Generation',
        youtubeId: 'kCc8FmEb1nY',
        duration: '36:30',
        summary: 'Stack multiple heads together, add LayerNorm, residual skip connections, and train the transformer to write Shakespeare-like text.',
        keyConcepts: ['Multi-Head Attention', 'Feed-Forward Network', 'LayerNorm vs BatchNorm', 'Residual Stream Highway'],
        suggestedStarterCode: `# Generating text from trained model
# context = torch.zeros((1, 1), dtype=torch.long)
# print(decode(model.generate(context, max_new_tokens=100)[0].tolist()))`,
        practiceLanguage: 'Python'
      }
    ]
  },
  // ==========================================
  // 17. VIDEO EDITING & TRENDING REELS EFFECTS (PRO / ADVANCED VIP EXCLUSIVE)
  // ==========================================
  {
    id: 'video-editing-trending-effects-masterclass',
    title: 'Video Editing, Trending Effects & AI VFX Masterclass',
    subtitle: 'From CapCut & Premiere Pro to Flow AI 10-sec Cinematic Clips & Viral Reels Editing',
    description: 'Learn modern video editing from India\'s top content creators. Master fast-paced beat cuts, zoom keyframes, sound design, DaVinci Resolve color grading, and Flow AI B-roll generation with trending motion effects.',
    category: 'video-editing',
    categoryLabel: 'Video Editing & Trending VFX',
    creator: {
      name: 'Creator Academy India',
      channelName: 'Creator Masterclass',
      channelUrl: 'https://www.youtube.com',
      avatarUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=150&auto=format&fit=crop&q=80',
      subscribers: '3.2M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Zero Prerequisites',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3h 15m',
    totalLessons: 4,
    isPremiumOnly: true, // PRO / ADVANCED ONLY
    prerequisites: ['Phone or Laptop', 'Creativity & Storytelling Interest'],
    syllabusTopics: [
      'CapCut Mobile & Desktop: Dynamic Zoom, Smooth Keyframing & Sound FX',
      'Adobe Premiere Pro & DaVinci: Cinematic Color Grading & 4K Export',
      'Flow AI Video Studio: Synthesizing 10s B-Roll with Camera Pan/Tilt/Drone',
      'Trending Reels Transitions, 3D Text Tracking & Viral Hooks'
    ],
    starterPracticeCode: `# Video Editing Timeline & Keyframe Calculator
fps = 60
clip_duration_seconds = 10
total_frames = fps * clip_duration_seconds

# Calculate keyframe timings for dynamic zoom
intro_hook_frames = int(fps * 2.5)  # First 2.5 seconds hook
b_roll_transition_frames = int(fps * 6.0) # Midpoint effect

print(f"Total 60fps Frames: {total_frames}")
print(f"Hook Cut Keyframe: Frame #{intro_hook_frames}")
print(f"Flow AI VFX Transition: Frame #{b_roll_transition_frames}")`,
    lessons: [
      {
        id: 'editing-lesson-1',
        lessonNumber: 1,
        title: 'CapCut Complete Masterclass: Fast Cuts, Zoom Keyframes & Audio Sync in Hindi',
        youtubeId: 'W6NZfCO5SIk',
        duration: '42:15',
        summary: 'Master the fundamentals of short-form storytelling. Learn how to cut dead air, apply smooth curve velocity speed ramps, match sound effects (whoosh, pop, riser), and retain 80%+ viewer retention.',
        keyConcepts: ['Curve Speed Ramping', 'Sound Design Layering', 'Keyframe Smooth Zoom', 'Captions & Text Animation'],
        isPremiumOnly: true
      },
      {
        id: 'editing-lesson-2',
        lessonNumber: 2,
        title: 'Premiere Pro & DaVinci Resolve: Color Grading & Cinematic Teal/Orange LUTs',
        youtubeId: 'W6NZfCO5SIk',
        duration: '50:30',
        summary: 'Transform flat smartphone footage into cinema-grade visuals using Lumetri Color curves, LUTs, masking, and high-bitrate 4K YouTube/Reels export settings.',
        keyConcepts: ['Color Scopes & Waveforms', 'Teal & Orange Grade', 'Mask Tracking', 'Lossless 4K Bitrate Export'],
        isPremiumOnly: true
      },
      {
        id: 'editing-lesson-3',
        lessonNumber: 3,
        title: 'Flow AI Video Studio & Runway Gen: Turning Prompts into 10-Sec AI B-Roll',
        youtubeId: 'aircAruvnKk',
        duration: '38:40',
        summary: 'Learn how to generate photorealistic video assets for your edits using Flow AI. Control camera panning, tilt, 360 orbit, and speed ramps to create viral b-roll without expensive camera gear.',
        keyConcepts: ['AI Prompt Synthesis', 'Camera Director Motion', 'Optical Flow Coherence', 'AI VFX Integration'],
        isPremiumOnly: true
      },
      {
        id: 'editing-lesson-4',
        lessonNumber: 4,
        title: 'Trending Viral Hooks & 3D Tracking Effects (Full Workflow)',
        youtubeId: 'aircAruvnKk',
        duration: '32:00',
        summary: 'Create viral YouTube Shorts and Instagram Reels with 3D text tracking behind subjects, sound impact markers, and smooth whip pan transitions.',
        keyConcepts: ['3D Camera Tracker', 'Rotoscoping Subjects', 'Whip Pan Transitions', 'Viral Retention Engineering'],
        isPremiumOnly: true
      }
    ]
  },
  // ==========================================
  // 18. LOVE BABBAR: DSA CRACKING SHEET (INDIAN CREATOR MASTERCLASS)
  // ==========================================
  {
    id: 'love-babbar-dsa-sheet-masterclass',
    title: 'Complete DSA Placement Series (Love Babbar)',
    subtitle: 'Solve India\'s Most Popular 450 DSA Interview Questions with Real Intuition in Hindi',
    description: 'Love Babbar (ex-Amazon SDE) breaks down Data Structures and Algorithms from absolute zero. Learn how to think through complex problems: Binary Search, Recursion, Trees, Graphs, and Dynamic Programming with visual dry-runs.',
    category: 'dsa',
    categoryLabel: 'DSA Placement Sheet',
    creator: {
      name: 'Love Babbar',
      channelName: 'CodeHelp - by Babbar',
      channelUrl: 'https://www.youtube.com/@CodeHelp',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subscribers: '1.8M+'
    },
    language: 'Hindi / Hinglish',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    totalDuration: '4h 10m',
    totalLessons: 4,
    prerequisites: ['Basic C++ or Java', 'Willingness to Solve Problems Daily'],
    syllabusTopics: [
      'Time & Space Complexity (Big-O) Masterclass',
      'Arrays & Two-Pointer Patterns (Trapping Rainwater, Kadane\'s)',
      'Binary Search on Answer Space (Book Allocation, Aggressive Cows)',
      'Recursion & Backtracking Intuition (Subsets, N-Queen)'
    ],
    starterPracticeCode: `// Binary Search Implementation in C++ / JavaScript
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log("Index of 23:", binarySearch(numbers, 23));`,
    lessons: [
      {
        id: 'babbar-1',
        lessonNumber: 1,
        title: 'Time & Space Complexity Explained in Hindi (Big-O, Omega, Theta)',
        youtubeId: 'WQoB2z67hvY',
        duration: '45:10',
        summary: 'Understand how interviewers evaluate code performance. Calculate time and space complexity with step-by-step loop analysis and recursion trees.',
        keyConcepts: ['Big-O Analysis', 'Worst vs Best Case', 'Auxiliary Space vs Input Space', 'Recursion Call Stack Memory']
      },
      {
        id: 'babbar-2',
        lessonNumber: 2,
        title: 'Arrays & Two-Pointer Master Patterns (Kadane’s Algorithm & Rainwater Trapping)',
        youtubeId: 'WQoB2z67hvY',
        duration: '55:20',
        summary: 'Master the top array questions asked in Google, Amazon, and Microsoft interviews with clear dry-runs.',
        keyConcepts: ['Two-Pointer Technique', 'Prefix Sum Array', 'Sliding Window', 'Kadane\'s Algorithm']
      },
      {
        id: 'babbar-3',
        lessonNumber: 3,
        title: 'Binary Search on Answer Space (Book Allocation & Painter Partition)',
        youtubeId: 'WQoB2z67hvY',
        duration: '58:00',
        summary: 'Learn how to apply Binary Search not just on sorted arrays, but on optimization problems with monotonic search spaces.',
        keyConcepts: ['Search Space Definition', 'Feasibility Function', 'Monotonicity', 'Boundary Updates']
      },
      {
        id: 'babbar-4',
        lessonNumber: 4,
        title: 'Recursion & Backtracking: Subsets, Permutations & N-Queen Problem in Hindi',
        youtubeId: 'WQoB2z67hvY',
        duration: '62:00',
        summary: 'Build iron-clad intuition for recursion trees, base cases, choice diagrams, and state restoration in backtracking.',
        keyConcepts: ['Base Cases & Recursive Steps', 'Choice Diagrams', 'State Backtracking', 'Branch Pruning']
      }
    ]
  }
];
