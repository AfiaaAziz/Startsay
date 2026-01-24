# Navigation Fix Plan

## Problem

React Router is not installed/configured, causing navbar links to not navigate properly.

## Solution Steps

### 1. Install react-router-dom package

- [x] Run npm install react-router-dom

### 2. Set up BrowserRouter in main.jsx

- [ ] Import BrowserRouter from react-router-dom
- [ ] Wrap App component with BrowserRouter

### 3. Configure routes in App.jsx

- [ ] Import Routes and Route from react-router-dom
- [ ] Define routes for different pages (Home, IndexPage, Research, Studio)
- [ ] Wrap page content in Route components

### 4. Update navbar links to use Link component

- [ ] In App.jsx (Home page): Update Index link to use Link component
- [ ] In IndexPage.jsx: Update Index link to use Link component
- [ ] Ensure all other navigation links work correctly

## Expected Result

Users should be able to click "Index" in the navbar and be taken to the IndexPage without page reload.
