<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Database;

class DashboardController extends Controller
{
    protected $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    public function index()
    {
        // Get recent orders
        $orders = $this->database->getReference('orders')
            ->orderByChild('created_at')
            ->limitToLast(5)
            ->getValue();

        // Get total orders count
        $totalOrders = count($this->database->getReference('orders')->getValue() ?? []);

        // Get total users count
        $totalUsers = count($this->database->getReference('users')->getValue() ?? []);

        return view('admin.dashboard', compact('orders', 'totalOrders', 'totalUsers'));
    }
}