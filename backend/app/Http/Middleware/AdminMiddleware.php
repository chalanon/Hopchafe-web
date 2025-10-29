<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Database;

class AdminMiddleware
{
    protected $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        if (!$user) {
            return redirect('/login');
        }

        // ตรวจสอบ role จาก Firebase
        $userRole = $this->database->getReference('users/' . $user->uid . '/role')->getValue();
        
        if ($userRole !== 'admin' && $userRole !== 'ผู้ดูแลร้าน') {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}