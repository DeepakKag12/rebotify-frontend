# Quick Guide: Adding Validation to New Forms

## 📚 How to Add Validation to Any Form

This guide shows you how to quickly add real-time validation to any new form component.

---

## 🚀 Quick Start (Copy-Paste Template)

### Step 1: Import the validators

At the top of your component file:

```javascript
import { useState } from "react";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePrice,
  // ... import other validators as needed
} from "../../../utils/validationSchemas";
```

### Step 2: Add error state

In your component:

```javascript
const YourComponent = () => {
  const [errors, setErrors] = useState({});
  
  // ... rest of your component
}
```

### Step 3: Create validation handlers

For each input field that needs validation:

```javascript
// For Name field
const handleNameChange = async (e) => {
  const { value } = e.target;
  // Update your form state here
  setFormData((prev) => ({ ...prev, name: value }));
  
  // Real-time validation
  const error = await validateName(value);
  setErrors((prev) => ({ ...prev, name: error }));
};

// For Email field
const handleEmailChange = async (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, email: value }));
  
  const error = await validateEmail(value);
  setErrors((prev) => ({ ...prev, email: error }));
};

// For Phone field
const handlePhoneChange = async (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, phone: value }));
  
  const error = await validatePhone(value);
  setErrors((prev) => ({ ...prev, phone: error }));
};

// For Price field
const handlePriceChange = async (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, price: value }));
  
  const error = await validatePrice(Number(value));
  setErrors((prev) => ({ ...prev, price: error }));
};
```

### Step 4: Use the validation handler in your Input component

```javascript
<Input
  label="Full Name"
  type="text"
  name="name"
  value={formData.name}
  onChange={handleNameChange}  // Use your validation handler
  error={errors.name}           // Pass the error
  required
/>

<Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleEmailChange}
  error={errors.email}
  required
/>

<Input
  label="Phone Number"
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handlePhoneChange}
  error={errors.phone}
  required
/>
```

---

## 📋 Available Validators

### Text Fields
- `validateName(value)` - For name fields
- `validateBrand(value)` - For brand names
- `validateModel(value)` - For model names
- `validateAddress(value)` - For addresses
- `validateLocation(value)` - For locations/cities
- `validateDescription(value)` - For descriptions

### Contact Fields
- `validateEmail(value)` - For email addresses
- `validatePhone(value)` - For phone numbers (required)
- `validateOptionalPhone(value)` - For optional phone numbers

### Numeric Fields
- `validatePrice(value)` - For prices/amounts
- `validateYear(value)` - For years

---

## 🎯 Example: Complete Form Component

```javascript
import { useState } from "react";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "../../../utils/validationSchemas";

const MyFormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  // Validation handlers
  const handleNameChange = async (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, name: value }));
    const error = await validateName(value);
    setErrors((prev) => ({ ...prev, name: error }));
  };

  const handleEmailChange = async (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, email: value }));
    const error = await validateEmail(value);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePhoneChange = async (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, phone: value }));
    const error = await validatePhone(value);
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submit
    const nameError = await validateName(formData.name);
    const emailError = await validateEmail(formData.email);
    const phoneError = await validatePhone(formData.phone);
    
    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
    });
    
    // Check if there are any errors
    if (nameError || emailError || phoneError) {
      return; // Don't submit if there are errors
    }
    
    // Submit the form
    console.log("Form is valid, submitting:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleNameChange}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleEmailChange}
        error={errors.email}
        required
      />

      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handlePhoneChange}
        error={errors.phone}
        required
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default MyFormComponent;
```

---

## 🎨 For Custom Input Fields (not using Input component)

If you're using a custom input or textarea:

```javascript
<input
  type="text"
  value={formData.name}
  onChange={handleNameChange}
  className={`your-classes ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
/>
{errors.name && (
  <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    {errors.name}
  </p>
)}
```

---

## 💡 Pro Tips

### 1. Validate on Submit
Always validate all fields when the form is submitted:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const nameError = await validateName(formData.name);
  const emailError = await validateEmail(formData.email);
  
  setErrors({
    name: nameError,
    email: emailError,
  });
  
  if (nameError || emailError) {
    return; // Stop submission
  }
  
  // Proceed with submission
};
```

### 2. Clear Errors on Input
If you want to clear errors only when user starts typing (not real-time validation):

```javascript
const handleNameChange = (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, name: value }));
  
  // Clear error when typing
  if (errors.name) {
    setErrors((prev) => ({ ...prev, name: "" }));
  }
};
```

### 3. Validate on Blur (when user leaves field)
```javascript
const handleNameBlur = async (e) => {
  const { value } = e.target;
  const error = await validateName(value);
  setErrors((prev) => ({ ...prev, name: error }));
};

<Input
  onChange={handleNameChange}
  onBlur={handleNameBlur}  // Validate when user leaves field
  error={errors.name}
/>
```

---

## 🔧 Customizing Validation Rules

To modify or add new validation rules, edit:
```
src/utils/validationSchemas.js
```

Example - Adding a username validator:
```javascript
export const usernameSchema = yup
  .string()
  .trim()
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .matches(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  );

export const validateUsername = async (value) => {
  return validateField('username', value, usernameSchema);
};
```

Then use it in your component:
```javascript
import { validateUsername } from "../../../utils/validationSchemas";

const handleUsernameChange = async (e) => {
  const { value } = e.target;
  setFormData((prev) => ({ ...prev, username: value }));
  const error = await validateUsername(value);
  setErrors((prev) => ({ ...prev, username: error }));
};
```

---

## 🎯 Need Help?

Refer to existing validated components:
- `src/features/auth/pages/SignupPage.jsx`
- `src/features/user/components/Step2ProductDetails.jsx`
- `src/features/user/components/Step3Pricing.jsx`
- `src/features/user/components/Step4ContactAddress.jsx`

These show complete working examples of real-time validation!
