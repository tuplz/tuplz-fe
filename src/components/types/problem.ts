export default interface Problem {
  id: number;
  like: number;
  dislike: number;
  visit: number;
  tags: string[];
  updTime: string;
  content: {
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
  };
}
