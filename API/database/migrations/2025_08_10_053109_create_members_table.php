<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name', 255);
            $table->string('middle_name', 255);
            $table->string('last_name', 255);
            $table->string('gender', 10);
            $table->string('email', 50)->nullable();
            $table->string('phone_number', 15);
            $table->string('secondary_phone_number', 15)->nullable();
            $table->string('birth_date', 10);
            $table->string('occupation', 50)->nullable();
            $table->string('photo', 50)->nullable();
            $table->string('permanent_address', 50)->nullable();
            $table->string('temporary_address', 50)->nullable();
            $table->string('baptized_date', 10)->nullable();
            $table->string('membership_date', 10)->nullable();
            $table->integer('group_id');
            $table->integer('church_role');
            $table->bigInteger('created_by');
            $table->bigInteger('updated_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
