const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formValidation = (email: string, password: string) => {
  if (!email || !password) {
    return;
  }

  if (!isValidEmail(email)) {
    return;
  }

  return true;
};
