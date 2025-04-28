import { useEffect } from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Toast from 'react-native-toast-message';
import { useSession } from '@/providers/SessionProvider';

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
  const { session, signOut } = useSession();

  const { data, error, isLoading, isSuccess, isError, isFetching, refetch, fetchStatus } = useQuery(
    {
      queryKey: key,
      enabled: typeof enabled === 'undefined' ? true : !!enabled,
      queryFn: () => (requireAuth ? api(session, param) : api(param)),
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
      if (axios.isAxiosError(error)) {
        const data: any = error?.response?.data;
        const message = data?.message;
        if (typeof message === 'string' && message === 'Token Expired') {
          if (showMessage) {
            // Using react-native-toast-message for toast notifications
            Toast.show({
              type: 'info',
              text1: 'Token Expired',
              text2: 'Log back in to access your account',
            });
          }
          signOut();
        }
      }
    }
  }, [error, isError, showMessage, signOut]);

  return { data, error, isLoading, isFetching, refetch, fetchStatus };
};

export default useFetch;
