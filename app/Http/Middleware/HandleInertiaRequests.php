<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user
                    ? $user->load('roles')
                    : null,
                'isSuperUsuario' => $user?->hasRole('Super Usuario') ?? false,
                'navigation' => [
                    'companies' => $user?->can('manage companies') ?? false,
                    'advisors' => $user?->can('manage advisors') ?? false,
                    'clients' => $user?->can('manage clients') ?? false,
                    'services' => $user?->hasAnyRole(['Super Usuario', 'Manager']) ?? false,
                    'calendars' => $user?->can('manage calendars') ?? false,
                    'appointments' => $user?->can('manage appointments') ?? false,
                    'reports' => $user?->can('manage appointments') ?? false,
                    'systemAdmin' => $user?->hasAnyRole(['Super Usuario', 'Super Admin']) ?? false,
                    'settings' => $user?->can('settings.view') ?? false,
                ],
            ],

            'unreadNotificationsCount' => fn () => $user?->unreadNotifications()->count() ?? 0,

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
