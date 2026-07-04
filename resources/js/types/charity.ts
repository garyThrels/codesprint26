export interface Charity {
    id: number;
    name: string;
    slogan: string;
    description: string;
    brand_color: string;
    surface_tint: 'warm' | 'cool' | 'neutral';
    logo_url: string;
    active_campaigns_count?: number;
    paused_campaigns_count?: number;
    completed_campaigns_count?: number;
    total_gathered?: number;
    created_at: string;
    updated_at: string;
}
