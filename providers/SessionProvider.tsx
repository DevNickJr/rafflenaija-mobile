import { useStorageState } from '@/hooks/useStorage';
import { IUser } from '@/interfaces';
import { router } from 'expo-router';
import {
  createContext,
  type PropsWithChildren,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from 'react';

interface IAuthContext extends IUser {
  is_logged_in: boolean;
  access_token: string | null;
  refresh_token: string | null;
  isLoading: boolean;
}

const init: IAuthContext = {
  is_logged_in: false,
  access_token: null,
  refresh_token: null,
  phone_number: '',
  first_name: '',
  last_name: '',
  email: '',
  is_verified: false,
  dob: '',
  gender: '',
  profile_picture: '',
  wallet_balance: 0,
  isLoading: false,
};

interface IAction {
  type: 'LOGIN' | 'LOGOUT' | 'UPDATE';
  payload: Partial<Omit<IAuthContext, 'is_logged_in' | 'isLoading'>> | null;
}

interface IAuthContextProvider extends IAuthContext {
  dispatch: React.Dispatch<IAction>;
  signIn: (value: Omit<IAuthContext, 'is_logged_in' | 'isLoading'>) => void;
  refreshToken: (value: Pick<IAuthContext, "access_token">) => void
  signOut: () => void;
}

const initAuthContext: IAuthContextProvider = {
  is_logged_in: false,
  access_token: null,
  refresh_token: null,
  phone_number: '',
  first_name: '',
  last_name: '',
  email: '',
  is_verified: false,
  dob: '',
  gender: '',
  profile_picture: '',
  wallet_balance: 0,
  isLoading: false,
  dispatch: (): void => {},
  signIn: (value) => {},
  refreshToken: (value) => {},
  signOut: () => {},
};

export const AuthContext = createContext<IAuthContextProvider>(initAuthContext);

// const AuthContext = createContext<{
//   signIn: (value: string) => void;
//   signOut: () => void;
//   session?: string | null;
//   isLoading: boolean;
// }>({
//   signIn: () => null,
//   signOut: () => null,
//   session: null,
//   isLoading: false,
// });

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export const authReducer = (state: IAuthContext, action: IAction) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        is_logged_in: true,
        access_token: action?.payload?.access_token || null,
        refresh_token: action?.payload?.refresh_token || null,
        phone_number: action?.payload?.phone_number || '',
        first_name: action?.payload?.first_name || '',
        last_name: action?.payload?.last_name || '',
        email: action?.payload?.email || '',
        is_verified: action?.payload?.is_verified || false,
        dob: action?.payload?.dob || '',
        gender: action?.payload?.gender || '',
        profile_picture: action?.payload?.profile_picture || '',
        wallet_balance: action?.payload?.wallet_balance || 0,
        isLoading: false,
      };
    case 'UPDATE':
      // console.log("action.payload", action.payload)
      return {
        ...state,
        ...action.payload,
      };
    case 'LOGOUT':
      console.log('logout inittiated');
      return init;
    default:
      return state;
  }
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer<Reducer<IAuthContext, IAction>>(authReducer, init);
  const [[isLoading, session], setSession] = useStorageState('session');

  useEffect(() => {
    if (session) {
      const user = JSON.parse(session);
      if (user?.is_logged_in && user?.access_token) {
        dispatch({
          type: 'LOGIN',
          payload: user,
        });
        return;
      }
      dispatch({
        type: 'LOGOUT',
        payload: null,
      });
    }
  }, [session]);

  const signIn = (value: Omit<IAuthContext, 'is_logged_in' | 'isLoading'>) => {
    dispatch({
      type: 'LOGIN',
      payload: value,
    });
    setSession(
      JSON.stringify({
        ...value,
        is_logged_in: true,
      }),
    );
    router.push("/(tabs)/home");
  };
  const signOut = () => {
    dispatch({
      type: 'LOGOUT',
      payload: null,
    });
    setSession(null);
    router.push("/(auth)/login");
  };

  const refreshToken = (value: Pick<IAuthContext, 'access_token'>) => {
    const data = {
      ...state,
      access_token: value.access_token,
      is_logged_in: true,
    };
    dispatch({
      type: 'LOGIN',
      payload: data,
    });
    setSession(
      JSON.stringify(data),
    );
    router.push("/(tabs)/home");
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isLoading, signIn, signOut, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}
