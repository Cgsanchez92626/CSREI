function formatPhoneNumber(phone) {
  // Remove non-numeric characters
  const cleaned = ("" + phone).replace(/\D/g, "");
  // Check the length of cleaned phone number
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
  }
  const match2 = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match2) {
    return `${match2[1]}-${match2[2]}-${match2[3]}`;
  }
  return phone; // Return the original phone if it doesn't match the pattern
}

function convertToDateForInput(date) {
  if (!date) return "";
  const [month, day, year] = date.split("-").map(Number);
  return `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const month = `0${d.getMonth() + 1}`.slice(-2); // Months are zero-based
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

// Function to format the parcel number input
function formatParcelNumber(parcelNumber) {
  // Remove non-numeric characters
  const cleaned = ("" + parcelNumber).replace(/\D/g, "");
  return parcelNumber
    .replace(/\D/g, "") // Remove non-numeric characters
    .replace(/^(\d{4})(\d{0,3})(\d{0,3})$/, "$1-$2-$3")
    .replace(/-$/, ""); // Remove trailing dash if present
}

// Helper function to validate non-empty string
function isNonEmptyString(value) {
  return value.trim() !== "";
}

// Helper function to validate email
function isValidEmail(email) {
  // Return true if phone is an empty string
  if (email === "") return true;
  // Check if email matches the specified formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone format
function isValidPhone(phone) {
  // Return true if phone is an empty string
  if (phone === "") return true;
  // Check if phone matches either of the specified formats
  return (
    /^\d{3}-\d{3}-\d{4}$/.test(phone) ||
    /^\d{1,3}-\d{3}-\d{3}-\d{4}$/.test(phone)
  );
}

// Helper function to validate zipcode format
function validateZipcode(value) {
  return /^\d{5}(-\d{4})?$/.test(value);
}

// Helper function to validate state abbreviation
function validateState(value) {
  return /^[A-Z]{2}$/.test(value);
}

// Helper function to validate parcel number format
function validateParcelNumber(value) {
  if (value === "") return true;
  return /^\d{4}-\d{3}-\d{3}$/.test(value);
}

// Helper function to validate year built format
function validateYearBuilt(value) {
  if (value === "") return true;
  return /^\d{4}$/.test(value);
}

//Export all functions together
export {
  formatPhoneNumber,
  convertToDateForInput,
  formatDate,
  formatParcelNumber,
  isNonEmptyString,
  isValidEmail,
  isValidPhone,
  validateZipcode,
  validateState,
  validateParcelNumber,
  validateYearBuilt,
};
