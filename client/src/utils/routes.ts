export type RouteConfig = {
  path: string;
  auth: 'required' | 'optional' | 'forbidden';
};

export const routes = {
  home: { path: '/', auth: 'optional' },
  products: { path: '/products', auth: 'optional' },
  productDetails: (id: string) => ({
    path: `/products/${id}`,
    auth: 'optional',
  }),
  cart: { path: '/cart', auth: 'optional' },
  checkout: { path: '/checkout', auth: 'required' },
  auth: {
    login: { path: '/auth/sign-in', auth: 'forbidden' },
    register: { path: '/auth/register', auth: 'forbidden' },
    forgotPassword: { path: '/auth/forgot-password', auth: 'forbidden' },
  },
  profile: { path: '/profile', auth: 'required' },
  orders: { path: '/orders', auth: 'required' },
  builder: { path: '/builder', auth: 'optional' },
  savedConfigs: { path: '/saved-configs', auth: 'required' },
} as const;

export type Routes = typeof routes;

// Helper function to get all paths
export const getAllPaths = (obj: any): RouteConfig[] => {
  return Object.values(obj).flatMap((value) =>
    typeof value === 'object'
      ? getAllPaths(value)
      : typeof value === 'function'
      ? [] // Skip function routes like productDetails
      : value
  );
};

export const allRoutes = getAllPaths(routes);
