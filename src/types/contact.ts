export interface Contact {
  id: number;
  name: string;
  mobile_no: string;
  email: string;
  country: any;
}

export interface ContactFormState {
  id?: number;
  user_id?: number;
  name: string;
  mobile_no: string;
  email: string;
  country: any;
}

export const emptyContactForm: ContactFormState = {
  name: "",
  mobile_no: "",
  email: "",
  country: "",
};

export interface CountryType {
  code: string;
  label?: string;
  phone: string;
  suggested?: boolean;
}
