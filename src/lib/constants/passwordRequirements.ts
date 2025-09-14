
// --- Password requirements ---
export function passwordRequirements(pwd: string) {
    return {
        minLength: pwd.length >= 8,
        hasUpperCase: /[A-Z]/.test(pwd),
        hasLowerCase: /[a-z]/.test(pwd),
        hasNumbers: /\d/.test(pwd),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
}