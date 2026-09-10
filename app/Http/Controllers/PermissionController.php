<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::query()
            ->with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'roles' => $permission->roles->pluck('name')->values(),
            ]);

        $roles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')->where('guard_name', 'web'),
            ],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Permiso creado correctamente.');
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')->where('guard_name', 'web')->ignore($permission->id),
            ],
        ]);

        $permission->update([
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Permiso actualizado correctamente.');
    }

    public function destroy(Permission $permission)
    {
        $protectedPermissions = [
            'manage companies',
            'manage advisors',
            'manage calendars',
            'manage clients',
            'manage appointments',
            'manage roles',
            'manage permissions',
        ];

        if (in_array($permission->name, $protectedPermissions, true)) {
            return back()->with('error', 'Este permiso es del sistema y no se puede eliminar.');
        }

        $permission->delete();

        return redirect()
            ->route('permissions.index')
            ->with('success', 'Permiso eliminado correctamente.');
    }
}
