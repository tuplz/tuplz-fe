export const { API_URL, BASE_URL, NODE_ENV } = process.env;

export const problemsApiUrl = `${API_URL}/prob`;
export const getProblemsApiUrl = `${problemsApiUrl}/findIdGt`;
export const getProblemApiUrl = `${problemsApiUrl}/findId`;

export const recommendsApiUrl = `${API_URL}/recommend`;
export const getRecommendsApiUrl = `${recommendsApiUrl}/findIdGt`;
export const getRecommendApiUrl = `${recommendsApiUrl}/findIdGt`;
