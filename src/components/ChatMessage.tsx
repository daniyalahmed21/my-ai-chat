import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface ChatMessageProps {
  content: string
  isUser: boolean
}

function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-slate-600 to-slate-700'
          : 'bg-gradient-to-br from-orange-500 to-orange-600'
      }`}>
        {isUser ? (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )}
      </div>

      <div className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-md transition-all hover:shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
          : 'bg-gradient-to-r from-gray-50 to-white text-gray-800 border border-gray-200'
      }`}>
        {isUser ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono text-xs font-semibold" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }: any) => (
                  <pre className="bg-slate-900 text-white p-5 rounded-xl overflow-x-auto my-3 shadow-lg border border-slate-700">
                    {children}
                  </pre>
                ),
                p: ({ children }: any) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }: any) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }: any) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }: any) => (
                  <li className="ml-2">{children}</li>
                ),
                h1: ({ children }: any) => (
                  <h1 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h1>
                ),
                h2: ({ children }: any) => (
                  <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                ),
                h3: ({ children }: any) => (
                  <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>
                ),
                blockquote: ({ children }: any) => (
                  <blockquote className="border-l-4 border-orange-500 pl-4 italic my-3 bg-orange-50 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }: any) => (
                  <a href={href} className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition-colors" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                table: ({ children }: any) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }: any) => (
                  <th className="border border-gray-300 px-3 py-2 bg-gray-200 font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }: any) => (
                  <td className="border border-gray-300 px-3 py-2">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
