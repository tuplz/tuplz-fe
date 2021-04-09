export interface ProblemIOSamples{
  input: string;
  output: string;
  explanation: string;
  misc: string;
}

export interface Problem {
  id: number;
  like: number;
  dislike: number;
  updateTime: string;
  content: {
    id:string;
    title: string;
    type: string;
    description: string;
    sample: ProblemIOSamples[];
    tags: string[];
    rules: {
      runtime: string;
      memory: string;
      stack: string;
      source: string;
    },
    meta: {
      created: string;
      updated: string;
      checked: string;
    },
    misc: string;
  };
}
