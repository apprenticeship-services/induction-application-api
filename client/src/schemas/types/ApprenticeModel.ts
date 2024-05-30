export type ApprenticeModel = {
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    accountId: string;
    trade: string;
    advisor: string;
    induction: boolean;
    assessment: boolean;
    updatedAt: Date | null;
}
