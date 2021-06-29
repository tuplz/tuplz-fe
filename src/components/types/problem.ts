interface ProblemSection {
  title: string;
  content: string;
  misc: string;
}

interface ProblemSample {
  title: string;
  input: string;
  output: string;
  explanation: string;
  misc: string;
}

export interface Problem {
  id: number;
  like: number;
  dislike: number;
  visit: number;
  content: {
    title: string;
    type: string;
    sections: ProblemSection[];
    samples: ProblemSample[];
    tags: string[];
    rules: {
      runtime: number;
      memory: number;
      stack: number;
      source: number;
    };
    meta: {
      created: string;
      updated: string;
      checked: string;
    };
    misc: string;
  };
  favourite: boolean;
}
