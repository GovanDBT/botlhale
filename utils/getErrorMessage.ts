// utils/getErrorMessage.ts
// reusable utility file for showing error messages
export default function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "An unexpected error occurred";
}