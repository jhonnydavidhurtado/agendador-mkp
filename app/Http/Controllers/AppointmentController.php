<?php

namespace App\Http\Controllers;

use App\Models\Advisor;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Company;
use App\Models\Service;
use App\Notifications\AppointmentCreated;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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

    $appointment = Appointment::create($validated);

    $appointment->load([
        'company',
        'advisor.user',
        'client',
        'service',
    ]);

    // Notificar al asesor
    if ($appointment->advisor?->user) {
        $appointment->advisor->user->notify(
            new AppointmentCreated($appointment)
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

        $appointment->update($validated);

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

        $appointment->delete();

        return redirect()
            ->route('appointments.index')
            ->with(
                'success',
                'Cita eliminada correctamente.'
            );
    }
}