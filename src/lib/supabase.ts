import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxiplvfitknezaljxrlz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aXBsdmZpdGtuZXphbGp4cmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDk2NTQsImV4cCI6MjA3MjgyNTY1NH0.BKFso_kIqSgFhnnB9hsNOVdg1VxqGKabMgkZ7CTjQ9A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);