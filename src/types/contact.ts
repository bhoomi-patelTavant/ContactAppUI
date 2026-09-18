export interface Contact {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  country: any;
  userId?: number;
}

export interface ContactFormState {
  id?: number;
  userId?: number;
  name: string;
  mobileNo: string;
  email: string;
  country: any;
}

export const emptyContactForm: ContactFormState = {
  name: "",
  mobileNo: "",
  email: "",
  country: "",
  userId: 0,
};

export interface CountryType {
  code: string;
  label?: string;
  phone: string;
  suggested?: boolean;
}
