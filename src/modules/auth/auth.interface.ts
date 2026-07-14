export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
