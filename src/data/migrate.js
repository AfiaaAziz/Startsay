import { createClient } from '@supabase/supabase-js';

// Supabase credentials (use your actual values)
const SUPABASE_URL = 'https://xxmgeiyhcnmkhlxyrjej.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bWdlaXloY25ta2hseHlyamVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4Mjk1NSwiZXhwIjoyMDg1MTU4OTU1fQ.Lcfl2TT1th7dV43_eTqgieHrWjFox4yd50ghHv3es60'; // Use service key for admin operations

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample data structure - replace with your Webflow export
const projectsData = [
  {
    slug: 'sample-project-1',
    title: 'Sample Campaign',
    client: 'Sample Client',
    year: '2024',
    category: 'Campaign Film',
    description: 'This is a sample project description.',
    hero_image_url: 'https://example.com/hero.jpg',
    hero_video_url: 'https://example.com/hero-video.mp4',
    index_video_url: 'https://example.com/index-video.mp4',
    is_active: true,
    display_order: 0,
    gallery_images: [
      'https://example.com/gallery1.jpg',
      'https://example.com/gallery2.jpg',
      'https://example.com/gallery3.jpg',
    ],
  },
  // Add more projects here...
];

async function migrateProjects() {
  console.log('Starting migration...');
  
  for (let i = 0; i < projectsData.length; i++) {
    const project = projectsData[i];
    
    try {
      // 1. Insert project
      console.log(`Migrating project: ${project.title}`);
      
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert([{
          slug: project.slug,
          title: project.title,
          client: project.client,
          year: project.year,
          category: project.category || null,
          description: project.description || null,
          hero_image_url: project.hero_image_url || null,
          hero_video_url: project.hero_video_url || null,
          index_video_url: project.index_video_url || null,
          is_active: project.is_active !== false,
          display_order: project.display_order || i,
        }])
        .select()
        .single();

      if (projectError) {
        console.error(`Error inserting project ${project.title}:`, projectError);
        continue;
      }

      console.log(`✓ Project created: ${newProject.title}`);

      // 2. Insert gallery images if any
      if (project.gallery_images && project.gallery_images.length > 0) {
        const galleryData = project.gallery_images.map((imageUrl, index) => ({
          project_id: newProject.id,
          image_url: imageUrl,
          display_order: index,
        }));

        const { error: galleryError } = await supabase
          .from('project_gallery')
          .insert(galleryData);

        if (galleryError) {
          console.error(`Error inserting gallery for ${project.title}:`, galleryError);
        } else {
          console.log(`✓ Gallery images added: ${project.gallery_images.length}`);
        }
      }

    } catch (error) {
      console.error(`Error processing project ${project.title}:`, error);
    }
  }

  console.log('Migration complete!');
}

async function migrateHomeSettings() {
  console.log('Migrating home page settings...');

  const homeSettings = {
    showreel_video_url: 'https://example.com/showreel.mp4',
    showreel_poster_url: 'https://example.com/showreel-poster.jpg',
  };

  try {
    const { error } = await supabase
      .from('home_page_settings')
      .update(homeSettings)
      .eq('id', '00000000-0000-0000-0000-000000000001');

    if (error) {
      console.error('Error updating home settings:', error);
    } else {
      console.log('✓ Home page settings updated');
    }
  } catch (error) {
    console.error('Error migrating home settings:', error);
  }
}

async function migrateFeaturedProjects() {
  console.log('Migrating featured projects...');

  // Get all projects first
  const { data: projects, error: fetchError } = await supabase
    .from('projects')
    .select('id, slug')
    .order('display_order');

  if (fetchError) {
    console.error('Error fetching projects:', fetchError);
    return;
  }

  // Select first 8 projects as featured (or specify slugs manually)
  const featuredSlugs = [
    'sample-project-1',
    // Add more project slugs here...
  ];

  const featuredData = featuredSlugs.map((slug, index) => {
    const project = projects.find(p => p.slug === slug);
    if (!project) return null;
    
    return {
      project_id: project.id,
      display_order: index,
    };
  }).filter(Boolean);

  if (featuredData.length > 0) {
    const { error } = await supabase
      .from('featured_projects')
      .insert(featuredData);

    if (error) {
      console.error('Error inserting featured projects:', error);
    } else {
      console.log(`✓ Featured projects added: ${featuredData.length}`);
    }
  }
}

// Run migration
async function runMigration() {
  console.log('='.repeat(50));
  console.log('STYLEFRAME CMS - DATA MIGRATION');
  console.log('='.repeat(50));
  console.log('');

  await migrateProjects();
  console.log('');
  await migrateHomeSettings();
  console.log('');
  await migrateFeaturedProjects();
  console.log('');
  
  console.log('='.repeat(50));
  console.log('MIGRATION COMPLETE!');
  console.log('='.repeat(50));
}


export { migrateProjects, migrateHomeSettings, migrateFeaturedProjects };