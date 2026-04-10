import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { messageAPI, userAPI, storageAPI } from '@/lib/api';
import Header from '@/components/Header';
import { Send, Search, MessageSquare, Plus, X, Paperclip, FileText, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [directoryUsers, setDirectoryUsers] = useState<any[]>([]);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Read URL query params securely
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // Reset messages when switching conversations to prevent cross-bleed of optimistic UI
    setMessages([]);
    let isSubscribed = true;

    // If there's an active conversation, poll it
    if (activeConversation && user) {
      const fetchMessages = async () => {
        try {
          const userId = user.id || user.rollNumber;
          const otherId = activeConversation.connectedUser?.userId || activeConversation.connectedUser?.id;
          
          if (!otherId) return;

          const result = (await messageAPI.getConversation(userId as string, otherId)) as any[];
          if (isSubscribed) {
            setMessages(result);
          }
          
          // Mark read
          await messageAPI.markAsRead(otherId, userId as string); // Sender is other person, receiver is us
        } catch (err) {
          console.error("Message polling error:", err);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => {
        isSubscribed = false;
        clearInterval(interval);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.connectedUser?.userId, activeConversation?.connectedUser?.id, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const results = (await messageAPI.getConversations(user?.id || user?.rollNumber as string)) as any[];
      setConversations(results || []);
      
      // Auto-select based on URL
      const params = new URLSearchParams(location.search);
      const preselectUserId = params.get('user');
      if (preselectUserId) {
         let existingConv = results?.find((c: any) => (c.connectedUser.userId || c.connectedUser.id) === preselectUserId);
         if (!existingConv && location.state?.preselectProfile) {
            existingConv = {
               connectedUser: {
                 ...location.state.preselectProfile,
                 userId: location.state.preselectProfile.id || location.state.preselectProfile.rollNumber
               },
               lastMessage: null,
               unreadCount: 0
            };
            setConversations(prev => [existingConv, ...prev]);
         }
         if (existingConv) {
           setActiveConversation(existingConv);
         }
      } else if (results && results.length > 0 && !activeConversation) {
        setActiveConversation(results[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user) return;
    
    const userId = user.id || user.rollNumber;
    const receiverId = activeConversation.connectedUser.userId;
    
    // Generate consistent unique ID for optimistic append
    const tempMsg = {
      id: `temp-${Date.now()}`,
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Check if we typed a new line to avoid duplicate appends on rapid sends
    setMessages(prev => {
       // prevent same temp logic dupes
       if (prev.find(m => m.id === tempMsg.id)) return prev;
       return [...prev, tempMsg];
    });
    setNewMessage('');
    
    try {
      let finalFileUrl = undefined;
      
      if (pendingFile) {
        // Upload the actual file to S3 via backend
        const uploadResponse = await storageAPI.uploadFile(pendingFile, 'messages');
        finalFileUrl = uploadResponse.url;
      }
      
      await messageAPI.sendMessage(userId, receiverId, tempMsg.content,
        finalFileUrl, pendingFile?.name || undefined, pendingFile?.type || undefined);
      setPendingFile(null);
      // Wait a moment then fetch for DB sync
      setTimeout(() => fetchConversations(), 500);
    } catch (err) {
      console.error("Failed to send.", err);
      // Handle optimistic rollback if needed (skip for now to keep UI flowing)
    }
  };

  const handleStartNewConversation = async () => {
    setShowNewMessageModal(true);
    if (directoryUsers.length === 0) {
       try {
         const users = await userAPI.getDirectory();
         setDirectoryUsers(Array.isArray(users) ? users : []);
       } catch(e) {
         console.error(e);
       }
    }
  };

  const selectNewUser = (selectedUser: any) => {
    const existingId = selectedUser.userId || selectedUser.id;
    let existingConv = conversations.find(c => (c.connectedUser?.userId || c.connectedUser?.id) === existingId);
    if (!existingConv) {
        existingConv = {
           connectedUser: {
              ...selectedUser,
              userId: existingId
           },
           lastMessage: null,
           unreadCount: 0
        };
        setConversations(prev => [existingConv, ...prev]);
    }
    setActiveConversation(existingConv);
    setShowNewMessageModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 pt-16 flex overflow-hidden max-h-screen">
        <div className="container-custom flex-1 py-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto h-[calc(100vh-64px)]">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm h-full flex-shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Messages</h2>
              <button 
                 onClick={handleStartNewConversation}
                 className="p-1.5 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors shadow-sm cursor-pointer"
                 title="New Message"
              >
                 <Plus size={18} />
              </button>
            </div>
            
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search messages" 
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                 <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">No conversations yet.</p>
                 </div>
              ) : (
                conversations.map((conv, idx) => {
                  const isActive = (activeConversation?.connectedUser?.userId || activeConversation?.connectedUser?.id) === (conv.connectedUser?.userId || conv.connectedUser?.id);
                  return (
                  <button 
                    key={idx}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left p-4 border-b border-gray-50 flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-primary-50' : 'hover:bg-gray-50 focus:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={conv.connectedUser?.profileImageUrl || conv.connectedUser?.profileImage || `https://ui-avatars.com/api/?name=${conv.connectedUser?.firstName}&background=random`} 
                      alt="avatar" 
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {conv.connectedUser?.firstName} {conv.connectedUser?.lastName}
                        </h3>
                        {conv.lastMessage && (
                           <span className="text-xs text-gray-400 shrink-0">
                             {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.lastMessage ? conv.lastMessage.content : 'Start a conversation'}
                      </p>
                    </div>
                  </button>
                )})
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="w-full md:w-2/3 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm h-full">
            {activeConversation ? (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <img 
                    src={activeConversation.connectedUser?.profileImageUrl || activeConversation.connectedUser?.profileImage || `https://ui-avatars.com/api/?name=${activeConversation.connectedUser?.firstName}&background=random`} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeConversation.connectedUser?.firstName} {activeConversation.connectedUser?.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{activeConversation.connectedUser?.headline}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
                  {messages.map((msg, idx) => {
                    const isSelf = msg.senderId === (user?.id || user?.rollNumber);
                    return (
                      <div key={idx} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          isSelf 
                          ? 'bg-primary-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                          <p>{msg.content}</p>
                          {msg.fileUrl && (
                            <a 
                              href={msg.fileUrl}
                              download={msg.fileName || 'attachment'}
                              className={`mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
                                isSelf 
                                  ? 'bg-primary-500/30 border-primary-400/30 text-white hover:bg-primary-500/50' 
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                              } transition-colors`}
                            >
                              <FileText size={14} className="shrink-0" />
                              <span className="truncate max-w-[180px]">{msg.fileName || 'Attachment'}</span>
                              <Download size={12} className="shrink-0 ml-auto" />
                            </a>
                          )}
                          <p className={`text-[10px] mt-1 text-right ${isSelf ? 'text-primary-100' : 'text-gray-400'}`}>
                             {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                  {pendingFile && (
                    <div className="mb-2 flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 text-sm">
                      <FileText size={16} className="text-primary-600 shrink-0" />
                      <span className="truncate text-primary-800 font-medium">{pendingFile.name}</span>
                      <button onClick={() => setPendingFile(null)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSend} className="flex gap-2">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be under 5MB');
                          return;
                        }
                        
                        setPendingFile(file);
                        
                        // Reset input so the same file can be re-selected
                        e.target.value = '';
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="flex-1 pl-4 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                    </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Your Messages</h3>
                <p className="text-sm text-center max-w-sm">Select a conversation from the sidebar or start a new tight-knit conversation from the directory.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {showNewMessageModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900">Start New Message</h3>
                  <button onClick={() => setShowNewMessageModal(false)} className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-3 border-b border-gray-100 relative bg-white">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search anyone in directory..." 
                     value={globalSearchTerm}
                     onChange={e => setGlobalSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
               </div>
               <div className="overflow-y-auto flex-1 p-2 bg-white">
                  {directoryUsers.length === 0 ? (
                     <div className="text-center p-8 text-sm text-gray-500 flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        Accessing Global Directory...
                     </div>
                  ) : directoryUsers.filter(u => 
                      u.firstName?.toLowerCase().includes(globalSearchTerm.toLowerCase()) || 
                      u.lastName?.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                      u.headline?.toLowerCase().includes(globalSearchTerm.toLowerCase())
                    ).map((u, i) => {
                     // Filter out self
                     const myId = user?.id || user?.rollNumber;
                     if ((u.userId || u.id) === myId) return null;

                     return (
                     <button 
                        key={i} 
                        onClick={() => selectNewUser(u)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-primary-50/50 rounded-lg transition-colors text-left border border-transparent hover:border-primary-100 mt-1"
                     >
                        <img 
                           src={u.profileImageUrl || u.profileImage || `https://ui-avatars.com/api/?name=${u.firstName}&background=random`} 
                           alt="avatar" 
                           className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" 
                        />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                           <p className="text-xs text-gray-500 truncate">{u.headline || u.role || 'No headline available'}</p>
                        </div>
                     </button>
                  )})}
               </div>
            </div>
         </div>
      )}
      
    </div>
  );
}
