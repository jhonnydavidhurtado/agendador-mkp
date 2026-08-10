<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@mkp.com')->first();

        Company::updateOrCreate(
            [
                'email' => 'empresa@mkp.com',
            ],
            [
                'name'       => 'MKP Solutions',
                'nit'        => '901234567',
                'phone'      => '3001234567',
                'address'    => 'Calle 100 #20-30',
                'city'       => 'Medellín',
                'country'    => 'Colombia',
                'logo'       => null,
                'cover'      => null,
                'status'     => true,
                'created_by' => $admin?->id,
            ]
        );

        $company = Company::where('email', 'empresa@mkp.com')->first();

        User::whereIn('email', [
            'admin@mkp.com',
            'juan@mkp.com',
        ])->update([
            'company_id' => $company->id,
        ]);
    }
}