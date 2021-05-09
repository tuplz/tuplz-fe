import { Problem } from '.';

interface CollectionBase {
  collectionId: number;
  userId: string;
  title: string;
  updateTime: string;
}

export interface CollectionInfo extends CollectionBase {
  problemCount: number;
}

export interface Collection extends CollectionBase {
  problems: Problem[];
}
