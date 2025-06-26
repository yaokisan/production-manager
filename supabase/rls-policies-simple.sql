-- まず既存のポリシーを削除（エラーが出ても無視してOK）
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- シンプルなポリシーを作成
-- すべての認証済みユーザーがすべての操作を実行可能
CREATE POLICY "Enable all for authenticated users" ON public.projects
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 同様に他のテーブルにも適用
-- Videos
DROP POLICY IF EXISTS "Authenticated users can view all videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated users can create videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON public.videos;

CREATE POLICY "Enable all for authenticated users" ON public.videos
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Production steps
CREATE POLICY "Enable all for authenticated users" ON public.production_steps
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Feedback items  
CREATE POLICY "Enable all for authenticated users" ON public.feedback_items
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Comments
CREATE POLICY "Enable all for authenticated users" ON public.comments
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');