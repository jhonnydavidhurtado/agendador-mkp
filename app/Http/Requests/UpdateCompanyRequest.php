<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'name' => ['required', 'string', 'max:255'],

            'nit' => ['nullable', 'string', 'max:100'],

            'email' => [

                'required',

                'email',

                'max:255',

                Rule::unique('companies', 'email')
                    ->ignore($this->company),

            ],

            'phone' => ['nullable', 'string', 'max:50'],

            'address' => ['nullable', 'string', 'max:255'],

            'city' => ['nullable', 'string', 'max:100'],

            'country' => ['nullable', 'string', 'max:100'],

            'logo' => ['nullable', 'image', 'max:2048'],

            'cover' => ['nullable', 'image', 'max:4096'],

            'status' => ['boolean'],

        ];
    }
}