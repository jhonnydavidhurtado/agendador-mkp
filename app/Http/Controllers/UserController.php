<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Listado de usuarios.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $search = $request->input('search');

        $users = User::query()
            ->with([
                'company',
                'creator',
                'roles',
            ])
            ->when(
                !$user->hasRole('Super Usuario'),
                function ($query) use ($user) {
                    $query->where('company_id', $user->company_id);
                }
            )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nit', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => [
                'required',
                'string',
                'exists:roles,name',
            ],
        ]);

        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'Rol actualizado correctamente.');
    }

    /**
     * Formulario para crear usuario.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        $companies = Company::query()
            ->when(
                !$user->hasRole('Super Usuario'),
                function ($query) use ($user) {
                    $query->where('id', $user->company_id);
                }
            )
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $roles = \Spatie\Permission\Models\Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('Users/Create', [
            'companies' => $companies,
            'roles' => $roles,
        ]);
    }

    /**
     * Guardar nuevo usuario.
     */
    public function store(Request $request)
    {
        $authUser = $request->user();

        $validated = $request->validate([
            'company_id' => [
                'nullable',
                'integer',
                'exists:companies,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'nit' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'logo' => [
                'nullable',
                'string',
                'max:255',
            ],

            'cover' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'boolean',
            ],

            'role' => [
                'required',
                'string',
                'exists:roles,name',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Seguridad por empresa
        |--------------------------------------------------------------------------
        */

        if (
            !$authUser->hasRole('Super Usuario') &&
            (int) $validated['company_id'] !== (int) $authUser->company_id
        ) {
            abort(403, 'No tienes permiso para crear usuarios en esta empresa.');
        }

        /*
        |--------------------------------------------------------------------------
        | Crear usuario
        |--------------------------------------------------------------------------
        */

        $newUser = User::create([
            'company_id' => $validated['company_id'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'nit' => $validated['nit'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'cover' => $validated['cover'] ?? null,
            'status' => $validated['status'] ?? true,
            'created_by' => $authUser->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Asignar rol
        |--------------------------------------------------------------------------
        */

        $newUser->assignRole($validated['role']);

        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    /**
     * Mostrar usuario.
     */
    public function show(Request $request, User $user): Response
    {
        $this->authorizeUser($request->user(), $user);

        $user->load([
            'company',
            'creator',
            'roles',
            'advisor',
        ]);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Formulario de edición.
     */
    public function edit(Request $request, User $user): Response
    {
        $this->authorizeUser($request->user(), $user);

        $authUser = $request->user();

        $companies = Company::query()
            ->when(
                !$authUser->hasRole('Super Usuario'),
                function ($query) use ($authUser) {
                    $query->where('id', $authUser->company_id);
                }
            )
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $roles = \Spatie\Permission\Models\Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return Inertia::render('Users/Edit', [
            'user' => $user->load('roles'),
            'companies' => $companies,
            'roles' => $roles,
        ]);
    }

    /**
     * Actualizar usuario.
     */
    public function update(Request $request, User $user)
    {
        $authUser = $request->user();

        $this->authorizeUser($authUser, $user);

        $validated = $request->validate([
            'company_id' => [
                'nullable',
                'integer',
                'exists:companies,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'nit' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'country' => [
                'nullable',
                'string',
                'max:255',
            ],

            'logo' => [
                'nullable',
                'string',
                'max:255',
            ],

            'cover' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'boolean',
            ],

            'role' => [
                'required',
                'string',
                'exists:roles,name',
            ],
        ]);

        if (
            !$authUser->hasRole('Super Usuario') &&
            (int) $validated['company_id'] !== (int) $authUser->company_id
        ) {
            abort(403, 'No puedes cambiar el usuario a otra empresa.');
        }

        $data = [
            'company_id' => $validated['company_id'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'nit' => $validated['nit'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'country' => $validated['country'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'cover' => $validated['cover'] ?? null,
            'status' => $validated['status'] ?? true,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        /*
        |--------------------------------------------------------------------------
        | Actualizar rol
        |--------------------------------------------------------------------------
        */

        $user->syncRoles([
            $validated['role'],
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    /**
     * Eliminar usuario.
     */
    public function destroy(Request $request, User $user)
    {
        $authUser = $request->user();

        $this->authorizeUser($authUser, $user);

        /*
        |--------------------------------------------------------------------------
        | Evitar que el Super Usuario se elimine accidentalmente
        |--------------------------------------------------------------------------
        */

        if ($user->id === $authUser->id) {
            return back()->withErrors([
                'user' => 'No puedes eliminar tu propio usuario.',
            ]);
        }

        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * Autorizar acceso al usuario según empresa.
     */
    private function authorizeUser(User $authUser, User $targetUser): void
    {
        /*
        |--------------------------------------------------------------------------
        | Super Usuario puede administrar todos los usuarios
        |--------------------------------------------------------------------------
        */

        if ($authUser->hasRole('Super Usuario')) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Los demás usuarios solamente pueden acceder a usuarios
        | de su propia empresa.
        |--------------------------------------------------------------------------
        */

        if (
            !$authUser->company_id ||
            (int) $authUser->company_id !== (int) $targetUser->company_id
        ) {
            abort(403, 'No tienes permiso para acceder a este usuario.');
        }
    }
}