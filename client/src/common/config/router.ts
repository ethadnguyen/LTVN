export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  products: {
    root: '/products',
    detail: (id: string | number) => `/products/${id}`,
  },
  categories: {
    root: '/categories',
    detail: (id: string | number) => `/categories/${id}`,
  },
  cart: '/cart',
  builder: '/builder',
  user: {
    profile: '/profile',
    orders: '/orders',
    savedConfigs: '/saved-configs',
  },
  checkout: '/checkout',
} as const;

export type Paths = typeof paths;
