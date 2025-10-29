<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Contract\Database;

class FirebaseServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('firebase.database', function ($app) {
            $factory = (new Factory)
                ->withServiceAccount(storage_path('app/firebase_credentials.json'))
                ->withDatabaseUri(config('services.firebase.database_url'));

            return $factory->createDatabase();
        });
    }

    public function provides()
    {
        return ['firebase.database'];
    }
}