export const RegisterMessages = {
  Success: 'User registered successfully',
  Errors: {
    EmailInUse: 'Email is already in use',
  },
};

export const LoginMessages = {
  Success: 'User logged in successfully',
  Errors: {
    InvalidCredentials: 'Invalid email or password',
  },
};

export const JWTMessages = {
  Errors: {
    Unauthorized: 'Unauthorized access',
  },
};

export const FindUserMessages = {
  Errors: {
    UserNotFound: (id: number) => `User with ID ${id} not found`,
  },
  Success: 'User found successfully',
};
