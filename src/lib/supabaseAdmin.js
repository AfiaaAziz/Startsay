
import { supabase } from './supabase';


export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
};

export const fetchProjectBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_gallery(*)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const reorderProjects = async (projects) => {
  const updates = projects.map((project, index) => 
    supabase
      .from('projects')
      .update({ display_order: index })
      .eq('id', project.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter(r => r.error);
  
  if (errors.length > 0) throw errors[0].error;
};

// ============================================
// PROJECT GALLERY
// ============================================

export const fetchGalleryImages = async (projectId) => {
  const { data, error } = await supabase
    .from('project_gallery')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
};

export const addGalleryImage = async (projectId, imageUrl, displayOrder) => {
  const { data, error } = await supabase
    .from('project_gallery')
    .insert([{
      project_id: projectId,
      image_url: imageUrl,
      display_order: displayOrder,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGalleryImage = async (id) => {
  const { error } = await supabase
    .from('project_gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const reorderGalleryImages = async (images) => {
  const updates = images.map((image, index) => 
    supabase
      .from('project_gallery')
      .update({ display_order: index })
      .eq('id', image.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter(r => r.error);
  
  if (errors.length > 0) throw errors[0].error;
};

// ============================================
// HOME PAGE SETTINGS
// ============================================

export const fetchHomePageSettings = async () => {
  const { data, error } = await supabase
    .from('home_page_settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const updateHomePageSettings = async (settings) => {
  const { data, error } = await supabase
    .from('home_page_settings')
    .update(settings)
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const fetchFeaturedProjects = async () => {
  const { data, error } = await supabase
    .from('featured_projects')
    .select('*, projects(*)')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
};

export const addFeaturedProject = async (projectId, displayOrder) => {
  const { data, error } = await supabase
    .from('featured_projects')
    .insert([{
      project_id: projectId,
      display_order: displayOrder,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFeaturedProject = async (id) => {
  const { error } = await supabase
    .from('featured_projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const reorderFeaturedProjects = async (featuredProjects) => {
  const updates = featuredProjects.map((fp, index) => 
    supabase
      .from('featured_projects')
      .update({ display_order: index })
      .eq('id', fp.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter(r => r.error);
  
  if (errors.length > 0) throw errors[0].error;
};



export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

export const listFiles = async (bucket, path = '') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) throw error;
  return data;
};