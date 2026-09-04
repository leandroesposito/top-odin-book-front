# Odin Book - Social Network Frontend

A complete social network frontend application built with React, featuring posts, comments, likes, friendships, messaging, and profile management. This project demonstrates modern React patterns and a polished user experience. Built with **React 19**, **React Router 7**, **Vite**, and custom hooks for API interaction and session management.

## Applied knowledge

- **React Components** - Functional components, hooks, and composition patterns
- **Custom Hooks** - `useFetch` for API communication with loading states and error handling
- **Form Validation** - Real-time validation with HTML5 Constraint Validation API
- **File Uploads** - Multi-image uploads with preview and clear functionality
- **State Management** - Component-level state with prop drilling and lifting state up
- **Routing** - React Router with nested routes and navigation
- **Responsive Design** - Desktop-first responsive layouts with strategic breakpoints using CSS Grid and Flexbox
- **Theming** - Dark/Light mode with CSS custom properties
- **Accessibility** - ARIA attributes, keyboard navigation, and focus management
- **Error Handling** - User-friendly flash messages and validation feedback

## Live Demo

- **Application:** [https://top-odin-book-front.netlify.app](https://top-odin-book-front.netlify.app)
- **Backend API:** [https://github.com/leandroesposito/top-odin-book-server/](https://github.com/leandroesposito/top-odin-book-server/)
- **Guest Login:** One-click demo access - no account required

## Key Features

### Authentication

- Sign up with password requirements validation
- Login with guest account option
- Session persistence with localStorage
- Automatic redirects based on auth state

### Profiles

- Profile creation and editing with image upload
- Automatic avatar replacement with name initials
- Friend status indicators (isFriend, requestSent, requestReceived)
- Friend count display
- Delete account with confirmation

### Posts

- Create posts with text and/or images
- Edit posts (text + add/remove images)
- Delete posts with cascade cleanup
- Like/unlike posts
- View comments (loaded on demand)
- Post feed (friends' posts) and user-specific posts

### Messaging

- Real-time chat with smart polling (2.5s/5s/30s)
- Image attachments in messages
- Message deletion
- Unread message count badges

### Friends

- Send, accept, reject, and cancel friend requests
- Remove friends
- Friend suggestions
- Friends list with friend status

### Search

- Fuzzy search by name with debounced input
- User cards with friend status and action buttons

## UI/UX Highlights

### Form Validations

Sign-up form provides **real-time feedback** on password requirements:

```jsx
// SignUp.jsx - Password strength indicator with real-time validation
<div className="password-requirements">
  <div className="requirements">Password must contain at least:</div>
  <div className="password-requirement requirement-length">
    8 (eight) characters.
  </div>
  <div className="password-requirement requirement-lowercase">
    One (1) lowercase letter.
  </div>
  {/* ... */}
</div>
```

```javascript
function updatePasswordRequirements(password) {
  // Checks: length ≥ 8, lowercase, uppercase, number, symbol
  // Adds ✅ or ❌ class to each requirement
  requirementLength.classList.add("valid"); // ✅
  requirementSymbol.classList.add("invalid"); // ❌
}
```

Requirements display dynamically:

- ✅ 8 (eight) characters
- ✅ One (1) lowercase letter
- ❌ One (1) uppercase letter
- ❌ One (1) number
- ❌ One (1) symbol

### Custom File Input Buttons with Preview

HTML file inputs are notoriously hard to style. Solution: visually hide the input and use a styled label:

```jsx
// PostForm.jsx - Custom file selector with preview and clear
<label htmlFor="pictures" className="file-input-label-button">
  <Images /> Select Pictures
  <input type="file" name="pictures" id="pictures" multiple />
</label>
```

```css
input[type="file"] {
  position: absolute;
  height: 0;
  width: 0;
}

label.file-input-label-button {
  /* Fully styled, clickable label */
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-500);
  cursor: pointer;
}
```

**Keyboard accessibility preserved** with:

```css
label:has(input:focus-visible) {
  outline: 2px solid var(--primary-800);
}
```

### Selected Files Display with Clear Button

Users see what they've selected before upload:

```jsx
{
  picturesToUpload.length > 0 && (
    <>
      <div className="pictures-to-upload">
        {[...picturesToUpload].map((p) => (
          <div className="picture-item" key={p.name}>
            {p.name}
          </div>
        ))}
      </div>
      <button onClick={clearFileInput}>
        <CircleX /> Clear Files
      </button>
    </>
  );
}
```

### Flash Messages with Auto-Collapse Animation

Error and success messages appear with a smooth scale animation:

```javascript
function FlashMessage({ type, message }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // Auto-expand on mount
    setTimeout(() => setCollapsed(false), 10);
  }, []);

  function onCloseClick() {
    setCollapsed(true); // Collapse animation
    setTimeout(() => setRemoved(true), 1000); // Remove from DOM
  }
}
```

```jsx
// FlashMessages.jsx - Auto-dismissing notifications with smooth animations
<div className={`flash-message ${type} ${collapsed ? "collapsed" : ""}`}>
  <div className="message">{message}</div>
  <button onClick={onCloseClick}>X</button>
</div>
```

**Types:**

- ✅ Success (green)
- ❌ Error (red)

### Dark/Light Mode

```css
/* index.css - Theme switching with CSS custom properties */
:root {
  --primary-100: #fcf2ff;
  --primary-500: #b476e3;
  --primary-900: #150c26;
  /* ... */
}

.dark-mode {
  --primary-100: #150c26;
  --primary-500: #b476e3;
  --primary-900: #fcf2ff;
  /* Inverted values for dark mode */
}
```

**Persistence & system detection:**

```javascript
// Checks localStorage first, then system preference
const storageMode = localStorage.getItem("dark-mode");
const mq = window.matchMedia("(prefers-color-scheme: dark)");
```

### Auto-Growing Textarea

Uses a hidden "sizer" element to create the auto-grow effect without JavaScript:

```jsx
<textarea value={body} rows={1} />
<pre className="sizer">{body}</pre>
```

```css
.sizer {
  visibility: hidden;
  height: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
```

Both share the same grid position, so the textarea grows with its content.

### Loading Indicator

No libraries - just a simple CSS animation:

```css
/* Loading.module.css - Simple CSS animation */
.loading {
  width: 1em;
  height: 1em;
  border: 0.2em dotted var(--primary-500);
  border-radius: 50%;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
```

**Scalable** - accepts a `size` prop that adjusts via `font-size`.

### Avatar Component with Fallback

Reusable avatar that automatically displays the first letter of a user's name when no profile picture exists:

```jsx
// Avatar.jsx - Automatic avatar replacement with initials
const avatarContent =
  user.profile_picture_url !== null ? (
    <img src={user.profile_picture_url} alt="avatar" />
  ) : (
    <div className="avatar-replacement">
      {user.name.substring(0, 1).toUpperCase()}
    </div>
  );
```

```jsx
<Avatar data={user} size={6} />  {/* 6rem */}
<Avatar data={post} size={3} addAnchor={false} />
```

- **`size` prop** - scales font-size, width, and height proportionally
- **`addAnchor` prop** - optionally wraps in a link to the profile
- **Letter fallback** - first character of name, uppercase, centered

### Responsive Design

**Desktop-first with strategic breakpoints:**

```css
/* 3-column layout: Sidebar | Main | Right */
.body {
  display: grid;
  grid-template-columns: 13rem 1fr 13rem;
}

/* Tablet: remove right sidebar */
@media (max-width: 1100px) {
  .body {
    grid-template-columns: 13rem 1fr;
  }
}

/* Mobile: single column, collapsible menu */
@media (max-width: 768px) {
  .body {
    grid-template-columns: 1fr;
  }
}
```

**Collapsible sidebar on mobile:**

```jsx
const [isCollapsed, setIsCollapsed] = useState(true);

<button onClick={() => setIsCollapsed(!isCollapsed)}>
  <Menu />
</button>;
```

### Sidebar Notifications

Polling notification counts every 10 seconds:

```javascript
useEffect(() => {
  makeRequest("/notifications");
  const interval = setInterval(() => {
    makeRequest("/notifications");
  }, 10000);

  return () => clearInterval(interval);
}, [makeRequest, location.pathname]);
```

Displays badges:

- Friend request count
- Unread message count

### Text Overflow with Ellipsis

Consistent pattern for handling long names:

```css
.name {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Applied throughout: chat items, user lists, headers, profile names.

## Technical Highlights

### Custom `useFetch` Hook

A reusable hook that handles all API interactions with consistent error handling and loading states:

```jsx
// useFetch.js - Centralized API communication
function useFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState([]);

  const makeRequest = useCallback(async (route, method, body, isMultipart) => {
    // Handles authentication, JSON/FormData, errors, and loading states
  }, []);

  return { loading, data, success, errors, makeRequest, reset };
}
```

```javascript
const { loading, data, success, errors, makeRequest } = useFetch();

// Supports JSON and multipart/form-data
makeRequest("/posts", "POST", formData, true); // Multipart
makeRequest("/auth/log-in", "POST", credentials); // JSON
```

**Smart behavior:**

- Automatically sets `Content-Type: application/json` for JSON requests
- Skips content-type for multipart (lets browser set boundary)
- Manages loading, error, and success states
- Returns only data fields (strips `success` and `errors` from response)

### Session Management with `sessionManager.js`

Lightweight client-side session handling using `localStorage`:

```javascript
logIn(userData); // Store user
logOut(); // Clear session
isLogedIn(); // Check auth status
getUserId(); // Get current user ID
```

Combined with backend session cookies, this enables instant UI updates without waiting for server roundtrips.

### Load Comments on Demand

Comments only load when the user clicks the comments button:

```jsx
// Post.jsx - Comments loaded only when user requests
const [viewComments, setViewComments] = useState(false);

function onCommentsButtonClick() {
  setViewComments(true);
}

{
  viewComments && <Comments postId={post.id} />;
}
```

**Benefits:**

- Faster initial page render
- Reduced bandwidth for posts users don't engage with

### Smart Chat Polling with Adaptive Intervals

Chat messages poll at different rates based on user activity:

```javascript
const pollInterval = 2500; // Active tab
const idleInterval = 5000; // Tab visible but unfocused
const hiddenInterval = 30000; // Tab hidden

if (document.hidden) {
  schedule(hiddenInterval); // Slow polling
} else if (!document.hasFocus()) {
  schedule(idleInterval); // Medium polling
} else {
  schedule(pollInterval); // Fast polling
}
```

Listens to `visibilitychange`, `focus`, and `blur` events to adjust polling frequency dynamically.

### Automatic Routing After Actions

- **Login** -> redirects to `/feed` after 3 seconds
- **Logout** -> redirects to `/log-in`
- **Sign-up** -> redirects to `/log-in` after success
- **Post creation** -> redirects to new post
- **Post edit** -> redirects to updated post
- **Authenticated only routes** -> redirects to `/log-in` if user is not authenticated

```javascript
useEffect(() => {
  if (success && data.message) {
    setTimeout(() => {
      navigate(`/post/${postId || data.post?.id}`);
    }, 10);
  }
}, [data, success, postId, navigate]);
```

### Relationship Buttons Component

One component handles all friendship states:

```jsx
{
  isFriend ? (
    <button onClick={deleteFriend}>Remove friend</button>
  ) : requestReceived ? (
    <>
      <button onClick={acceptFriendRequest}>Accept request</button>
      <button onClick={rejectFriendRequest}>Reject request</button>
    </>
  ) : requestSent ? (
    <button onClick={cancelFriendRequest}>Cancel request</button>
  ) : (
    <button onClick={sendFriendRequest}>Send friend request</button>
  );
}
```

The backend returns relationship state on every profile fetch, keeping the UI always accurate.

## Project Structure

```
src/
├── components/
│   ├── chats/          # Messaging features
│   ├── friends/        # Friend management
│   ├── logIn/          # Login page
│   ├── logOut/         # Logout handler
│   ├── parts/          # Reusable components (Avatar, Header, Sidebar, etc.)
│   ├── post/           # Posts, likes, comments
│   ├── postForm/       # Create/edit posts
│   ├── profile/        # Profile view
│   ├── profileForm/    # Profile editor
│   ├── search/         # User search
│   └── signUp/         # Registration with password requirements
├── hooks/
│   └── useFetch.js     # Custom fetch hook
├── session/
│   └── sessionManager.js # Auth state management
├── App.jsx
├── main.jsx
├── routes.jsx
└── index.css           # Global styles with theming
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

| Category             | Technology                              |
| -------------------- | --------------------------------------- |
| **Framework**        | React 19                                |
| **Routing**          | React Router 7                          |
| **Build Tool**       | Vite                                    |
| **Styling**          | CSS with custom properties              |
| **Icons**            | Lucide React                            |
| **HTTP Client**      | Native Fetch API                        |
| **State Management** | Component-level state with custom hooks |
