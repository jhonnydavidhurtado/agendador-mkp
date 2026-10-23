<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppointmentActivity extends Notification
{
    use Queueable;

    public function __construct(
        public Appointment $appointment,
        public string $event
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $messages = [
            'created' => 'Se creó una nueva cita.',
            'updated' => 'Se actualizó una cita.',
            'cancelled' => 'Se canceló una cita.',
            'deleted' => 'Se eliminó una cita.',
        ];

        return [
            'event' => $this->event,
            'appointment_id' => $this->appointment->id,
            'company' => $this->appointment->company?->name,
            'advisor' => $this->appointment->advisor?->user?->name,
            'client' => $this->appointment->client?->name,
            'service' => $this->appointment->service?->name,
            'date' => $this->appointment->date?->format('Y-m-d'),
            'hour' => substr((string) $this->appointment->hour, 0, 5),
            'status' => $this->appointment->status,
            'message' => $messages[$this->event] ?? 'Se modificó una cita.',
        ];
    }
}
