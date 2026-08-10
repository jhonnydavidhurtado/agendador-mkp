<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarHourRequest;
use App\Http\Requests\UpdateCalendarHourRequest;
use App\Models\CalendarDay;
use App\Models\CalendarHour;
use Inertia\Inertia;

class CalendarHourController extends Controller
{
    /**
     * Mostrar los horarios de un día.
     */
    public function index(CalendarDay $calendarDay)
    {
        $hours = $calendarDay->hours()
            ->orderBy('start_time')
            ->get();

        return Inertia::render('CalendarHours/Index', [
            'calendarDay' => $calendarDay->load('calendar.company', 'calendar.advisor.user'),
            'hours' => $hours,
        ]);
    }

    /**
     * Mostrar formulario para crear un horario.
     */
    public function create(CalendarDay $calendarDay)
    {
        $calendarDay->load('calendar.company', 'calendar.advisor.user');

        return Inertia::render('CalendarHours/Create', [
            'calendarDay' => $calendarDay,
        ]);
    }

    /**
     * Guardar un nuevo horario.
     */
    public function store(
        StoreCalendarHourRequest $request,
        CalendarDay $calendarDay
    ) {
        $calendarDay->hours()->create([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => $request->boolean('status'),
        ]);

        return redirect()
            ->route('calendar-days.hours.index', $calendarDay->id)
            ->with('success', 'Horario creado correctamente.');
    }

    /**
     * Mostrar un horario.
     */
    public function show(
        CalendarDay $calendarDay,
        CalendarHour $hour
    ) {
        $hour->load('calendarDay.calendar.company', 'calendarDay.calendar.advisor.user');

        return Inertia::render('CalendarHours/Show', [
            'calendarDay' => $calendarDay,
            'hour' => $hour,
        ]);
    }

    /**
     * Mostrar formulario para editar un horario.
     */
    public function edit(
        CalendarDay $calendarDay,
        CalendarHour $hour
    ) {
        $calendarDay->load('calendar.company', 'calendar.advisor.user');

        return Inertia::render('CalendarHours/Edit', [
            'calendarDay' => $calendarDay,
            'hour' => $hour,
        ]);
    }

    /**
     * Actualizar un horario.
     */
    public function update(
        UpdateCalendarHourRequest $request,
        CalendarDay $calendarDay,
        CalendarHour $hour
    ) {
        $hour->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => $request->boolean('status'),
        ]);

        return redirect()
            ->route('calendar-days.hours.index', $calendarDay->id)
            ->with('success', 'Horario actualizado correctamente.');
    }

    /**
     * Eliminar un horario.
     */
    public function destroy(
        CalendarDay $calendarDay,
        CalendarHour $hour
    ) {
        $hour->delete();

        return redirect()
            ->route('calendar-days.hours.index', $calendarDay->id)
            ->with('success', 'Horario eliminado correctamente.');
    }
}