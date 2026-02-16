'use client';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import { useEffect, useMemo } from 'react';
import keycloak from '@/lib/keycloak';
import { createMockKeycloak, isSkipAuth, MOCK_USER } from '@/lib/mockAuth';

export default function KeycloakProviderWrapper({ children }) {
  const authClient = useMemo(() => {
    if (isSkipAuth()) {
      console.log('[KeycloakProvider] Using mock auth (NEXT_PUBLIC_SKIP_AUTH=true)');
      return createMockKeycloak();
    }
    return keycloak;
  }, []);

  useEffect(() => {
    if (isSkipAuth() && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('daviActingOwnerId', MOCK_USER.user_id);
        window.localStorage.setItem('daviActingOwnerUserId', String(MOCK_USER.user_id));
        window.sessionStorage.setItem('daviActingOwnerSelectedForSession', 'true');
      } catch (e) {
        /* ignore */
      }
      return;
    }
    const handleAuthError = (event) => {
      console.log('Global auth error detected:', event.detail);
      if (authClient.authenticated) {
        authClient.logout({ redirectUri: window.location.origin });
      }
    };
    window.addEventListener('authError', handleAuthError);
    return () => window.removeEventListener('authError', handleAuthError);
  }, [authClient]);

  return (
    <ReactKeycloakProvider
      authClient={authClient}
      initOptions={{ 
        onLoad: 'check-sso',
        checkLoginIframe: false, 
        pkceMethod: 'S256' 
      }}
      onTokens={(tokens) => { 
        if (tokens.token) {
          localStorage.setItem('token', tokens.token);
        }
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
      }}
      onEvent={(event, error) => {
        if (isSkipAuth()) return;
        if (event === 'onAuthError' || event === 'onTokenExpired') {
          console.warn('[KeycloakProvider] Auth error:', event, error);
          if (error?.error !== 'invalid_grant') {
            keycloak.login();
          }
        }
      }}
    >
      {children}
    </ReactKeycloakProvider>
  );
}
