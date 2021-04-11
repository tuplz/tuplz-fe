export interface ProblemSections{
  title: string;
  content: string;
  misc: string;
}

export interface Problem {
  id: number;
  like: number;
  dislike: number;
  updTime: string;
  content: {
    id:string;
    title: string;
    type: string;
    sections: ProblemSections[];
    tags: string[];
    Rules: {
      runtime: string;
      memory: string;
      stack: string;
      source: string;
    },
  };
}
