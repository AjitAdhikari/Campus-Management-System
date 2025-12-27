<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
     // POST: Create Expenses
    public function create(Request $request)
    {
        try {
            if (empty($request->expense) || empty($request->date)) {
                return response()->json("Nothing found");
            }

            foreach ($request->expense as $expense) {
                Expense::create([
                    'category'     => $expense['category'] ?? null,
                    'amount'       => $expense['amount'] ?? 0,
                    'expense_date' => $request->date,
                    'description'  => $expense['description'] ?? null,
                    'created_by'   => Auth::id(),
                ]);
            }

            return response()->json(['message' => 'Created successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Expenses
    public function update(Request $request)
    {
        if (empty($request->expense) || empty($request->date)) {
            return response()->json("Invalid Input Data", 400);
        }

        try {
            foreach ($request->expense as $expense) {
                $expenseModel = Expense::find($expense['id']);
                if ($expenseModel) {
                    $expenseModel->update([
                        'category'     => $expense['category'] ?? null,
                        'amount'       => $expense['amount'] ?? 0,
                        'expense_date' => $request->date,
                        'description'  => $expense['description'] ?? null,
                        'updated_by'   => Auth::id(),
                        'updated_at'   => now(),
                    ]);
                }
            }

            return response()->json(['message' => 'Updated successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // DELETE: Delete by date
    public function delete($expenseDate)
    {
        if (empty($expenseDate)) {
            return response()->json("Expense Date is not selected", 400);
        }

        try {
            Expense::where('expense_date', $expenseDate)->delete();
            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Get by date
    public function get($expenseDate)
    {
        if (empty($expenseDate)) {
            return response()->json("Expense Date is not selected", 400);
        }

        try {
            $data = Expense::where('expense_date', $expenseDate)->get();
            return response()->json($data);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: List with filter
    public function list(Request $request)
    {
        $date = Carbon::now();
        $firstDayOfMonth = $date->copy()->startOfMonth()->format('Y-m-d');
        $lastDayOfMonth  = $date->copy()->endOfMonth()->format('Y-m-d');

        $startDate = $request->query('start_date', $firstDayOfMonth);
        $endDate   = $request->query('end_date', $lastDayOfMonth);

        $data = Expense::whereBetween('expense_date', [$startDate, $endDate])->get();

        return response()->json($data);
    }

    // GET: Total Expense Data (sum)
    public function total(Request $request)
    {
        $date = Carbon::now();
        $firstDayOfMonth = $date->copy()->startOfMonth()->format('Y-m-d');
        $lastDayOfMonth  = $date->copy()->endOfMonth()->format('Y-m-d');

        $startDate = $request->query('start_date', $firstDayOfMonth);
        $endDate   = $request->query('end_date', $lastDayOfMonth);

        $total = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');

        return response()->json(['total_expense' => $total]);
    }
}
