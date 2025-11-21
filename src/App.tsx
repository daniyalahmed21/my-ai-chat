import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import ChatHeader from './components/ChatHeader'
import { mockChatStream } from './mock-api'

interface Message {
  content: string
  isUser: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages')
    if (saved) {
      return JSON.parse(saved)
    }
    return [{ content: "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?", isUser: false }]
  })
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = useRef(`user-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const validMessages = messages.filter(msg => msg.content.trim() !== '')
    localStorage.setItem('chat_messages', JSON.stringify(validMessages))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async (message: string) => {
    setMessages(prev => [...prev, { content: message, isUser: true }])
    setIsTyping(true)
    setStreamingMessage('')

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId.current
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        setIsTyping(false)

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            setMessages(prev => [...prev, { content: fullText, isUser: false }])
            setStreamingMessage('')
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setStreamingMessage(fullText)
        }
      }
    } catch (error) {
      console.error('Error connecting to API, using mock response:', error)
      setIsTyping(false)

      let fullText = ''
      for await (const chunk of mockChatStream(message)) {
        fullText += chunk
        setStreamingMessage(fullText)
      }
      setMessages(prev => [...prev, { content: fullText, isUser: false }])
      setStreamingMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <ChatHeader />

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-5xl h-[calc(100vh-140px)] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} content={msg.content} isUser={msg.isUser} />
            ))}

            {streamingMessage && (
              <ChatMessage content={streamingMessage} isUser={false} />
            )}

            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl px-6 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}

export default App
