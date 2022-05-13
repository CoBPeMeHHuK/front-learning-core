import { UUID } from '@/domains/common';

export interface UserInfo {
  id: UUID;
  firstName: string;
  lastName: string;
}

export interface UserProfile {
  name: UserFullname;
  email: string | null;
  phoneNumber: string | null;
  dob: string;
  gender: UserGender;
  positionId: UUID;
  positionName: string;
  profession: string;
  roles: { role: UserRole }[];
  teamDisplayName: string;
  teamId: UUID;
  teamName: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  CHEIF = 'chief',
}

export interface UserFullname {
  first: string,
  last: string,
  middle?: string
}

export enum UserGender {
  INVALID = 'SEX_INVALID',
  MALE = 'SEX_MALE',
  FEMALE = 'SEX_FEMALE',
  NOT_APPLICABLE = 'SEX_NOT_APPLICABLE',
}

export interface User {
  userId: UUID, // Информация о пользователе
  firstName: string, // Имя
  middleName?: string, // Отчество
  lastName: string, // Фамилия
  sex: UserGender, // Пол
  spName: string, // Название главной штатной должности в рамках компании
  excluded: boolean, // Признак, что пользователь Команды Исключен из Назначения
  newUser: boolean, // Признак, что этот пользователь недавно появился в группе,для него еще не было создано Назначения
}

export interface UserWithProgress extends User {
  progress: {
    tracksPassed: number; // Программ пройдено пока равно 0, позднее будет рассчиываться
    tracksAll: number; // Программ всего назначено
  }
}
