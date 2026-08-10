<?php


use App\Http\Controllers\AdvisorController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ClientController;   
use App\Http\Controllers\ServiceController; 
use App\Http\Controllers\CalendarController;   
use App\Http\Controllers\CalendarDayController;
use App\Http\Controllers\CalendarHourController;  

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

    Route::resource('companies', CompanyController::class);

    Route::resource('advisors', AdvisorController::class);

    Route::resource('clients', ClientController::class);
    
    Route::resource('services', ServiceController::class);
    
    Route::resource('calendars', CalendarController::class);

    Route::resource(
        'calendars.days',
        CalendarDayController::class
    );
    
    Route::resource(
        'calendar-days.hours',
        CalendarHourController::class
    );


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});