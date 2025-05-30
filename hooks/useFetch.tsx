import { useEffect } from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Toast from 'react-native-toast-message';
import { useSession } from '@/providers/SessionProvider';
import { apiRefreshToken } from '@/services/AuthService';

interface IProps<T> {
  api: (a?: any, b?: any) => Promise<AxiosResponse<T, any>>;
  param?: any;
  key: QueryKey;
  onSuccess?: (a: any) => void;
  requireAuth?: boolean;
  select?: (a: any) => T;
  enabled?: boolean;
  showMessage?: boolean;
}

const useFetch = <T,>({
  api,
  param,
  key,
  onSuccess,
  requireAuth,
  select,
  enabled,
  showMessage = true,
  ...rest
}: IProps<T>) => {
  const { access_token, signOut, refreshToken, refresh_token } = useSession();

  const { data, error, isLoading, isSuccess, isError, isFetching, refetch, fetchStatus } = useQuery(
    {
      queryKey: key,
      enabled: typeof enabled === 'undefined' ? true : !!enabled,
      queryFn: () => (requireAuth ? api(access_token, param) : api(param)),
      select: select || ((d: any): T => d?.data),
      ...rest,
    },
  );

  useEffect(() => {
    if (onSuccess && isSuccess && data) {
      onSuccess(data);
    }
  }, [data, isSuccess, onSuccess]);

  useEffect(() => {
    if (isError && error) {
      console.log({  error: JSON.stringify(error)  })
      if (axios.isAxiosError(error)) {
        const data: any = error?.response?.data;
        const message = data?.message;
        if (typeof message === 'string' && message === 'Token Expired') {
          // Handle token expiration here
          const handleRefresh = async () => {
            try {
              const refresh = await apiRefreshToken({ refresh: refresh_token || ''  })
              console.log("refresh3", refresh?.data?.access)
              if (refresh?.data?.access) {
                refreshToken({
                  access_token: refresh?.data?.access,
                });
                // signIn
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'Token Expired. Refresh Failed!',
                });
                return signOut();
              }
            } catch (error) {
              Toast.show({
                type: 'info',
                text1: 'Token Expired. Refresh Failed!',
              });
              return signOut();
            }
          }
          handleRefresh();
        }
      }
    }
  }, [error, isError, showMessage, signOut]);

  return { data, error, isLoading, isFetching, refetch, fetchStatus, isError };
};

export default useFetch;
