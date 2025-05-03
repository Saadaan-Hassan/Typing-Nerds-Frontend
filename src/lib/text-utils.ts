// Sample text for different difficulty levels
const beginnerTexts = [
  'The quick brown fox jumps over the lazy dog. This pangram contains all letters of the alphabet.',
  'She sells seashells by the seashore. The shells she sells are surely seashells.',
  'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
  'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',
  'Betty bought a bit of butter, but the butter Betty bought was bitter.',
];

const intermediateTexts = [
  "The ability to type quickly and accurately is an essential skill in today's digital world. Practice makes perfect.",
  'Programming is the process of creating a set of instructions that tell a computer how to perform a task.',
  'The Internet is a global system of interconnected computer networks that use standardized communication protocols.',
  'Artificial intelligence is intelligence demonstrated by machines, as opposed to natural intelligence displayed by humans.',
  'Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power.',
];

const advancedTexts = [
  'The intricate interplay between quantum mechanics and general relativity presents one of the most profound challenges in modern theoretical physics.',
  "Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life, allowing neurons to adjust their activities in response to new situations or changes in their environment.",
  'The implementation of sophisticated machine learning algorithms requires a deep understanding of both statistical methods and computational optimization techniques.',
  'Cryptocurrency transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.',
  'The anthropogenic impact on biodiversity and ecosystem functioning has accelerated dramatically in recent decades, leading to unprecedented rates of species extinction.',
];

// Function to get random text based on difficulty
export function getRandomText(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): string {
  let textArray: string[];

  switch (difficulty) {
    case 'beginner':
      textArray = beginnerTexts;
      break;
    case 'intermediate':
      textArray = intermediateTexts;
      break;
    case 'advanced':
      textArray = advancedTexts;
      break;
    default:
      textArray = beginnerTexts;
  }

  const randomIndex = Math.floor(Math.random() * textArray.length);
  return textArray[randomIndex];
}
