export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 72;

export type PasswordRuleChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPER_REGEX = /[A-Z]/;
const LOWER_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;
const SPECIAL_REGEX = /[^A-Za-z\d]/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function passwordRuleChecks(value: string): PasswordRuleChecks {
  return {
    length: value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH,
    upper: UPPER_REGEX.test(value),
    lower: LOWER_REGEX.test(value),
    number: NUMBER_REGEX.test(value),
    special: SPECIAL_REGEX.test(value),
  };
}

export function isValidPassword(value: string): boolean {
  const checks = passwordRuleChecks(value);
  return checks.length && checks.upper && checks.lower && checks.number && checks.special;
}

