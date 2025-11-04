export default function handleVAPT(event, fieldCode, module, fieldType) {
  const newValue = event.target.value?.trim() || '';

  const maxLength = fieldType?.includes('TEXT_FIELD_')
    ? parseInt(fieldType.split('_')[2], 10)
    : fieldType === 'TEXT_AREA'
      ? 500000
      : fieldType === 'NUMBER_FIELD' || fieldType === 'Number' || fieldType === 'AMOUNT_FIELD'
        ? 20
        : fieldType === 'TEXT_FIELD' || fieldType === 'String'
          ? 100
          : 10000;

  let disallowedChars = [
    '&',
    '$',
    '#',
    '^',
    '*',
    '(',
    ')',
    '?',
    '/',
    '{',
    '}',
    '+',
    '=',
    '~',
    '`',
    '!',
    ':',
    ';',
    '@',
    '_',
    '.',
    '%',
    '[',
    ']',
    "'",
    '"',
    ' ',
    '-'
  ];

  // Exceptions for certain field types
  if (fieldCode === 'EMAIL') {
    disallowedChars = disallowedChars.filter((char) => !'@!#$%&*+-/=?^_`{|}~,.'.includes(char));
  }
  if (fieldType?.includes('TEXT_AREA')) {
    disallowedChars = disallowedChars.filter((char) => !'_-%&()?,.:$!#^ '.includes(char));
  }
  if (
    (fieldType?.includes('TEXT_FIELD') || fieldType === 'String' || fieldType === 'TEXT_AREA') &&
    !fieldType?.includes('TEXT_AREA') &&
    fieldCode !== 'EMAIL'
  ) {
    disallowedChars = disallowedChars.filter((char) => !'%&()?,.:$!#^- '.includes(char));
  }
  if (fieldType === 'ALPHABET') {
    disallowedChars = disallowedChars.filter((char) => !' '.includes(char));
  }
  if (fieldType === 'DATE_FIELD' || fieldType === 'Date') {
    disallowedChars = disallowedChars.filter((char) => char !== '-');
  }
  if (fieldType === 'NUMBER_FIELD' || fieldType === 'Number') {
    if (/^-?\d*(\.\d+)?$/.test(newValue) && newValue !== '-') {
      disallowedChars = disallowedChars.filter((char) => char !== '-');
    }
  }
  if (fieldType === 'INTEGER' || fieldType === 'Integer') {
    disallowedChars.push('.');
    const isValidNumberWithPrefix = /^[-+]?\d*$/.test(newValue);
    if (isValidNumberWithPrefix) {
      disallowedChars = disallowedChars.filter((char) => char !== '+' && char !== '-');
    }
  }
  if (fieldType === 'AMOUNT_FIELD') {
    disallowedChars = disallowedChars.filter((char) => !'.,'.includes(char));
  }

  let newError = '';

  // Generic checks
  if (
    ((fieldType?.includes('TEXT_FIELD') || fieldType === 'String' || fieldType === 'TEXT_AREA') &&
      newValue.length > maxLength) ||
    ((fieldType === 'NUMBER_FIELD' || fieldType === 'Number' || fieldType === 'AMOUNT_FIELD') &&
      newValue.toString().length > maxLength)
  ) {
    newError = `Input cannot exceed ${maxLength} characters.`;
  }
  // if (disallowedChars.some((char) => newValue.includes(char))) {
  //   newError = 'Input contains invalid characters.';
  // }
  if (!/^-?\d*\.?\d*$/.test(newValue) && (fieldType === 'NUMBER_FIELD' || fieldType === 'Number')) {
    newError = 'Enter numbers only.';
  }
  if (!/^-?(?!,$)\d*\.?\d*(,\d*)*\.?\d*$/.test(newValue) && fieldType === 'AMOUNT_FIELD') {
    newError = 'Invalid amount format.';
  }
  if (fieldType === 'ALPHABET') {
    if (!/^[a-zA-Z ]*$/.test(newValue)) {
      newError = 'Enter alphabets only.';
    } else if (newValue.length > 50) {
      newError = 'Text cannot exceed 50 letters.';
    }
  }
  if (fieldType === 'TEXT_AREA') {
    if (newValue.length > 100) {
      newError = 'Text cannot exceed 100 letters.';
    }
  }
  if (/<\/?[^>]*>/.test(newValue)) {
    newError = 'Input cannot contain HTML/XML-like tags.';
  }

  // Field-specific validation
  if (!newError && newValue) {
    if (fieldCode === 'AADHAR') {
      if (newValue.length > 12) return 'Aadhaar must be exactly 12 digits.';
      if (/[^\d]/.test(newValue)) return 'Aadhaar must contain only numbers.';
      if (newValue.length !== 12) return 'Aadhaar must be exactly 12 digits.';
      return '';
    }
    switch (fieldCode) {
      case 'PAN':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(newValue)) {
          newError = 'Enter a valid PAN (e.g., ABCDE1234F).';
        }
        break;

      case 'PASSPORT':
        if (!/^[A-PR-WYa-pr-wy][0-9]{7}$/.test(newValue)) {
          newError = 'Enter a valid Passport number.';
        }
        break;

      case 'DRIVING_LICENSE':
        if (!/^[A-Z]{2}\d{2}\s?\d{11}$/.test(newValue)) {
          newError = 'Enter a valid Driving Licence.';
        }
        break;

      case 'VOTER_ID':
        if (!/^[A-Z]{3}[0-9]{7}$/.test(newValue)) {
          newError = 'Enter a valid Voter ID (e.g., ABC1234567).';
        }
        break;

      case 'LOAN_AMOUNT': {
        const amount = parseInt(newValue.replace(/,/g, ''), 10);
        if (isNaN(amount)) {
          newError = 'Enter a valid loan amount.';
        } else if (amount < 100000) {
          newError = 'Minimum loan amount is ₹1,00,000';
        } else if (amount > 10000000) {
          newError = 'Maximum loan amount is ₹1,00,00,000';
        }
        break;
      }

      case 'DOB': {
        const dob = new Date(newValue);
        const today = new Date();
        if (isNaN(dob.getTime())) {
          newError = 'Enter a valid date';
        } else {
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          if (age < 18) {
            newError = 'Applicant must be at least 18 years old';
          }
        }
        break;
      }
      case 'EMAIL': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          newError = 'Enter a valid email address.';
        }
        break;
      }

      case 'ADDRESS1':
      case 'ADDRESS2':
        if (/[^\w\s,./-]/.test(newValue)) {
          newError = `${fieldCode} contains invalid characters.`;
        } else if (newValue.trim().length < 3) {
          newError = `${fieldCode} must be at least 3 characters.`;
        } else if (newValue.length > 100) {
          newError = `${fieldCode} cannot exceed 100 letters.`;
        }
        break;

      case 'CITY':
        if (!/^[a-zA-Z\s]+$/.test(newValue)) {
          newError = `${fieldCode} must contain only letters.`;
        }
        break;
      case 'FIRM-NAME':
        if (!/^[a-zA-Z\s]+$/.test(newValue)) {
          newError = `${fieldCode} must contain only letters.`;
        }
        break;
      case 'STATE':
        if (!/^[a-zA-Z\s]+$/.test(newValue)) {
          newError = `${fieldCode} must contain only letters.`;
        }
        break;
      case 'PINCODE':
        if (!/^[1-9][0-9]{5}$/.test(newValue)) {
          newError = `${fieldCode} must be a valid 6-digit pincode.`;
        }
        break;
      case 'UAN':
        if (!/^[0-9]{1,20}$/.test(newValue)) {
          newError = 'UAN must contain only numbers (max 20 digits).';
        }
        break;
      case 'GST_NUMBER':
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(newValue)) {
          newError = 'Enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5).';
        }
        break;
      case 'EMPLOYER_NAME':
      case 'DESIGNATION':
        if (newValue.length < 2) {
          newError = `${fieldCode} must be at least 2 characters.`;
        } else if (!/^[a-zA-Z\s]+$/.test(newValue)) {
          newError = `${fieldCode} must contain only letters.`;
        }
        break;

      case 'GROSS_INCOME':
      case 'BONUS_OVERTIME':
      case 'TOTAL_EMI': {
        const rawValue = newValue.replace(/,/g, ''); // remove commas
        const amount = parseFloat(rawValue);

        if (!/^\d{1,10}$/.test(rawValue)) {
          newError = `${fieldCode} must be a number with up to 10 digits.`;
        } else if (isNaN(amount)) {
          newError = `${fieldCode} must be a valid amount.`;
        }
        break;
      }

      case 'BRAND':
        if (!newValue) newError = 'Car Brand is required.';
        break;

      case 'MODEL':
        if (!newValue) newError = 'Car Model is required.';
        break;

      case 'VARIANT':
        if (!newValue) newError = 'Car Variant is required.';
        break;

      case 'MANUFACTURER_NAME':
      case 'AUTHORIZED_DEALER_NAME':
        if (!newValue) {
          newError = `${fieldCode.replace('_', ' ')} is required.`;
        } else if (/\d/.test(newValue)) {
          newError = `${fieldCode.replace('_', ' ')} cannot contain numbers.`;
        } else if (newValue.length > 50) {
          newError = `${fieldCode.replace('_', ' ')} must be at most 50 characters.`;
        }
        break;

      case 'DEALER_ADDRESS':
        if (!newValue) newError = 'DEALER_ADDRESS is required.';
        break;

      case 'DEALER_VICINITY':
        if (!newValue) newError = 'Dealer vicinity selection is required.';
        break;

      case 'INSURANCE_OWN_SOURCE':
        if (!newValue) newError = 'Insurance source selection is required.';
        break;

      case 'INSURANCE_AMOUNT':
        if (!newValue) newError = 'Insurance amount is required.';
        break;

      case 'DOWN_PAYMENT_AMOUNT':
        if (!newValue) newError = 'Down payment amount is required.';
        break;

      case 'INVOICE_DATE':
        if (!newValue) {
          newError = 'Invoice date is required.';
        } else {
          const inputDate = new Date(newValue);
          const today = new Date();
          const minDate = new Date('1900-01-01');

          if (isNaN(inputDate.getTime())) {
            newError = 'Enter a valid date.';
          } else if (inputDate < minDate) {
            newError = 'Invoice date cannot be before 1900.';
          } else if (inputDate > today) {
            newError = 'Invoice date cannot be in the future.';
          }
        }
        break;

      case 'EX_SHOWROOM_COST':
        if (!newValue) newError = 'Ex-showroom cost is required.';
        break;

      case 'REGISTRATION_TYPE':
        if (!newValue) newError = 'Registration type is required.';
        break;

      default:
        break;
    }
  }

  return newError || true;
}
