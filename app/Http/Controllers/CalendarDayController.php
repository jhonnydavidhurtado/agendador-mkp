<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarDayRequest;
use App\Http\Requests\UpdateCalendarDayRequest;
use App\Models\Calendar;
use App\Models\CalendarDay;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CalendarDayController extends Controller
{
    /**
     * Mostrar los días de un calendario.
     */
    public function index(Calendar $calendar): Response
    {
        $days = $calendar->days()
            ->with('hours')
            ->orderByRaw("
                FIELD(
                    day,
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday'
                )
            ")
            ->get();

        return Inertia::render('CalendarDays/Index', [
            'calendar' => $calendar->load([
                'company',
                'advisor.user',
            ]),
            'days' => $days,
        ]);
    }

    /**
     * Mostrar formulario para crear un día.
     */
    public function create(Calendar $calendar): Response
    {
        return Inertia::render('CalendarDays/Create', [
            'calendar' => $calendar->load([
                'company',
                'advisor.user',
            ]),
        ]);
    }

    /**
     * Guardar día.
     */
    public function store(
        StoreCalendarDayRequest $request,
        Calendar $calendar
    ): RedirectResponse {
        $calendar->days()->create(
            $request->validated()
        );

        return redirect()
            ->route('calendars.days.index', $calendar)
            ->with('success', 'Día agregado correctamente.');
    }

    /**
     * Mostrar día.
     */
    public function show(
        Calendar $calendar,
        CalendarDay $day
    ): Response {
        $day->load('hours');

        return Inertia::render('CalendarDays/Show', [
            'calendar' => $calendar->load([
                'company',
                'advisor.user',
            ]),
            'day' => $day,
        ]);
    }

    /**
     * Mostrar formulario de edición.
     */
    public function edit(
        Calendar $calendar,
        CalendarDay $day
    ): Response {
        return Inertia::render('CalendarDays/Edit', [
            'calendar' => $calendar->load([
                'company',
                'advisor.user',
            ]),
            'day' => $day,
        ]);
    }

    /**
     * Actualizar día.
     */
    public function update(
        UpdateCalendarDayRequest $request,
        Calendar $calendar,
        CalendarDay $day
    ): RedirectResponse {
        $day->update(
            $request->validated()
        );

        return redirect()
            ->route('calendars.days.index', $calendar)
            ->with('success', 'Día actualizado correctamente.');
    }

    /**
     * Eliminar día.
     */
    public function destroy(
        Calendar $calendar,
        CalendarDay $day
    ): RedirectResponse {
        $day->delete();

        return redirect()
            ->route('calendars.days.index', $calendar)
            ->with('success', 'Día eliminado correctamente.');
    }
}