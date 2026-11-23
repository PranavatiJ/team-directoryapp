
import { useEffect, useRef, useState } from 'react';

function AddUserForm({ members, onAddMember, isSaving }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);
  useEffect(() => {
  nameInputRef.current?.focus();
}, []);
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
  newErrors.name = 'Full Name is required.';
} else if (formData.name.trim().length < 3) {
  newErrors.name = 'Full Name must contain at least 3 characters.';
}

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (
      members.some(
        (member) =>
          member.email.toLowerCase() === formData.email.trim().toLowerCase()
      )
    ) {
      newErrors.email = 'This email address already exists.';
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain exactly 10 digits.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  
async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    await onAddMember({
      firstName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: {
        city: formData.city.trim(),
      },
    });

    // Clear the form only after successful submission.
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
    });

    setErrors({});
    nameInputRef.current?.focus();
  } catch (error) {
    setErrors((previousErrors) => ({
      ...previousErrors,
      email: error.message || 'Unable to add member.',
    }));
  }
}

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h2 className="h5 mb-0">Add New Team Member</h2>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
           <input
            ref={nameInputRef}
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
         />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Add Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUserForm;
