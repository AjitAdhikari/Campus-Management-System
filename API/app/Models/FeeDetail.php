<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeDetail extends Model
{
    //
    protected $fillable = [
        'user_id',
        'semester',
        'payment_date',
        'amount',
        'created_by',
        'updated_by'
    ];

     /**
     * Relationship: FeeDetail belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: FeeDetail belongs to Fee (total fee record)
     */
    public function fee()
    {
        return $this->belongsTo(Fee::class, 'user_id', 'user_id')
                    ->where('semester', $this->semester);
    }
}
