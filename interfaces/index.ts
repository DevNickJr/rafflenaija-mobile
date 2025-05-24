export interface ITableColumn {
  name: string;
  label: string;
  extra?: boolean;
  custom?: (value: string, meta: any) => JSX.Element;
  options?: {
    filter: boolean;
    sort: boolean;
  };
}

export type AuthUIDisplayOptions = 'LOGIN' | 'SIGNUP' | 'FORGOT-PASSWORD' | 'COMPLETE-RESET' | null;

export interface IReducerAction<T> {
  type: T;
  payload?: string | number | { [key: string]: string } | boolean;
  data?: string | { [key: string]: string } | object;
  name?: string;
}

export interface IUserLogin {
  phone_number: string;
  password: string;
}

export interface IRefresh {
  refresh: string;
}

export interface ILoginReducerAction
  extends IReducerAction<'password' | 'phone_number' | 'reset'> {}

export interface IUserRegister {
  phone_number: string;
  password: string;
  referral_code?: string;
  agreeToTerms?: boolean;
}

export interface IResponseData<T> {
  message: string;
  status: boolean;
  data: T;
  count?: number;
}
export interface IReturnAccount {
  id: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  logo: string;
}

export interface IUser {
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  dob: string;
  gender: string;
  profile_picture: string;
  wallet_balance?: string | number;
  created_at?: string;
}

export interface IAccount {
  account_number: string;
  account_name: string;
  bank_name: string;
  logo: string;
}

export interface IAccountReducerAction extends IReducerAction<keyof IAccount | 'setAll'> {}

export interface IUserLean {
  id?: string;
  phone_number: string;
  email: string;
  created_at: string;
}

export interface IUserLeanResponse {
  total_users: number;
  total_active_users: number;
  restricted_users: number;
  users: IPagination<IUserLean>;
}

export interface IBanner {
  id: number;
  image: string;
}

export interface IPayout {
  id?: string;
  date_won: string;
  item_won: string;
  phone_number: string;
  payment_status: string;
}

export interface IPayoutResponse {
  pending_payouts: number;
  total_payouts: number;
  total_won_games: number;
  payouts: IPagination<IPayout>;
}

export interface IPagination<Data> {
  count: number;
  next: number;
  previous: number;
  results: Data[];
}
export interface IBasicPagination<Data> {
  count: number;
  data?: Data[];
}

export interface IWon {
  item_name: string;
  winner_phone: string;
  won_at: string;
}

export interface IGameResult {
  game_id: string;
  item_name: string;
  phone_number: string;
  stake: string;
  status: string;
  won_at: string;
}

export interface IBank {
  code: string;
  country: string;
  currency: string;
  id: number;
  longcode: string;
  name: string;
  slug: string;
}

export interface IUserReducerAction
  extends IReducerAction<
    | 'first_name'
    | 'last_name'
    | 'phone_number'
    | 'email'
    | 'dob'
    | 'gender'
    | 'profile_picture'
    | 'wallet_balance'
  > {}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  wallet_balance: string;
  user: IUser;
}

export interface IRegisterReducerAction
  extends IReducerAction<
    'password' | 'phone_number' | 'referral_code' | 'agreeToTerms' | 'reset'
  > {}

export interface ILogin {
  isLoggedIn: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

export interface IForgotPassword {
  phone_number: string;
}

export interface IResetCode {
  reset_code: string;
}

export interface IResetCodeReducerAction extends IReducerAction<'reset_code' | 'reset'> {
  payload: string;
}

export interface IActivateAccount {
  phone_number: string;
  otp: string;
}
export interface IActivateAccountReducerAction
  extends IReducerAction<'phone_number' | 'otp' | 'reset'> {
  payload: string;
}

export interface IEmail {
  email: string;
}

export interface IEmailAction extends IReducerAction<'email' | 'reset'> {
  payload: string;
}

export interface IOTP {
  otp: string;
}

export interface IOTPAction extends IReducerAction<'otp' | 'reset'> {
  payload: string;
}

export interface IUpdatePassword {
  old_password: string;
  new_password: string;
}
export interface IUpdatePasswordReducerAction
  extends IReducerAction<'old_password' | 'new_password' | 'reset'> {}

export interface IPasswordReset {
  phone_number: string;
  new_password: string;
  confirm_password: string;
}

export interface ILogout {
  refresh_token: string;
}

export interface IDuration {
  duration: number; // days
  date?: string;
}

export interface IDurationAction extends IReducerAction<'duration' | 'date' | 'reset'> {
  payload: string | number;
}

export interface IPic {
  profile_picture: File;
}

export interface IForgotPasswordAction extends IReducerAction<'phone_number' | 'reset'> {
  payload: string;
}

export interface IPasswordResetAction
  extends IReducerAction<'new_password' | 'confirm_password' | 'phone_number' | 'reset'> {
  payload: string;
}

export interface IReferral {
  id?: string;
  amount: '0.00';
  created_at: string;
  referred_user_phone_number: string;
  status: 'Pending' | string;
}

export interface IAnalytics {
  total_money_made: number;
  total_users: number;
  total_wallet_balance: number;
}

export interface ITransaction {
  id?: string;
  amount: string;
  created_at: string;
  status: 'Pending' | string;
  description: string;
  reference: string;
  transaction_type: string;
  updated_at: string;
  user: number;
}

export interface IAdminDeposit {
  user: {
    phone_number: string;
    first_name: string;
    last_name: string;
  };
  id?: string;
  amount: string;
  created_at: string;
  status: 'Pending' | string;
  description: string;
  reference: string;
  transaction_type: string;
  updated_at: string;
}

export interface IAdminWithdrawal {
  bank_account: {
    id: string;
    bank_name: string;
    bank_code: string;
    account_name: string;
    account_number: string;
    recipient_code: string;
    is_default: boolean;
  };
  id?: string;
  amount: string;
  created_at: string;
  status: 'Pending' | string;
  description: string;
  reference: string;
  transaction_type: string;
  updated_at: string;
}

export interface IResponseAdminTransaction<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IHistory {
  id?: string;
  item_name: string;
  stake: string;
  status: string;
  ticket_code: string;
  is_paid: boolean;
}

export interface ISecurityQuestions {
  security_questions: string[];
  security_answers: string[];
}

export interface ISecurityQuestion {
  security_question: string;
  security_answer: string;
}

export interface ISecurityQuestionAction
  extends IReducerAction<'security_question' | 'security_answer' | 'reset'> {
  payload: string;
}

export interface IDeposit {
  amount: number; //In Naira
  email: string; // If user.email is Null consruct email from phone_number e.g 090444444@raffle-naija.com
  reference: string; // reference UUID generated on the frontend
}

export interface IReturnDeposit {
  account_name: string;
  account_number: string;
  bank_name: string;
}

export interface IWithdraw {
  amount: number;
  // bank_account_id: string
  recipient_code: string;
}

export interface ITransfer {
  amount: number;
  recipient_phone: string;
}

export interface ITransferAction extends IReducerAction<'amount' | 'recipient_phone' | 'reset'> {
  payload: string | number;
}

export interface IReferralWithdraw {
  amount: number;
  // recipient_code: string
}

export interface IDepositAction extends IReducerAction<'amount' | 'email' | 'reference' | 'reset'> {
  payload: string | number;
}

export interface IDelete {
  id: string;
}
export interface IBankAccount {
  account_name: string;
  account_number: string;
  bank_code: string;
  bank_name: string;
  id: string;
  is_default: boolean;
  recipient_code: string;
}

export interface IAddBank {
  account_number: string;
  bank_code: string;
  bank_name: string;
  is_default: boolean;
}

export interface IPurchaseTicket {
  ticket_code: string;
}
export interface IVerifyBank {
  account_number: string;
  bank_code: string;
}
export interface IVerifyBankResponse {
  account_name: string;
  bank_id: number;
  account_number: string;
}

export interface IVerifyBankAction
  extends IReducerAction<'account_number' | 'bank_code' | 'reset'> {
  payload: string | number;
}

export interface IAddBankAction
  extends IReducerAction<'account_number' | 'bank_code' | 'bank_name' | 'is_default' | 'reset'> {
  payload: string | number | boolean;
}

export interface ICategory {
  id?: string;
  name: string;
  description: string;
  created_at?: string;
}

// export interface IImage {
//   image: FormData;
// }

export interface ICreateRaffle {
  ticket_price: number; // Price of each card
  total_tickets: number; // Total number of cards to be raffled for this item
  is_featured: boolean | '';
}
export interface ICategoryAction extends IReducerAction<'name' | 'description' | 'reset'> {
  payload: string | number | boolean;
}

export interface ITicket {
  code: string;
  is_winner: boolean;
  purchased_at: string | null;
  status: string;
}

export interface IRaffle {
  created_at: string;
  end_date: string | null;
  id: string;
  is_featured: boolean;
  item: string;
  start_date: string | null;
  status: string;
  ticket_price: string;
  tickets: ITicket[];
}

export interface IImage {
  image_url: string
}

export interface IGame {
  category: string;
  id: string;
  images: IImage[];
  name: string;
  raffles: IRaffle[];
}

export interface IItem {
  category: string;
  id: string;
  name: string;
  serial_number: string;
}

export interface ICreateItem {
  name: string;
  description: string;
  market_price: string;
  quantity: string;
  images: File[];
  category: string;
}

export interface ICreateItemAction
  extends IReducerAction<
    | 'name'
    | 'description'
    | 'market_price'
    | 'quantity'
    | 'category'
    | 'images'
    | 'rmimage'
    | 'reset'
  > {
  payload: string | number | boolean;
}
export interface ICreateRaffleAction
  extends IReducerAction<'ticket_price' | 'total_tickets' | 'is_featured' | 'reset'> {
  payload: string | number | boolean;
}

export interface IRaffleTicket {
  code: string;
  price: string;
}
