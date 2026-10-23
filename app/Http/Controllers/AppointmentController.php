<?php

namespace App\Http\Controllers;

use App\Models\Advisor;
use App\Models\Appointment;
use App\Models\CalendarHour;
use App\Models\Client;
use App\Models\Company;
use App\Models\Service;
use App\Notifications\AppointmentActivity;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    /**
     * Mostrar listado de citas.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $appointments = Appointment::with([
            'company',
            'advisor.user',
            'client',
            'service',
        ])
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {

                    $query->whereHas('client', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    })
                        ->orWhereHas('advisor.user', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('service', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('company', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });

                });
            })
            ->latest('date')
            ->latest('hour')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Mostrar formulario para crear una cita.
     */
    public function create(): Response
    {
        $companies = Company::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $advisors = Advisor::with('user')
            ->where('status', true)
            ->get([
                'id',
                'company_id',
                'user_id',
            ]);

        $clients = Client::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
            ]);

        $services = Service::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
                'duration',
                'price',
            ]);

        return Inertia::render('Appointments/Create', [
            'companies' => $companies,
            'advisors' => $advisors,
            'clients' => $clients,
            'services' => $services,
        ]);
    }

    /**
     * Guardar una nueva cita.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([

            'company_id' => [
                'required',
                'exists:companies,id',
            ],

            'advisor_id' => [
                'required',
                Rule::exists('advisors', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
            ],

            'client_id' => [
            'required',
            Rule::exists('clients', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
        ],

            'service_id' => [
            'required',
            Rule::exists('services', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
        ],

            'date' => [
            'required',
            'date',
        ],

            'hour' => [
            'required',
            'date_format:H:i',
        ],

            'status' => [
            'required',
            'in:pending,confirmed,completed,cancelled',
        ],

            'notes' => [
            'nullable',
            'string',
            'max:2000',
        ],
        ]);

        $appointment = DB::transaction(function () use ($validated) {
            Advisor::query()
                ->whereKey($validated['advisor_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $this->ensureAppointmentIsAvailable($validated);

            return Appointment::create($validated);
        });

        $appointment->load([
            'company',
            'advisor.user',
            'client',
            'service',
        ]);

        // Notificar al asesor
        if ($appointment->advisor?->user) {
            $appointment->advisor->user->notify(
                new AppointmentActivity($appointment, 'created')
            );
        }

        return redirect()
            ->route('appointments.index')
            ->with(
                'success',
                'Cita creada correctamente.'
            );
    }

    /**
     * Mostrar una cita.
     */
    public function show(Appointment $appointment): Response
    {
        $appointment->load([
            'company',
            'advisor.user',
            'client',
            'service',
        ]);

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Mostrar formulario para editar una cita.
     */
    public function edit(Appointment $appointment): Response
    {
        $appointment->load([
            'company',
            'advisor.user',
            'client',
            'service',
        ]);

        $companies = Company::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $advisors = Advisor::with('user')
            ->where('status', true)
            ->get([
                'id',
                'company_id',
                'user_id',
            ]);

        $clients = Client::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
            ]);

        $services = Service::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
                'duration',
                'price',
            ]);

        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'companies' => $companies,
            'advisors' => $advisors,
            'clients' => $clients,
            'services' => $services,
        ]);
    }

    /**
     * Actualizar una cita.
     */
    public function update(
        Request $request,
        Appointment $appointment
    ): RedirectResponse {

        $validated = $request->validate([

            'company_id' => [
                'required',
                'exists:companies,id',
            ],

            'advisor_id' => [
                'required',
                Rule::exists('advisors', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
            ],

            'client_id' => [
                'required',
                Rule::exists('clients', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
            ],

            'service_id' => [
                'required',
                Rule::exists('services', 'id')
                    ->where(function ($query) use ($request) {
                        $query->where(
                            'company_id',
                            $request->company_id
                        )
                            ->where('status', true);
                    }),
            ],

            'date' => [
                'required',
                'date',
            ],

            'hour' => [
                'required',
                'date_format:H:i',
            ],

            'status' => [
                'required',
                'in:pending,confirmed,completed,cancelled',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $wasCancelled = $appointment->status === 'cancelled';
        $appointment->loadMissing('advisor.user');
        $previousAdvisorUser = $appointment->advisor?->user;

        DB::transaction(function () use ($validated, $appointment) {
            Advisor::query()
                ->whereKey($validated['advisor_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $this->ensureAppointmentIsAvailable($validated, $appointment);

            $appointment->update($validated);
        });

        if ($appointment->wasChanged()) {
            $appointment->load(['advisor.user', 'client', 'service', 'company']);
            $event = ! $wasCancelled && $appointment->status === 'cancelled'
                ? 'cancelled'
                : 'updated';

            collect([$previousAdvisorUser, $appointment->advisor?->user])
                ->filter()
                ->unique('id')
                ->each(fn ($user) => $user->notify(
                    new AppointmentActivity($appointment, $event)
                ));
        }

        return redirect()
            ->route('appointments.index')
            ->with(
                'success',
                'Cita actualizada correctamente.'
            );
    }

    /**
     * Eliminar una cita.
     */
    public function destroy(
        Appointment $appointment
    ): RedirectResponse {

        $appointment->load(['advisor.user', 'client', 'service', 'company']);

        DB::transaction(function () use ($appointment) {
            if ($appointment->advisor?->user) {
                $appointment->advisor->user->notify(
                    new AppointmentActivity($appointment, 'deleted')
                );
            }

            $appointment->delete();
        });

        return redirect()
            ->route('appointments.index')
            ->with(
                'success',
                'Cita eliminada correctamente.'
            );
    }

    /**
     * Validate that the advisor has a matching calendar slot without conflicts.
     *
     * @param  array<string, mixed>  $data
     */
    private function ensureAppointmentIsAvailable(
        array $data,
        ?Appointment $appointment = null
    ): void {
        if ($data['status'] === 'cancelled') {
            return;
        }

        $start = CarbonImmutable::parse($data['date'].' '.$data['hour']);
        $service = Service::findOrFail($data['service_id']);
        $end = $start->addMinutes($service->duration);
        $weekday = strtolower($start->format('l'));

        $hasCalendarSlot = CalendarHour::query()
            ->where('status', true)
            ->whereHas('calendarDay', function ($dayQuery) use ($data, $weekday) {
                $dayQuery
                    ->where('day', $weekday)
                    ->where('status', true)
                    ->whereHas('calendar', function ($calendarQuery) use ($data) {
                        $calendarQuery
                            ->where('company_id', $data['company_id'])
                            ->where('advisor_id', $data['advisor_id'])
                            ->where('status', true);
                    });
            })
            ->get(['start_time', 'end_time'])
            ->contains(function (CalendarHour $slot) use ($start, $end) {
                $slotStart = CarbonImmutable::parse($start->format('Y-m-d').' '.$slot->start_time);
                $slotEnd = CarbonImmutable::parse($start->format('Y-m-d').' '.$slot->end_time);

                return $start >= $slotStart
                    && $end <= $slotEnd
                    && $end->isSameDay($start);
            });

        if (! $hasCalendarSlot) {
            throw ValidationException::withMessages([
                'hour' => 'La hora y duración del servicio deben estar dentro de un horario activo del calendario del asesor.',
            ]);
        }

        $conflicts = Appointment::query()
            ->with('service:id,duration')
            ->where('advisor_id', $data['advisor_id'])
            ->whereDate('date', $data['date'])
            ->where('status', '!=', 'cancelled')
            ->when($appointment, fn ($query) => $query->where('id', '!=', $appointment->id))
            ->get();

        foreach ($conflicts as $conflict) {
            $conflictStart = CarbonImmutable::parse(
                $conflict->date->format('Y-m-d').' '.$conflict->hour
            );
            $conflictEnd = $conflictStart->addMinutes($conflict->service?->duration ?? 0);

            if ($start < $conflictEnd && $end > $conflictStart) {
                throw ValidationException::withMessages([
                    'hour' => 'El asesor ya tiene una cita en ese horario.',
                ]);
            }
        }
    }
}
