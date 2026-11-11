import { SkillNode } from '../types';

export const TRACK_METADATA = [
  {
    id: 'python-fundamentals',
    name: 'Python for Beginners',
    description: 'Clean readable syntax, lists, dictionaries, indentation rules, and functions explained via everyday tools.',
    color: 'from-blue-500 to-amber-400',
    borderColor: 'border-blue-500/30',
    bgBadge: 'bg-blue-500/10 text-blue-300',
  },
  {
    id: 'javascript-fundamentals',
    name: 'JavaScript Fundamentals',
    description: 'Variables, arrow functions, arrays, closures, asynchronous promises, and browser interactions.',
    color: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-400/30',
    bgBadge: 'bg-amber-400/10 text-amber-300',
  },
  {
    id: 'ai-ml-foundations',
    name: 'Machine Learning 101',
    description: 'Features, labels, linear regression, classification, vector embeddings, and real-life prediction models.',
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/30',
    bgBadge: 'bg-purple-500/10 text-purple-300',
  },
  {
    id: 'neural-networks',
    name: 'Neural Networks & Deep Learning',
    description: 'Artificial neurons, weighted voting, activation curves, loss feedback, and backpropagation.',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    bgBadge: 'bg-emerald-500/10 text-emerald-300',
  },
  {
    id: 'modern-genai',
    name: 'Generative AI & LLMs',
    description: 'Self-attention, tokenization, context windows, prompt engineering, and RAG knowledge retrieval.',
    color: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-500/30',
    bgBadge: 'bg-pink-500/10 text-pink-300',
  },
];

export const CURATED_SKILLS: SkillNode[] = [
  // ==========================================
  // TRACK 1: PYTHON FUNDAMENTALS FOR BEGINNERS
  // ==========================================
  {
    id: 'py-vars-types',
    title: 'Python Variables & Dynamic Types',
    track: 'python-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'Python',
    iconName: 'Box',
    shortTagline: 'Sticky labels you can slap on any kitchen container',
    realLifeAnalogy: {
      title: 'Sticky Post-It Labels on Kitchen Jars',
      story: 'In Python, a variable is not a rigid metal safe; it is a lightweight sticky Post-it label. If you write "snack = 5", the label "snack" sticks to the integer 5. Later you can peel that exact same label and stick it onto "apple" (a string)! Python figures out the type automatically without you declaring "int" or "string".',
      metaphorItem: 'Sticky Post-It Label',
    },
    keyTakeaway: 'Python is dynamically typed: variable names point to objects in memory without rigid type declarations.',
    prerequisites: [],
    position: { x: 50, y: 50 },
    relatedExerciseId: 'py-fruit-basket',
    codeSnippet: `# Python dynamic typing in action
hero_name = "Arya"      # str
level = 1               # int
health_potion = 99.5    # float
is_alive = True         # bool

print(f"Hero {hero_name} is level {level} with {health_potion}% potion.")`,
  },
  {
    id: 'py-lists-and-tuples',
    title: 'Python Lists vs Tuples',
    track: 'python-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'Python',
    iconName: 'Layers',
    shortTagline: 'Cloth shopping tote (List) vs Carved Stone Tablet (Tuple)',
    realLifeAnalogy: {
      title: 'Shopping Tote Bag vs Carved Stone Tablet',
      story: 'A Python List `[1, 2, 3]` is like a cloth shopping tote bag: you can drop in an apple, swap oranges for bananas, or dump items out (mutable). A Tuple `(1, 2, 3)` is like an inscription carved in a granite stone tablet: once carved, nobody can add, delete, or rearrange the words (immutable). Use tuples for coordinates or settings that must NEVER accidentally change!',
      metaphorItem: 'Shopping Bag vs Stone Tablet',
    },
    keyTakeaway: 'Lists are mutable ordered sequences ([...]); tuples are immutable fixed sequences ((...)).',
    prerequisites: ['py-vars-types'],
    position: { x: 220, y: 50 },
    relatedExerciseId: 'py-list-reverser',
    codeSnippet: `# List: You can change items anytime
grocery_list = ["Milk", "Bread", "Eggs"]
grocery_list.append("Coffee")  # Add item
grocery_list[0] = "Oat Milk"   # Replace item

# Tuple: Locked forever!
gps_coordinates = (28.6139, 77.2090) # Delhi coordinates
# gps_coordinates[0] = 30.0 -> ERROR! Tuples cannot be modified!`,
  },
  {
    id: 'py-dictionaries',
    title: 'Python Dictionaries (Key-Value Pairs)',
    track: 'python-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'Python',
    iconName: 'BookOpen',
    shortTagline: 'The Contact Book in your smartphone',
    realLifeAnalogy: {
      title: 'The Smartphone Contacts App',
      story: 'Imagine looking up a phone number in your contacts. You don’t search by "Item number 47"; you search by the person’s unique name: "Pooja" (the Key) -> and instantly get her phone number (the Value). Python Dictionaries `{ key: value }` give you instant O(1) lookups by name instead of scanning through an entire list!',
      metaphorItem: 'Phone Contact Book',
    },
    keyTakeaway: 'Dictionaries map unique keys to values using hash tables for lightning-fast lookups.',
    prerequisites: ['py-lists-and-tuples'],
    position: { x: 390, y: 50 },
    relatedExerciseId: 'py-student-grades',
    codeSnippet: `# Dictionary contact book
student_scores = {
    "Aarav": 95,
    "Simran": 88,
    "Kabir": 92
}

# Instant lookup by name key
print("Aarav scored:", student_scores["Aarav"])

# Add new entry
student_scores["Rhea"] = 97`,
  },
  {
    id: 'py-loops-and-comprehensions',
    title: 'Loops & List Comprehensions',
    track: 'python-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'Python',
    iconName: 'RotateCw',
    shortTagline: 'Conveyor belt stamping machine & espresso maker',
    realLifeAnalogy: {
      title: 'The Conveyor Belt Stamping Machine',
      story: 'A `for item in items:` loop is an automated stamping machine on an assembly line. As each item slides underneath, your code stamps it with an action. Python even has "List Comprehensions"—which is like an espresso machine making a whole tray of iced coffees in a single compact 1-line breath: `[coffee + " 🧊" for coffee in orders]`!',
      metaphorItem: 'Espresso Tray Machine',
    },
    keyTakeaway: 'Python loops iterate over any sequence cleanly; list comprehensions transform data in elegant one-liners.',
    prerequisites: ['py-lists-and-tuples'],
    position: { x: 560, y: 50 },
    codeSnippet: `# Classic loop
prices = [10, 20, 30]
doubled = []
for p in prices:
    doubled.append(p * 2)

# Elegant Python List Comprehension (exact same result in 1 line!)
doubled_fast = [p * 2 for p in prices]
print("Doubled:", doubled_fast) # [20, 40, 60]`,
  },
  {
    id: 'py-functions-and-exceptions',
    title: 'Python Functions & Try/Except Safety Nets',
    track: 'python-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'Python',
    iconName: 'Cpu',
    shortTagline: 'Kitchen recipe instructions & a circus acrobat safety net',
    realLifeAnalogy: {
      title: 'The Trapeze Acrobat Safety Net',
      story: 'When an acrobat performs dangerous stunts high up in the circus tent, they put a safety net underneath. If the acrobat slips (an error occurs like dividing by zero or missing file), they don’t crash into the concrete floor (crash your whole server); they bounce safely into the net (the `except` block catches the error and gives a friendly message).',
      metaphorItem: 'Circus Safety Net',
    },
    keyTakeaway: 'Functions package repeatable logic with `def`, while `try/except` gracefully catches runtime exceptions.',
    prerequisites: ['py-loops-and-comprehensions'],
    position: { x: 730, y: 50 },
    codeSnippet: `def safe_divide(numerator, denominator):
    try:
        result = numerator / denominator
        return f"Result: {result}"
    except ZeroDivisionError:
        # Bounced safely into the net!
        return "⚠️ Cannot divide by zero! Please enter a non-zero number."

print(safe_divide(10, 2))  # Result: 5.0
print(safe_divide(10, 0))  # Caught gracefully!`,
  },

  // ==========================================
  // TRACK 2: JAVASCRIPT FUNDAMENTALS
  // ==========================================
  {
    id: 'js-vars-and-scopes',
    title: 'JS Variables: let, const, & Scope',
    track: 'javascript-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'JavaScript',
    iconName: 'Box',
    shortTagline: 'Permanent marker vs whiteboard pen',
    realLifeAnalogy: {
      title: 'Permanent Marker vs Dry-Erase Marker',
      story: '`const` is writing with a permanent black Sharpie on cardboard: once written, you can never change what is assigned to it. `let` is writing with a dry-erase marker on a whiteboard: you can wipe it off and write a new number whenever you want. And both live only inside the room (curly braces `{}`) where you wrote them!',
      metaphorItem: 'Sharpie vs Whiteboard Pen',
    },
    keyTakeaway: 'Prefer const by default for immutable bindings; use let for reassignable values within block scope.',
    prerequisites: [],
    position: { x: 50, y: 170 },
    relatedExerciseId: 'grocery-cart-total',
    codeSnippet: `const PI = 3.14159; // Permanent Sharpie
let score = 0;       // Whiteboard pen
score += 10;        // Reassigned to 10

{
  let secretRoom = "Treasure"; // Only exists inside this block!
}
// secretRoom is undefined out here!`,
  },
  {
    id: 'js-array-methods',
    title: 'Modern Array Methods: Map, Filter, Reduce',
    track: 'javascript-fundamentals',
    difficulty: 'Beginner',
    programmingLanguage: 'JavaScript',
    iconName: 'Sliders',
    shortTagline: 'Airport security scanner & package sorting facility',
    realLifeAnalogy: {
      title: 'Airport Security Check & Conveyor Belt Sorting',
      story: 'Imagine travelers at an airport: `.filter()` is the security bouncer checking boarding passes (only eligible people pass through). `.map()` is the gift shop giving every traveler a free sun hat (transforms each person into a person with a hat). And `.reduce()` is the bus driver counting everyone until one single total passenger number is calculated!',
      metaphorItem: 'Airport Security Conveyor',
    },
    keyTakeaway: 'Array methods let you transform, filter, and aggregate data without manual index counters.',
    prerequisites: ['js-vars-and-scopes'],
    position: { x: 220, y: 170 },
    relatedExerciseId: 'vip-club-bouncer',
    codeSnippet: `const numbers = [1, 2, 3, 4, 5];

// Filter: keep only evens
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// Map: double every number
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// Reduce: sum them up into 1 number
const totalSum = numbers.reduce((acc, n) => acc + n, 0); // 15`,
  },
  {
    id: 'js-async-promises',
    title: 'Promises & Async/Await',
    track: 'javascript-fundamentals',
    difficulty: 'Intermediate',
    programmingLanguage: 'JavaScript',
    iconName: 'Clock',
    shortTagline: 'The Restaurant Buzzer Token',
    realLifeAnalogy: {
      title: 'The Food Court Vibrating Buzzer Token',
      story: 'When you order a burger, the cashier does not freeze you at the register for 15 minutes. They give you a vibrating buzzer (a Promise). You can chat, sit down, or check your phone. When the chef finishes cooking, the buzzer shakes (resolves) and you await the burger!',
      metaphorItem: 'Vibrating Food Token',
    },
    keyTakeaway: 'Promises handle asynchronous delays without blocking the single-threaded browser UI.',
    prerequisites: ['js-array-methods'],
    position: { x: 390, y: 170 },
    codeSnippet: `async function fetchUserData(userId) {
  console.log("Request sent to server. Waiting in background...");
  const response = await fetch(\`https://api.example.com/users/\${userId}\`);
  const user = await response.json();
  console.log("User received:", user.name);
  return user;
}`,
  },

  // ==========================================
  // TRACK 3: AI & MACHINE LEARNING 101
  // ==========================================
  {
    id: 'ml-features-and-labels',
    title: 'Features, Labels, & Supervised Learning',
    track: 'ai-ml-foundations',
    difficulty: 'Beginner',
    programmingLanguage: 'Universal',
    iconName: 'Target',
    shortTagline: 'The Real Estate Appraiser Checklist',
    realLifeAnalogy: {
      title: 'A Real Estate Agent Appraising a House',
      story: 'When an appraiser estimates house price, they check several clues: square footage, number of bedrooms, and distance to school (these are the FEATURES, X). The final sale price on the deed ($450,000) is the TARGET LABEL (Y). Supervised learning simply feeds a computer 10,000 past house checklists with their final sale prices so the algorithm learns the formula connecting features to prices!',
      metaphorItem: 'House Inspection Checklist',
    },
    keyTakeaway: 'Supervised ML trains models to map input features (X) to correct target labels (Y).',
    prerequisites: [],
    position: { x: 50, y: 290 },
    relatedExerciseId: 'py-house-price-predictor',
    codeSnippet: `# House Features: [Bedrooms, Square Feet, Distance to City in km]
features = [
    [3, 1500, 5],
    [2, 900, 12],
    [4, 2400, 2]
]
# Labels: Actual selling price in thousands
labels = [450, 280, 720]`,
  },
  {
    id: 'ml-linear-regression',
    title: 'Linear Regression & Line of Best Fit',
    track: 'ai-ml-foundations',
    difficulty: 'Beginner',
    programmingLanguage: 'Universal',
    iconName: 'TrendingUp',
    shortTagline: 'Stretching a taut rubber band through a scatter plot of dots',
    realLifeAnalogy: {
      title: 'Stretching a Taut Rubber Band Through Pushpins',
      story: 'Imagine sticking 50 pushpins into a corkboard representing how hours studied (X) affects exam score (Y). You take an elastic rubber band and pull it tight across the board so that the total distance between every pin and the rubber band is as tiny as possible. That rubber band is the "Line of Best Fit" (y = mx + b)!',
      metaphorItem: 'Elastic Rubber Band on Corkboard',
    },
    keyTakeaway: 'Linear regression finds the optimal slope and intercept minimizing squared prediction errors.',
    prerequisites: ['ml-features-and-labels'],
    position: { x: 220, y: 290 },
    codeSnippet: `# Simple linear regression line: y = m*x + b
slope_m = 9.5    # Each hour studied adds ~9.5 marks
intercept_b = 30 # Base baseline score

def predict_score(hours_studied):
    predicted = (slope_m * hours_studied) + intercept_b
    return min(100, predicted)

print("Score for 5 hours of study:", predict_score(5)) # ~77.5`,
  },
  {
    id: 'ml-vector-embeddings',
    title: 'Vector Embeddings & Semantic Similarity',
    track: 'ai-ml-foundations',
    difficulty: 'Intermediate',
    programmingLanguage: 'Universal',
    iconName: 'Compass',
    shortTagline: 'GPS coordinates on an infinite map of human concepts',
    realLifeAnalogy: {
      title: 'The Supermarket Aisle GPS Coordinates',
      story: 'In a giant grocery store, apples and pears sit side-by-side on Aisle 1 Shelf 2. Laundry detergent is 15 aisles away. Vector embeddings assign numeric coordinates (like [0.92, 0.14, 0.88]) to words or pictures so that concepts with similar meaning sit geographically close together in mathematical space!',
      metaphorItem: 'Supermarket Aisle Map',
    },
    keyTakeaway: 'Embeddings transform unstructured text and images into geometric vectors where distance equals semantic similarity.',
    prerequisites: ['ml-linear-regression'],
    position: { x: 390, y: 290 },
    relatedExerciseId: 'vector-cosine-similarity',
    codeSnippet: `// Cat and Dog embeddings in 2D space
const catVector = [0.9, 0.2];
const dogVector = [0.85, 0.35];
const tractorVector = [0.05, 0.95];

// Cat and Dog have 0.98 cosine similarity (almost identical!)
// Tractor has only 0.22 similarity to Cat.`,
  },

  // ==========================================
  // TRACK 4: NEURAL NETWORKS & DEEP LEARNING
  // ==========================================
  {
    id: 'nn-artificial-neuron',
    title: 'The Artificial Neuron & Perceptron',
    track: 'neural-networks',
    difficulty: 'Intermediate',
    programmingLanguage: 'Universal',
    iconName: 'Activity',
    shortTagline: 'A committee of friends voting on movie night',
    realLifeAnalogy: {
      title: 'A Committee of Friends Voting on Movie Night',
      story: 'You want to decide if you should watch a horror film. You ask 3 friends: Alex (loves scary films, high positive weight +0.8), Maya (hates jump scares, high negative weight -0.9), and Leo (likes anything, weight +0.2). You multiply each friend’s vote by their trust weight, add your personal courage threshold (bias), and if the sum passes 0, you buy the popcorn!',
      metaphorItem: 'Committee Voting Threshold',
    },
    keyTakeaway: 'An artificial neuron computes the dot product of inputs and weights, adds a bias, and passes through an activation curve.',
    prerequisites: ['ml-vector-embeddings'],
    position: { x: 50, y: 410 },
    codeSnippet: `def artificial_neuron(inputs, weights, bias):
    # Weighted sum: z = (x1*w1) + (x2*w2) + ... + bias
    weighted_sum = sum(x * w for x, w in zip(inputs, weights)) + bias
    
    # ReLU activation: if positive, fire! Otherwise return 0
    return max(0.0, weighted_sum)`,
  },
  {
    id: 'nn-backpropagation',
    title: 'Backpropagation & Loss Optimization',
    track: 'neural-networks',
    difficulty: 'Advanced',
    programmingLanguage: 'Universal',
    iconName: 'Target',
    shortTagline: 'Learning to throw darts blindfolded with a voice coach',
    realLifeAnalogy: {
      title: 'Blindfolded Dart Throwing with Coach Feedback',
      story: 'You throw a dart blindfolded. You cannot see the board, but your coach yells: "You landed 8 inches to the left and 4 inches high!" That error is the LOSS. Because you know exactly how far you missed, you subtly adjust your wrist angle to the right and lower your elbow slightly (the gradient update). You repeat this 10,000 times until you hit the bullseye every single time.',
      metaphorItem: 'Dartboard Coach Feedback Loop',
    },
    keyTakeaway: 'Backpropagation applies the calculus chain rule backwards from the loss to update weights via gradient descent.',
    prerequisites: ['nn-artificial-neuron'],
    position: { x: 220, y: 410 },
    codeSnippet: `# Single-step weight adjustment via gradient descent
weight = 0.5
learning_rate = 0.05

error = 2.4        # How far prediction missed target
gradient = error * 1.2

# Nudge weight in the opposite direction of the gradient
weight = weight - (learning_rate * gradient)
print("New updated weight:", round(weight, 4))`,
  },

  // ==========================================
  // TRACK 5: MODERN GENERATIVE AI & LLMS
  // ==========================================
  {
    id: 'genai-tokens-context',
    title: 'Tokens & Context Windows in LLMs',
    track: 'modern-genai',
    difficulty: 'Beginner',
    programmingLanguage: 'Universal',
    iconName: 'FileText',
    shortTagline: 'Scrabble syllable tiles on a conference whiteboard',
    realLifeAnalogy: {
      title: 'Scrabble Syllable Tiles & Meeting Room Whiteboard',
      story: 'LLMs like Gemini or GPT do not see whole words; they break text into "Tokens"—which are like common syllables or Scrabble tiles (e.g. "learning" becomes "learn" + "ing"). And the Context Window is like a meeting room whiteboard: when it fills up completely, old notes have to be erased to write new thoughts.',
      metaphorItem: 'Scrabble Syllable Tiles',
    },
    keyTakeaway: 'Tokens are the atomic units LLMs process (~4 characters per token), and context windows define maximum memory capacity.',
    prerequisites: [],
    position: { x: 50, y: 530 },
    codeSnippet: `const sampleSentence = "SkillGraph makes mastering AI intuitive!";
// Rough estimation rule: 1 token ≈ 4 characters
const tokenCountEstimate = Math.ceil(sampleSentence.length / 4);
console.log(\`Estimated tokens: ~\${tokenCountEstimate}\`);`,
  },
  {
    id: 'genai-self-attention',
    title: 'Self-Attention: The Dynamic Word Highlighter',
    track: 'modern-genai',
    difficulty: 'Advanced',
    programmingLanguage: 'Universal',
    iconName: 'Sparkles',
    shortTagline: 'Color-coded highlighter pens in a mystery novel',
    realLifeAnalogy: {
      title: 'Highlighting Pronouns in a Mystery Novel',
      story: 'Read this: "The bank robber dashed toward the river, but the bank was too muddy to climb." How does your brain know the second "bank" means riverbank, not a money vault? Because your brain pays "Attention" to the words "muddy" and "river"! In Transformers, self-attention lets every word spotlight all other words in the text to discern exact context.',
      metaphorItem: 'Color-Coded Highlighter Pen',
    },
    keyTakeaway: 'Self-attention calculates dynamic relevance weights between all tokens in a sequence simultaneously.',
    prerequisites: ['ml-vector-embeddings', 'genai-tokens-context'],
    position: { x: 220, y: 530 },
    relatedExerciseId: 'mini-attention-weights',
    codeSnippet: `// Softmax attention weight calculation
function calculateAttentionWeights(scores) {
  const maxScore = Math.max(...scores);
  const expScores = scores.map(s => Math.exp(s - maxScore));
  const sum = expScores.reduce((a, b) => a + b, 0);
  return expScores.map(val => Number((val / sum).toFixed(3)));
}`,
  },
];
