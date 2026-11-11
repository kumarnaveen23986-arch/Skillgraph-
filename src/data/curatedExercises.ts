import { Exercise } from '../types';

export const CURATED_EXERCISES: Exercise[] = [
  // ==========================================
  // PYTHON BEGINNER EXERCISES
  // ==========================================
  {
    id: 'py-fruit-basket',
    title: 'Python: Fruit Market Inventory Counter',
    category: 'Python Lists & Counting',
    difficulty: 'Beginner',
    track: 'python-fundamentals',
    language: 'Python',
    realLifeStory:
      'You are helping a local fruit vendor at the farmers market. A customer buys a crate of mixed fruits ["apple", "banana", "apple", "mango", "apple"]. You need to write a helper function that counts how many times a target fruit appears in the crate.',
    instructions:
      'Write `count_fruits(basket, target_fruit)` that counts and returns how many times `target_fruit` occurs in the list `basket`. Return 0 if the basket is empty or the fruit is not present.',
    starterCode: `function count_fruits(basket, target_fruit) {
  // Python equivalent:
  // def count_fruits(basket, target_fruit):
  //     return basket.count(target_fruit)
  let count = 0;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i] === target_fruit) {
      count++;
    }
  }
  return count;
}`,
    solutionCode: `function count_fruits(basket, target_fruit) {
  let count = 0;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i] === target_fruit) {
      count += 1;
    }
  }
  return count;
}`,
    solutionAnalogy:
      'Like standing at the checkout register and picking out every apple from the shopping tote to put on the scale, incrementing your tally counter one by one.',
    testCases: [
      {
        inputDescription: 'Basket with 3 apples',
        evalSnippet: 'count_fruits(["apple", "banana", "apple", "mango", "apple"], "apple")',
        expectedOutput: '3',
      },
      {
        inputDescription: 'Fruit not present in basket',
        evalSnippet: 'count_fruits(["banana", "mango"], "orange")',
        expectedOutput: '0',
      },
      {
        inputDescription: 'Empty basket',
        evalSnippet: 'count_fruits([], "apple")',
        expectedOutput: '0',
      },
    ],
    hints: [
      'Loop over each item in `basket`.',
      'Compare each item with `target_fruit`.',
      'Increment a counter variable when matching.',
    ],
    xpReward: 50,
  },
  {
    id: 'py-student-grades',
    title: 'Python: Report Card Letter Grade Mapper',
    category: 'Python Dictionaries & Logic',
    difficulty: 'Beginner',
    track: 'python-fundamentals',
    language: 'Python',
    realLifeStory:
      'A school principal wants to print report cards. If a student scored 90 or above, give an "A". If between 80 and 89 inclusive, give a "B". If between 70 and 79 inclusive, give a "C". Otherwise give "Needs Improvement".',
    instructions:
      'Write `get_letter_grade(score)` returning "A", "B", "C", or "Needs Improvement" based on numeric score.',
    starterCode: `function get_letter_grade(score) {
  // Return grade string
  
}`,
    solutionCode: `function get_letter_grade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "Needs Improvement";
}`,
    solutionAnalogy:
      'Like sorting mail into 4 postal bins based on zip code tiers: the highest tier envelopes go straight into the gold express bin.',
    testCases: [
      {
        inputDescription: 'High score 95',
        evalSnippet: 'get_letter_grade(95)',
        expectedOutput: '"A"',
      },
      {
        inputDescription: 'Score 84',
        evalSnippet: 'get_letter_grade(84)',
        expectedOutput: '"B"',
      },
      {
        inputDescription: 'Score 71',
        evalSnippet: 'get_letter_grade(71)',
        expectedOutput: '"C"',
      },
      {
        inputDescription: 'Score 58',
        evalSnippet: 'get_letter_grade(58)',
        expectedOutput: '"Needs Improvement"',
      },
    ],
    hints: [
      'Check `score >= 90` first, then `score >= 80`, and so on.',
    ],
    xpReward: 50,
  },

  // ==========================================
  // JAVASCRIPT FUNDAMENTAL EXERCISES
  // ==========================================
  {
    id: 'grocery-cart-total',
    title: 'JS: The Cashier Register Accumulator',
    category: 'Arrays & Loops',
    difficulty: 'Beginner',
    track: 'javascript-fundamentals',
    language: 'JavaScript',
    realLifeStory:
      'You are working the checkout counter at a grocery store. Customers place items on the conveyor belt with various prices. You need to beep each item and sum them up into a total grocery bill. If the cart has no items, the bill is 0.',
    instructions:
      'Write a function `calculateTotal(prices)` that takes an array of item prices (numbers) and returns the sum of all prices. If the array is empty, return 0.',
    starterCode: `function calculateTotal(prices) {
  let total = 0;
  // Loop through prices and sum them
  return total;
}`,
    solutionCode: `function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}`,
    solutionAnalogy:
      'Think of `let total = 0` as an empty cash register drawer. As each price slides across the scanner in the loop, you drop that exact bill into the drawer (`total += prices[i]`).',
    testCases: [
      {
        inputDescription: 'Cart with items [10, 25, 5]',
        evalSnippet: 'calculateTotal([10, 25, 5])',
        expectedOutput: '40',
      },
      {
        inputDescription: 'Empty cart []',
        evalSnippet: 'calculateTotal([])',
        expectedOutput: '0',
      },
      {
        inputDescription: 'Single item [99.5]',
        evalSnippet: 'calculateTotal([99.5])',
        expectedOutput: '99.5',
      },
    ],
    hints: [
      'Initialize `let total = 0;`',
      'Use a `for` loop to add each item: `total += prices[i]`',
      'Return `total` after the loop completes.',
    ],
    xpReward: 50,
  },
  {
    id: 'thermostat-rule',
    title: 'JS: Smart Thermostat Decision Maker',
    category: 'Conditionals & Logic',
    difficulty: 'Beginner',
    track: 'javascript-fundamentals',
    language: 'JavaScript',
    realLifeStory:
      'A smart home system automatically controls climate. If the temperature is strictly greater than 28°C, it switches to "COOL". If it is strictly below 18°C, it switches to "HEAT". In all other moderate temperatures (18°C to 28°C inclusive), it returns "STANDBY".',
    instructions:
      'Write `getThermostatMode(temp)` that takes a temperature and returns either "COOL", "HEAT", or "STANDBY".',
    starterCode: `function getThermostatMode(temp) {
  // Return "COOL", "HEAT", or "STANDBY"
  
}`,
    solutionCode: `function getThermostatMode(temp) {
  if (temp > 28) return "COOL";
  if (temp < 18) return "HEAT";
  return "STANDBY";
}`,
    solutionAnalogy:
      'Like checking the morning weather outside: if scorching heat, wear sunglasses and turn on the fan; if freezing snow, wear a thermal jacket; else normal clothes.',
    testCases: [
      {
        inputDescription: 'Hot day: 32°C',
        evalSnippet: 'getThermostatMode(32)',
        expectedOutput: '"COOL"',
      },
      {
        inputDescription: 'Cold night: 14°C',
        evalSnippet: 'getThermostatMode(14)',
        expectedOutput: '"HEAT"',
      },
      {
        inputDescription: 'Pleasant room: 24°C',
        evalSnippet: 'getThermostatMode(24)',
        expectedOutput: '"STANDBY"',
      },
    ],
    hints: [
      'Use `if (temp > 28)` for COOL.',
      'Use `else if (temp < 18)` for HEAT.',
      'Return "STANDBY" as the fallback.',
    ],
    xpReward: 50,
  },
  {
    id: 'vip-club-bouncer',
    title: 'JS: The VIP Club Bouncer Filter',
    category: 'Array Filtering & Predicates',
    difficulty: 'Intermediate',
    track: 'javascript-fundamentals',
    language: 'JavaScript',
    realLifeStory:
      'A bouncer stands outside a club checking IDs. Only people who are at least 21 years old AND have a VIP ticket are allowed inside the club.',
    instructions:
      'Write `filterVIPGuests(guests)` where `guests` is an array of objects `{ name: string, age: number, isVip: boolean }`. Return an array containing only the names of the guests who are at least 21 AND have `isVip === true`.',
    starterCode: `function filterVIPGuests(guests) {
  // Return array of names of qualifying VIP guests
  
}`,
    solutionCode: `function filterVIPGuests(guests) {
  return guests
    .filter(g => g.age >= 21 && g.isVip)
    .map(g => g.name);
}`,
    solutionAnalogy:
      'The bouncer has two checkpoints: first, check both ID age and VIP badge. If both pass, write down their name on the guest ledger.',
    testCases: [
      {
        inputDescription: 'Mixed guests list',
        evalSnippet: `filterVIPGuests([
          { name: "Rahul", age: 25, isVip: true },
          { name: "Sara", age: 19, isVip: true },
          { name: "Leo", age: 30, isVip: false }
        ])`,
        expectedOutput: '["Rahul"]',
      },
      {
        inputDescription: 'Multiple VIPs passing',
        evalSnippet: `filterVIPGuests([
          { name: "Aarav", age: 22, isVip: true },
          { name: "Pooja", age: 28, isVip: true }
        ])`,
        expectedOutput: '["Aarav","Pooja"]',
      },
    ],
    hints: [
      'Use `.filter(g => g.age >= 21 && g.isVip)`',
      'Chain `.map(g => g.name)` to get the names.',
    ],
    xpReward: 90,
  },

  // ==========================================
  // AI & MACHINE LEARNING EXERCISES
  // ==========================================
  {
    id: 'py-house-price-predictor',
    title: 'AI: Linear Regression Price Estimator',
    category: 'Machine Learning Models',
    difficulty: 'Beginner',
    track: 'ai-ml-foundations',
    language: 'Universal',
    realLifeStory:
      'A real estate ML model has learned that each square foot of living space adds $180 to the house valuation, and the base lot value (intercept) is $40,000. Write a prediction function that calculates the estimated house value based on square footage.',
    instructions:
      'Write `predictHousePrice(sqft)` that returns `(sqft * 180) + 40000`. If sqft is less than or equal to 0, return 0.',
    starterCode: `function predictHousePrice(sqft) {
  // Return predicted house valuation
  
}`,
    solutionCode: `function predictHousePrice(sqft) {
  if (sqft <= 0) return 0;
  return (sqft * 180) + 40000;
}`,
    solutionAnalogy:
      'The classic y = mx + b line of best fit: m is the price per square foot (slope), and b is the raw land value (y-intercept).',
    testCases: [
      {
        inputDescription: '1,000 sqft apartment',
        evalSnippet: 'predictHousePrice(1000)',
        expectedOutput: '220000',
      },
      {
        inputDescription: '2,500 sqft villa',
        evalSnippet: 'predictHousePrice(2500)',
        expectedOutput: '490000',
      },
      {
        inputDescription: 'Invalid 0 sqft',
        evalSnippet: 'predictHousePrice(0)',
        expectedOutput: '0',
      },
    ],
    hints: [
      'Check if `sqft <= 0` and return 0.',
      'Otherwise return `(sqft * 180) + 40000`.',
    ],
    xpReward: 60,
  },
  {
    id: 'vector-cosine-similarity',
    title: 'AI: Semantic Vector Cosine Similarity',
    category: 'AI Math & Embeddings',
    difficulty: 'Intermediate',
    track: 'ai-ml-foundations',
    language: 'Universal',
    realLifeStory:
      'Modern AI systems (ChatGPT, Gemini, search engines) calculate the "Cosine Similarity" between two embedding vectors to find how closely related two texts are. If two vectors point in the exact same direction, cosine similarity is 1.0 (identical meaning!). If they are orthogonal, it is 0.0.',
    instructions:
      'Write `cosineSimilarity(vecA, vecB)` that calculates `dotProduct(A, B) / (magnitude(A) * magnitude(B))`. Round the result to 4 decimal places. If both vectors are zero or empty, return 0.',
    starterCode: `function cosineSimilarity(vecA, vecB) {
  // Calculate cosine similarity between two numeric vectors
  // Formula: (A · B) / (||A|| * ||B||)
  
}`,
    solutionCode: `function cosineSimilarity(vecA, vecB) {
  if (!vecA.length || !vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return Math.round((dotProduct / denominator) * 10000) / 10000;
}`,
    solutionAnalogy:
      'Imagine two laser pointers shining in a dark room. The dot product measures how much they illuminate the same target area. Dividing by their lengths normalizes them.',
    testCases: [
      {
        inputDescription: 'Identical vectors [1, 2, 3] and [1, 2, 3]',
        evalSnippet: 'cosineSimilarity([1, 2, 3], [1, 2, 3])',
        expectedOutput: '1',
      },
      {
        inputDescription: 'Perpendicular vectors [1, 0] and [0, 1]',
        evalSnippet: 'cosineSimilarity([1, 0], [0, 1])',
        expectedOutput: '0',
      },
      {
        inputDescription: 'Semantic vector test [0.5, 0.5] and [0.5, 0.2]',
        evalSnippet: 'cosineSimilarity([0.5, 0.5], [0.5, 0.2])',
        expectedOutput: '0.9191',
      },
    ],
    hints: [
      'Loop over indices to sum `vecA[i] * vecB[i]` for dot product.',
      'Sum squares for magnitudes and apply `Math.sqrt`.',
    ],
    xpReward: 120,
  },
  {
    id: 'mini-attention-weights',
    title: 'AI: Neural Softmax Attention Calculator',
    category: 'Neural Networks & Transformers',
    difficulty: 'Advanced',
    track: 'modern-genai',
    language: 'Universal',
    realLifeStory:
      'The heart of GPT, Gemini, and Claude is the Self-Attention mechanism. It takes raw scores (logits) between tokens and converts them into attention weights using the Softmax formula: `exp(x_i) / sum(exp(x_j))`. All weights must sum to exactly 1.0 (a probability distribution)!',
    instructions:
      'Write `softmaxAttention(rawScores)` that takes an array of numbers and returns an array of probabilities where each element is `Math.exp(s - maxScore) / sum(Math.exp)`. Round each output to 3 decimal places.',
    starterCode: `function softmaxAttention(rawScores) {
  // Implement numerically stable softmax
  
}`,
    solutionCode: `function softmaxAttention(rawScores) {
  if (!rawScores.length) return [];
  const maxScore = Math.max(...rawScores);
  const expScores = rawScores.map(s => Math.exp(s - maxScore));
  const sumExp = expScores.reduce((acc, val) => acc + val, 0);

  return expScores.map(exp => Math.round((exp / sumExp) * 1000) / 1000);
}`,
    solutionAnalogy:
      'Imagine 4 politicians shouting at a debate. You want to allocate 100% of the audience attention fairly. Softmax rewards the loudest voices exponentially, but ensures the total pie is always precisely 100%.',
    testCases: [
      {
        inputDescription: 'Equal scores [2, 2]',
        evalSnippet: 'softmaxAttention([2, 2])',
        expectedOutput: '[0.5,0.5]',
      },
      {
        inputDescription: 'High dominant score [1, 5, 1]',
        evalSnippet: 'softmaxAttention([1, 5, 1])',
        expectedOutput: '[0.018,0.964,0.018]',
      },
    ],
    hints: [
      'Subtract `Math.max(...rawScores)` before exponentiation for numerical stability.',
      'Sum all exponents and divide each element by the sum.',
    ],
    xpReward: 150,
  },
];
