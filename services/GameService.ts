import { ICategory, IPurchaseTicket, IReferralWithdraw } from '@/interface';
import BaseService from './BaseService';

const servicePrefix = '/games';

const Auth = (token: string, data?: any) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...data,
  },
});

export const apiGetCategories = (params: any = {}) => {
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
  return BaseService.get(`${servicePrefix}/categories/${query}`);
};

export const apiGetGames = (category_id: string) => {
  // console.log({category_id})
  return BaseService.get(`${servicePrefix}/${category_id}/`);
};

export const apiPurchaseTicket = (ticket_code: string, { token }: { token: string }) => {
  console.log({ token });
  return BaseService.post(`${servicePrefix}/purchase-ticket/${ticket_code}/`, {}, Auth(token));
};

export const apiGetHistory = (token: string, params: any = {}) => {
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
  console.log(params, query);
  return BaseService.get(`${servicePrefix}/history/${query}`, Auth(token));
};

export const apiGetMarketValue = (token: string, { id }: { id: string }) => {
  return BaseService.get(`${servicePrefix}/get-market-value/${id}/`, Auth(token));
};
export const apiSwap = (data: any, { id, token }: { id: string; token: string }) => {
  return BaseService.post(`${servicePrefix}/swap/${id}/`, {}, Auth(token));
};

export const apiGetRecentWinners = () => {
  return BaseService.get(`${servicePrefix}/recent-winners/`);
};

export const apiGetResults = (params: any = {}) => {
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
  return BaseService.get(`${servicePrefix}/results/${query}`);
};
// export const apiWithdrawReferralFunds =  (data: IReferralWithdraw,  { token }: { token: string}) => {
//     return BaseService.post(`${servicePrefix}/withdraw/`, data, Auth(token))
// }
