export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8})$/;
  return phoneRegex.test(phone);
};

export const generateSlug = (name: string) => {
  if (!name) return '';

  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
};
