import {
  IUserLogin,
  IForgotPassword,
  IPasswordReset,
  ILogout,
  IUserRegister,
  IUser,
  IPic,
  IUpdatePassword,
  IResetCode,
  IActivateAccount,
  IDuration,
  IEmail,
  IOTP,
  IRefresh,
} from '@/interfaces';
import BaseService from './BaseService';

const servicePrefix = '/auth';

const Auth = (token: string, data?: any) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...data,
  },
});

export const apiLogin = (data: IUserLogin) => {
  return BaseService.post(`${servicePrefix}/login/`, data);
};

export const apiRefreshToken = (data: IRefresh) => {
  return BaseService.post(`${servicePrefix}/token/refresh`, data);
};

export const apiRegister = (data: IUserRegister) => {
  return BaseService.post(`${servicePrefix}/register/`, data);
};

export const apiActivateAccount = (data: IActivateAccount) => {
  return BaseService.post(`${servicePrefix}/activate/`, data);
};

export const apiVerifyEmail = (data: IEmail, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/verify-email-send/`, data, Auth(token));
};

export const apiVerifyEmailComplete = (data: IOTP, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/verify-email-complete/`, data, Auth(token));
};

export const apiLogout = (data: ILogout, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/logout/`, data, Auth(token));
};

export const apiRestrictAccount = (data: IDuration, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/restrict-account/`, data, Auth(token));
};

export const apiDeactivateAccount = (data: any, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/deactivate-account/`, data, Auth(token));
};

export const apiGetUser = (token: string) => {
  return BaseService.get(`${servicePrefix}/user/`, Auth(token));
};

export const apiUpdateUser = (data: Partial<IUser>, { token }: { token: string }) => {
  return BaseService.patch(`${servicePrefix}/user/`, data, Auth(token));
};

export const apiUpdatePic = (data: IPic, { token }: { token: string }) => {
  const formData = new FormData();
  // Object.keys(data).forEach(key => formData.append(key, data[key as keyof IPic]))
  formData.append('profile_picture', data['profile_picture']);

  return BaseService.patch(
    `${servicePrefix}/user/`,
    formData,
    Auth(token, {
      'Content-Type': 'multipart/form-data',
    }),
  );
};

export const apiUpdatePassword = (data: IUpdatePassword, { token }: { token: string }) => {
  return BaseService.patch(`${servicePrefix}/update-password/`, data, Auth(token));
};

export const apiForgotPassword = (data: IForgotPassword) => {
  return BaseService.post(`${servicePrefix}/password-reset/`, data);
};

export const apiVerifyCode = (data: IResetCode) => {
  return BaseService.post(`${servicePrefix}/password-reset-confirm/`, data);
};

export const apiResendCode = (data: IForgotPassword) => {
  return BaseService.post(`${servicePrefix}/resend-otp/`, data);
};

export const apiPasswordReset = (data: IPasswordReset) => {
  return BaseService.post(`${servicePrefix}/password-reset-complete/`, data);
};

// export const apiChangePassword =  (data: IChangePassword, { id }: { id: string }) => {
//     return BaseService.patch(`/users/${id}/change_password`, data)
// }

// export const apiUpdateUser =  (data: IProfile, token?: string) => {
//     const formData = new FormData()
//     Object.keys(data).forEach(key => formData.append(key, data[key as keyof IProfile]))

//     return BaseService.patch<IUser>(`${servicePrefix}/user/`, formData, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data"
//         }
//     })
// }
