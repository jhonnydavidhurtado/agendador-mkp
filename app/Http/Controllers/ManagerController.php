<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreManagerRequest;
use App\Http\Requests\UpdateManagerRequest;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ManagerController extends Controller
{
    /**
     * Listado de managers.
     *
     * Solo Super Usuario.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $managers = User::query()
            ->with('company')
            ->role('Manager')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('company', function ($company) use ($search) {
                            $company->where(
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

        return Inertia::render('Managers/Index', [
            'managers' => $managers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Formulario para crear Manager.
     */
    public function create(): Response
    {
        return Inertia::render('Managers/Create', [
            'companies' => Company::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
        ]);
    }

    /**
     * Guardar Manager.
     */
    public function store(StoreManagerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'company_id' => $data['company_id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'status' => $data['status'] ?? true,
            'created_by' => auth()->id(),
        ]);

        $user->assignRole('Manager');

        return redirect()
            ->route('managers.index')
            ->with('success', 'Manager creado correctamente.');
    }

    /**
     * Mostrar Manager.
     */
    public function show(User $manager): Response
    {
        abort_unless(
            $manager->hasRole('Manager'),
            404
        );

        $manager->load('company');

        return Inertia::render('Managers/Show', [
            'manager' => $manager,
        ]);
    }

    /**
     * Formulario de edición.
     */
    public function edit(User $manager): Response
    {
        abort_unless(
            $manager->hasRole('Manager'),
            404
        );

        $manager->load('company');

        return Inertia::render('Managers/Edit', [
            'manager' => $manager,
            'companies' => Company::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
        ]);
    }

    /**
     * Actualizar Manager.
     */
    public function update(
        UpdateManagerRequest $request,
        User $manager
    ): RedirectResponse {
        abort_unless(
            $manager->hasRole('Manager'),
            404
        );

        $data = $request->validated();

        $update = [
            'company_id' => $data['company_id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'country' => $data['country'] ?? null,
            'status' => $data['status'] ?? true,
        ];

        if (!empty($data['password'])) {
            $update['password'] = Hash::make($data['password']);
        }

        $manager->update($update);

        $manager->syncRoles(['Manager']);

        return redirect()
            ->route('managers.index')
            ->with('success', 'Manager actualizado correctamente.');
    }

    /**
     * Eliminar Manager.
     */
    public function destroy(User $manager): RedirectResponse
    {
        abort_unless(
            $manager->hasRole('Manager'),
            404
        );

        if ($manager->id === auth()->id()) {
            return back()->with(
                'error',
                'No puedes eliminar tu propio usuario.'
            );
        }

        $manager->delete();

        return redirect()
            ->route('managers.index')
            ->with(
                'success',
                'Manager eliminado correctamente.'
            );
    }
}