<?php

namespace App\Http\Controllers;

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
        $orders = $this->database->getReference('orders')->getValue();
        return view('admin.orders.index', ['orders' => $orders]);
    }

    public function show($id)
    {
        $order = $this->database->getReference('orders/' . $id)->getValue();
        return view('admin.orders.show', ['order' => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = $this->database->getReference('orders/' . $id);
        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Order updated successfully');
    }
}