import { GetRecommendsResp } from '@/components/types/responses';
import { getRecommendApiUrl, getRecommendsApiUrl } from '@/utils/config';
import axios, { AxiosError, AxiosResponse } from 'axios';

// FIXME: remove mock data
const getRecommendations = (): Promise<GetRecommendsResp> =>
  new Promise((resolve, reject) => {
    // resolve(mockGetProblemsResp);
    axios
      .post(getRecommendsApiUrl, {
        params: {
          ProblemId: '1001',
          ProblemContent: '',
          MaxLength: 1000,
          UserId: 'root',
          UserKey: 'root',
          operation: '',
        },
      })
      .then((resp: AxiosResponse) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => reject(err));
  });

const getRecommendationContent = (): Promise<GetRecommendResp> =>
  new Promise((resolve, reject) => {
    // resolve(mockGetProblemsResp);
    axios
      .post(getRecommendApiUrl, {
        params: {
          ProblemId: '1001',
          ProblemContent: '',
          MaxLength: 1000,
          UserId: 'root',
          UserKey: 'root',
          operation: '',
        },
      })
      .then((resp: AxiosResponse) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => reject(err));
  });

const recommendClient = {
  getRecommendations,
  getRecommendationContent,
};

export default recommendClient;
