<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Http\Requests\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    // POST: Create Incomes
    public function create(Request $request)
    {
        try {
            if (empty($request->income) || empty($request->date)) {
                return response()->json("Nothing found");
            }

            foreach ($request->income as $income) {
                Income::create([
                    'category'     => $income['category'] ?? null,
                    'amount'       => $income['amount'] ?? 0,
                    'income_date'  => $request->date,
                    'member_id'    => $income['member_id'] ?? null,
                    'description'  => $income['description'] ?? null,
                    'created_by'   => Auth::id(),
                ]);
            }

            return response()->json(['message' => 'Created successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // PUT: Update Incomes
    public function update(Request $request)
    {
        if (empty($request->income) || empty($request->date)) {
            return response()->json("Invalid Input Data", 400);
        }

        try {
            foreach ($request->income as $income) {
                $incomeModel = Income::find($income['id']);
                if ($incomeModel) {
                    $incomeModel->update([
                        'category'     => $income['category'] ?? null,
                        'amount'       => $income['amount'] ?? 0,
                        'income_date'  => $request->date,
                        'member_id'    => $income['member_id'] ?? null,
                        'description'  => $income['description'] ?? null,
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
    public function delete($incomeDate)
    {
        if (empty($incomeDate)) {
            return response()->json("Income Date is not selected", 400);
        }

        try {
            Income::where('income_date', $incomeDate)->delete();
            return response()->json(['message' => 'Deleted successfully']);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    // GET: Get by date
    public function get($incomeDate)
    {
        if (empty($incomeDate)) {
            return response()->json("Income Date is not selected", 400);
        }

        try {
            $data = Income::where('income_date', $incomeDate)->get();
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

        $data = Income::whereBetween('income_date', [$startDate, $endDate])->get();

        return response()->json($data);
    }

    // GET: Total Income Count
    public function total(Request $request)
    {
        $date = Carbon::now();
        $firstDayOfMonth = $date->copy()->startOfMonth()->format('Y-m-d');
        $lastDayOfMonth  = $date->copy()->endOfMonth()->format('Y-m-d');

        $startDate = $request->query('start_date', $firstDayOfMonth);
        $endDate   = $request->query('end_date', $lastDayOfMonth);

        $total = Income::whereBetween('income_date', [$startDate, $endDate])->sum('amount');

        return response()->json(['total_income' => $total]);
    }
}
