<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    /** @use HasFactory<\Database\Factories\IncomeFactory> */
    use HasFactory;

    protected $fillable = [
        'category',
        'amount',
        'income_date',
        'member_id',
        'description',
    ];

    // Relationship with Member
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
