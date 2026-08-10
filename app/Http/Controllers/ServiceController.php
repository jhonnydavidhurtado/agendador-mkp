<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Company;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $services = Service::with('company')
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where(
                        'name',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'description',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhereHas(
                        'company',
                        function ($query) use ($search) {
                            $query->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        }
                    );
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Services/Index', [
            'services' => $services,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $companies = Company::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Services/Create', [
            'companies' => $companies,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreServiceRequest $request
    ): RedirectResponse {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo'] = $request
                ->file('photo')
                ->store('services', 'public');
        }

        Service::create($data);

        return redirect()
            ->route('services.index')
            ->with(
                'success',
                'Servicio creado correctamente.'
            );
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): Response
    {
        $service->load([
            'company',
            'appointments',
        ]);

        return Inertia::render('Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service): Response
    {
        $companies = Company::orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Services/Edit', [
            'service' => $service,
            'companies' => $companies,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateServiceRequest $request,
        Service $service
    ): RedirectResponse {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            if (
                $service->photo &&
                Storage::disk('public')->exists(
                    $service->photo
                )
            ) {
                Storage::disk('public')->delete(
                    $service->photo
                );
            }

            $data['photo'] = $request
                ->file('photo')
                ->store('services', 'public');
        }

        $service->update($data);

        return redirect()
            ->route('services.index')
            ->with(
                'success',
                'Servicio actualizado correctamente.'
            );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Service $service
    ): RedirectResponse {
        if (
            $service->photo &&
            Storage::disk('public')->exists(
                $service->photo
            )
        ) {
            Storage::disk('public')->delete(
                $service->photo
            );
        }

        $service->delete();

        return redirect()
            ->route('services.index')
            ->with(
                'success',
                'Servicio eliminado correctamente.'
            );
    }
}