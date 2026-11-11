export interface AICourseLesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  xpReward: number;
  analogyTitle: string;
  analogyStory: string;
  analogyObject: string;
  coreConcepts: string[];
  interactiveDemoType: 'neuron-sim' | 'loss-graph' | 'vector-calc' | 'token-visualizer' | 'code-sandbox';
  interactiveDemoCode?: string;
  interactiveDemoDefaultState?: any;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  proofLoopPrompt: {
    learnSummary: string;
    buildTask: string;
    explainQuestion: string;
  };
}

export interface AICourseModule {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  level: string;
  lessons: AICourseLesson[];
}

export const AI_COURSE_MODULES: AICourseModule[] = [
  {
    id: 'mod-1',
    title: 'Module 1: Foundations of Artificial Intelligence',
    tagline: 'Understand the difference between traditional code, machine learning, and AI using everyday physical examples.',
    iconName: 'Sparkles',
    level: 'Beginner Friendly',
    lessons: [
      {
        id: 'ai-101',
        moduleId: 'mod-1',
        moduleTitle: 'Foundations of AI',
        title: 'Traditional Coding vs Machine Learning',
        difficulty: 'Beginner',
        durationMinutes: 8,
        xpReward: 60,
        analogyTitle: 'The Chef\'s Recipe vs The Master Baker Tasting Cakes',
        analogyStory: 'In traditional programming, you give the computer an exact recipe (Rules + Ingredients = Cake). If a single step is missing, it crashes. In Machine Learning, you show the computer 1,000 delicious cakes and 1,000 ruined cakes, and let the computer discover the recipe by itself!',
        analogyObject: 'Cookbook vs Taste Buds',
        coreConcepts: [
          'Traditional Programming: Rules + Data ➔ Answers',
          'Machine Learning: Data + Answers ➔ Rules (The Model)',
          'Why AI handles fuzzy real-world inputs (faces, voices, messy text) that strict if-else code cannot.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// Traditional Rule-Based vs ML Pattern Matcher
function ruleBasedSpamDetector(email) {
  // Strict rule: only catches exact words
  return email.toLowerCase().includes("win free lottery");
}

// Simulated Machine Learning: Probability score
function mlSpamDetector(email) {
  const spamSignals = ["urgent", "claim", "free", "lottery", "wire", "transfer"];
  let score = 0;
  spamSignals.forEach(signal => {
    if (email.toLowerCase().includes(signal)) score += 0.25;
  });
  return {
    isSpam: score >= 0.5,
    confidence: Math.min(1, score).toFixed(2),
  };
}

const testEmail = "URGENT: Claim your prize now via wire transfer";
console.log("Rule-based:", ruleBasedSpamDetector(testEmail));
console.log("ML Score:", mlSpamDetector(testEmail));`,
        quiz: {
          question: 'What is the fundamental difference between traditional programming and machine learning?',
          options: [
            'Traditional programming uses computers; machine learning uses quantum chips only',
            'In traditional code we write rules; in ML, the computer learns rules from data',
            'Machine learning cannot make mistakes, while traditional code always does',
            'Traditional programming is faster for speech recognition'
          ],
          correctIndex: 1,
          explanation: 'In traditional coding, developers write hardcoded rules. In Machine Learning, we feed inputs and expected outputs, and the model calculates the rules (weights) automatically.'
        },
        proofLoopPrompt: {
          learnSummary: 'Machine learning shifts from writing rules by hand to letting computers detect patterns in datasets.',
          buildTask: 'Create an algorithm that calculates a spam score based on weighted vocabulary keywords.',
          explainQuestion: 'Explain why an if-else statement struggles to identify cats in photos, but a trained ML model succeeds.'
        }
      },
      {
        id: 'ai-102',
        moduleId: 'mod-1',
        moduleTitle: 'Foundations of AI',
        title: 'Supervised, Unsupervised & Reinforcement Learning',
        difficulty: 'Beginner',
        durationMinutes: 10,
        xpReward: 70,
        analogyTitle: 'The Flashcards, The Cluttered Closet, and The Video Game Player',
        analogyStory: 'Supervised Learning is like studying with flashcards (you see the question AND the answer). Unsupervised Learning is like cleaning a messy closet with no instructions—you group similar shirts and shoes together. Reinforcement Learning is like playing Mario—you learn when you get points (reward) or fall into a pit (penalty)!',
        analogyObject: 'Flashcards vs Closet Organizer vs Mario High Scores',
        coreConcepts: [
          'Supervised: Labeled data (Input X -> Target Y). Examples: spam detection, medical imaging.',
          'Unsupervised: Unlabeled data (Input X -> Clusters/Patterns). Examples: customer segmentation, anomaly detection.',
          'Reinforcement Learning: Agent interacting with environment receiving rewards or penalties. Examples: AlphaGo, self-driving car pathfinding.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// Simulating 3 Learning Paradigms:
console.log("=== 1. Supervised Learning ===");
const labeledData = [
  { size: 1200, bedrooms: 2, price: 300000 },
  { size: 2400, bedrooms: 4, price: 620000 }
];
console.log("Predicts price from labeled history.");

console.log("\\n=== 2. Unsupervised Clustering ===");
const customerPurchases = [15, 20, 18, 500, 480, 520]; // 2 natural clusters
const lowSpenders = customerPurchases.filter(p => p < 100);
const highSpenders = customerPurchases.filter(p => p >= 100);
console.log("Discovered clusters:", { lowSpenders, highSpenders });

console.log("\\n=== 3. Reinforcement Learning (Agent Policy) ===");
let agentScore = 0;
function takeAction(action) {
  if (action === "dodge_obstacle") agentScore += 10;
  else agentScore -= 5;
  return agentScore;
}
console.log("Score after dodge:", takeAction("dodge_obstacle"));`,
        quiz: {
          question: 'If you want an algorithm to group your e-commerce customers into 3 behavioral tribes without predefined labels, which paradigm do you use?',
          options: [
            'Supervised Learning',
            'Unsupervised Clustering',
            'Reinforcement Learning',
            'Genetic Mutation'
          ],
          correctIndex: 1,
          explanation: 'Unsupervised clustering finds hidden groupings in data without requiring human labels or targets.'
        },
        proofLoopPrompt: {
          learnSummary: 'AI algorithms learn either with a teacher (Supervised), by discovering structure (Unsupervised), or by trial-and-error rewards (Reinforcement).',
          buildTask: 'Classify 5 real-world tech products into Supervised, Unsupervised, or Reinforcement systems.',
          explainQuestion: 'How would you teach a robotic dog to walk using Reinforcement Learning?'
        }
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Module 2: Neural Networks & Deep Learning',
    tagline: 'Crack the mystery of neurons, weights, biases, activations, and how neural networks learn via backpropagation.',
    iconName: 'Network',
    level: 'Core Deep Dive',
    lessons: [
      {
        id: 'nn-201',
        moduleId: 'mod-2',
        moduleTitle: 'Neural Networks & Deep Learning',
        title: 'The Artificial Neuron & Perceptron',
        difficulty: 'Beginner',
        durationMinutes: 12,
        xpReward: 80,
        analogyTitle: 'The Boardroom Committee Voting on an Investment',
        analogyStory: 'Imagine 3 advisors evaluating an investment. Advisor 1 is an expert (Weight = 0.8), Advisor 2 is an intern (Weight = 0.1), and Advisor 3 is a risk officer (Weight = 0.6). Each gives an opinion (Input). The CEO tallies the weighted votes, subtracts a risk hurdle (Bias), and if the sum passes zero, approves the deal (Activation)!',
        analogyObject: 'Committee Voting Scale & Rubber Stamp',
        coreConcepts: [
          'Inputs (X): The signals coming into the neuron (e.g. pixels, prices, sensor readings).',
          'Weights (W): The importance or strength assigned to each input signal.',
          'Bias (b): The baseline threshold or hurdle the inputs must overcome to fire.',
          'Formula: z = (x1*w1 + x2*w2 + ... + xn*wn) + bias'
        ],
        interactiveDemoType: 'neuron-sim',
        interactiveDemoCode: `// Interactive Artificial Neuron
function artificialNeuron(inputs, weights, bias) {
  let weightedSum = 0;
  for (let i = 0; i < inputs.length; i++) {
    weightedSum += inputs[i] * weights[i];
  }
  weightedSum += bias;
  
  // Activation: ReLU (Rectified Linear Unit)
  const output = Math.max(0, weightedSum);
  return {
    weightedSum: weightedSum.toFixed(2),
    output: output.toFixed(2),
    activated: output > 0
  };
}

// Test with 2 inputs (e.g., Study hours, Practice tests)
const inputs = [4.5, 3.0];
const weights = [0.6, 0.4];
const bias = -2.0;

const result = artificialNeuron(inputs, weights, bias);
console.log("Neuron Result:", result);`,
        quiz: {
          question: 'If all weights in a neuron are positive, but the output still refuses to fire, what parameter might be keeping it below zero?',
          options: [
            'The input dimension',
            'A negative Bias hurdle',
            'The CPU clock speed',
            'The dataset batch size'
          ],
          correctIndex: 1,
          explanation: 'The bias shifts the activation function left or right. A negative bias acts as a threshold hurdle that the weighted inputs must exceed.'
        },
        proofLoopPrompt: {
          learnSummary: 'A single neuron computes a weighted sum of its inputs, adds a bias, and passes the result through an activation function.',
          buildTask: 'Write a perceptron that acts as an AND logic gate (fires only when both inputs are 1).',
          explainQuestion: 'Why can a single linear perceptron not solve the XOR problem, and why do we need multi-layer networks?'
        }
      },
      {
        id: 'nn-202',
        moduleId: 'mod-2',
        moduleTitle: 'Neural Networks & Deep Learning',
        title: 'Activation Functions: ReLU, Sigmoid & Softmax',
        difficulty: 'Intermediate',
        durationMinutes: 14,
        xpReward: 90,
        analogyTitle: 'The Dimmer Switch, The Probability Dial, and The Pie Slicer',
        analogyStory: 'Without activation functions, even a 100-layer neural network is just one giant linear equation (y = mx + b). Activations introduce bendy curves! Sigmoid squashes numbers into a 0 to 1 probability (The Dimmer Switch). ReLU lets positive numbers flow freely while silencing negative noise (The One-Way Gate). Softmax turns competing outputs into percentages that sum to 100% (The Pie Slicer)!',
        analogyObject: 'Bendy Rulers & Dimmer Switches',
        coreConcepts: [
          'Non-Linearity: Allows networks to learn curved boundaries (circles, spirals, complex patterns).',
          'Sigmoid: 1 / (1 + e^-z). Useful for binary yes/no probability.',
          'ReLU (Rectified Linear Unit): max(0, z). Fast to compute, prevents vanishing gradients.',
          'Softmax: Exponentiates and normalizes outputs into a probability distribution.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// Activation Functions Demo
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function relu(z) {
  return Math.max(0, z);
}

function softmax(logits) {
  const exps = logits.map(Math.exp);
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => Number((e / sumExps).toFixed(3)));
}

console.log("Sigmoid(-5):", sigmoid(-5).toFixed(4), "(near 0)");
console.log("Sigmoid(0):", sigmoid(0).toFixed(4), "(exact 0.5)");
console.log("Sigmoid(5):", sigmoid(5).toFixed(4), "(near 1)");

console.log("ReLU(-3):", relu(-3), "(silenced)");
console.log("ReLU(8):", relu(8), "(passes unchanged)");

const classLogits = [2.0, 1.0, 0.1]; // Cat, Dog, Bird
console.log("Softmax Probabilities:", softmax(classLogits));`,
        quiz: {
          question: 'Why is ReLU (max(0, z)) preferred over Sigmoid in modern deep hidden layers?',
          options: [
            'ReLU produces negative infinity which computers love',
            'ReLU is computationally fast and does not suffer from vanishing gradients for positive inputs',
            'ReLU is only used for audio processing',
            'Sigmoid takes 100GB of RAM to run'
          ],
          correctIndex: 1,
          explanation: 'ReLU is simple to compute (just a comparison with 0) and has a constant gradient of 1 for positive inputs, avoiding the vanishing gradient problem of Sigmoid.'
        },
        proofLoopPrompt: {
          learnSummary: 'Activation functions introduce non-linearity, enabling neural networks to learn intricate, real-world relationships.',
          buildTask: 'Implement Softmax and prove that all output probabilities sum to exactly 1.0.',
          explainQuestion: 'What would happen if an autonomous driving vision network had zero activation functions between layers?'
        }
      },
      {
        id: 'nn-203',
        moduleId: 'mod-2',
        moduleTitle: 'Neural Networks & Deep Learning',
        title: 'Backpropagation & Gradient Descent',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        xpReward: 100,
        analogyTitle: 'The Blindfolded Hiker Descending a Mountain in the Fog',
        analogyStory: 'Imagine you are hiking on a mountain in dense fog (you cannot see where the valley bottom is). The altitude is your Loss (how wrong you are). To reach the bottom (Zero Loss), you feel the slope of the ground beneath your boots (The Gradient) and take a small step in the steepest downward direction (Learning Rate). You repeat this thousands of times until you reach the lowest point!',
        analogyObject: 'Foggy Mountain & Walking Stick',
        coreConcepts: [
          'Loss Function: Mathematical score of how far the model\'s prediction is from the truth (e.g. Mean Squared Error).',
          'Gradient: The direction of steepest increase in loss. We move in the opposite direction (Descent).',
          'Learning Rate (Alpha): The step size. Too big = overshooting into outer space; too small = taking 10 years to reach the bottom.',
          'Chain Rule of Calculus: How Backpropagation distributes credit or blame backward through each layer.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// 1D Gradient Descent Simulation
// Goal: Find minimum of Loss function: L(w) = (w - 7)^2 (minimum at w = 7)
let weight = 0.0; // Start with a random guess
const learningRate = 0.1;
const epochs = 15;

console.log("Starting weight:", weight);

for (let step = 1; step <= epochs; step++) {
  // Loss = (w - 7)^2
  const loss = Math.pow(weight - 7, 2);
  
  // Derivative of loss with respect to w: dL/dw = 2 * (w - 7)
  const gradient = 2 * (weight - 7);
  
  // Update weight in the negative gradient direction
  weight = weight - learningRate * gradient;
  
  if (step % 3 === 0 || step === epochs) {
    console.log(\`Step \${step}: Weight = \${weight.toFixed(3)}, Loss = \${loss.toFixed(3)}\`);
  }
}
console.log("Converged close to target weight 7!");`,
        quiz: {
          question: 'What happens if your learning rate is set too high (e.g., 100.0) during gradient descent training?',
          options: [
            'The model trains in 2 milliseconds and is perfectly accurate',
            'The weights overshoot the minimum and the loss explodes/diverges',
            'The GPU turns off to conserve power',
            'The dataset gets deleted automatically'
          ],
          correctIndex: 1,
          explanation: 'A learning rate that is too large causes the updates to overshoot the valley bottom, bouncing back and forth with growing loss (divergence).'
        },
        proofLoopPrompt: {
          learnSummary: 'Backpropagation uses calculus to find how each weight contributed to the prediction error, and gradient descent tweaks them downward.',
          buildTask: 'Simulate 5 steps of gradient descent to fit a slope parameter.',
          explainQuestion: 'Explain the difference between a local minimum and a global minimum to a beginner.'
        }
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Module 3: Generative AI, Transformers & LLMs',
    tagline: 'Discover how modern AI models like Gemini, GPT, and Claude understand and generate human language.',
    iconName: 'Bot',
    level: 'Modern GenAI',
    lessons: [
      {
        id: 'llm-301',
        moduleId: 'mod-3',
        moduleTitle: 'Generative AI & LLMs',
        title: 'Tokens, Vectors & High-Dimensional Embeddings',
        difficulty: 'Beginner',
        durationMinutes: 12,
        xpReward: 85,
        analogyTitle: 'The GPS Coordinates in the City of Meaning',
        analogyStory: 'Computers cannot read letters; they only understand numbers. Tokens break text into syllables or word chunks (~4 characters). Then, Embeddings place every word into a giant multidimensional universe. In this universe, "King" and "Queen" live right next to each other, and "Apple" the fruit lives near "Banana", while "Apple" the tech company lives near "Google" and "Microsoft"!',
        analogyObject: '3D Constellation Map of Concepts',
        coreConcepts: [
          'Tokenization: Dividing text into numeric tokens (e.g., "learning" -> ["learn", "ing"]).',
          'Embeddings: Converting tokens into long vectors of numbers (e.g., 768 or 1536 floats) capturing semantics.',
          'Vector Arithmetic: King - Man + Woman = Queen.',
          'Cosine Similarity: Measuring the angle between two concept vectors to test if they mean the same thing.'
        ],
        interactiveDemoType: 'vector-calc',
        interactiveDemoCode: `// Cosine Similarity between 2 Word Vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simulated 3D embeddings [Royalty, Gender_Female, Tech]
const king =   [0.9, 0.1, 0.0];
const queen =  [0.9, 0.9, 0.0];
const laptop = [0.0, 0.0, 0.95];

console.log("Similarity (King, Queen):", cosineSimilarity(king, queen).toFixed(3));
console.log("Similarity (King, Laptop):", cosineSimilarity(king, laptop).toFixed(3));`,
        quiz: {
          question: 'Why do Large Language Models convert words into high-dimensional vector embeddings?',
          options: [
            'To encrypt the text so hackers cannot read it',
            'So mathematical distance reflects semantic meaning and relationships',
            'Because modern screens only display vectors',
            'To reduce memory usage to 1 byte'
          ],
          correctIndex: 1,
          explanation: 'Embeddings map words into a continuous vector space where words with similar meanings are close together, enabling mathematical reasoning on concepts.'
        },
        proofLoopPrompt: {
          learnSummary: 'Language models process text as tokens mapped to high-dimensional embedding vectors that capture semantic meaning.',
          buildTask: 'Build a similarity calculator that compares user query vectors against database document vectors.',
          explainQuestion: 'Explain how vector search powers modern search engines like Google and Spotify.'
        }
      },
      {
        id: 'llm-302',
        moduleId: 'mod-3',
        moduleTitle: 'Generative AI & LLMs',
        title: 'The Self-Attention Mechanism & Transformers',
        difficulty: 'Intermediate',
        durationMinutes: 16,
        xpReward: 110,
        analogyTitle: 'The Spotlight Highlighter in a Mystery Novel',
        analogyStory: 'Consider the sentence: "The bank of the river was muddy because it rained all night." When a human reads the word "bank", their mental spotlight immediately looks at "river" and "muddy" to realize it means land, not a place to deposit money! The Self-Attention mechanism in Transformers does exactly this: every word shines a spotlight on all other words in the sentence to understand its true context.',
        analogyObject: 'Highlighter Pen & Theater Spotlights',
        coreConcepts: [
          'Attention is All You Need (2017 paper that revolutionized AI).',
          'Queries, Keys, and Values (Q, K, V): Database lookup metaphor where each word queries what other words are relevant.',
          'Multi-Head Attention: Looking at grammar, tone, gender, and factual context simultaneously in parallel.',
          'Parallelization: Transformers read entire paragraphs at once, unlike older sequential RNNs.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// Simplified Self-Attention Demo
// Sentence: ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "tired"]
// What does "it" refer to?
const words = ["animal", "street", "it"];
// Attention score matrix for "it"
const attentionScores = {
  "it_to_animal": 0.88, // Model knows "animal" is tired
  "it_to_street": 0.12  // Streets don't get tired!
};

console.log("Attention weights for pronoun 'it':");
console.log("- Attention to 'animal':", attentionScores.it_to_animal * 100 + "%");
console.log("- Attention to 'street':", attentionScores.it_to_street * 100 + "%");
console.log("Result: Model resolves 'it' ➔ 'animal'");`,
        quiz: {
          question: 'In the Transformer architecture, what is the primary role of the Self-Attention mechanism?',
          options: [
            'To generate random numbers to make the AI unpredictable',
            'To allow each word to dynamically weigh and reference all other words in the sequence for context',
            'To compress images into MP3 files',
            'To turn off the neural network when the user stops typing'
          ],
          correctIndex: 1,
          explanation: 'Self-attention calculates attention weights between all pairs of words, allowing words like pronouns ("it") to bind to their real context ("animal" or "street").'
        },
        proofLoopPrompt: {
          learnSummary: 'Transformers revolutionized AI by using self-attention to process entire sequences in parallel, attending to contextual relationships.',
          buildTask: 'Demonstrate how a word like "crane" changes meaning depending on the surrounding words "bird" vs "construction".',
          explainQuestion: 'Why did Transformers replace Recurrent Neural Networks (RNNs) in natural language processing?'
        }
      },
      {
        id: 'llm-303',
        moduleId: 'mod-3',
        moduleTitle: 'Generative AI & LLMs',
        title: 'Prompt Engineering, RAG & Hallucination Defense',
        difficulty: 'Intermediate',
        durationMinutes: 14,
        xpReward: 95,
        analogyTitle: 'The Closed-Book Memory vs The Open-Book Research Exam',
        analogyStory: 'A base LLM is like a student taking a closed-book exam—it relies on what it memorized months ago and might guess or make up a believable lie (hallucination). RAG (Retrieval-Augmented Generation) is turning that into an open-book exam: before answering, the AI looks up the verified company manual or textbook, reads the exact paragraph, and cites the answer!',
        analogyObject: 'Closed-Book Memory vs Open-Book Research Binder',
        coreConcepts: [
          'Hallucination: When an LLM generates fluent, confident, but factually false statements.',
          'RAG (Retrieval-Augmented Generation): Search database ➔ Retrieve top relevant snippets ➔ Inject into prompt.',
          'Prompt Patterns: System persona, few-shot examples, chain-of-thought ("think step-by-step"), guardrails.',
          'Temperature Setting: Low (0.1) for deterministic facts & code; High (0.9) for creative brainstorming.'
        ],
        interactiveDemoType: 'code-sandbox',
        interactiveDemoCode: `// RAG Flow Simulation in JavaScript
const companyKnowledgeBase = [
  { id: 1, doc: "Refund policy: 30 days money-back guarantee with original receipt." },
  { id: 2, doc: "Support hours: 9 AM to 6 PM EST Monday through Friday." }
];

function simpleRAG(userQuery) {
  // Step 1: Retrieval
  const terms = userQuery.toLowerCase().split(" ");
  const matchedDocs = companyKnowledgeBase.filter(item => 
    terms.some(t => item.doc.toLowerCase().includes(t))
  );

  // Step 2: Augmentation (Grounding prompt)
  const context = matchedDocs.map(d => d.doc).join("\\n");
  const augmentedPrompt = \`
CONTEXT DOCUMENTS:
\${context || "No matching documents found."}

USER QUERY: \${userQuery}

INSTRUCTION: Answer strictly using the context above. If not mentioned, state 'I do not have verified data'.
\`;

  return augmentedPrompt;
}

const prompt = simpleRAG("Can I get a refund after 20 days?");
console.log("Augmented Grounded Prompt:\\n", prompt);`,
        quiz: {
          question: 'How does Retrieval-Augmented Generation (RAG) dramatically reduce hallucinations in enterprise applications?',
          options: [
            'By retraining the entire model every hour on 10,000 GPUs',
            'By retrieving verified external facts and passing them directly into the context window for the model to reference',
            'By converting all text to lowercase',
            'By blocking users from asking questions'
          ],
          correctIndex: 1,
          explanation: 'RAG gives the model an "open-book" reference by retrieving accurate snippets from a vector database and injecting them directly into the prompt.'
        },
        proofLoopPrompt: {
          learnSummary: 'RAG grounds LLM responses with real-time, verified external data, effectively curing hallucinations for production systems.',
          buildTask: 'Design a system prompt with few-shot examples and strict negative constraints to prevent out-of-domain answers.',
          explainQuestion: 'Explain the trade-offs between fine-tuning a model versus implementing RAG for a company handbook.'
        }
      }
    ]
  }
];
