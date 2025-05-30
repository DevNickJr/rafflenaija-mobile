import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { AxiosResponse } from 'axios';
import { useSession } from '@/providers/SessionProvider';
import { apiRefreshToken } from '@/services/AuthService';

interface State {
  onSuccess?: (data: any, variables?: any, context?: any) => void;
  onError?: (error: any, variables?: any, context?: any) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  requireAuth?: boolean;
  id?: string;
}

const useMutate = <T, K>(
  api: (
    data: T,
    { id, token, ...rest }: { id: string; token: string; rest?: any },
  ) => Promise<AxiosResponse>,
  {
    onSuccess,
    onError,
    showSuccessMessage = false,
    showErrorMessage = false,
    requireAuth,
    id,
    ...rest
  }: State,
) => {
  const { access_token, refresh_token, signOut, refreshToken } = useSession();

  const Mutation = useMutation<K, K, T>({
    mutationFn: async (data: T) => {
      // const response = requireAuth ? await api(data, session?.user?.token.access) : await api(data)
      const response = requireAuth
        ? await api(data, { id: id!, token: access_token || '' })
        : await api(data, { id: id!, token: access_token || '' });
      // console.log("response from useMutate", response)
      return response?.data;
      // if (response?.data?.status === "success") {
      //   return response?.data?.data
      // } else {
      //   throw new Error(response?.data?.message)
      //   }
    },
    onSuccess: async (data, variables, context) => {
      // console.log("successful", data)
      if (showSuccessMessage) {
        // toast.success(data?.message);
        Toast.show({
          type: 'success',
          text1: 'Successful!',
        });
      }
      if (onSuccess) {
        // console.log("onSuccess", onSuccess)
        onSuccess(data, variables, context);
      }
    },
    onError: async (error: any, variables, context) => {
      const message =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      error?.response?.data?.detail;
      console.log("error2", showErrorMessage, message, error?.response?.data?.message)
      console.log("error", JSON.stringify(error)) 
      if (typeof message === 'string') {
        console.log("error", {error, message})
        if (message === 'Token Expired') {
          // handle refresh
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
        } else if (showErrorMessage) {
          Toast.show({
            type: 'error',
            text1: message || 'An Error Occurred!',
          });
        }
      } else if (showErrorMessage) {
        Toast.show({
          type: 'info',
          text1: error?.response?.data?.message?.[0] || 'An Error Occurred!',
        });
      }
      if (onError) {
        // console.log({ new_error: "message nodey" })
        onError(error, variables, context);
      }
    },
    ...rest,
  });

  return Mutation;
};

export default useMutate;
