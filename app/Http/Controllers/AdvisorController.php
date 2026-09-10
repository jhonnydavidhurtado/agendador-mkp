<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvisorRequest;
use App\Http\Requests\UpdateAdvisorRequest;
use App\Models\Advisor;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdvisorController extends Controller
{
    /**
     * Mostrar listado de asesores.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();

        $search = $request->input('search');

        $advisors = Advisor::query()
            ->with(['company', 'user'])
            ->when(
                $user->hasRole('Manager'),
                function ($query) use ($user) {
                    $query->where(
                        'company_id',
                        $user->company_id
                    );
                }
            )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where(
                        'profession',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where(
                            'name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('company', function ($q) use ($search) {
                        $q->where(
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
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | Empresas disponibles
        |--------------------------------------------------------------------------
        */

        $companies = $user->hasRole('Super Usuario')
            ? Company::query()
                ->orderBy('name')
                ->get()
            : Company::query()
                ->whereKey($user->company_id)
                ->orderBy('name')
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Usuarios disponibles
        |--------------------------------------------------------------------------
        |
        | IMPORTANTE:
        |
        | No filtramos por role('Asesor') porque el usuario
        | puede todavía no tener ese rol.
        |
        | Excluimos solamente los usuarios que ya tienen
        | un registro en advisors.
        |
        */

        $users = User::query()
            ->whereDoesntHave('advisor')
            ->when(
                $user->hasRole('Manager'),
                function ($query) use ($user) {
                    $query->where(
                        'company_id',
                        $user->company_id
                    );
                }
            )
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
                'email',
            ]);


        return Inertia::render('Advisors/Create', [
            'companies' => $companies,
            'users' => $users,
        ]);
    }


    /**
     * Guardar asesor.
     */
    public function store(
        StoreAdvisorRequest $request
    ): RedirectResponse {
        $user = auth()->user();

        $data = $request->validated();


        /*
        |--------------------------------------------------------------------------
        | Validación para Manager
        |--------------------------------------------------------------------------
        */

        if ($user->hasRole('Manager')) {

            abort_unless(
                (int) $data['company_id'] === (int) $user->company_id,
                403
            );

            $advisorUser = User::query()
                ->whereKey($data['user_id'])
                ->where('company_id', $user->company_id)
                ->whereDoesntHave('advisor')
                ->firstOrFail();

            $data['company_id'] = $user->company_id;
        }


        /*
        |--------------------------------------------------------------------------
        | Validación adicional para Super Usuario
        |--------------------------------------------------------------------------
        */

        if ($user->hasRole('Super Usuario')) {

            $advisorUser = User::query()
                ->whereKey($data['user_id'])
                ->whereDoesntHave('advisor')
                ->first();

            if (!$advisorUser) {
                throw ValidationException::withMessages([
                    'user_id' => 'El usuario seleccionado ya tiene un perfil de asesor.',
                ]);
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Crear perfil de asesor
        |--------------------------------------------------------------------------
        */

        $advisor = Advisor::create([
            'company_id' => $data['company_id'],
            'user_id' => $data['user_id'],
            'photo' => $data['photo'] ?? null,
            'profession' => $data['profession'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? true,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Asignar rol Asesor
        |--------------------------------------------------------------------------
        |
        | El usuario pasa a ser oficialmente un Asesor.
        |
        */

        if (!$advisorUser->hasRole('Asesor')) {
            $advisorUser->assignRole('Asesor');
        }


        return redirect()
            ->route('advisors.index')
            ->with(
                'success',
                'Asesor creado correctamente.'
            );
    }


    /**
     * Mostrar asesor.
     */
    public function show(Advisor $advisor): Response
    {
        $user = auth()->user();

        if (
            $user->hasRole('Manager') &&
            (int) $advisor->company_id !== (int) $user->company_id
        ) {
            abort(403);
        }

        $advisor->load([
            'company',
            'user',
        ]);

        return Inertia::render('Advisors/Show', [
            'advisor' => $advisor,
        ]);
    }


    /**
     * Mostrar formulario de edición.
     */
    public function edit(Advisor $advisor): Response
    {
        $user = auth()->user();

        if (
            $user->hasRole('Manager') &&
            (int) $advisor->company_id !== (int) $user->company_id
        ) {
            abort(403);
        }

        $advisor->load([
            'company',
            'user',
        ]);


        $companies = $user->hasRole('Super Usuario')
            ? Company::query()
                ->orderBy('name')
                ->get()
            : Company::query()
                ->whereKey($user->company_id)
                ->orderBy('name')
                ->get();


        /*
        |--------------------------------------------------------------------------
        | Usuarios disponibles
        |--------------------------------------------------------------------------
        |
        | Incluimos:
        |
        | 1. El usuario actualmente asignado al asesor.
        | 2. Usuarios que todavía no tienen asesor.
        |
        */

        $users = User::query()
            ->where(function ($query) use ($advisor) {
                $query
                    ->whereKey($advisor->user_id)
                    ->orWhereDoesntHave('advisor');
            })
            ->when(
                $user->hasRole('Manager'),
                function ($query) use ($user) {
                    $query->where(
                        'company_id',
                        $user->company_id
                    );
                }
            )
            ->orderBy('name')
            ->get([
                'id',
                'company_id',
                'name',
                'email',
            ]);


        return Inertia::render('Advisors/Edit', [
            'advisor' => $advisor,
            'companies' => $companies,
            'users' => $users,
        ]);
    }


    /**
     * Actualizar asesor.
     */
    public function update(
        UpdateAdvisorRequest $request,
        Advisor $advisor
    ): RedirectResponse {

        $user = auth()->user();

        if (
            $user->hasRole('Manager') &&
            (int) $advisor->company_id !== (int) $user->company_id
        ) {
            abort(403);
        }

        $data = $request->validated();


        /*
        |--------------------------------------------------------------------------
        | Validaciones Manager
        |--------------------------------------------------------------------------
        */

        if ($user->hasRole('Manager')) {

            abort_unless(
                (int) $data['company_id'] === (int) $user->company_id,
                403
            );

            User::query()
                ->whereKey($data['user_id'])
                ->where('company_id', $user->company_id)
                ->where(function ($query) use ($advisor) {
                    $query
                        ->whereKey($advisor->user_id)
                        ->orWhereDoesntHave('advisor');
                })
                ->firstOrFail();

            $data['company_id'] = $user->company_id;
        }


        /*
        |--------------------------------------------------------------------------
        | Evitar duplicar usuario
        |--------------------------------------------------------------------------
        */

        $existingAdvisor = Advisor::query()
            ->where('user_id', $data['user_id'])
            ->whereKeyNot($advisor->id)
            ->first();

        if ($existingAdvisor) {
            throw ValidationException::withMessages([
                'user_id' => 'El usuario seleccionado ya tiene un perfil de asesor.',
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Actualizar
        |--------------------------------------------------------------------------
        */

        $oldUser = $advisor->user;

        $advisor->update([
            'company_id' => $data['company_id'],
            'user_id' => $data['user_id'],
            'photo' => $data['photo'] ?? null,
            'profession' => $data['profession'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? true,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Rol Asesor
        |--------------------------------------------------------------------------
        */

        $newAdvisorUser = User::findOrFail($data['user_id']);

        if (!$newAdvisorUser->hasRole('Asesor')) {
            $newAdvisorUser->assignRole('Asesor');
        }


        /*
        |--------------------------------------------------------------------------
        | Si se cambió de usuario
        |--------------------------------------------------------------------------
        |
        | No eliminamos automáticamente otros roles del usuario anterior.
        |
        */

        if (
            $oldUser &&
            (int) $oldUser->id !== (int) $newAdvisorUser->id
        ) {
            // No quitamos roles automáticamente.
        }


        return redirect()
            ->route('advisors.index')
            ->with(
                'success',
                'Asesor actualizado correctamente.'
            );
    }


    /**
     * Eliminar asesor.
     */
    public function destroy(
        Advisor $advisor
    ): RedirectResponse {

        $user = auth()->user();

        if (
            $user->hasRole('Manager') &&
            (int) $advisor->company_id !== (int) $user->company_id
        ) {
            abort(403);
        }

        $advisor->delete();

        /*
        |--------------------------------------------------------------------------
        | Eliminar solamente el perfil.
        |--------------------------------------------------------------------------
        |
        | NO eliminamos el usuario.
        | NO eliminamos automáticamente sus roles.
        |
        */

        return redirect()
            ->route('advisors.index')
            ->with(
                'success',
                'Asesor eliminado correctamente.'
            );
    }
}