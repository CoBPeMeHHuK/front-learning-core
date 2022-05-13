import { UserFullname } from '../types';

export default function getInitials({ first, last }: UserFullname): string {
  if (first && last) {
    return `${first[0]}${last[0]}`;
  }

  return first.slice(0, 2).toUpperCase();
}
