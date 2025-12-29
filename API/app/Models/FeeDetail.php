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

    public function feeDetails() {
        return $this->hasMany(FeeDetail::class, 'user_id');
    }
}
