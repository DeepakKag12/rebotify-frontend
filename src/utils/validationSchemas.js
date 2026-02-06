import * as yup from "yup";

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

/**
 * Name validation:
 * - Minimum 2 characters
 * - Maximum 50 characters
 * - Only letters, spaces, hyphens, and apostrophes
 * - No leading/trailing spaces
 * - No numbers or special characters (except hyphen and apostrophe)
 */
export const nameSchema = yup
  .string()
  .trim()
  .required("Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .matches(
    /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes. No numbers or special characters allowed"
  )
  .test("no-numbers", "Name cannot contain numbers", (value) => {
    return !/\d/.test(value);
  })
  .test(
    "no-special-chars",
    "Name cannot contain special characters like dots or symbols",
    (value) => {
      return !/[!@#$%^&*()_+=\[\]{};:"\\|,.<>?~`0-9]/.test(value);
    }
  );

/**
 * Email validation:
 * - Valid email format
 * - Common email providers
 */
export const emailSchema = yup
  .string()
  .trim()
  .required("Email is required")
  .email("Please enter a valid email address")
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Please enter a valid email address"
  );

/**
 * Phone validation (Indian format):
 * - 10 digits only
 * - Can start with optional +91
 * - No letters or special characters (except + at start)
 */
export const phoneSchema = yup
  .string()
  .trim()
  .required("Phone number is required")
  .test("no-letters", "Phone number cannot contain letters", (value) => {
    if (!value) return true;
    // Remove +91 or + prefix, then check if remaining has letters
    const cleanValue = value.replace(/^\+91|^\+/, "");
    return !/[a-zA-Z]/.test(cleanValue);
  })
  .test(
    "no-dots",
    "Phone number cannot contain dots or special characters",
    (value) => {
      if (!value) return true;
      // Remove +91 or + prefix, then check for dots and special chars
      const cleanValue = value.replace(/^\+91|^\+/, "");
      return !/[.\-\s()#*]/.test(cleanValue);
    }
  )
  .matches(/^(\+91)?[6-9]\d{9}$/, "Please enter a valid 10-digit phone number");

/**
 * Optional phone validation (allows empty)
 */
export const optionalPhoneSchema = yup
  .string()
  .trim()
  .test("no-letters", "Phone number cannot contain letters", (value) => {
    if (!value) return true;
    const cleanValue = value.replace(/^\+91|^\+/, "");
    return !/[a-zA-Z]/.test(cleanValue);
  })
  .test(
    "no-dots",
    "Phone number cannot contain dots or special characters",
    (value) => {
      if (!value) return true;
      const cleanValue = value.replace(/^\+91|^\+/, "");
      return !/[.\-\s()#*]/.test(cleanValue);
    }
  )
  .test(
    "valid-format",
    "Please enter a valid 10-digit phone number",
    (value) => {
      if (!value) return true; // Allow empty
      return /^(\+91)?[6-9]\d{9}$/.test(value);
    }
  );

/**
 * Address validation:
 * - Minimum 10 characters
 * - Maximum 200 characters
 */
export const addressSchema = yup
  .string()
  .trim()
  .required("Address is required")
  .min(10, "Address must be at least 10 characters")
  .max(200, "Address must be less than 200 characters");

/**
 * Brand validation:
 * - Minimum 2 characters
 * - Only letters, numbers, spaces, and hyphens
 */
export const brandSchema = yup
  .string()
  .trim()
  .required("Brand is required")
  .min(2, "Brand must be at least 2 characters")
  .max(30, "Brand must be less than 30 characters")
  .test(
    "no-special-chars",
    "Brand can only contain letters, numbers, spaces, and hyphens",
    (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9\s-]+$/.test(value);
    }
  );

/**
 * Model validation:
 * - Minimum 1 character
 * - Letters, numbers, spaces, and hyphens allowed
 */
export const modelSchema = yup
  .string()
  .trim()
  .min(1, "Model must be at least 1 character")
  .max(50, "Model must be less than 50 characters")
  .test(
    "no-special-chars",
    "Model can only contain letters, numbers, spaces, and hyphens",
    (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9\s-]+$/.test(value);
    }
  );

/**
 * Battery health validation:
 * - Minimum 1 character
 * - Letters, numbers, spaces, %, commas, hyphens, and slashes allowed
 * - No random special symbols
 */
export const batterySchema = yup
  .string()
  .trim()
  .min(1, "Battery health must be at least 1 character")
  .max(100, "Battery health must be less than 100 characters")
  .test(
    "no-special-chars",
    "Battery health can only contain letters, numbers, spaces, %, commas, hyphens, and slashes",
    (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9\s%,\/-]+$/.test(value);
    }
  );

/**
 * Video link validation (optional):
 * - Must be a valid URL format
 * - Accepts YouTube, Vimeo, Google Drive, Dropbox, and other video platforms
 * - Empty value is allowed (optional field)
 */
export const videoLinkSchema = yup
  .string()
  .trim()
  .test(
    "is-url",
    "Please enter a valid URL (e.g., https://youtube.com/...)",
    (value) => {
      if (!value) return true; // Allow empty
      // Check if it's a valid URL format
      try {
        new URL(value);
        return /^https?:\/\/.+/.test(value);
      } catch {
        return false;
      }
    }
  )
  .test(
    "starts-with-protocol",
    "URL must start with http:// or https://",
    (value) => {
      if (!value) return true;
      return /^https?:\/\//.test(value);
    }
  );

/**
 * Year validation:
 * - Must be a valid year
 * - Between 1990 and current year
 */
const currentYear = new Date().getFullYear();
export const yearSchema = yup
  .number()
  .typeError("Year must be a number")
  .integer("Year must be a whole number")
  .min(1990, "Year must be 1990 or later")
  .max(currentYear, `Year cannot be later than ${currentYear}`)
  .test("no-decimals", "Year cannot contain decimals", (value) => {
    if (!value) return true;
    return Number.isInteger(value);
  });

/**
 * Description validation:
 * - Minimum 20 characters
 * - Maximum 1000 characters
 */
export const descriptionSchema = yup
  .string()
  .trim()
  .required("Description is required")
  .min(20, "Description must be at least 20 characters")
  .max(1000, "Description must be less than 1000 characters");

/**
 * Price validation:
 * - Must be a positive number
 * - No more than 2 decimal places
 * - Maximum value check
 */
export const priceSchema = yup
  .number()
  .typeError("Price must be a valid number")
  .required("Price is required")
  .positive("Price must be greater than 0")
  .max(10000000, "Price must be less than 10,000,000")
  .test("no-letters", "Price cannot contain letters", function (value) {
    if (value === undefined || value === null) return true;
    return !isNaN(value);
  })
  .test("max-decimals", "Price can have maximum 2 decimal places", (value) => {
    if (!value) return true;
    return /^\d+(\.\d{1,2})?$/.test(value.toString());
  });

/**
 * Bid amount validation:
 * - Must be a positive number
 * - No more than 2 decimal places
 */
export const bidAmountSchema = yup
  .number()
  .typeError("Bid amount must be a valid number")
  .required("Bid amount is required")
  .positive("Bid amount must be greater than 0")
  .test("no-letters", "Bid amount cannot contain letters", function (value) {
    if (value === undefined || value === null) return true;
    return !isNaN(value);
  })
  .test(
    "max-decimals",
    "Bid amount can have maximum 2 decimal places",
    (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }
  );

/**
 * Location/City validation:
 * - Only letters, spaces, and hyphens
 */
export const locationSchema = yup
  .string()
  .trim()
  .required("Location is required")
  .min(2, "Location must be at least 2 characters")
  .max(50, "Location must be less than 50 characters")
  .matches(
    /^[a-zA-Z\s-]+$/,
    "Location can only contain letters, spaces, and hyphens"
  );

// ============================================
// FORM VALIDATION SCHEMAS
// ============================================

/**
 * Signup form validation schema
 */
export const signupSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  addresses: yup
    .array()
    .of(
      yup.object().shape({
        address: addressSchema,
      })
    )
    .min(1, "At least one address is required")
    .test("no-empty", "All addresses must be filled", (addresses) => {
      if (!addresses || addresses.length === 0) return false;
      return addresses.every(
        (addr) => addr.address && addr.address.trim().length >= 10
      );
    }),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
});

/**
 * Login form validation schema
 */
export const loginSchema = yup.object().shape({
  email: emailSchema,
});

/**
 * Product details validation schema (Step 2)
 */
export const productDetailsSchema = yup.object().shape({
  productCategory: yup.string().required("Product category is required"),
  brand: brandSchema,
  model: modelSchema,
  manufacture_year: yearSchema,
  description: descriptionSchema,
  condition: yup.string().required("Condition is required"),
});

/**
 * Pricing validation schema (Step 3)
 */
export const pricingSchema = yup.object().shape({
  price: priceSchema,
  delivery_options: yup
    .array()
    .min(1, "At least one delivery option is required")
    .required("Delivery options are required"),
});

/**
 * Contact & Address validation schema (Step 4)
 */
export const contactAddressSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  whatsapp: optionalPhoneSchema,
  address: addressSchema,
  location: locationSchema,
  contact_preference: yup.string().required("Contact preference is required"),
});

/**
 * Bid form validation schema
 */
export const bidFormSchema = yup.object().shape({
  amount: bidAmountSchema,
});

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
});

// ============================================
// INDIVIDUAL FIELD VALIDATORS (for real-time validation)
// ============================================

/**
 * Validate a single field against its schema
 */
export const validateField = async (fieldName, value, schema) => {
  try {
    await schema.validate(value);
    return null; // No error
  } catch (error) {
    return error.message; // Return error message
  }
};

/**
 * Validate name field in real-time
 */
export const validateName = async (value) => {
  return validateField("name", value, nameSchema);
};

/**
 * Validate email field in real-time
 */
export const validateEmail = async (value) => {
  return validateField("email", value, emailSchema);
};

/**
 * Validate phone field in real-time
 */
export const validatePhone = async (value) => {
  return validateField("phone", value, phoneSchema);
};

/**
 * Validate optional phone field in real-time
 */
export const validateOptionalPhone = async (value) => {
  return validateField("phone", value, optionalPhoneSchema);
};

/**
 * Validate address field in real-time
 */
export const validateAddress = async (value) => {
  return validateField("address", value, addressSchema);
};

/**
 * Validate brand field in real-time
 */
export const validateBrand = async (value) => {
  return validateField("brand", value, brandSchema);
};

/**
 * Validate model field in real-time
 */
export const validateModel = async (value) => {
  return validateField("model", value, modelSchema);
};

/**
 * Validate battery health field in real-time
 */
export const validateBattery = async (value) => {
  return validateField("battery", value, batterySchema);
};

/**
 * Validate video link field in real-time
 */
export const validateVideoLink = async (value) => {
  return validateField("video_link", value, videoLinkSchema);
};

/**
 * Validate year field in real-time
 */
export const validateYear = async (value) => {
  return validateField("year", value, yearSchema);
};

/**
 * Validate description field in real-time
 */
export const validateDescription = async (value) => {
  return validateField("description", value, descriptionSchema);
};

/**
 * Validate price field in real-time
 */
export const validatePrice = async (value) => {
  return validateField("price", value, priceSchema);
};

/**
 * Validate location field in real-time
 */
export const validateLocation = async (value) => {
  return validateField("location", value, locationSchema);
};
