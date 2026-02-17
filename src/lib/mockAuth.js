/**
 * Mock auth for local development when NEXT_PUBLIC_SKIP_AUTH=true
 * Bypasses Keycloak so you can run the app without auth setup.
 */

export const MOCK_AUTH_TOKEN = 'mock-token-local-dev-skip-auth';

export const createMockKeycloak = () => ({
  authenticated: true,
  token: MOCK_AUTH_TOKEN,
  refreshToken: 'mock-refresh-token',
  tokenParsed: {
    exp: Math.floor(Date.now() / 1000) + 86400,
    realm_access: { roles: ['super_admin', 'company_admin', 'company_user'] },
  },
  init: function () {
    return Promise.resolve(true);
  },
  login: function () {},
  logout: function () {},
  updateToken: function () {
    return Promise.resolve(true);
  },
  clearToken: function () {},
  onTokenExpired: null,
});

export const MOCK_USER = {
  user_id: 'mock-user-id-local',
  email: 'mock@local.dev',
  name: 'Mock Local User',
  is_teamlid: false,
  company_role: 'company_admin',
  modules: {
    'Documenten chat': { enabled: true },
    'GGD Checks': { enabled: true },
    'Creative Chat': { enabled: true },
  },
};

export const MOCK_WORKSPACES = {
  self: {
    ownerId: 'mock-user-id-local',
    label: 'Mijn werkruimte',
    owner: { name: 'Mock Local User', email: 'mock@local.dev' },
    permissions: null,
  },
  guestOf: [],
};

export const isSkipAuth = () => {
  const v = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SKIP_AUTH;
  return v === 'true' || (typeof v === 'string' && v.trim().toLowerCase() === 'true');
};
