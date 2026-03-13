
-- Create analyses table
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  quality_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  line INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'bug',
  severity TEXT NOT NULL DEFAULT 'warning',
  description TEXT NOT NULL,
  fix TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Analyses policies
CREATE POLICY "Users can view own analyses" ON public.analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON public.analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON public.analyses FOR DELETE USING (auth.uid() = user_id);

-- Issues policies (via analysis ownership)
CREATE POLICY "Users can view issues of own analyses" ON public.issues FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.analyses WHERE analyses.id = issues.analysis_id AND analyses.user_id = auth.uid()));
CREATE POLICY "Users can insert issues for own analyses" ON public.issues FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.analyses WHERE analyses.id = issues.analysis_id AND analyses.user_id = auth.uid()));
CREATE POLICY "Users can delete issues of own analyses" ON public.issues FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.analyses WHERE analyses.id = issues.analysis_id AND analyses.user_id = auth.uid()));
