# Project Command & Control: ScriptFlow

## 1. Instructions for My AI Partner (You)

**Objective:** This document is the single source of truth for the ScriptFlow project. **Before every response, you must review this file** to ensure all decisions, preferences, and context are maintained. Your goal is to act as a world-class Senior Software Engineer and my dedicated partner in building this project.

**Core Directives:**

*   **Review This File First:** This is your primary instruction. Always read and comprehend this `GEMINI.md` file before generating any response or code.
*   **Single Source of Truth:** All architectural, design, and strategic decisions documented here are canonical. Do not deviate unless I explicitly instruct you to, and then update this file accordingly.
*   **Reference the `mockups/` Directory:** All UI development must be based directly on the static files provided in the `mockups/` folder. This is the ground truth for all visual components.
*   **Document Everything:** When I provide new feedback, make a key decision, or state a strong preference, you must ask if you should add it to this document. Keep the "Key Decisions & User Preferences" and "Development Plan" sections updated.
*   **Proactive Partnership:** Don't just wait for instructions. Based on the project vision and our progress, suggest next steps, identify potential issues, and help me think strategically.

## 2. Project Vision & High-Level Plan

*   **Vision:** An AI-powered web application to streamline the YouTube video creation workflow, from scriptwriting to final packaging.
*   **Core Problem:** The creative process for video production is fragmented, requiring multiple tools for scripting, brainstorming, and creating assets.
*   **Target User:** YouTube creators and content marketers looking to accelerate their production schedule.
*   **Architecture:** A serverless web application with a React frontend.
*   **Tech Stack:** React, TypeScript, Tailwind CSS, Gemini API.

## 3. Key Decisions & User Preferences

*   **Guiding Principle:** Prioritize a clean, intuitive, and highly functional user interface that makes complex AI interactions feel simple and natural.
*   **Project Creation Flow:** The project creation process begins with an AI-powered brainstorming session (`/setup`) to help users generate and refine ideas before moving to the main script editor. This prioritizes ideation upfront.
*   **Persistence:** Use IndexedDB for client-side storage of project data (scripts, titles, etc.) to ensure offline availability and state persistence between sessions.
*   **Script Editor:** Decided to use a styled `<textarea>` for the initial script editor implementation. It provides robust view/edit functionality and state management, deferring the complexity of a full rich-text (`contentEditable`) editor for a future iteration.
  *   **AI Interaction Model:** Implemented a tabbed interface in the project workspace to switch between the AI Assistant (for conversational, iterative tasks) and AI Tools (for one-shot actions like script cleanup). This provides dedicated spaces for different types of AI interaction.
  *   **Structured AI Output:** For the Content Packaging feature, we will use Gemini's JSON mode with a `responseSchema` to ensure we receive a predictable data structure containing titles, a description, and tags.
  *   **Ideation Chat:** The initial brainstorming session (`/setup`) uses the Gemini Chat API (`ai.chats.create`) to maintain a stateful, context-aware conversation. When converting to a script, the entire chat history is used to generate a project title and script outline via a structured JSON call.
  *   **Contextual Text Transfer:** Implemented a contextual toolbar with separate "Replace" and "Append" options for transferring text from the AI chat to the script editor. The toolbar appears when text is selected in the AI chat and the script editor gains focus, allowing users to either replace selected text or append at the cursor position. Text formatting (including newlines) is preserved during transfer. We convert selected chat HTML back into Markdown using Turndown before inserting into the editor.

## Acceptance Criteria: Replace/Append from Chat
- [x] Create `docs/GEMINI.md` as the command & control center.
- [x] Implement IndexedDB for client-side project storage.

**Phase 2: Core UI Conversion & Feature Implementation**
- [x] Convert `mockups/dashboard.html` to the `Dashboard` page.
- [x] Convert `mockups/project-id-setup.html` to the `ProjectSetup` page.
- [x] Convert `mockups/project-id.html` to the `ProjectWorkspace` page.
- [x] Convert `mockups/project-id-v2.html` to enhance the `ProjectWorkspace` with an AI chat assistant.
- [x] Convert `mockups/project-id-b-roll.html`, `project-id-thumbnails.html`, and `ProcessingWorkflowpage.html`.
- [x] Implement FR-002: Connect Dashboard 'New Project' button to the `/setup` page to initiate the project creation flow. All dashboard and sidebar navigation is now functional.
- [x] Implement FR-003: Add a transcript upload feature (`.txt`, `.srt`) to the `ProjectWorkspace` page for new projects. The in-project navigation is now functional.
- [x] Implement FR-004: Implement a script editor module to allow users to view and modify their transcript.
- [x] Implement FR-005: Add an "AI Edit" tool to automatically clean up the full script, removing filler words and redundancies.
- [x] Implement FR-006: Add a "Content Packaging" tool to generate titles, a description, and tags from the script.
- [x] Implement Ideation-First Chat Module: Power the `/setup` page with a live, context-aware Gemini chat for brainstorming.
- [x] Implement context-aware text transfer (replace/append) from AI Assistant to Script Editor.
 - [x] Preserve formatting on transfer by converting selected chat HTML to Markdown (Turndown) before insertion.

### Acceptance Criteria: Replace/Append from Chat

- **Replace flow**
  - Select text in the AI chat panel (right).
  - Select target text in the Script Editor (left) — contextual toolbar shows Replace and Append.
  - Clicking Replace replaces the selected editor text with the selected AI text.

- **Append flow**
  - Select text in the AI chat panel (right).
  - Place the caret in the Script Editor without selecting text — contextual toolbar shows Append.
  - Clicking Append inserts the AI text at the caret position.

- **Formatting preservation**
  - Bold, italics, lists, code blocks, and line breaks are preserved. The AI chat selection is captured as HTML and converted back to Markdown with Turndown before being inserted into the textarea-based editor. In view mode, Markdown is rendered via `parseAndSanitizeMarkdown()`.

- **UI visibility & state**
  - The contextual toolbar only appears when there is a valid chat selection, the editor is focused, and an editor selection/caret exists.
  - After Replace or Append, the source selection and editor selection are cleared and the toolbar hides.

- **Fallback behavior**
  - If Turndown is not loaded, the app falls back to inserting plain text so workflows remain functional.

**Phase 3: Polish & Refinement**
- [ ] Conduct a full accessibility audit (A11y).
- [ ] Optimize for performance (Lighthouse score > 90).

**Phase 4: Final Steps**
- [ ] Write comprehensive tests.
- [ ] Deploy to production.

**Phase 5: Gemini API Integration**
- [x] Integrate Gemini for script rewriting in the AI Assistant.
- [x] Implement context-aware rewriting based on selected editor text.
- [x] Integrate Gemini for image generation in the AI Assistant.
- [x] Integrate Gemini for automated script cleanup.
- [x] Integrate Gemini for content packaging (titles, description, tags).
- [x] Integrate Gemini Chat API for the ideation-first brainstorming module.
- [ ] Power the multi-step `ProcessingWorkflow` page with Gemini.
- [ ] Power the `B-Roll Generator` page with the Gemini API.
- [ ] Power the `Thumbnail Generator` page with the Gemini API.
