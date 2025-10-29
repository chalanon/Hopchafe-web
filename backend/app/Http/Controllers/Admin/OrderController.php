<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Kreait\Firebase\Contract\Database;

class OrderController extends Controller
{
    protected $database;

    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    public function index()
    {
        $orders = $this->database->getReference('orders')->getValue() ?? [];
        return view('admin.orders.index', compact('orders'));
    }

    public function show($id)
    {
        $order = $this->database->getReference('orders/' . $id)->getValue();
        if (!$order) {
            return redirect()->route('admin.orders.index')->with('error', 'Order not found');
        }
        return view('admin.orders.show', compact('order'));
    }

    public function updateStatus(Request $request, $id)
    {
        $order = $this->database->getReference('orders/' . $id);
        $order->update([
            'status' => $request->status,
            'updated_at' => now()->toDateTimeString()
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully');
    }
}