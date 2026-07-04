<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Domain\Campaign\Models\Campaign;
use Domain\Charity\Models\Charity;
use Domain\Currency\Models\Currency;
use Domain\Donation\Data\DonationRequestData;
use Domain\Donation\DonationProcessor;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Fortify\Events\TwoFactorAuthenticationEnabled;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;

class AuditActionsTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_donation_processing_is_no_longer_audited(): void
    {
        $charity = Charity::factory()->create();
        $currency = Currency::factory()->create(['is_active' => true]);
        $charity->currencies()->attach($currency);

        $campaign = Campaign::factory()->create([
            'charity_id' => $charity->id,
            'currency_id' => $currency->id,
        ]);

        $data = new DonationRequestData(
            campaignId: $campaign->id,
            amount: 1000,
            currencyId: $currency->id,
            paymentMethod: 'card',
            donorName: 'John Doe',
            donorEmail: 'john@example.com',
            isAnonymous: false,
            isRecurring: false,
            giftAidEnabled: false,
            roundUp: false
        );

        $processor = app(DonationProcessor::class);

        $initialCount = Activity::count();
        $processor->execute($data);

        $this->assertEquals($initialCount, Activity::count(), 'Donation processing should not create audit logs.');
    }

    public function test_campaign_management_is_audited(): void
    {
        $admin = $this->adminUser();
        $charity = Charity::factory()->create();
        $currency = Currency::factory()->create(['is_active' => true]);

        // Create campaign
        $this->actingAs($admin)->post(route('admin.campaigns.store'), [
            'charity_id' => $charity->id,
            'name' => 'New Campaign',
            'tagline' => 'Support us',
            'description_html' => '<p>Description</p>',
            'about_title' => 'About',
            'goal_amount' => 1000,
            'currency_id' => $currency->id,
            'donation_presets' => [['amount' => 10, 'label' => 'Small']],
            'preselected_index' => 1,
            'allow_custom_amount' => true,
            'status' => 'active',
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_type', Campaign::class)->where('description', 'created')->exists());

        $campaign = Campaign::latest()->first();

        // Update campaign
        $this->actingAs($admin)->put(route('admin.campaigns.update', $campaign), [
            'charity_id' => $charity->id,
            'name' => 'Updated Campaign',
            'tagline' => 'Support us',
            'description_html' => '<p>Description</p>',
            'about_title' => 'About',
            'goal_amount' => 1000,
            'currency_id' => $currency->id,
            'donation_presets' => [['amount' => 10, 'label' => 'Small']],
            'preselected_index' => 1,
            'allow_custom_amount' => true,
            'status' => 'active',
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_type', Campaign::class)->where('description', 'updated')->exists());
    }

    public function test_charity_management_is_audited(): void
    {
        $admin = $this->adminUser();
        $currency = Currency::factory()->create(['is_active' => true]);

        // Create charity
        $this->actingAs($admin)->post(route('admin.charities.store'), [
            'name' => 'New Charity',
            'slogan' => 'Do good',
            'description' => 'A great charity',
            'brand_color' => '#ff0000',
            'surface_tint' => 'warm',
            'currency_ids' => [$currency->id],
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_type', Charity::class)->where('description', 'created')->exists());

        $charity = Charity::latest()->first();

        // Update charity
        $this->actingAs($admin)->put(route('admin.charities.update', $charity), [
            'name' => 'Updated Charity',
            'slogan' => 'Do good',
            'description' => 'A great charity',
            'brand_color' => '#ff0000',
            'surface_tint' => 'warm',
            'currency_ids' => [$currency->id],
        ]);

        $this->assertTrue(Activity::where('subject_type', Charity::class)->where('description', 'updated')->exists());
    }

    public function test_ledger_export_is_audited(): void
    {
        $admin = $this->adminUser();

        $this->actingAs($admin)->get(route('admin.ledger.export'));

        $this->assertTrue(Activity::where('description', 'Exported donation ledger')->exists());
    }

    public function test_audit_log_export_is_audited(): void
    {
        $admin = $this->adminUser();

        $this->actingAs($admin)->get(route('admin.audit-log.export', ['format' => 'csv']));

        $this->assertTrue(Activity::where('description', 'Exported audit log')->exists());
    }

    public function test_auth_events_are_audited(): void
    {
        $user = User::factory()->create();

        Event::dispatch(new Login('web', $user, false));
        $this->assertEquals(1, Activity::where('description', 'User logged in')->where('causer_id', $user->id)->count());

        Event::dispatch(new Logout('web', $user));
        $this->assertEquals(1, Activity::where('description', 'User logged out')->where('causer_id', $user->id)->count());
        
        Event::dispatch(new TwoFactorAuthenticationEnabled($user));
        $this->assertEquals(1, Activity::where('description', 'Two-factor authentication enabled')->where('causer_id', $user->id)->count());
    }

    public function test_user_management_is_audited(): void
    {
        $admin = $this->adminUser();

        // Create user
        $this->actingAs($admin)->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'roles' => ['volunteer'],
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_type', User::class)->where('description', 'created')->exists());

        $user = User::where('email', 'newuser@example.com')->first();

        // Update user password
        $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'name' => 'Updated User',
            'email' => 'newuser@example.com',
            'password' => 'newpassword123',
            'roles' => ['volunteer'],
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_id', $user->id)->where('description', 'User password updated by admin')->exists());

        // Delete user
        $this->actingAs($admin)->delete(route('admin.users.destroy', $user))->assertRedirect();
        $this->assertTrue(Activity::where('subject_id', $user->id)->where('description', 'deleted')->exists());
    }

    public function test_profile_security_updates_are_audited(): void
    {
        $user = $this->adminUser(); // Using admin user because regular user might not have access to some routes if I haven't checked

        // Update own password
        $this->actingAs($user)->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])->assertRedirect();

        $this->assertTrue(Activity::where('subject_id', $user->id)->where('description', 'Password updated')->exists());
    }

    private function adminUser(): User
    {
        $admin = User::factory()->create();
        $admin->assignRole('super-admin');

        return $admin;
    }
}
