<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Member extends Model
{
    /** @use HasFactory<\Database\Factories\MemberFactory> */
    use HasFactory;

    protected $table = 'members';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'email',
        'phone_number',
        'secondary_phone_number',
        'birth_date',
        'occupation',
        'photo',
        'permanent_address',
        'temporary_address',
        'baptized_date',
        'membership_date',
        'group_id',
        'church_role',
        'created_by',
        'updated_by',
    ];

    // Automatically set UUID on creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
