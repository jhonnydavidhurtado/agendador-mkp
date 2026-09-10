<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Mostrar las notificaciones del usuario autenticado.
     */
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $request->user()
                ->unreadNotifications()
                ->count(),
        ]);
    }

    /**
     * Marcar una notificación como leída.
     */
    public function markAsRead(
        Request $request,
        string $notification
    ): RedirectResponse {
        $userNotification = $request->user()
            ->notifications()
            ->where('id', $notification)
            ->firstOrFail();

        $userNotification->markAsRead();

        return back();
    }

    /**
     * Marcar todas las notificaciones como leídas.
     */
    public function markAllAsRead(
        Request $request
    ): RedirectResponse {
        $request->user()
            ->unreadNotifications
            ->markAsRead();

        return back();
    }
}