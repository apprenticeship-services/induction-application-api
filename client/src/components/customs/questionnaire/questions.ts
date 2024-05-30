export type Question = {
    question: string;
    options: {
      [key: string]: string;
    };
    userAnswer: null | null;
  };

export const dumbData: Question[] = [
  {
    question: 'What is the capital of France?',
    options: {
      a: 'Paris',
      b: 'Berlin',
      c: 'London',
      d: 'New York'
    },
    userAnswer: null
  },
  {
    question: 'How many fingers does a typical human have on one hand?',
    options: {
      a: '8',
      b: '5',
      c: '10',
      d: '12'
    },
    userAnswer: null
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: {
      a: 'Jupiter',
      b: 'Venus',
      c: 'Mars',
      d: 'Saturn'
    },
    userAnswer: null
  },
  {
    question: 'What is the main ingredient in guacamole?',
    options: {
      a: 'Tomatoes',
      b: 'Banana',
      c: 'Onions',
      d: 'Avocado'
    },
    userAnswer: null
  },
  {
    question: 'Where is Cork?',
    options: {
      a: 'Ireland',
      b: 'Portugal',
      c: 'Spain',
      d: 'None of the above'
    },
    userAnswer: null
  }
]
