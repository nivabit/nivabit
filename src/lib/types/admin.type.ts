
export interface AdminPayload {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    phone: string;
    resetToken: string | null;
    resetTokenExp: Date | null;
    createdAt: Date;
    updatedAt: Date;
}