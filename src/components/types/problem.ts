export interface Problem {
  id: number;
  like: number;
  dislike: number;
  updateTime: string;
  content: {
    title: string;
    tags: string[];
    description: string;
    inputFormat: string;
    outputFormat: string;
    sample: string;
    constraints: string;
  };
}
