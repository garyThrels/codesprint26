export type AuditLogEntry = {
    id: number;
    description: string | null;
    event: string | null;
    logName: string | null;
    causer: string | null;
    subjectType: string | null;
    loggedAt: string;
};
