<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        }
        .header {
            padding: 40px;
            text-align: center;
            background-color: {{ $charity->brand_color ?? '#000000' }};
            color: #ffffff;
        }
        .header img {
            max-width: 120px;
            margin-bottom: 20px;
        }
        .content {
            padding: 40px;
            color: #1a202c;
        }
        .thank-you {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 32px;
            text-align: center;
        }
        .receipt-card {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }
        .receipt-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .receipt-row:last-child {
            margin-bottom: 0;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            font-weight: 700;
            font-size: 18px;
        }
        .label {
            color: #718096;
        }
        .value {
            color: #1a202c;
            text-align: right;
        }
        .footer {
            padding: 32px 40px;
            text-align: center;
            font-size: 12px;
            color: #a0aec0;
            background-color: #f8fafc;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: {{ $charity->brand_color ?? '#000000' }};
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if($charity->getFirstMediaUrl('logo'))
                <img src="{{ $charity->getFirstMediaUrl('logo') }}" alt="{{ $charity->name }} Logo">
            @else
                <h1 style="margin: 0; font-size: 24px;">{{ $charity->name }}</h1>
            @endif
        </div>
        
        <div class="content">
            <div class="thank-you">Thank you, {{ $donation->donor_name ?? 'Kind Donor' }}!</div>
            <div class="message">
                Your generous contribution to <strong>{{ $campaign->name }}</strong> has been received. Your support makes a real difference in our mission.
            </div>

            <div class="receipt-card">
                <div class="receipt-row">
                    <span class="label">Date</span>
                    <span class="value">{{ $donation->created_at->format('M j, Y') }}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Transaction ID</span>
                    <span class="value">#{{ $donation->id }}</span>
                </div>
                <div class="receipt-row">
                    <span class="label">Payment Method</span>
                    <span class="value">{{ ucfirst($donation->payment_method) }}</span>
                </div>
                @if($donation->gift_aid_enabled)
                <div class="receipt-row">
                    <span class="label">Gift Aid</span>
                    <span class="value">Applied (+25%)</span>
                </div>
                @endif
                <div class="receipt-row">
                    <span class="label">Total Amount</span>
                    <span class="value">{{ $formattedAmount }}</span>
                </div>
            </div>

            <div style="text-align: center;">
                <p style="font-size: 14px; color: #718096;">Need help or have questions?</p>
                <a href="{{ config('app.url') }}" class="button">Visit Our Website</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ $charity->name }}. All rights reserved.</p>
            <p>{{ $charity->slogan }}</p>
        </div>
    </div>
</body>
</html>
