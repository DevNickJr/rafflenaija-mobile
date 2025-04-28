import {
  ICategory,
  ICreateItem,
  ICreateRaffle,
  IDuration,
  IPurchaseTicket,
  IReferralWithdraw,
} from '@/interface';
import BaseService from './BaseService';
import { toast } from 'react-toastify';

const servicePrefix = '/backoffice';

const Auth = (token: string, data?: any) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...data,
  },
});

export const apiGetCategories = (token: string) => {
  return BaseService.get(`${servicePrefix}/categories/`, Auth(token));
};

export const apiGetUsers = (token: string, params: any) => {
  let query = '?';
  Object.keys(params).map((key, index) => {
    const val = params[key];
    if (val) {
      if (index >= 1) {
        query += `&${key}=${val}`;
      } else {
        query += `${key}=${val}`;
      }
    }
  });
  return BaseService.get(`${servicePrefix}/users/${query}`, Auth(token));
};

export const apiGetPayouts = (token: string) => {
  return BaseService.get(`${servicePrefix}/payouts/`, Auth(token));
};

export const apiGetAnalytics = (token: string) => {
  return BaseService.get(`${servicePrefix}/analytics/`, Auth(token));
};

export const apiGetRaffleItems = (token: string, params: any) => {
  let query = '?';
  Object.keys(params).map((key, index) => {
    const val = params[key];
    if (val) {
      if (index >= 1) {
        query += `&${key}=${val}`;
      } else {
        query += `${key}=${val}`;
      }
    }
  });
  return BaseService.get(`${servicePrefix}/items/${params?.id}/${query}`, Auth(token));
};
export const apiGetBannerItems = (params: any) => {
  // let query = '?'
  // Object.keys(params).map((key, index) => {
  //     const val =  params[key]
  //     if (val) {
  //         if (index >= 1) {
  //             query += `&${key}=${val}`
  //         } else {
  //             query += `${key}=${val}`
  //         }
  //     }
  // })
  return BaseService.get(`${servicePrefix}/banner/`);
};

export const apiCreateCategory = (data: ICategory, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/categories/`, data, Auth(token));
};

export const apiAddBanner = (data: FormData, { token }: { token: string }) => {
  return BaseService.post(
    `${servicePrefix}/banner/`,
    data,
    Auth(token, {
      'Content-Type': 'multipart/form-data',
    }),
  );
};

export const apiDeleteBanner = (data: {}, { token, id }: { token: string; id: string }) => {
  return BaseService.delete(`${servicePrefix}/banner/${id}/`, Auth(token));
};
export const apiCreateRaffleItem = (data: FormData, { token }: { token: string }) => {
  const id = data.get('category');
  if (!id) {
    toast.info('Provide Id');
  }
  return BaseService.post(
    `${servicePrefix}/items/${id}/`,
    data,
    Auth(token, {
      'Content-Type': 'multipart/form-data',
    }),
  );
};
export const apiCreateRaffle = (
  data: ICreateRaffle,
  { id, token }: { token: string; id: string },
) => {
  return BaseService.post(`${servicePrefix}/create-raffle/${id}/`, data, Auth(token));
};

export const apiRestrictUser = (data: IDuration, { token, id }: { token: string; id: string }) => {
  return BaseService.post(`${servicePrefix}/restrict-user/${id}/`, data, Auth(token));
};

export const apiMarkPaid = (data: any, { token, id }: { token: string; id: string }) => {
  return BaseService.post(`${servicePrefix}/payouts/${id}/`, {}, Auth(token));
};

export const apiDeleteCategory = (data: {}, { token, id }: { token: string; id: string }) => {
  return BaseService.delete(`${servicePrefix}/categories/${id}/`, Auth(token));
};
export const apiDeleteRaffleItem = (data: {}, { token, id }: { token: string; id: string }) => {
  return BaseService.delete(`${servicePrefix}/item-detail/${id}/`, Auth(token));
};

export const apiDeleteUser = (data: any, { token, id }: { token: string; id: string }) => {
  return BaseService.delete(`${servicePrefix}/users/${id}/`, Auth(token));
};

export const apiAdminiGetDeposits = (token: string, params: any) => {
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
  return BaseService.get(`${servicePrefix}/transactions/deposit/${query}`, Auth(token));
  // return BaseService.get(`${servicePrefix}/transactions/?start_date=${"2024-7-7"}&send_date=${"2024-12-12"}`, Auth(token))
};
export const apiAdminiGetWithdrawals = (token: string, params: any) => {
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
  return BaseService.get(`${servicePrefix}/transactions/withdrawal/${query}`, Auth(token));
  // return BaseService.get(`${servicePrefix}/transactions/?start_date=${"2024-7-7"}&send_date=${"2024-12-12"}`, Auth(token))
};

export const apiAdminConfirmDeposit = (
  data: { id: string; reject: boolean },
  { token }: { token: string },
) => {
  return BaseService.patch(
    `${servicePrefix}/transactions/deposit/${data.id}/?status=${!!data.reject ? 'reject' : 'confirm'}`,
    data,
    Auth(token),
  );
};

export const apiAdminConfirmWithdrawal = (data: { id: string }, { token }: { token: string }) => {
  return BaseService.patch(
    `${servicePrefix}/transactions/withdrawal/${data.id}/`,
    data,
    Auth(token),
  );
};

export const apiAdminCreateAccount = (data: FormData, { token }: { token: string }) => {
  return BaseService.post(
    `${servicePrefix}/account-details/`,
    data,
    Auth(token, {
      'Content-Type': 'multipart/form-data',
    }),
  );
};

export const apiAdminUpdateAccount = (data: FormData, { token }: { token: string }) => {
  return BaseService.post(
    `${servicePrefix}/account-details/`,
    data,
    Auth(token, {
      'Content-Type': 'multipart/form-data',
    }),
  );
};

export const apiGetAccount = (token: string) => {
  return BaseService.get(`${servicePrefix}/account-details/`);
};
