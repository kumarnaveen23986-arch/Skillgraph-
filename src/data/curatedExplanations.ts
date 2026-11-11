import { AIExplanationResponse } from '../types';

export interface PresetTopic {
  id: string;
  question: string;
  category: string;
  badge: string;
  cachedResponse: AIExplanationResponse;
}

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'backprop',
    question: 'What is Backpropagation in AI & Neural Networks?',
    category: 'AI & Deep Learning',
    badge: 'Popular AI Question',
    cachedResponse: {
      title: 'Backpropagation: The Error Feedback Loop',
      analogyTitle: 'Learning Darts Blindfolded with a Voice Coach',
      analogy:
        'Imagine you are standing in front of a dartboard wearing a blindfold. You throw a dart. You cannot see where it landed, but your friend standing next to you says: "You hit 8 inches to the left and 4 inches too high!" That error measurement is your Loss. Because you know exactly where you missed, you subtly adjust your wrist angle to the right and lower your elbow slightly. That is the gradient calculation! You repeat this throw 50,000 times until your muscle memory lands in the bullseye every single time.',
      coreConcept:
        'Backpropagation is the mathematical engine of neural network learning. It uses the chain rule of calculus to calculate how much each individual weight contributed to the final output error (loss), flowing backwards from the output layer to the input layer so the weights can be nudged in the right direction.',
      codeSnippet: `// Simplified single-neuron gradient descent step
let weight = 0.8;
const input = 2.0;
const targetOutput = 10.0;
const learningRate = 0.05;

// Forward pass: make a prediction
const prediction = weight * input; // 0.8 * 2 = 1.6
const error = prediction - targetOutput; // 1.6 - 10 = -8.4 (Loss)

// Backward pass: calculate gradient
const gradient = error * input; // -8.4 * 2 = -16.8

// Update weight
weight = weight - (learningRate * gradient);
console.log("Updated weight nudged towards target:", weight);`,
      codeExplanation:
        'The forward pass computes what the model currently guesses. The error calculates how far off we are, and the gradient tells us how much to adjust the weight to reduce that error on the next iteration.',
      realWorldApplication:
        'Used in every modern neural network from ChatGPT and Gemini to Tesla self-driving vision systems and speech recognition on your phone.',
      commonGotchas: [
        'Setting learning rate too high: weights explode and miss the bullseye completely (overshooting).',
        'Vanishing gradients: in very deep networks, multiplying small numbers backwards can make the updates shrink to zero.',
      ],
      miniQuiz: {
        question: 'What does the "Loss" represent in our dartboard analogy?',
        options: [
          'The weight of the dart',
          'How far the dart landed away from the center bullseye',
          'The number of people watching you play',
        ],
        correctIndex: 1,
        explanation:
          'Loss is the exact numeric penalty measuring how far your prediction deviated from the true target value!',
      },
      followUpQuestions: [
        'What is Gradient Descent vs Stochastic Gradient Descent?',
        'How does an activation function like ReLU prevent vanishing gradients?',
        'What is an epoch in machine learning?',
      ],
    },
  },
  {
    id: 'async-await',
    question: 'Why do we use async/await instead of regular synchronous code?',
    category: 'Web & JavaScript',
    badge: 'Core Programming',
    cachedResponse: {
      title: 'Async/Await: Non-blocking Execution',
      analogyTitle: 'The Cafe Vibrating Food Token vs Standing at the Counter',
      analogy:
        'Suppose you walk into a busy pizza shop. The cashier takes your money. In synchronous code, the cashier forces you to stay glued to the counter, freezing the entire line behind you for 20 minutes while the pizza bakes in the oven—nobody else can order, and you cannot even sit down or drink water. In asynchronous code (async/await), the cashier hands you a vibrating buzzer (a Promise). You can go sit down, chat with friends, or browse your phone. When the pizza is hot and ready, the buzzer vibrates, and you "await" your warm pizza!',
      coreConcept:
        'JavaScript is single-threaded. If a network request or file read takes 2 seconds to complete synchronously, the entire webpage would freeze, buttons would not respond, and animations would stutter. `async/await` allows the engine to pause that specific task without locking the browser UI.',
      codeSnippet: `// Asynchronous pizza ordering simulation
async function orderPizza(customerName) {
  console.log(\`\${customerName} placed order. Received vibrating buzzer token...\`);
  
  // Wait 1.5 seconds in background without freezing browser
  const pizza = await new Promise(resolve => {
    setTimeout(() => resolve("Fresh Wood-fired Margherita 🍕"), 1500);
  });
  
  console.log(\`Buzzer alerted! Collected: \${pizza}\`);
  return pizza;
}

orderPizza("Arjun");
console.log("Arjun is texting a friend while waiting..."); // Runs immediately!`,
      codeExplanation:
        'Notice that "Arjun is texting a friend" prints BEFORE the pizza is ready. The program did not freeze while awaiting the oven timer.',
      realWorldApplication:
        'Every web app fetching data from servers—like Instagram loading your feed, Google Maps loading map tiles, or YouTube buffering videos.',
      commonGotchas: [
        'Forgetting `await`: you get an unresolved Promise object instead of the actual data.',
        'Running independent promises sequentially inside a loop instead of with `Promise.all`.',
      ],
      miniQuiz: {
        question: 'What happens to the browser UI when an `await` statement is running?',
        options: [
          'The browser freezes and user clicks are discarded',
          'The browser stays fully interactive while waiting in the background',
          'The browser automatically refreshes the webpage',
        ],
        correctIndex: 1,
        explanation:
          'Async/await frees up the event loop so users can click buttons, scroll, and view animations smoothly!',
      },
      followUpQuestions: [
        'What is the Event Loop and Call Stack in JavaScript?',
        'How does Promise.all execute multiple requests in parallel?',
        'What is the difference between microtasks and macrotasks?',
      ],
    },
  },
  {
    id: 'embeddings',
    question: 'How do Vector Embeddings capture meaning of words or images?',
    category: 'AI & NLP',
    badge: 'GenAI Foundation',
    cachedResponse: {
      title: 'Vector Embeddings: Meaning as Spatial Coordinates',
      analogyTitle: 'The 3D Supermarket Aisle Coordinate System',
      analogy:
        'Imagine a massive supermarket. Every item is given a 3D GPS location: [Aisle, Shelf Height, Distance from entrance]. "Apples" and "Pears" are located side-by-side in Aisle 1 (Produce). "Dish Soap" is 15 aisles away in Cleaning. Even if you do not speak English, you can tell that Apples and Pears are related because their physical distance in the store is tiny! Vector embeddings assign a list of 512 or 1,536 coordinates to words or images so that concepts with similar meaning sit geographically close to each other.',
      coreConcept:
        'Computers only understand numbers, not semantics. An embedding model maps text into high-dimensional vectors where mathematical distance (cosine similarity or Euclidean distance) directly mirrors conceptual similarity.',
      codeSnippet: `// 2D concept space: [Fruitiness, Pet-Likeness]
const items = {
  apple: [0.95, 0.05],
  mango: [0.98, 0.02],
  goldenRetriever: [0.01, 0.99],
  cat: [0.03, 0.97]
};

// Distance between apple & mango: tiny! (both fruits)
// Distance between apple & cat: large! (completely different concepts)`,
      codeExplanation:
        'In reality, models use 768 to 3,072 dimensions instead of 2, capturing nuance like tone, context, grammar, and relationship.',
      realWorldApplication:
        'Semantic search (typing "cute puppy video" finds clips tagged "adorable dog"), Spotify song recommendations, and RAG document search in AI apps.',
      commonGotchas: [
        'Assuming embeddings preserve exact keyword spelling—they capture semantic meaning, not anagrams or rhymes.',
        'Comparing embeddings produced by two completely different embedding models (dimensions and spaces will not match).',
      ],
      miniQuiz: {
        question: 'What does a high cosine similarity between two vector embeddings mean?',
        options: [
          'The two words have identical letter counts',
          'The two concepts have very similar meanings in context',
          'The computer ran out of memory',
        ],
        correctIndex: 1,
        explanation:
          'High cosine similarity (close to 1.0) means their vector arrows point in almost the exact same conceptual direction!',
      },
      followUpQuestions: [
        'What is the math behind King - Man + Woman = Queen?',
        'How do Vector Databases like Pinecone, Chroma, or Milvus index embeddings?',
        'What is the difference between sparse and dense embeddings?',
      ],
    },
  },
  {
    id: 'big-o',
    question: 'What is Big-O Notation and why does it matter?',
    category: 'Algorithms & CS',
    badge: 'Interview Classic',
    cachedResponse: {
      title: 'Big-O: Predicting Scalability at Massive Size',
      analogyTitle: 'Sending Hard Drives: Bicycle Courier vs Internet Fiber',
      analogy:
        'Imagine you need to send 1 photograph across town: your friend hops on a bicycle and delivers it in 20 minutes. If you need to send 1,000,000 photos stored on an SSD drive, your friend on the bicycle STILL delivers it in 20 minutes! That is O(1) constant time—it takes the same time no matter how huge the data gets. But if you sent the 1,000,000 photos over a dial-up modem, it would take 1,000,000 times longer—that is O(N) linear time. Big-O doesn’t measure seconds; it measures how the workload grows as your data explodes!',
      coreConcept:
        'Big-O notation describes the worst-case limiting behavior of an algorithm as the input size N approaches infinity. It ignores hardware speed and constant multipliers to focus on growth rate.',
      codeSnippet: `// O(1) Constant: Instant lookups
function getFirstItem(array) {
  return array[0]; // 1 step, whether array has 10 or 10,000,000 items
}

// O(N) Linear: Time grows proportionally with size
function findItem(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) return i;
  }
  return -1;
}

// O(N^2) Quadratic: Nested loops that grind to a halt on big data
function hasDuplicates(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) return true;
    }
  }
  return false;
}`,
      codeExplanation:
        'O(1) takes the same time regardless of size. O(N) does N checks. O(N²) compares every item against every other item, taking 10,000 steps for just 100 items.',
      realWorldApplication:
        'Why Google can search 50 billion web pages in 0.2 seconds (using O(log N) inverted indexes) instead of checking every page one by one (O(N)).',
      commonGotchas: [
        'Premature optimization: for an array of 5 items, O(N²) is virtually instantaneous; Big-O only dominates when data gets big.',
        'Ignoring hidden operations inside built-in array methods like `.includes()` or `.indexOf()` inside loops.',
      ],
      miniQuiz: {
        question: 'Which Big-O complexity scales the most gracefully when N increases from 1,000 to 1,000,000?',
        options: ['O(N²)', 'O(N)', 'O(log N)'],
        correctIndex: 2,
        explanation:
          'O(log N) only increases by a few operations when input multiplies by 1,000! For instance, binary search on 1,000,000 items takes only ~20 checks.',
      },
      followUpQuestions: [
        'What is Space Complexity vs Time Complexity?',
        'How does a Hash Map achieve average O(1) lookups?',
        'Why is Quicksort average O(N log N) but worst-case O(N²)?',
      ],
    },
  },
  {
    id: 'attention-mechanism',
    question: 'How does the Attention Mechanism work in Transformers & LLMs?',
    category: 'Generative AI',
    badge: 'Deep Tech',
    cachedResponse: {
      title: 'Self-Attention: The Dynamic Word Highlighter',
      analogyTitle: 'Color-Coded Highlighter Pens in a Mystery Novel',
      analogy:
        'Read this sentence: "The bank robber dashed toward the river, but the bank was too muddy to climb." Notice the word "bank" appears twice. When your eyes read the second "bank", you do not think of financial loans. Why? Because your brain connects the word "bank" with "river" and "muddy". Self-attention does exactly this: every word shines a spotlight on all other words in the sentence and asks, "Who is most relevant to understanding me right now?"',
      coreConcept:
        'Self-Attention computes Queries (Q), Keys (K), and Values (V). For each token, the dot product between its Query vector and all Key vectors yields attention weights. Softmax converts these into probabilities, and the output is a weighted sum of the Value vectors.',
      codeSnippet: `// High-level conceptual attention flow
function calculateTokenAttention(queryWord, sentenceTokens) {
  // 1. Calculate similarity score between queryWord and each token
  const rawScores = sentenceTokens.map(token => computeRelevance(queryWord, token));
  
  // 2. Normalize with Softmax so all attention weights sum to 100%
  const total = rawScores.reduce((a, b) => a + Math.exp(b), 0);
  const attentionWeights = rawScores.map(s => Math.exp(s) / total);
  
  return attentionWeights;
}`,
      codeExplanation:
        'This allows the model to capture long-range dependencies across thousands of words simultaneously, unlike older RNNs that forgot early words.',
      realWorldApplication:
        'The foundational architecture of GPT-4, Gemini, Claude, LLaMA, AlphaFold (protein folding), and modern vision models.',
      commonGotchas: [
        'Attention compute scales quadratically O(N²) with context length unless specialized techniques like FlashAttention are used.',
      ],
      miniQuiz: {
        question: 'Why is Self-Attention better than older Recurrent Neural Networks (RNNs)?',
        options: [
          'It can process all words in a sentence simultaneously and capture long-distance connections',
          'It requires no math at all',
          'It only works for 3-letter words',
        ],
        correctIndex: 0,
        explanation:
          'Self-attention runs in parallel across modern GPUs and does not suffer from forgetting words from 100 sentences ago!',
      },
      followUpQuestions: [
        'What is Multi-Head Attention and why do we need multiple heads?',
        'How does FlashAttention make context windows reach 1 million tokens?',
        'What is the difference between Encoder-only (BERT) and Decoder-only (GPT)?',
      ],
    },
  },
];
