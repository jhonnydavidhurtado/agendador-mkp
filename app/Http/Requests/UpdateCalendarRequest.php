<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCalendarRequest extends FormRequest
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

            'advisor_id' => [
                'required',
                'exists:advisors,id',
            ],

            'status' => [
                'boolean',
            ],

        ];
    }
}