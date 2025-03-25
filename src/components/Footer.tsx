export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <p className="mt-4 text-base text-gray-500">
              JobSurfAI helps you manage your job search process efficiently with AI-powered job details extraction.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/dashboard" className="text-base text-gray-500 hover:text-gray-900">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/jobs" className="text-base text-gray-500 hover:text-gray-900">
                  Jobs
                </a>
              </li>
              <li>
                <a href="/jobs/new" className="text-base text-gray-500 hover:text-gray-900">
                  New Job
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} JobSurfAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 