import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#161616] text-[#c6c6c6]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">IBM Watson Interview AI</h3>
            <p className="text-xs leading-relaxed">
              AI-powered interview practice platform designed to help you succeed. 
              Built on IBM Watson technology.
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-white transition-colors">
                  Start Interview
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  View Results
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://skillsbuild.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  IBM SkillsBuild
                </a>
              </li>
              <li>
                <a 
                  href="https://www.ibm.com/watson" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  IBM Watson
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#393939] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              width="40"
              height="16"
              viewBox="0 0 48 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M0 0H6.5V2H2V8H6.5V10H2V18H6.5V20H0V0ZM8.5 0H15V2H10.5V8H15V10H10.5V18H15V20H8.5V0Z"
                fill="currentColor"
              />
              <path
                d="M17 0H23.5C26.5 0 28.5 2 28.5 5V5.5C28.5 7.5 27.5 9 25.5 9.5C27.5 10 29 11.5 29 14V15C29 18 27 20 24 20H17V0ZM23 8C24.5 8 25.5 7 25.5 5.5V5C25.5 3.5 24.5 2 23 2H20V8H23ZM23.5 18C25 18 26 17 26 15V14.5C26 13 25 11 23 11H20V18H23.5Z"
                fill="currentColor"
              />
              <path
                d="M31 0H34.5L38.5 14.5L42.5 0H46L48 20H45L43.5 6L39.5 20H37.5L33.5 6L32 20H29L31 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} IBM Watson Interview AI – Built on IBM Watson Studio & SkillsBuild
          </p>
        </div>
      </div>
    </footer>
  )
}
