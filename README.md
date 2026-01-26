# Electra - Online Voting Platform

![Electra Logo](public/Electra_Voting_Platform_Logo_-_Flat_Vector_Design-removebg-preview.png)

Electra is a modern, secure, and user-friendly online voting platform that allows users to create, manage, and participate in polls and elections. Built with React on the frontend and Node.js/Express on the backend, it provides a seamless experience for both poll creators and voters.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🚀 Features

### For Poll Creators
- **Easy Poll Creation**: Create polls with multiple options, custom themes, and settings
- **Real-time Results**: View live voting results with interactive charts (bar and pie charts)
- **Access Control**: Set polls as public or private with invited voters
- **Dashboard**: Manage all your polls from a centralized dashboard
- **Share Options**: Generate shareable links and QR codes for easy distribution

### For Voters
- **Secure Voting**: Cast votes with duplicate prevention (IP-based for anonymous users)
- **Real-time Updates**: See live results as votes come in
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Anonymous Voting**: Option for anonymous polls

### Platform Features
- **Authentication**: Secure user registration and login
- **Data Visualization**: Beautiful charts and statistics
- **Email Notifications**: Automated email services for invitations
- **RESTful API**: Well-documented API for integrations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js/Recharts** - Data visualization
- **SweetAlert2** - Beautiful modal dialogs
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database and authentication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email services
- **Request-IP** - IP address detection for vote tracking

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Supabase** account and project

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📖 Usage

### Creating a Poll
1. Sign up or log in to your account
2. Click "Create New Poll" from the dashboard
3. Fill in poll details (title, description, options)
4. Configure settings (privacy, anonymity, dates)
5. Share the generated link with voters

### Voting in a Poll
1. Click on the poll link shared by the creator
2. Select your preferred option
3. Submit your vote
4. View real-time results (if enabled)

### Managing Polls
- View all your polls in the dashboard
- Edit poll settings before voting starts
- Monitor live results
- Share polls via links or QR codes

## 🗂️ Project Structure

```
Voting-system_front/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Authentication & validation
│   │   ├── utils/          # Helper functions
│   │   └── config/         # Database configuration
│   ├── tests/              # Unit tests
│   └── API_Docs.md         # API documentation
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── styles/         # CSS stylesheets
│   │   ├── constants/      # App constants
│   │   ├── data/           # Mock data (for development)
│   │   └── utils/          # Utility functions
│   ├── index.html          # Main HTML file
│   └── vite.config.js      # Vite configuration
```

## 🔒 Security Features

- **Authentication**: JWT-based user authentication
- **Data Encryption**: Secure password hashing
- **Input Validation**: Comprehensive input sanitization
- **CORS Protection**: Cross-origin resource sharing controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



**Electra** - Making democracy accessible through technology. 🗳️
