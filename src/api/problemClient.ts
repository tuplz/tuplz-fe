import { GetProblemsResp, GetProblemContentResp } from '@/components/types';
import { GetProblemsApiUrl, GetProblemContentApiUrl } from '@/utils/config';
import { mockGetProblemContentResp } from '@/api/mock/problems';
import axios, { AxiosError, AxiosResponse } from 'axios';

// FIXME: remove mock data
const getProblems = (): Promise<GetProblemsResp> =>
  new Promise((resolve, reject) => {
    axios
      .post(GetProblemsApiUrl, {
        "Id": "1",
        "MaxLength": 10,
        "UserId": "root",
        "UserKey": "root"
      })
      .then((resp: AxiosResponse) => {
        resolve(resp.data);
      })
      .catch((err: AxiosError) => reject(err));
  });

const getProblemContent = (id: string | string[]): Promise<GetProblemContentResp> =>
  new Promise((resolve, reject) => {
    resolve(mockGetProblemContentResp);
    console.log("mocking..")
    console.log(id)
    console.log(mockGetProblemContentResp)
    // axios
    //   .post(GetProblemContentApiUrl, {          
    //     "Id": id,
    //     "MaxLength": 10,
    //     "UserId": "root",
    //     "UserKey": "root"
    //   })
    //   .then((resp: AxiosResponse) => {
    //     resolve(resp.data);
    //   })
    //   .catch((err: AxiosError) => reject(err));
  });

const problemClient = {
  getProblems,
  getProblemContent,
};

export default problemClient;
