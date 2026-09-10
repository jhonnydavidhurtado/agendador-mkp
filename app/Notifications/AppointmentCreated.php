<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCreated extends Notification
{
    use Queueable;

    public function __construct(
        public Appointment $appointment
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'company_id' => $this->appointment->company_id,
            'advisor_id' => $this->appointment->advisor_id,
            'client_id' => $this->appointment->client_id,
            'service_id' => $this->appointment->service_id,
            'date' => $this->appointment->date?->format('Y-m-d'),
            'hour' => $this->appointment->hour,
            'status' => $this->appointment->status,
            'message' => 'Se ha creado una nueva cita.',
        ];
    }
}