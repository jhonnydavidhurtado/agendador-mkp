<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $month = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
        ])['month'] ?? now()->format('Y-m');
        $startDate = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $appointments = Appointment::query()
            ->with(['company:id,name', 'client:id,name', 'advisor:id,company_id', 'service:id,name'])
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->when(
                !$user->hasRole('Super Usuario'),
                fn ($query) => $query->where('company_id', $user->company_id)
            )
            ->latest('date')
            ->latest('hour')
            ->get();

        $byStatus = $appointments
            ->groupBy('status')
            ->map(fn ($items) => $items->count())
            ->sortKeys();

        return Inertia::render('Reports/Index', [
            'month' => $month,
            'summary' => [
                'total' => $appointments->count(),
                'pending' => $byStatus->get('pending', 0),
                'confirmed' => $byStatus->get('confirmed', 0),
                'completed' => $byStatus->get('completed', 0),
                'cancelled' => $byStatus->get('cancelled', 0),
            ],
            'appointments' => $appointments->map(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'date' => $appointment->date?->format('d/m/Y'),
                'hour' => substr((string) $appointment->hour, 0, 5),
                'status' => $appointment->status,
                'company' => $appointment->company?->name,
                'client' => $appointment->client?->name,
                'service' => $appointment->service?->name,
            ])->values(),
        ]);
    }
}
