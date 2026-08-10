<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvisorRequest;
use App\Http\Requests\UpdateAdvisorRequest;
use App\Models\Advisor;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdvisorController extends Controller
{
    /**
     * Mostrar listado de asesores.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
    
        $advisors = Advisor::query()
            ->with(['company', 'user'])
            ->when($search, function ($query) use ($search) {
                $query->where('profession', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('company', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    
        return Inertia::render('Advisors/Index', [
            'advisors' => $advisors,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    /**
 * Mostrar formulario de creación.
 */
public function create(): Response
{
    return Inertia::render('Advisors/Create', [
        'companies' => Company::orderBy('name')->get(),

        'users' => User::role('Asesor')
            ->orderBy('name')
            ->get(),
    ]);
}
    

       /**
     * Guardar asesor.
     */
    public function store(StoreAdvisorRequest $request): RedirectResponse
    {
        Advisor::create($request->validated());

        return redirect()
            ->route('advisors.index')
            ->with('success', 'Asesor creado correctamente.');
    }

    /**
     * Mostrar asesor.
     */
    public function show(Advisor $advisor): Response
    {
        $advisor->load(['company', 'user']);

        return Inertia::render('Advisors/Show', [
            'advisor' => $advisor,
        ]);
    }

    /**
     * Mostrar formulario de edición.
     */
    public function edit(Advisor $advisor): Response
    {
        $advisor->load(['company', 'user']);

        return Inertia::render('Advisors/Edit', [
            'advisor' => $advisor,
            'companies' => Company::orderBy('name')->get(),
            'users' => User::role('Asesor')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Actualizar asesor.
     */
    public function update(
        UpdateAdvisorRequest $request,
        Advisor $advisor
    ): RedirectResponse {

        $advisor->update($request->validated());

        return redirect()
            ->route('advisors.index')
            ->with('success', 'Asesor actualizado correctamente.');
    }

    /**
     * Eliminar asesor.
     */
    public function destroy(Advisor $advisor): RedirectResponse
    {
        $advisor->delete();

        return redirect()
            ->route('advisors.index')
            ->with('success', 'Asesor eliminado correctamente.');
    }
}