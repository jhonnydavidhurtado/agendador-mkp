<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCalendarDayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'day' => [
                'required',
                Rule::in([
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                ]),
                Rule::unique('calendar_days', 'day')
                    ->where(function ($query) {
                        return $query->where(
                            'calendar_id',
                            $this->route('calendar')->id
                        );
                    }),
            ],

            'status' => [
                'boolean',
            ],
        ];
    }
}