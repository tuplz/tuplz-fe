import { GetProblemsResp } from '@/components/types';
import { mockGetProblemsResp } from './mock';

// FIXME: remove mock data
const getProblems = (): Promise<GetProblemsResp> =>
  new Promise((resolve, _reject) => {
    resolve(mockGetProblemsResp);
  });

const problemClient = {
  getProblems,
};

export default problemClient;
