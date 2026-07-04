import { CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CardData } from './types';

interface CardFormProps {
    card: CardData;
    onChange: (card: CardData) => void;
}

export function CardForm({ card, onChange }: CardFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label className="font-inter text-xs font-bold tracking-wider text-brand-foreground-secondary uppercase">
                    Cardholder Name
                </Label>
                <Input
                    placeholder="Name on card"
                    className="h-12 border-none bg-white shadow-sm placeholder:font-inter"
                    value={card.cardholderName}
                    onChange={(e) =>
                        onChange({ ...card, cardholderName: e.target.value })
                    }
                />
            </div>
            <div className="space-y-1.5">
                <Label className="font-inter text-xs font-bold tracking-wider text-brand-foreground-secondary uppercase">
                    Card Number
                </Label>
                <div className="relative">
                    <Input
                        placeholder="0000 0000 0000 0000"
                        className="h-12 border-none bg-white font-geist shadow-sm"
                        value={card.cardNumber}
                        onChange={(e) =>
                            onChange({ ...card, cardNumber: e.target.value })
                        }
                    />
                    <CreditCard className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 opacity-40" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="font-inter text-xs font-bold tracking-wider text-brand-foreground-secondary uppercase">
                        Expiry
                    </Label>
                    <Input
                        placeholder="MM / YY"
                        className="h-12 border-none bg-white text-center font-geist shadow-sm"
                        value={`${card.expiryMonth}${card.expiryYear ? ' / ' + card.expiryYear : ''}`}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            onChange({
                                ...card,
                                expiryMonth: val.substring(0, 2),
                                expiryYear: val.substring(2, 4),
                            });
                        }}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="font-inter text-xs font-bold tracking-wider text-brand-foreground-secondary uppercase">
                        CVV
                    </Label>
                    <div className="relative">
                        <Input
                            placeholder="•••"
                            type="password"
                            className="h-12 border-none bg-white text-center font-geist shadow-sm"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) =>
                                onChange({ ...card, cvv: e.target.value })
                            }
                        />
                        <Lock className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 opacity-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
