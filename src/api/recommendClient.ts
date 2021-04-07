import { GetRecommendResp } from '@/components/types/responses';
import { API_URL } from '@/utils/config';
import axios, { AxiosError, AxiosResponse } from 'axios';

const recommendApiUrl = API_URL + "/recommend"
// FIXME: remove mock data
const getRecommendations = (): Promise<GetRecommendResp> =>
  new Promise((resolve, reject) => {
    // resolve(mockGetProblemsResp);
    axios
      .post(recommendApiUrl, {
        params: {
          ProblemId: "1001",
          ProblemContent: "",
          MaxLength: 1000,
          UserId: "root",
          UserKey: "root",
          operation: ""
        }
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
      .post(recommendApiUrl, {
        params: {
          ProblemId: "1001",
          ProblemContent: "",
          MaxLength: 1000,
          UserId: "root",
          UserKey: "root",
          operation: ""
        }
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
