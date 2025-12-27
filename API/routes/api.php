<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;

Route::prefix('inventories')->group(function () {
    Route::post('/', [InventoryController::class, 'create']);
    Route::post('/{id}', [InventoryController::class, 'store']);
    Route::delete('/{id}', [InventoryController::class, 'destroy']);
    Route::get('/{id}', [InventoryController::class, 'get']);
    Route::get('/', [InventoryController::class, 'index']);
});

Route::prefix('members')->group(function () {
    Route::post('/', [MemberController::class, 'create']);
    Route::post('/{id}', [MemberController::class, 'store']);
    Route::get('/', [MemberController::class, 'index']);
    Route::delete('/{id}', [MemberController::class, 'destroy']);
    Route::get('/{id}', [MemberController::class, 'get']);
    Route::get('/active-member', [MemberController::class, 'list_active_members']);
});

Route::prefix('documents')->group(function () {
    Route::post('/', [DocumentController::class, 'create']);
    Route::put('/', [DocumentController::class, 'store']);
    Route::delete('/{id}', [DocumentController::class, 'destroy']);
    Route::get('/{id}', [DocumentController::class, 'get']);
    Route::get('/download/{id}', [DocumentController::class, 'download']);
    Route::get('/', [DocumentController::class, 'index']);
});

Route::prefix('expenses')->group(function () {
    Route::post('/', [ExpenseController::class, 'create']);
    Route::put('/', [ExpenseController::class, 'store']);
    Route::delete('/{expenseDate}', [ExpenseController::class, 'destroy']);
    Route::get('/{expenseDate}', [ExpenseController::class, 'get']);
    Route::get('/', [ExpenseController::class, 'index']);
    Route::get('/total-expense', [ExpenseController::class, 'total']);
});

Route::prefix('incomes')->group(function () {
    Route::post('/', [IncomeController::class, 'create']);
    Route::put('/', [IncomeController::class, 'store']);
    Route::delete('/{incomeDate}', [IncomeController::class, 'destroy']);
    Route::get('/{incomeDate}', [IncomeController::class, 'get']);
    Route::get('/', [IncomeController::class, 'index']);
    Route::get('/total-income', [IncomeController::class, 'total']);
});
