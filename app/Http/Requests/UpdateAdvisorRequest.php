<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdvisorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'company_id' => [
                'required',
                'exists:companies,id',
            ],

            'user_id' => [
                'required',
                'exists:users,id',
            ],

            'photo' => [
                'nullable',
                'string',
            ],

            'profession' => [
                'nullable',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'status' => [
                'boolean',
            ],
        ];
    }
}