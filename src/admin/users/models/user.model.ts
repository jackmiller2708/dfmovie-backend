export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  pfp?: string;
  username: string;
  password: string;
}

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  pfp?: string;
  username?: string;
  password?: string;
}

export type UserDto = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}