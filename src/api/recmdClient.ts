import { GetRecmdsResp, GetRecmdContentResp, RecmdFormState } from '@/components/types/';
import { GetRecmdsApiUrl, GetRecmdContentApiUrl } from '@/utils/config';
import { mockGetRecmdsResp } from '@/api/mock/recmds';
import axios, { AxiosError, AxiosResponse } from 'axios';

// FIXME: remove mock data
const getRecmds = (): Promise<GetRecmdsResp> =>
  new Promise((resolve, reject) => {
    resolve(mockGetRecmdsResp);
    // axios
    //   .post(GetRecmdsApiUrl, {
    //     params: {
    //       ProblemId: "1001",
    //       ProblemContent: "",
    //       MaxLength: 1000,
    //       UserId: "root",
    //       UserKey: "root",
    //       operation: ""
    //     }
    //   })
    //   .then((resp: AxiosResponse) => {
    //     resolve(resp.data);
    //   })
    //   .catch((err: AxiosError) => reject(err));
  });

const uploadRecmd = (data: RecmdFormState): Promise<GetRecmdsResp> =>
  new Promise((resolve, reject) => {
    console.log(data);
  });

const recmdClient = {
  getRecmds,
  uploadRecmd
};

export default recmdClient;
