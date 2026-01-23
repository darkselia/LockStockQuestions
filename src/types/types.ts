export type QuestionRecord = {
  'question-id': number;
  question: string;
  hint1: string | null;
  hint2: string | null;
  answer: number;
  'answer-comm': string | null;
};

export type QuestionsByVideo = Record<string, QuestionRecord[]>;
