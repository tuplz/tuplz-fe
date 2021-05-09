import { GetCollectionResp, GetCollectionsResp } from '@/components/types';
import { mockProblemTemplate } from '.';
import { mock } from 'mockjs';

const mockStatusTemplate = {
  code: 200,
  status: 'success',
};

const mockCollectionBaseTemplate = {
  collectionId: '@integer(1, 10000)',
  userId: '@guid',
  title: '@title(1, 6)',
  updateTime: '@dateTime',
};

export const mockCollectionInfoTemplate = {
  ...mockCollectionBaseTemplate,
  problemCount: '@integer(0, 5)',
};

export const mockCollectionTemplate = {
  ...mockCollectionBaseTemplate,
  'problems|0-5': [mockProblemTemplate],
};

export const mockGetCollectionsResp: GetCollectionsResp = mock({
  ...mockStatusTemplate,
  'collections|0-5': [mockCollectionInfoTemplate],
});

export const mockGetCollectionResp: GetCollectionResp = mock({
  ...mockStatusTemplate,
  collection: mockCollectionTemplate,
});
