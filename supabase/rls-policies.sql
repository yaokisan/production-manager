-- RLS Policies for Production Manager

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Projects table policies
CREATE POLICY "Authenticated users can view all projects" ON public.projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects" ON public.projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects" ON public.projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Videos table policies
CREATE POLICY "Authenticated users can view all videos" ON public.videos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create videos" ON public.videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos" ON public.videos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" ON public.videos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Production steps policies
CREATE POLICY "Authenticated users can view all production steps" ON public.production_steps
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create production steps" ON public.production_steps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update production steps" ON public.production_steps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete production steps" ON public.production_steps
  FOR DELETE USING (auth.role() = 'authenticated');

-- Feedback items policies
CREATE POLICY "Authenticated users can view all feedback items" ON public.feedback_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create feedback items" ON public.feedback_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update feedback items" ON public.feedback_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete feedback items" ON public.feedback_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Comments policies
CREATE POLICY "Authenticated users can view all comments" ON public.comments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);