<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tags', function (Blueprint $table): void {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
        });

        $legacyTagCount = DB::table('tags')->whereNull('user_id')->count();
        if ($legacyTagCount > 0) {
            $userIds = DB::table('users')->pluck('id');

            if ($userIds->count() !== 1) {
                throw new RuntimeException(
                    'Cannot scope legacy tags automatically: resolve tag ownership and rerun this migration.',
                );
            }

            DB::table('tags')->whereNull('user_id')->update(['user_id' => $userIds->first()]);
        }

        DB::statement('ALTER TABLE tags ALTER COLUMN user_id SET NOT NULL');
    }

    public function down(): void
    {
        Schema::table('tags', function (Blueprint $table): void {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
