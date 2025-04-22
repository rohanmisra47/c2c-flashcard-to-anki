# Flashcard Generator for Medical Notes

A web application that allows users to paste medical text from websites or wikis, generate AI-powered flashcards, and export them to Anki format.

## Technology Stack

- **Frontend**: React.js with Next.js
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Styling**: Shadcn/ui
- **AI Integration**: OpenAI API
- **Export Format**: Simple .txt files for Anki import

## Development Plan

1. **Setup Phase**
   - Initialize Next.js project
   - Configure Shadcn/ui
   - Set up Supabase project and database
   - Configure OpenAI API integration

2. **Core Features**
   - Text input area for medical notes
   - AI-powered flashcard generation
   - Flashcard preview and editing
   - Save flashcards to Supabase
   - Export to .txt format for Anki

3. **UI/UX Development**
   - Clean, responsive design
   - User-friendly interface
   - Flashcard preview and management
   - Export functionality

4. **Testing & Deployment**
   - Test flashcard generation
   - Verify Anki export format
   - Deploy to production

## Detailed Development Steps

### 1. Project Setup
- Create Next.js project with TypeScript
- Install and configure Shadcn/ui
- Set up Supabase project and install client
- Create environment variables file
- Test basic page rendering

### 2. Basic UI Structure
- Create main layout with header and sidebar
- Add text input area for medical notes
- Add basic styling with Shadcn/ui components
- Test responsive design

### 3. Supabase Setup
- Create flashcards table in Supabase
- Set up basic CRUD operations
- Test database connection
- Create basic API routes in Next.js

### 4. Text Input and Processing
- Create text input component
- Add basic text processing
- Test text input and storage
- Add character/word count

### 5. OpenAI Integration
- Set up OpenAI API connection
- Create prompt template for medical flashcards
- Test basic text generation
- Add error handling

### 6. Flashcard Generation
- Create flashcard preview component
- Implement flashcard generation logic
- Add loading states
- Test generation with sample medical text

### 7. Flashcard Management
- Create flashcard list component
- Add save functionality
- Implement delete/edit features
- Test CRUD operations

### 8. Export Functionality
- Create export to .txt function
- Format text for Anki import
- Add download button
- Test export with sample flashcards

### 9. UI Polish
- Add animations and transitions
- Improve error messages
- Add loading states
- Test all user flows

### 10. Testing and Deployment
- Add error boundaries
- Test edge cases
- Set up deployment
- Add analytics

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run development server

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## Anki Export Format

The application will generate .txt files in the following format:
```
Question 1
Answer 1

Question 2
Answer 2
...
```

This format can be directly imported into Anki using the basic import feature.
