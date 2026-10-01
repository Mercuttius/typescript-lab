import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const attempts = sqliteTable('attempts', {
 id:text('id').primaryKey(), exercise_id:text('exercise_id').notNull(), correct:integer('correct').notNull(),
 created_at:text('created_at').notNull(), day:text('day').notNull(),
}, table=>[index('idx_attempts_exercise').on(table.exercise_id),index('idx_attempts_day').on(table.day)]);
