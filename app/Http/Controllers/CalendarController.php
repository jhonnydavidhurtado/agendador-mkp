<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarRequest;
use App\Http\Requests\UpdateCalendarRequest;
use App\Models\Advisor;
use App\Models\Calendar;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Mostrar calendarios.
     */
public function index(Request $request): Response
{
    $search = trim($request->input('search', ''));

    $calendars = Calendar::with([
        'company',
        'advisor.user',
    ])
        ->when($search !== '', function ($query) use ($search) {

            $query->where(function ($query) use ($search) {

                // Buscar por empresa
                $query->whereHas('company', function ($companyQuery) use ($search) {

                    $companyQuery->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );

                })

                // O buscar por asesor
                ->orWhereHas('advisor.user', function ($userQuery) use ($search) {

                    $userQuery->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );

                });

            });

        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Calendars/Index', [
        'calendars' => $calendars,

        'filters' => [
            'search' => $search,
        ],
    ]);
}

    /**
     * Mostrar formulario para crear.
     */
    public function create(): Response
    {
        $companies = Company::orderBy('name')->get();

        $advisors = Advisor::with('user')
            ->where('status', true)
            ->get();

        return Inertia::render('Calendars/Create', [
            'companies' => $companies,
            'advisors' => $advisors,
        ]);
    }

    /**
     * Guardar calendario.
     */
    public function store(StoreCalendarRequest $request): RedirectResponse
    {
        Calendar::create($request->validated());

        return redirect()
            ->route('calendars.index')
            ->with('success', 'Calendario creado correctamente.');
    }

    /**
     * Mostrar calendario.
     */
    public function show(Calendar $calendar): Response
    {
        $calendar->load([
            'company',
            'advisor.user',
            'days',
        ]);

        return Inertia::render('Calendars/Show', [
            'calendar' => $calendar,
        ]);
    }

    /**
     * Mostrar formulario de edición.
     */
    public function edit(Calendar $calendar): Response
    {
        $calendar->load([
            'company',
            'advisor.user',
        ]);

        $companies = Company::orderBy('name')->get();

        $advisors = Advisor::with('user')
            ->where('status', true)
            ->get();

        return Inertia::render('Calendars/Edit', [
            'calendar' => $calendar,
            'companies' => $companies,
            'advisors' => $advisors,
        ]);
    }

    /**
     * Actualizar calendario.
     */
    public function update(
        UpdateCalendarRequest $request,
        Calendar $calendar
    ): RedirectResponse {

        $calendar->update($request->validated());

        return redirect()
            ->route('calendars.index')
            ->with('success', 'Calendario actualizado correctamente.');
    }

    /**
     * Eliminar calendario.
     */
    public function destroy(Calendar $calendar): RedirectResponse
    {
        $calendar->delete();

        return redirect()
            ->route('calendars.index')
            ->with('success', 'Calendario eliminado correctamente.');
    }
}