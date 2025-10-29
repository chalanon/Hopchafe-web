<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Details - Hopchafe Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <img src="https://play-lh.googleusercontent.com/zEe6Ugn1OoFIeP0bYbzqcnP_f0-5HkaYDfwqpMFfBV7Mz0u93XpKUklXXr6ed4uSx7Q" 
                                 alt="Hopchafe Logo" 
                                 class="h-8 w-8">
                        </div>
                        <div class="ml-6 flex space-x-8">
                            <a href="{{ route('admin.dashboard') }}" 
                               class="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="{{ route('admin.orders.index') }}" 
                               class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                                Orders
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="py-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Order Details -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                            Order Details
                        </h3>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Order ID
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ $order['id'] }}
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Customer Name
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ $order['customerName'] }}
                                </dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <form action="{{ route('admin.orders.update-status', $order['id']) }}" method="POST" class="flex items-center space-x-4">
                                        @csrf
                                        <select name="status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                            <option value="pending" {{ $order['status'] === 'pending' ? 'selected' : '' }}>Pending</option>
                                            <option value="processing" {{ $order['status'] === 'processing' ? 'selected' : '' }}>Processing</option>
                                            <option value="completed" {{ $order['status'] === 'completed' ? 'selected' : '' }}>Completed</option>
                                            <option value="cancelled" {{ $order['status'] === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                                        </select>
                                        <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Update Status
                                        </button>
                                    </form>
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Items
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                                        @foreach($order['items'] as $item)
                                            <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                <div class="w-0 flex-1 flex items-center">
                                                    <span class="ml-2 flex-1 w-0 truncate">
                                                        {{ $item['name'] }} x {{ $item['quantity'] }}
                                                    </span>
                                                </div>
                                                <div class="ml-4 flex-shrink-0">
                                                    ฿{{ number_format($item['price'] * $item['quantity'], 2) }}
                                                </div>
                                            </li>
                                        @endforeach
                                    </ul>
                                </dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Total
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    ฿{{ number_format($order['total'], 2) }}
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Created At
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ $order['created_at'] }}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="mt-4">
                    <a href="{{ route('admin.orders.index') }}" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Back to Orders
                    </a>
                </div>
            </div>
        </main>
    </div>
</body>
</html>