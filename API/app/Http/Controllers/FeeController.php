<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\FeeDetail;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class FeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //


        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'semester' => 'required|string',
                'total_fee' => 'required|integer'
            ]);

            $entity = new Fee();
            $entity->user_id = $validated['user_id'];
            $entity->semester = $validated['semester'];
            $entity->total_fee = $validated['total_fee'];
            $entity->created_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Added Successfully',
                'id' => $entity->id
            ]);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }


    public function create_fee_details(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|string ',
                'semester' => 'required|string',
                'payment_date' => 'required|string',
                'amount' => 'required|numeric'
            ]);

            \Log::info('Payment request received:', $validated);

            // Get user to send email
            $user = User::find($validated['user_id']);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Get user profile to update wallet balance
            $userProfile = UserProfile::where('user_id', $validated['user_id'])->first();

            if (!$userProfile) {
                return response()->json(['error' => 'User profile not found'], 404);
            }

            $currentBalance = floatval($userProfile->fees ?? 0);
            $paymentAmount = floatval($validated['amount']);

            // Check if sufficient balance
            if ($currentBalance < $paymentAmount) {
                return response()->json(['error' => 'Insufficient wallet balance'], 400);
            }

            // Create fee detail record
            $entity = new FeeDetail();
            $entity->user_id = $validated['user_id'];
            $entity->semester = $validated['semester'];
            $entity->amount = $validated['amount'];
            $entity->payment_date = $validated['payment_date'];
            $entity->created_by = 1;
            $entity->save();

            \Log::info('Payment record created:', ['id' => $entity->id, 'amount' => $entity->amount]);

            // Deduct from wallet balance
            $newBalance = $currentBalance - $paymentAmount;
            $userProfile->fees = $newBalance;
            $userProfile->save();

            // Send invoice email to student
            $this->sendInvoiceEmail($user, $entity, $newBalance, $validated['amount']);

            return response()->json([
                'message' => 'Fee Details Added Successfully',
                'id' => $entity->id,
                'new_wallet_balance' => $newBalance
            ]);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'semester' => 'required|string',
                'total_fee' => 'required|integer'
            ]);

            $entity = Fee::findOrFail($validated['id']);
            $entity->user_id = $validated['user_id'] ?? $entity->user_id;
            $entity->semester = $validated['semester'] ?? $entity->semester;
            $entity->total_fee = $validated['total_fee'] ?? $entity->total_fee;
            $entity->updated_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Updated Successfully',
                'id' => $entity->id
            ]);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    public function update_fee_details(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string ',
            'semester' => 'required|string',
            'payment_date' => 'required|string',
            'amount' => 'required|integer'
        ]);

        try {
            $entity = FeeDetail::findOrFail($validated['id']);
            $entity->user_id = $validated['user_id'] ?? $entity->user_id;
            $entity->semester = $validated['semester'] ?? $entity->semester;
            $entity->amount = $validated['amount'] ?? $entity->amount;
            $entity->payment_date = $validated['payment_date'] ?? $entity->payment_date;
            $entity->updated_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Details Added Successfully',
                'id' => $entity->id
            ]);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($user_id)
    {
        try {
            $fees = Fee::where('user_id', $user_id)->get();

            // If no fees found in fees table, create a temporary one with fixed amount
            if ($fees->isEmpty()) {
                $user = User::with('profile')->find($user_id);

                if ($user && $user->profile && $user->profile->semesters) {
                    // Use a FIXED constant for total_fee, NOT the wallet balance
                    // Wallet balance (user_profiles.fees) changes with payments
                    // Total fee should always remain 60000
                    $fixedTotalFee = 60000;

                    // Create a temporary fee record for display
                    $fees = collect([
                        [
                            'user_id' => $user_id,
                            'semester' => $user->profile->semesters,
                            'total_fee' => $fixedTotalFee,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]
                    ]);
                }
            }

            // Calculate amount paid and due for each semester
            $feesWithDetails = $fees->map(function ($fee) use ($user_id) {
                $semester = is_array($fee) ? $fee['semester'] : $fee->semester;
                $totalFee = is_array($fee) ? floatval($fee['total_fee']) : floatval($fee->total_fee);

                // Get total paid for this semester
                $totalPaid = floatval(FeeDetail::where('user_id', $user_id)
                    ->where('semester', $semester)
                    ->sum('amount'));

                $dueAmount = max(0, $totalFee - $totalPaid);

                // Get latest payment date
                $latestPayment = FeeDetail::where('user_id', $user_id)
                    ->where('semester', $semester)
                    ->orderBy('payment_date', 'desc')
                    ->first();

                return [
                    'user_id' => $user_id,
                    'semester' => $semester,
                    'total_fee' => $totalFee,
                    'amount_paid' => $totalPaid,
                    'due_amount' => $dueAmount,
                    'latest_payment_date' => $latestPayment ? $latestPayment->payment_date : null,
                    'status' => $dueAmount <= 0 ? 'Paid' : ($totalPaid > 0 ? 'Partial Payment' : 'Pending')
                ];
            });

            return response()->json([
                'data' => $feesWithDetails
            ], 200);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    public function show_fee_details($user_id)
    {
        try {
            $entity = FeeDetail::where('user_id', $user_id)->get();
            return response()->json([
                'data' => $entity
            ], 200);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {
        try {
            $entity = Fee::findOrFail($id);
            $entity->delete();

            return response()->json([
                'message' => 'Fee Deleted Successfully',
            ], 201);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    public function delete_fee_details($id)
    {
        try {
            $entity = FeeDetail::findOrFail($id);
            $entity->delete();
            return response()->json([
                'message' => 'Fee Details Deleted Successfully',
            ], 201);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    /**
     * Get payment history for all students or filtered by name/semester
     */
    public function getPaymentHistory(Request $request)
    {
        try {
            $query = FeeDetail::with(['user.profile']);

            // Filter by user name if provided
            if ($request->has('name') && $request->name) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->name . '%');
                });
            }

            // Filter by semester if provided
            if ($request->has('semester') && $request->semester) {
                $query->where('semester', $request->semester);
            }

            $payments = $query->orderBy('payment_date', 'desc')->get();

            // Transform data to include user details
            $data = $payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'user_id' => $payment->user_id,
                    'user_name' => $payment->user->name ?? 'Unknown',
                    'semester' => $payment->semester,
                    'amount' => $payment->amount,
                    'payment_date' => $payment->payment_date,
                    'created_at' => $payment->created_at
                ];
            });

            return response()->json([
                'data' => $data
            ], 200);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    /**
     * Get student fee summary with total, paid, and due amounts
     * Returns all students if no filters provided, or filtered results
     */
    public function getStudentFeeSummary(Request $request)
    {
        try {
            // Start with base query for all students
            $query = User::with(['profile'])
                ->whereHas('profile', function ($q) {
                    $q->where('role', 'student');
                });

            // Apply semester filter if provided
            if ($request->has('semester') && $request->semester) {
                $query->whereHas('profile', function ($q) use ($request) {
                    $q->where('semesters', $request->semester);
                });
            }

            // Apply name filter if provided
            if ($request->has('name') && $request->name) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            $students = $query->get();

            $data = $students->map(function ($student) {
                // Get student's current semester
                $semester = $student->profile->semesters ?? '1';

                // Get total fee for this student/semester
                $totalFee = 60000; // Default fixed fee
                $fee = Fee::where('user_id', $student->id)
                    ->where('semester', $semester)
                    ->first();
                if ($fee) {
                    $totalFee = floatval($fee->total_fee);
                }

                // Get total paid for this student/semester
                $totalPaid = floatval(FeeDetail::where('user_id', $student->id)
                    ->where('semester', $semester)
                    ->sum('amount'));

                $dueAmount = max(0, $totalFee - $totalPaid);

                return [
                    'user_id' => $student->id,
                    'user_name' => $student->name,
                    'semester' => $semester,
                    'total_amount' => $totalFee,
                    'amount_paid' => $totalPaid,
                    'due_payment' => $dueAmount
                ];
            });

            return response()->json([
                'data' => $data->values()
            ], 200);

        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    /**
     * Send payment invoice email to student
     */
    private function sendInvoiceEmail($user, $feeDetail, $newWalletBalance, $paidAmount)
    {
        try {
            $studentName = $user->name;
            $studentEmail = $user->email;
            $semester = $feeDetail->semester;
            $paymentDate = $feeDetail->payment_date;
            $transactionId = $feeDetail->id;

            Mail::send([], [], function ($message) use ($studentName, $studentEmail, $semester, $paymentDate, $paidAmount, $newWalletBalance, $transactionId) {
                $message->to($studentEmail)
                    ->subject('Payment Invoice - Fee Payment Successful')
                    ->html("
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;'>
                            <div style='text-align: center; margin-bottom: 30px;'>
                                <h1 style='color: #4f46e5; margin: 0;'>Payment Invoice</h1>
                                <p style='color: #6b7280; margin: 5px 0;'>CMS</p>
                            </div>
                            
                            <div style='background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;'>
                                <h2 style='color: #111827; margin-top: 0;'>Dear {$studentName},</h2>
                                <p style='color: #374151;'>Your fee payment has been successfully processed. Below are the transaction details:</p>
                            </div>
                            
                            <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Transaction ID:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;'>{$transactionId}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Student Name:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;'>{$studentName}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Semester:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;'>{$semester}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Payment Date:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;'>{$paymentDate}</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Amount Paid:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #10b981; font-weight: 700; font-size: 18px;'>₹" . number_format($paidAmount, 2) . "</td>
                                </tr>
                                <tr>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-weight: 600;'>Remaining Wallet Balance:</td>
                                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;'>₹" . number_format($newWalletBalance, 2) . "</td>
                                </tr>
                            </table>
                            
                            <div style='background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;'>
                                <p style='margin: 0; color: #065f46; font-weight: 600;'>✓ Payment Successful</p>
                                <p style='margin: 5px 0 0 0; color: #047857; font-size: 14px;'>Your payment has been recorded in our system.</p>
                            </div>
                            
                            <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;'>
                                <p style='color: #6b7280; font-size: 12px; margin: 5px 0;'>This is an automated email. Please do not reply.</p>
                                <p style='color: #6b7280; font-size: 12px; margin: 5px 0;'>For any queries, contact the administration office.</p>
                            </div>
                        </div>
                    ");
            });
        } catch (\Exception $e) {
            // Log error but don't fail the payment
            \Log::error('Failed to send invoice email: ' . $e->getMessage());
        }
    }
}
