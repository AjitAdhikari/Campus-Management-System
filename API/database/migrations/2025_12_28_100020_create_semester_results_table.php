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
          Schema::create('semester_results', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('student_id')->constrained('users')->cascadeOnDelete();
            $table->integer('semester');
            $table->decimal('gpa', 3, 2);
            $table->string('result_pdf')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->unique(['student_id', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester_results');
    }
};
