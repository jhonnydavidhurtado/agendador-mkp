<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $today = now()->toDateString();

        $appointmentsQuery = Appointment::query()
            ->whereDate('date', $today)
            ->when(
                ! $user->hasRole('Super Usuario'),
                fn ($query) => $query->where('company_id', $user->company_id)
            );

        $byStatus = (clone $appointmentsQuery)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $appointments = (clone $appointmentsQuery)
            ->with(['company:id,name', 'client:id,name', 'advisor.user:id,name', 'service:id,name'])
            ->orderBy('hour')
            ->get()
            ->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'hour' => substr((string) $appointment->hour, 0, 5),
                'status' => $appointment->status,
                'company' => $appointment->company?->name,
                'client' => $appointment->client?->name,
                'advisor' => $appointment->advisor?->user?->name,
                'service' => $appointment->service?->name,
            ]);

        return Inertia::render('Dashboard', [
            'date' => now()->format('d/m/Y'),
            'summary' => [
                'total' => array_sum($byStatus->all()),
                'pending' => $byStatus->get('pending', 0),
                'confirmed' => $byStatus->get('confirmed', 0),
                'completed' => $byStatus->get('completed', 0),
                'cancelled' => $byStatus->get('cancelled', 0),
            ],
            'appointments' => $appointments,
        ]);
    }
}
