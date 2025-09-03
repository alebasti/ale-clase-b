export interface Question {
  question: string;
  options: string[];
  correctAnswer: string | string[];
  points: number;
  image?: string;
}
