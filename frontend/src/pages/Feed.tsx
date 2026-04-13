import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, Heart, MessageCircle, Share2, MoreHorizontal, ExternalLink, X } from 'lucide-react'
import Header from '@/components/Header'
import { useAuth, User } from '@/contexts/AuthContext'
import { postAPI, userAPI, storageAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Comment {
  id: number
  authorId: string
  content: string
  createdAt: string
  // Hydrated
  authorName?: string
  authorAvatar?: string
}

interface Post {
  id: number
  authorId: string
  content: string
  category: string
  createdAt: string
  link?: string
  mediaUrl?: string
  likeCount: number
  isLikedByCurrentUser: boolean
  comments: Comment[]
  
  // Hydrated Profile Data
  authorName?: string
  authorAvatar?: string
  authorPosition?: string
  
  // Local UI State
  showComments?: boolean
  newCommentText?: string
}

export default function Feed() {
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [directory, setDirectory] = useState<User[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isPosting, setIsPosting] = useState(false)
  const [shareTooltip, setShareTooltip] = useState<number | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load backend data and hydrate profiles
  const fetchFeed = async () => {
    try {
      const [feedData, dirData] = await Promise.all([
         postAPI.getFeed() as Promise<any[]>,
         userAPI.getDirectory() as Promise<User[]>
      ])
      
      setDirectory(dirData)
      
      // Hydrate with Real Authors
      // ProfileDto from backend returns userId, firstName, lastName, profileImageUrl, position, currentCompany, headline
      const hydratedPosts = feedData.map((p: any) => {
         const author = dirData.find((u: any) => (u.userId || u.id) === p.authorId)
         
         // Hydrate Comments
         const hydratedComments = (p.comments || []).map((c: any) => {
            const cAuthor = dirData.find((u: any) => (u.userId || u.id) === c.authorId)
            const cName = cAuthor ? `${cAuthor.firstName || ''} ${cAuthor.lastName || ''}`.trim() : 'Unknown User'
            return {
               ...c,
               authorName: cName || 'Unknown User',
               authorAvatar: (cAuthor?.profileImage || cAuthor?.profileImage) || `https://ui-avatars.com/api/?name=User&background=random`
            }
         })

         const authorName = author ? `${author.firstName || ''} ${author.lastName || ''}`.trim() : 'Unknown User'
         const authorAvatar = (author?.profileImage || author?.profileImage) || `https://ui-avatars.com/api/?name=User&background=random&color=fff`
         
         // Build position string from profile fields
         let authorPosition = 'GradSync Member'
         if (author) {
           const pos = author.position || (author.headline?.includes(' at ') ? author.headline.split(' at ')[0] : author.headline) || ''
           const company = author.currentCompany || (author.headline?.includes(' at ') ? author.headline.split(' at ')[1] : '') || ''
           if (pos && company) authorPosition = `${pos} at ${company}`
           else if (pos) authorPosition = pos
           else if (company) authorPosition = company
           else if (author.role) authorPosition = author.role
         }

         return {
           ...p,
           authorName,
           authorAvatar,
           authorPosition,
           comments: hydratedComments,
           showComments: false,
           newCommentText: ''
         }
      })
      setPosts(hydratedPosts)
    } catch (error) {
      console.error('Failed to fetch feed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedFile) return
    setIsPosting(true)
    try {
      let mediaUrl = undefined
      if (selectedFile) {
         // Upload via User Service S3 API 
         const res = await storageAPI.uploadFile(selectedFile, 'posts')
         mediaUrl = res.url
      }
      
      await postAPI.createPost({
        content: newPostContent,
        category: 'NORMAL',
        mediaUrl: mediaUrl
      })
      
      setNewPostContent('')
      setSelectedFile(null)
      await fetchFeed()
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (postId: number) => {
    // Optimistic UI update
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLikedByCurrentUser: !p.isLikedByCurrentUser,
          likeCount: p.isLikedByCurrentUser ? Math.max(0, p.likeCount - 1) : p.likeCount + 1
        }
      }
      return p
    }))
    
    try {
       await postAPI.toggleLike(postId)
    } catch (e) {
       console.error("Failed to toggle like", e)
       // Revert UI on failure (optional, simplified here)
    }
  }

  const toggleComments = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, showComments: !p.showComments } : p))
  }

  const handleCommentChange = (postId: number, text: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, newCommentText: text } : p))
  }

  const submitComment = async (postId: number) => {
    const post = posts.find(p => p.id === postId)
    if (!post || !post.newCommentText?.trim()) return

    try {
      await postAPI.addComment(postId, post.newCommentText)
      // Refresh to get exactly what DB stored
      await fetchFeed()
    } catch (e) {
      console.error("Failed to add comment", e)
    }
  }

  const handleShare = (postId: number, link?: string) => {
    const shareUrl = link && link.startsWith('http') ? link : window.location.href
    navigator.clipboard.writeText(shareUrl)
    setShareTooltip(postId)
    setTimeout(() => setShareTooltip(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />
      
      <div className="pt-24 container-custom max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar (Mini Profile) */}
        <div className="hidden md:block w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="h-16 bg-gradient-to-r from-primary-500 to-golden-500"></div>
            <div className="px-4 pb-4 -mt-8 text-center">
              <img 
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff`} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-4 border-white mx-auto shadow-sm object-cover bg-white"
              />
              <h3 className="mt-2 font-bold text-gray-900">{isAuthenticated ? `${user?.firstName} ${user?.lastName}` : 'Guest User'}</h3>
              <p className="text-xs text-gray-500 mt-1">{isAuthenticated ? (user?.position ? `${user?.position} at ${user?.currentCompany}` : user?.role) : 'Please log in'}</p>
            </div>
          </div>
        </div>

        {/* Main Feed Centric Column */}
        <div className="w-full md:w-2/3 space-y-6">
          
          {/* Create Post Box */}
          {isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex space-x-3">
                <img 
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}&background=random`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your achievements, asks, or ideas..."
                    className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary-300 resize-none"
                    rows={3}
                  />
                  
                  {/* Image Preview Window */}
                  {selectedFile && (
                     <div className="mt-2 relative inline-block">
                        <img 
                          src={URL.createObjectURL(selectedFile)} 
                          alt="Attachment preview" 
                          className="h-24 rounded-lg object-cover border border-gray-200" 
                        />
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:scale-110 transition"
                        >
                           <X size={12} />
                        </button>
                     </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <input 
                       type="file"
                       accept="image/png, image/jpeg, application/pdf"
                       className="hidden"
                       ref={fileInputRef}
                       onChange={handleFileSelect}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 text-gray-500 hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <ImageIcon size={18} className="text-primary-500" />
                      <span className="text-sm font-medium">Add Media</span>
                    </button>
                    <button 
                      onClick={handleCreatePost}
                      disabled={isPosting || (!newPostContent.trim() && !selectedFile)}
                      className={`btn-primary px-5 py-2 text-sm rounded-full flex items-center space-x-2 transition ${
                        isPosting || (!newPostContent.trim() && !selectedFile) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isPosting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <Send size={16} />}
                      <span>{isPosting ? 'Posting...' : 'Post'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feed Posts */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12"><LoadingSpinner /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-500">
                No posts yet. Be the first to start the conversation!
              </div>
            ) : (
              <AnimatePresence>
                {posts.map((post, i) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Post Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex space-x-3">
                        <img src={post.authorAvatar} alt="Author" className="w-12 h-12 rounded-full border border-gray-100 shadow-sm object-cover bg-white" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{post.authorName}</h4>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5">
                            {post.authorPosition}
                            <span className="mx-1">•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      {post.authorId === user?.id && (
                          <button onClick={() => postAPI.deletePost(post.id).then(fetchFeed)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-full transition">
                            <X size={18} />
                          </button>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="text-gray-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </div>

                    {/* Attached S3 Media */}
                    {post.mediaUrl && (
                       <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex justify-center">
                          <img 
                            src={post.mediaUrl} 
                            alt="Post Media" 
                            className="max-h-96 object-contain"
                          />
                       </div>
                    )}

                    {post.link && (
                      <div className="mb-4">
                        <a 
                           href={post.link.startsWith('http') ? post.link : `https://${post.link}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center space-x-2 btn-primary px-4 py-2 text-sm shadow-sm hover:shadow-md"
                        >
                          <span>Open Link</span>
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    )}

                    {/* Post Call-To-Action Stats Summary */}
                    <div className="flex justify-between text-xs text-gray-500 mb-3 px-2 border-b border-gray-100 pb-3">
                      <span>{post.likeCount} Likes</span>
                      <span>{post.comments.length} Comments</span>
                    </div>

                    {/* Interactive Post Actions */}
                    <div className="flex items-center justify-between relative">
                      <button 
                        onClick={() => handleLike(post.id)}
                        disabled={!isAuthenticated}
                        className={`flex flex-1 items-center justify-center space-x-2 py-2 rounded-lg transition group ${post.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-500 hover:bg-gray-50 hover:text-red-500'}`}
                      >
                        <Heart size={18} className={`${post.isLikedByCurrentUser ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className={`flex flex-1 items-center justify-center space-x-2 py-2 rounded-lg transition group ${post.showComments ? 'text-primary-500' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-500'}`}
                      >
                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                      <button 
                        onClick={() => handleShare(post.id, post.link)}
                        className="flex flex-1 items-center justify-center space-x-2 text-gray-500 hover:bg-gray-50 hover:text-golden-500 py-2 rounded-lg transition group relative"
                      >
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Share</span>
                        {shareTooltip === post.id && (
                           <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded-full animation-fade-in shadow-md">
                             Copied!
                           </div>
                        )}
                      </button>
                    </div>

                    {/* Dynamic Comment Section */}
                    <AnimatePresence>
                      {post.showComments && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-100 space-y-4"
                        >
                           {/* Add Comment Input */}
                           {isAuthenticated && (
                               <div className="flex space-x-3">
                                 <img src={user?.profileImage || 'https://ui-avatars.com/api/?name=User&background=random'} className="w-8 h-8 rounded-full border border-gray-200 mt-1 object-cover bg-white" alt="Me" />
                                 <div className="flex-1 relative">
                                    <input 
                                      type="text" 
                                      value={post.newCommentText || ''}
                                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                      onKeyDown={(e) => { if (e.key === 'Enter') submitComment(post.id) }}
                                      placeholder="Add a comment..."
                                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-colors pr-10"
                                    />
                                    <button 
                                      onClick={() => submitComment(post.id)}
                                      disabled={!post.newCommentText?.trim()}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500 disabled:opacity-50 hover:scale-110 transition-transform"
                                    >
                                       <Send size={16} />
                                    </button>
                                 </div>
                               </div>
                           )}

                           {/* Rendered Comments */}
                           {post.comments.map(c => (
                             <div key={c.id} className="flex space-x-3">
                               <img src={c.authorAvatar} className="w-8 h-8 rounded-full border border-gray-200 object-cover bg-white" alt="Avatar" />
                               <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2">
                                 <h5 className="font-bold text-xs text-gray-900">{c.authorName}</h5>
                                 <p className="text-sm text-gray-800">{c.content}</p>
                                 <p className="text-[10px] text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleString()}</p>
                               </div>
                             </div>
                           ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
