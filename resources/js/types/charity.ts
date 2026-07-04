export interface Charity {
    id: number;
    name: string;
    slogan: string;
    description: string;
    brand_color: string;
    surface_tint: 'warm' | 'cool' | 'neutral';
    logo_url?: string;
    currency_ids?: number[];
    currencies?: import('./currency').Currency[];
    supported_currencies?: import('./currency').Currency[];
    active_campaigns_count?: number;
    paused_campaigns_count?: number;
    completed_campaigns_count?: number;
    total_gathered?: number;
    created_at: string;
    updated_at: string;
}
