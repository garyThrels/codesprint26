export type { Campaign, Charity } from '@/types';
import type { DonationPreset as Preset } from '@/types';

export type { Preset };

export interface CardData {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
}

export type DonationStep = 'amount' | 'processing' | 'success' | 'failed';

export type PaymentMethod = 'tap' | 'manual' | 'fail';
