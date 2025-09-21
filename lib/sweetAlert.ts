import Swal from "sweetalert2";

// Custom SweetAlert configurations with enhanced styling
const swalConfig = {
  confirmButtonColor: "#9333ea", // purple-600
  cancelButtonColor: "#6b7280", // gray-500
  background: "#ffffff",
  color: "#1f2937", // gray-800
  borderRadius: "16px",
  customClass: {
    popup: "rounded-2xl shadow-2xl border border-purple-200",
    title: "text-xl font-bold text-gray-900 mb-2",
    content: "text-gray-600",
    confirmButton:
      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    cancelButton:
      "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-3",
    actions: "gap-3 mt-6",
  },
};

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    ...swalConfig,
    icon: "success",
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    ...swalConfig,
    icon: "error",
    title,
    text,
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    ...swalConfig,
    icon: "warning",
    title,
    text,
  });
};

export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    ...swalConfig,
    icon: "info",
    title,
    text,
  });
};

export const showConfirmAlert = (
  title: string,
  text?: string,
  confirmButtonText: string = "Yes, delete it!",
  cancelButtonText: string = "Cancel"
) => {
  return Swal.fire({
    ...swalConfig,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
};

export const showLoadingAlert = (
  title: string = "Processing...",
  text?: string
) => {
  return Swal.fire({
    ...swalConfig,
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showInputAlert = (
  title: string,
  inputPlaceholder: string,
  inputValue: string = "",
  confirmButtonText: string = "Submit"
) => {
  return Swal.fire({
    ...swalConfig,
    title,
    input: "text",
    inputPlaceholder,
    inputValue,
    showCancelButton: true,
    confirmButtonText,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
};

export const showToast = (
  icon: "success" | "error" | "warning" | "info",
  title: string,
  position:
    | "top-end"
    | "top"
    | "top-start"
    | "center"
    | "bottom"
    | "bottom-start"
    | "bottom-end" = "top-end"
) => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    customClass: {
      popup: "rounded-lg shadow-lg",
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

const loading = (title: string = "Processing...", text?: string) => {
  return showLoadingAlert(title, text);
};

const success = (title: string, text?: string) => {
  return showSuccessAlert(title, text);
};

const error = (title: string, text?: string) => {
  return showErrorAlert(title, text);
};

const warning = (title: string, text?: string) => {
  return showWarningAlert(title, text);
};

const info = (title: string, text?: string) => {
  return showInfoAlert(title, text);
};

const confirm = (
  title: string,
  text?: string,
  confirmButtonText?: string,
  cancelButtonText?: string
) => {
  return showConfirmAlert(title, text, confirmButtonText, cancelButtonText);
};

const custom = (options: any) => {
  return Swal.fire({ ...swalConfig, ...options });
};

const close = () => {
  return Swal.close();
};

const swal = {
  loading,
  success,
  error,
  warning,
  info,
  confirm,
  custom,
  close,
};

export default swal;
