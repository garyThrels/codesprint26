import type { Currency } from './currency';

export interface Donation {
    id: number;
    amount: number;
    amount_in_base_currency: number;
    currency: Currency;
    status: string;
    donor_name: string | null;
    donor_email: string | null;
    is_anonymous: boolean;
    transaction_id: string | null;
    receipt_sent_at?: string;
    gift_aid_enabled?: boolean;
    gift_aid_name?: string;
    gift_aid_address?: string;
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
