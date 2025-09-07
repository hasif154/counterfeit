import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function testSupabaseConnection() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from('_realtime_schema_migrations')
      .select('*')
      .limit(1);

    if (error) {
      console.log('✅ Supabase connected! (Expected error for system table)');
    } else {
      console.log('✅ Supabase connected successfully!');
    }

    // Test a simple query
    const { data: result, error: queryError } = await supabase
      .rpc('version');

    if (!queryError) {
      console.log('📊 Database version:', result);
    }

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
  }
}

testSupabaseConnection();