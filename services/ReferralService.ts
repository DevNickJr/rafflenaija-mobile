import { IReferralWithdraw } from '@/interfaces';
import BaseService from './BaseService';

const servicePrefix = '/referral';

const Auth = (token: string, data?: any) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...data,
  },
});

export const apiReferral = (token: string) => {
  return BaseService.get(`${servicePrefix}/`, Auth(token));
};

export const apiGetReferrals = (token: string) => {
  return BaseService.get(`${servicePrefix}/referrals/`, Auth(token));
};

export const apiWithdrawReferralFunds = (data: IReferralWithdraw, { token }: { token: string }) => {
  return BaseService.post(`${servicePrefix}/withdraw/`, data, Auth(token));
};
