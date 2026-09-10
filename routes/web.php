<?php

use App\Http\Controllers\AdvisorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CalendarDayController;
use App\Http\Controllers\CalendarHourController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Empresas
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage companies')->group(function () {
        Route::resource('companies', CompanyController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Asesores
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage advisors')->group(function () {
        Route::resource('advisors', AdvisorController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Clientes
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage clients')->group(function () {
        Route::resource('clients', ClientController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Servicios
    |--------------------------------------------------------------------------
    | Por ahora solamente Super Usuario y Manager.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:Super Usuario|Manager')->group(function () {
        Route::resource('services', ServiceController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Calendarios
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage calendars')->group(function () {

        Route::resource('calendars', CalendarController::class);

        Route::resource(
            'calendars.days',
            CalendarDayController::class
        );

        Route::resource(
            'calendar-days.hours',
            CalendarHourController::class
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Citas
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage appointments')->group(function () {
        Route::resource('appointments', AppointmentController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Reportes
    |--------------------------------------------------------------------------
    */
    Route::middleware('permission:manage appointments')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])
            ->name('reports.index');
    });

    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */
    Route::get('/settings', [CompanySettingController::class, 'index'])
        ->name('settings.index');
    Route::patch('/settings', [CompanySettingController::class, 'update'])
        ->name('settings.update');

    /*
    |--------------------------------------------------------------------------
    | Managers
    |--------------------------------------------------------------------------
    | Solamente Super Usuario
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:Super Usuario|Super Admin')->group(function () {
        Route::resource('managers', ManagerController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Roles y permisos
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:Super Usuario|Super Admin')->group(function () {
        Route::resource('users', UserController::class);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])
            ->name('users.assignRole');
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | Perfil
    |--------------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Notificaciones
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->name('notifications.read');

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    )->name('notifications.readAll');
});