import { message, notification } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/lib/form/interface';
import IsEmail from 'isemail';

import { NoticeType, TagColorMap } from '@/components/types';

export const title = 'Teach Us Please!';

export const openMessage = (type: NoticeType, content: string): void => {
  message[type]({
    content,
  });
};

export const openNotification = (
  type: NoticeType,
  description: string
): void => {
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

export const parseDatetime = (isoDatetime: string): string =>
  isoDatetime.replace(/T/, ' ').replace(/\..*/, '');

export const validateEmail = async (
  _rule: RuleObject,
  value: string
): Promise<void> => {
  const level = IsEmail.validate(value, { errorLevel: 8 });
  console.log(`E-mail validation error level: ${level}`);
  if (level) {
    return Promise.reject('Please input a valid E-mail');
  } else {
    return Promise.resolve();
  }
};
