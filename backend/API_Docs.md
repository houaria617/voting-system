# Voting App Backend API Documentation

## 1. Project Setup
**Base URL:** `http://localhost:5000/api`

### Headers
Most endpoints require authentication.
- **Authorization:** `Bearer <YOUR_JWT_TOKEN>`

---

## 2. Authentication

### Register User
**POST** `/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "ADMIN"  // or "VOTER"
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```
**Response:** Returns a `token`. Save this in LocalStorage!

### Logout
**POST** `/auth/logout`
- **Headers:** Requires Token.
- **Action:** Blacklists the token on the server.

### Forgot Password
**POST** `/auth/forgot-password`
```json
{ "email": "john@example.com" }
```

### Reset Password
**POST** `/auth/reset-password`
```json
{
  "token": "token_from_email_link",
  "newPassword": "newPassword123"
}
```

---

## 3. Polls

### Create Poll (Admin Only)
**POST** `/polls`
```json
{
  "title": "Best Framework?",
  "description": "Vote wisely",
  "options": ["React", "Vue", "Angular"],
  "invitedEmails": ["friend@test.com"], // Optional (For Private polls)
  "theme": {
    "backgroundColor": "#121212",
    "textColor": "#ffffff",
    "font": "Roboto"
  },
  "settings": {
    "isAnonymous": false,
    "allowMultiple": false,
    "visibility": "ALWAYS", // ALWAYS, AFTER_VOTE, CLOSED
    "accessType": "PUBLIC"  // PUBLIC, PRIVATE
  }
}
```

### Get Single Poll (Preview & Results)
**GET** `/polls/:id`
- Handles Public and Private access automatically.
- Returns `user_has_voted: true/false`.
- Hides vote counts automatically if settings require it.

### Edit Poll
**PUT** `/polls/:id`
- Only Creator can edit.
- Cannot edit if status is "CLOSED".
```json
{
  "title": "Updated Title",
  "status": "CLOSED", // Use this to stop voting
  "theme": { "backgroundColor": "#000" }
}
```

### Dashboard (My Polls)
**GET** `/polls/dashboard?search=React`
- Returns all polls created by current user.
- Supports search query param.

---

## 4. Voting

### Submit Vote
**POST** `/polls/:pollId/vote`
```json
{
  "optionId": 123 // The ID of the option selected
}
```
- Supports Guest voting (IP Check).
- Prevents Double Voting.

---

## 5. Frontend Integration Guide (React/Vue)

### How to handle Auth
1. **Login:** When user logs in, save the token:
   ```js
   localStorage.setItem('token', response.data.token);
   ```
2. **Requests:** Create an Axios instance that auto-attaches the token:
   ```js
   const api = axios.create({ baseURL: 'http://localhost:5000/api' });

   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

### How to handle Private Polls
1. Try to fetch `GET /polls/:id`.
2. If backend returns **403 Forbidden**, show a "Login Required" or "Access Denied" page.

### How to handle Voting UI
1. Check `response.data.user_has_voted`.
2. If `true`, disable the buttons and show the results (if visible).
3. If `false`, make buttons clickable.

### How to customize Theme
1. Read `poll.theme_settings` from the API.
2. Apply inline styles in React:
   ```jsx
   <div style={{ backgroundColor: poll.theme_settings.backgroundColor }}>
     <h1>{poll.title}</h1>
   </div>
   ```