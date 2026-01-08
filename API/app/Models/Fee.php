<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fee extends Model
{
    //
    protected $fillable = [
        'user_id',
        'semester',
        'total_fee',
        'created_by',
        'updated_by'
    ];

    /**
     * Relationship: Fee belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Fee has many FeeDetails (payments)
     */
    public function feeDetails()
    {
        return $this->hasMany(FeeDetail::class, 'user_id', 'user_id')
                    ->where('semester', $this->semester);
    }
}
