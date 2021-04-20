import { notification } from 'ant-design-vue';
import { TagColorMap } from '@/components/types';

export const title = 'Teach Us Please!';

export const openNotification = (type: string, description: string): void => {
  notification[type]({
    message: type.toUpperCase(),
    description,
  });
};

const defaultTagColors: TagColorMap = {
  naive: 'blue',
  easy: 'green',
  normal: 'orange',
  hard: 'red',
};

export const tagColor = (tag: string): string =>
  defaultTagColors[tag] || 'purple';
