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

        $appointmentsQuery = Appointment::query()
            ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->when(
                ! $user->hasRole('Super Usuario'),
                fn ($query) => $query->where('company_id', $user->company_id)
            );

        $byStatus = (clone $appointmentsQuery)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $appointments = (clone $appointmentsQuery)
            ->with(['company:id,name', 'client:id,name', 'service:id,name'])
            ->latest('date')
            ->latest('hour')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Appointment $appointment) => [
                'id' => $appointment->id,
                'date' => $appointment->date?->format('d/m/Y'),
                'hour' => substr((string) $appointment->hour, 0, 5),
                'status' => $appointment->status,
                'company' => $appointment->company?->name,
                'client' => $appointment->client?->name,
                'service' => $appointment->service?->name,
            ]);

        return Inertia::render('Reports/Index', [
            'month' => $month,
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
