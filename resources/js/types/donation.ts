export interface Donation {
    id: number;
    amount: number;
    currency: string;
    status: string;
    donor_name: string | null;
    donor_email: string | null;
    is_anonymous: boolean;
    transaction_id: string | null;
    created_at: string;
    campaign: {
        name: string;
    };
}

export interface ReconciliationItem {
    id: number;
    local_transaction_id: string;
    mastercard_transaction_id: string;
    amount: number;
    local_status: string;
    mastercard_status: string;
    is_match: boolean;
    discrepancy: string | null;
}
