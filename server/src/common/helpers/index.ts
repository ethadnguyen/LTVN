export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8})$/;
  return phoneRegex.test(phone);
};
