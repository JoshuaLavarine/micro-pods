# Micro-Pods

A Next.js application for creating and managing small text snippets called "Pods".

## Overview

Micro-Pods is a simple web application built with Next.js that allows users to create, view, and delete short text snippets. The application features:

- Create and delete pods
- Pagination with customisable page size
- Sorting options (newest first or oldest first)
- Persistent settings using localStorage

## Getting Started

### Visit the Live Demo
You can try out the live demo hosted by Vercel at [https://micro-pods.vercel.app/](https://micro-pods.vercel.app/).

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/micro-pods.git
cd micro-pods
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Running Tests

Execute the test suite with:

```bash
npm run test
```

## Project Structure

```txt
app/
├── _components/            # UI components
│   ├── Header.tsx          # Application header
│   ├── Footer.tsx          # Pagination controls
│   └── pods/               # Pod-specific components
│       ├── PodForm.tsx     # Form for creating pods
│       ├── PodList.tsx     # Display grid of pods
│       └── PodsList.tsx    # Main container component
├── api/                    # API routes
│   └── pods/               # Pod API endpoints
│       ├── responseHelpers.ts  # Helper functions
│       └── route.ts        # API route handlers
├── types.ts                # TypeScript interfaces
└── page.tsx                # Main page component
```

## Features

- **Create Pods**: Add short text snippets
- **View Pods**: Display in a responsive grid
- **Delete Pods**: Remove unwanted pods
- **Pagination**: Navigate through pods with first, previous, next, and last page controls
- **Customisable Page Size**: Choose how many pods to display per page
- **Sorting**: Sort pods by creation time (newest first or oldest first)
- **Persistent Settings**: User preferences and draft input are saved to localStorage

## Design Trade-offs

### In-Memory Data Storage

The application currently uses in-memory storage for pods, which means data is lost when the server restarts. This was chosen for simplicity but has obvious limitations for production use.

### Client-Side State Management

The application primarily uses React's useState hooks for state management instead of more complex solutions like Redux or Zustand. This keeps the codebase simpler but may become harder to maintain as the application grows.

### UI Design

The UI is built with inline styles rather than a component library or CSS framework. This approach allows for quick development but sacrifices some design consistency and maintainability.

### API Structure

The API uses simple route handlers that directly manipulate in-memory data. This works well for a small application but wouldn't scale for production use cases with real databases.

## Future Improvements

Given more time, these improvements would enhance the application:

### Technical Improvements

1. **Database Integration**: Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. **Authentication**: Add user accounts and authentication
3. **State Management**: Implement a more robust state management solution for larger scale
4. **Performance Optimisations**:

   **a**. Pagination should be entirely server-side (client currently handles which page to show)
   
   **b**. Memoize expensive calculations
   
   **c**. Caching API responses
   
6. **Accessibility**: Improve keyboard navigation and screen reader support
7. **Testing**: Add end-to-end tests with Cypress or Playwright

### Feature Enhancements

1. **Rich Text Editing**: Support for formatting text in pods
2. **Search Functionality**: Search within pod content
3. **Export/Import**: Export pods as JSON or text files
4. **Sharing**: Share pods with other users or via links
5. **Editing**: Update pods after creation
6. **Maximise Pod View**: Enable users to view fullscreen pods
