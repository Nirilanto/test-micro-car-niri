// libs/common/src/interfaces/user.interface.ts
export interface IUser {
    id: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }