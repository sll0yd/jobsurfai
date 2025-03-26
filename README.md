# Job Surf AI

Job Surf AI is a modern web application that helps job seekers optimize their job search process using AI-powered insights and recommendations. The platform provides personalized job suggestions, resume analysis, and interview preparation tools to help users land their dream job.

## Features

- **AI-Powered Job Matching**: Get personalized job recommendations based on your skills, experience, and preferences
- **Resume Analysis**: Upload your resume for AI-powered analysis and improvement suggestions
- **Interview Preparation**: Practice with AI-generated interview questions and get feedback
- **Job Search Dashboard**: Track your applications and manage your job search process
- **User Authentication**: Secure sign-up and sign-in functionality
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Wave Animation**: Engaging visual elements with smooth animations

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom auth context with secure session management
- **UI Components**: Custom components with modern design
- **Animations**: CSS transitions and SVG animations

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jobsurfai.git
cd jobsurfai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── jobs/             # Job-related pages
│   ├── signin/           # Sign in page
│   └── signup/           # Sign up page
├── components/           # Reusable components
│   ├── Navbar.tsx       # Navigation bar
│   └── Footer.tsx       # Footer component
├── lib/                  # Utility functions and contexts
│   └── auth-context.tsx  # Authentication context
└── types/               # TypeScript type definitions
```

## Features in Detail

### Authentication
- Secure user authentication with email and password
- Protected routes and API endpoints
- Session management with context API

### Job Search
- AI-powered job matching algorithm
- Detailed job listings with company information
- Application tracking system
- Save favorite jobs for later

### Resume Analysis
- Upload and analyze resumes
- Get AI-powered improvement suggestions
- Track resume versions and changes

### Interview Preparation
- Practice with AI-generated questions
- Get feedback on your responses
- Track your progress over time

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors who have helped shape this project

## Support

For support, email support@jobsurfai.com or join our Slack channel.
