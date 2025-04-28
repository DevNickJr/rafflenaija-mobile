import {
  IAddBank,
  IDelete,
  IDeposit,
  ISecurityQuestions,
  ITransfer,
  IUserLogin,
  IUserRegister,
  IVerifyBank,
  IWithdraw,
} from '@/interface';
import BaseService from './BaseService';

const servicePrefix = '/wallet';

const Auth = (token: string, data?: any) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...data,
  },
});

export const apiGetTransactions = (token: string, params: any) => {
  let query = '?';
  const keys = Object.keys(params).map((key, index) => {
    const val = params[key];
    if (val) {
      if (index >= 1) {
        query += `&${key}=${val}`;
      } else {
        query += `${key}=${val}`;
      }
    }
  });
  // for (let i=0;)
  return BaseService.get(`${servicePrefix}/transactions/${query}`, Auth(token));
  // return BaseService.get(`${servicePrefix}/transactions/?start_date=${"2024-7-7"}&send_date=${"2024-12-12"}`, Auth(token))
};

export const apiDeposit = (data: IDeposit, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/deposit/`, data, Auth(token));
};

export const apiManualDeposit = (data: IDeposit, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/manual-deposit/`, data, Auth(token));
};

export const apiWithdraw = (data: IWithdraw, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/withdraw/`, data, Auth(token));
};

export const apiManualWithdrawal = (data: IWithdraw, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/manual-withdrawal/`, data, Auth(token));
};

export const apiTransfer = (data: ITransfer, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/transfer/`, data, Auth(token));
};

export const apiGetSecurityQuestions = (token: string) => {
  return BaseService.get(`${servicePrefix}/security-questions-list/`, Auth(token));
};

export const apiGetRandomQuestion = (token: string) => {
  return BaseService.get(`${servicePrefix}/security-questions/`, Auth(token));
};

export const apiGetUserBankAccounts = (token: string) => {
  return BaseService.get(`${servicePrefix}/bank-account/`, Auth(token));
};

export const apiAddBankAccount = (data: IAddBank, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/bank-account/`, data, Auth(token));
};

export const apiDeleteBankAccount = (data: IDelete, { token }: { token: string }) => {
  return BaseService.delete(`${servicePrefix}/bank-account/`, { ...Auth(token), data });
};

export const apiVerifyBankAccount = (data: IVerifyBank, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/verify-bank-account/`, data, Auth(token));
};

export const apiGetSupportedBanks = (token: string) => {
  return BaseService.get(`${servicePrefix}/banks/`, Auth(token));
};

export const apiSetSecurityQuestions = (data: ISecurityQuestions, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/security-questions/`, data, Auth(token));
};

// export const apiLogin =  (data: IUserLogin) => {
//     return BaseService.post(`${servicePrefix}/login/`, data)
// }

// export const apiRegister =  (data: IUserRegister) => {
//     return BaseService.post(`${servicePrefix}/register/`, data)
// }
