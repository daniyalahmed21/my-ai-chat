import { useState, useRef, useEffect } from 'react'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import ChatHeader from './components/ChatHeader'
import { messageService } from './lib/supabase'

interface Message {
  content: string
  isUser: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userIdRef = useRef<string>('')

  useEffect(() => {
    const initializeChat = async () => {
      let userId = localStorage.getItem('chat_user_id')
      if (!userId) {
        userId = `user-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('chat_user_id', userId)
      }
      userIdRef.current = userId

      const loadedMessages = await messageService.loadMessages(userId)
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages.map(msg => ({
          content: msg.content,
          isUser: msg.is_user
        })))
      } else {
        const welcomeMessage = { content: "Hello! I'm your AI assistant powered by Cloudflare Workers AI. How can I help you today?", isUser: false }
        setMessages([welcomeMessage])
        await messageService.saveMessage({
          user_id: userId,
          content: welcomeMessage.content,
          is_user: false
        })
      }
      setIsLoading(false)
    }

    initializeChat()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async (message: string) => {
    const userMessage = { content: message, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    await messageService.saveMessage({
      user_id: userIdRef.current,
      content: message,
      is_user: true
    })

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userIdRef.current
        },
        body: JSON.stringify({ message })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      console.log('Reader available:', !!reader)

      if (reader) {
        setIsTyping(false)
        setMessages(prev => [...prev, { content: '', isUser: false }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log('Stream complete, final text:', fullText)
            await messageService.saveMessage({
              user_id: userIdRef.current,
              content: fullText,
              is_user: false
            })
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          console.log('Received chunk:', chunk)
          fullText += chunk

          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = { content: fullText, isUser: false }
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error('Error details:', error)
      setIsTyping(false)
      const errorMessage = {
        content: 'Sorry, there was an error processing your message. Please try again.',
        isUser: false
      }
      setMessages(prev => [...prev, errorMessage])
      await messageService.saveMessage({
        user_id: userIdRef.current,
        content: errorMessage.content,
        is_user: false
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading chat...</div>
      </div>
    )
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
