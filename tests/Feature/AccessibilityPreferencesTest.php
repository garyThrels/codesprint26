<?php

use App\Http\Middleware\HandleAppearance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

test('the middleware shares accessibility preferences from cookies', function () {
    $request = Request::create('/', 'GET', cookies: [
        'contrast' => 'high',
        'font_scale' => 'large',
    ]);

    (new HandleAppearance)->handle($request, fn () => response('ok'));

    expect(View::shared('contrast'))->toBe('high')
        ->and(View::shared('fontScale'))->toBe('large');
});

test('the middleware defaults preferences to normal when no cookies are set', function () {
    $request = Request::create('/', 'GET');

    (new HandleAppearance)->handle($request, fn () => response('ok'));

    expect(View::shared('contrast'))->toBe('normal')
        ->and(View::shared('fontScale'))->toBe('normal');
});

test('the root document embeds the no-flash preference script', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee("=== 'high'", false)
        ->assertSee('data-font-scale', false);
});
