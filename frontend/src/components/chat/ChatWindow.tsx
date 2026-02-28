"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Loader2, MessageSquare, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  project_id: number;
  sender_id: number;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  projectId: number;
  className?: string;
}

export default function ChatWindow({ projectId, className }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await api.get(`/chat/${projectId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Polling for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await api.post("/chat/", {
        project_id: projectId,
        content: newMessage.trim(),
      });
      // Backend returns message without sender info initially, 
      // but we will fetch on next poll or we could optimistic update
      // Actually, since we're using polling, let's just push and it'll refresh names
      setMessages((prev) => [...prev, { ...res.data, sender_name: user?.full_name, sender_avatar: user?.avatar_url }]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-secondary min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-3 text-accent" />
        <p className="text-sm font-medium animate-pulse">Synchronizing conversation...</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col bg-card/60 backdrop-blur-md rounded-2xl border border-border shadow-xl overflow-hidden h-full min-h-[500px]", 
      className
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-secondary/5 dark:bg-accent/5 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-primary dark:text-white leading-tight">Project Discussion</h3>
            <div className="flex items-center text-[10px] text-secondary/60 font-bold uppercase tracking-widest mt-0.5">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Live Coordination
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] bg-primary/10 dark:bg-white/10 text-primary dark:text-accent px-2 py-0.5 rounded-lg font-bold border border-primary/5 dark:border-accent/10">
                PRO COLLAB
            </span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-10">
            <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 text-secondary/30" />
            </div>
            <h4 className="text-primary dark:text-white font-bold mb-1">No messages yet</h4>
            <p className="text-sm text-secondary/60">
              Start a professional discussion with your team regarding this valuation project.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === user?.id;
            const showName = idx === 0 || messages[idx-1].sender_id !== msg.sender_id;
            
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-end space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isMe ? "flex-row-reverse space-x-reverse" : "flex-row"
                )}
              >
                {!isMe && showName ? (
                  <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-border bg-accent/10 flex items-center justify-center shadow-sm">
                    {msg.sender_avatar ? (
                      <img src={`http://127.0.0.1:8000${msg.sender_avatar}`} alt={msg.sender_name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-accent">{getInitials(msg.sender_name || "?")}</span>
                    )}
                  </div>
                ) : (
                  <div className="w-8 flex-shrink-0" /> // Placeholder for alignment
                )}

                <div className={cn(
                  "flex flex-col group",
                  isMe ? "items-end" : "items-start"
                )}>
                  {!isMe && showName && (
                    <span className="text-[10px] font-bold text-primary dark:text-accent mb-1 ml-1 uppercase tracking-tighter">
                      {msg.sender_name}
                    </span>
                  )}
                  
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all duration-200 group-hover:shadow-md",
                    isMe 
                      ? "bg-primary dark:bg-accent text-white dark:text-primary rounded-tr-none hover:bg-primary/95 dark:hover:bg-accent/95" 
                      : "bg-white dark:bg-secondary/20 border border-border text-foreground rounded-tl-none hover:border-accent/30 dark:hover:bg-secondary/30"
                  )}>
                    {msg.content}
                  </div>
                  
                  <span className="text-[9px] text-secondary/40 mt-1 px-1 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-secondary/5 dark:bg-accent/5 border-t border-border">
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <div className="relative flex-1 group">
                <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a professional message..."
                    className="pr-12 py-6 bg-card dark:bg-secondary/40 border-border rounded-xl focus:ring-accent focus:border-accent shadow-inner transition-all group-hover:border-accent/30"
                    disabled={isSending}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[10px] font-bold text-secondary/30 bg-secondary/5 px-2 py-1 rounded border border-border/50">
                    ESC to clear
                </div>
            </div>
            
            <Button 
                type="submit" 
                disabled={isSending || !newMessage.trim()}
                className={cn(
                    "h-12 w-12 rounded-xl bg-primary dark:bg-accent text-white dark:text-primary shadow-lg transition-transform",
                    newMessage.trim() ? "translate-y-0 scale-100" : "scale-90"
                )}
            >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
        </form>
        <p className="text-[9px] text-secondary/50 mt-2 text-center uppercase tracking-widest font-bold">
            All discussions are archived for audit compliance
        </p>
      </div>
    </div>
  );
}
