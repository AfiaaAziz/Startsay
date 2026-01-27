# Project Pages Structure Plan

## Overview

Create a dynamic project page system for 8 projects with the following URLs:

1. `/project/mars`
2. `/project/teenage-engineering`
3. `/project/innovation-lab`
4. `/project/beats-n-buckets`
5. `/project/moncler-grenoble`
6. `/project/13-11`
7. `/project/we-are-rewind`
8. `/project/hatton-labs-x-ap`

## Implementation Steps - COMPLETED ✅

### Step 1: Create Project Data File ✅

- Created `src/data/projects.js`
- Defined centralized data for all 8 projects with:
  - slug (URL identifier)
  - title (display name)
  - client name
  - hero image URL
  - gallery images
  - project description
  - year
  - category

### Step 2: Create Reusable Project Page Component ✅

- Created `src/pages/ProjectPage.jsx`
- Uses useParams() to get project slug from URL
- Finds project data based on slug
- Displays hero, info, gallery sections
- Handles 404 for invalid slugs
- Includes navigation to previous/next projects

### Step 3: Update App.jsx Routes ✅

- Added dynamic route: `<Route path="/project/:projectSlug" element={<ProjectPage />} />`

### Step 4: Update Homepage Links ✅

- All 8 project links on homepage already point to correct URLs:
  - Oakley → `/project/mars`
  - Teenage Engineering → `/project/teenage-engineering`
  - Ray-Ban → `/project/innovation-lab`
  - Samsung → `/project/beats-n-buckets`
  - Moncler → `/project/moncler-grenoble`
  - Oakley (2nd) → `/project/13-11`
  - We Are Rewind → `/project/we-are-rewind`
  - Hatton Labs → `/project/hatton-labs-x-ap`

### Step 5: Create Project Page CSS ✅

- Created `src/pages/ProjectPage.css` with styles for:
  - Hero section with full-width background image
  - Project metadata (client, year)
  - Title and category styling
  - Gallery grid layout
  - Previous/Next navigation
  - Responsive design
  - Animations

## Files Created/Modified

**Created:**

- ✅ `src/data/projects.js` - Centralized project data
- ✅ `src/pages/ProjectPage.jsx` - Dynamic project page component
- ✅ `src/pages/ProjectPage.css` - Project page styles

**Modified:**

- ✅ `src/App.jsx` - Added dynamic route for project pages

## How to Run

1. Navigate to the project directory:

   ```bash
   cd styleframe-react
   ```

2. Install dependencies (if not already done):

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit the project pages:
   - http://localhost:5173/project/mars
   - http://localhost:5173/project/teenage-engineering
   - http://localhost:5173/project/innovation-lab
   - http://localhost:5173/project/beats-n-buckets
   - http://localhost:5173/project/moncler-grenoble
   - http://localhost:5173/project/13-11
   - http://localhost:5173/project/we-are-rewind
   - http://localhost:5173/project/hatton-labs-x-ap

## Customization

To update project content, edit `src/data/projects.js`. Each project has:

- `title`: Display name
- `client`: Client name
- `year`: Project year
- `heroImage`: URL for hero background
- `gallery`: Array of image URLs
- `description`: Project description
- `category`: Project category

## Notes

- Using single dynamic component approach for easier maintenance
- Centralized data file allows easy updates
- All project images and descriptions can be managed from one file
- Each page includes navigation to previous/next projects
- 404 handling for invalid project slugs
