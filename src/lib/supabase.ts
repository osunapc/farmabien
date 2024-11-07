import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	"https://pauoqbnvqbjrygrsbonc.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhdW9xYm52cWJqcnlncnNib25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1ODcwNzcsImV4cCI6MjA0NjE2MzA3N30.4IsFtyIfYsH_llYts__C5gyzod6Hy_KIAGDcrwue4dY"
);
