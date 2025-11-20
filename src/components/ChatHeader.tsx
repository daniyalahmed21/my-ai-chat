function ChatHeader() {
  return (
    <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 px-8 py-7 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
          <svg className="w-10 h-10 text-orange-500" viewBox="0 0 109 109" fill="currentColor">
            <path d="M100.5 58.5c0 1.4-1.1 2.5-2.5 2.5H72.3c-.8 0-1.5.7-1.5 1.5v25.7c0 1.4-1.1 2.5-2.5 2.5h-18c-1.4 0-2.5-1.1-2.5-2.5V62.5c0-.8-.7-1.5-1.5-1.5H20.6c-1.4 0-2.5-1.1-2.5-2.5v-18c0-1.4 1.1-2.5 2.5-2.5h25.7c.8 0 1.5-.7 1.5-1.5V10.8c0-1.4 1.1-2.5 2.5-2.5h18c1.4 0 2.5 1.1 2.5 2.5v25.7c0 .8.7 1.5 1.5 1.5H98c1.4 0 2.5 1.1 2.5 2.5v18z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-white text-3xl font-bold tracking-tight flex items-center gap-3">
            Cloudflare AI Chat
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">BETA</span>
          </h1>
          <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Powered by Workers AI
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
        <span className="text-white text-sm font-medium">Online</span>
      </div>
    </div>
  )
}

export default ChatHeader
