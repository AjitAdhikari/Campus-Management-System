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
        // Schema::table('inventories', function (Blueprint $table) {
        //     //
        //     $table->unsignedBigInteger('created_by')->nullable()->after('image_url');
        //     $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
        //     $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        //     $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        // });

        // Schema::table('members', function (Blueprint $table) {
        //     //
        //     $table->unsignedBigInteger('created_by')->nullable();
        //     $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
        //     $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        //     $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        // });



        Schema::table('expenses', function (Blueprint $table) {
            //
            $table->unsignedBigInteger('created_by')->nullable()->after('amount');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('incomes', function (Blueprint $table) {
            //
            $table->unsignedBigInteger('created_by')->nullable()->after('amount');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            //
        });
    }
};
