<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanySetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanySettingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperUsuario = $user->hasRole('Super Usuario');
        $companies = Company::query()
            ->when(!$isSuperUsuario, fn ($query) => $query->whereKey($user->company_id))
            ->orderBy('name')
            ->get(['id', 'name']);

        $companyId = (int) ($request->input('company_id') ?: $companies->first()?->id);
        $company = $companies->firstWhere('id', $companyId);
        $settings = $company
            ? CompanySetting::firstOrCreate(
                ['company_id' => $company->id],
                $this->defaultSettings()
            )
            : null;

        return Inertia::render('Settings/Index', [
            'companies' => $companies,
            'selectedCompany' => $company?->only(['id', 'name']),
            'settings' => $settings?->toArray() ?? $this->defaultSettings(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isSuperUsuario = $user->hasRole('Super Usuario');

        $validated = $request->validate([
            'company_id' => [
                'required',
                'integer',
                Rule::exists('companies', 'id'),
            ],
            'timezone' => ['required', 'string', 'max:100'],
            'currency' => ['required', 'string', 'max:10'],
            'language' => ['required', 'string', 'max:10'],
            'appointment_interval' => ['required', 'integer', 'in:15,30,45,60,90,120'],
            'start_week' => ['required', 'in:monday,sunday'],
            'primary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'notifications' => ['boolean'],
        ]);

        if (!$isSuperUsuario && (int) $validated['company_id'] !== (int) $user->company_id) {
            abort(403, 'No tienes permiso para modificar esta configuración.');
        }

        CompanySetting::updateOrCreate(
            ['company_id' => $validated['company_id']],
            collect($validated)->except('company_id')->all()
        );

        return redirect()
            ->route('settings.index', ['company_id' => $validated['company_id']])
            ->with('success', 'Configuración guardada correctamente.');
    }

    private function defaultSettings(): array
    {
        return [
            'timezone' => 'America/Bogota',
            'currency' => 'COP',
            'language' => 'es',
            'appointment_interval' => 30,
            'start_week' => 'monday',
            'primary_color' => '#0d6efd',
            'secondary_color' => '#6c757d',
            'notifications' => true,
        ];
    }
}
