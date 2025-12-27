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
        Schema::table('members', function (Blueprint $table) {
            //
            $table->string('permanent_address', 500)->nullable()->change();
            $table->string('temporary_address', 500)->nullable()->change();
            $table->string('phone_number', 20)->nullable()->change();
            $table->string('secondary_phone_number', 20)->nullable()->change();
            $table->string('occupation', 255)->nullable()->change();
            $table->string('photo', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            //
        });
    }
};
