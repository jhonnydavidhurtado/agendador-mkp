<?php

namespace App\Http\Controllers;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AdvisorController;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Mostrar listado de empresas.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $companies = Company::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('nit', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
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
        return Inertia::render('Companies/Create');
    }

    /**
     * Guardar empresa.
     */
    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        Company::create($request->validated());

        return redirect()
            ->route('companies.index')
            ->with('success', 'Empresa creada correctamente.');
    }

    /**
     * Mostrar empresa.
     */
    public function show(Company $company): Response
    {
        return Inertia::render('Companies/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Formulario de edición.
     */
    public function edit(Company $company): Response
    {
        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }

    /**
     * Actualizar empresa.
     */
    public function update(UpdateCompanyRequest $request, Company $company): RedirectResponse
    {
        $company->update($request->validated());

        return redirect()
            ->route('companies.index')
            ->with('success', 'Empresa actualizada correctamente.');
    }

    /**
     * Eliminar empresa.
     */
    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();

        return redirect()
            ->route('companies.index')
            ->with('success', 'Empresa eliminada correctamente.');
    }
}