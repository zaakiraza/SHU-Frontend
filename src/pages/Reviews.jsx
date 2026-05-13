import { Star, ThumbsUp, MessageSquare, Search, ArrowUpDown, PenSquare, Filter, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';

const Reviews = () => {
  const { user } = useAuth();
  const [sortOrder, setSortOrder] = useState('highest');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uniFilter, setUniFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // New Post State
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUni, setNewCommentUni] = useState(user?.university || '');
  const [newCommentCat, setNewCommentCat] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync uni with logged in user
  useEffect(() => {
    if (user?.university) {
      setNewCommentUni(user.university);
    }
  }, [user]);

  // Set default category once categories load
  useEffect(() => {
    if (categories.length > 0 && !newCommentCat) {
      setNewCommentCat(categories[0]._id || categories[0].id);
    }
  }, [categories]);

  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const initialReviews = [
    { id: 1, author: 'CS_Senior', type: 'Faculty', subject: 'Dr. Alan Turing - Data Structures', university: 'Stanford University', rating: 5, text: 'Tough grader but you learn a lot. Make sure to attend office hours!', likes: 124, comments: 12 },
    { id: 2, author: 'Freshman24', type: 'University', subject: 'Campus Life', university: 'MIT', rating: 4, text: 'Great environment but the library gets too crowded during finals week.', likes: 89, comments: 5 },
    { id: 3, author: 'MathMajor', type: 'Course', subject: 'Calculus II (MAT201)', university: 'Harvard University', rating: 2, text: 'Very theory heavy. The textbook is mandatory for the homeworks and lectures are dry.', likes: 45, comments: 8 },
    { id: 4, author: 'BioGrad', type: 'University', subject: 'Research Facilities', university: 'Stanford University', rating: 5, text: 'State of the art labs. Unbeatable if you are into biotech.', likes: 156, comments: 20 },
  ];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch comments/reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let url = `${BASE_URL}/api/comments?page=1&limit=10`;
        
        if (uniFilter) url += `&university=${encodeURIComponent(uniFilter)}`;
        if (categoryId) url += `&category=${encodeURIComponent(categoryId)}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch reviews from API');
        
        const data = await response.json();
        setReviews(data.data?.comments || (Array.isArray(data.data) ? data.data : []));
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchReviews();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [uniFilter, categoryId, refreshKey]);

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    if (sortOrder === 'highest') return ratingB - ratingA;
    return ratingA - ratingB;
  });

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText || !newCommentUni || !newCommentCat) return;
    
    setSubmitLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          text: newCommentText,
          university: newCommentUni,
          category: newCommentCat
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to post comment');
      }
      setNewCommentText('');
      setShowForm(false);
      setRefreshKey(k => k + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText) return;
    
    setReplyLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ text: replyText })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to post reply');
      }
      setReplyText('');
      setReplyingTo(null);
      setRefreshKey(k => k + 1);
    } catch (err) {
      alert(err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      
      // Optimistically update the UI
      const newCount = data.data?.likes;
      setReviews(prevReviews => prevReviews.map(r => {
        if ((r.id || r._id) === commentId) {
          const currentCount = Array.isArray(r.likes) ? r.likes.length : (r.likes || 0);
          return { ...r, likes: newCount !== undefined ? newCount : currentCount + 1 };
        }
        return r;
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/comments/${commentId}`,
        {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      
      // Optimistically remove from UI
      setReviews(prevReviews => prevReviews.filter(r => (r.id || r._id) !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: '40px 0' }}>
        <h1 style={{ fontSize: '36px' }}>Campus <span className="gradient-text">Reviews</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>
          Honest feedback from verified students. Browse universities, faculties, and courses.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
               <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="text" 
                 placeholder="Filter by University ID..." 
                 value={uniFilter}
                 onChange={(e) => setUniFilter(e.target.value)}
                 style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'Inter', outline: 'none' }} 
               />
            </div>
            <div style={{ position: 'relative', flex: 1, maxWidth: '200px' }}>
               <Filter size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', appearance: 'none', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'Inter', cursor: 'pointer', outline: 'none' }}>
                   <option value="">All Categories</option>
                   {categories.map(cat => (
                     <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                   ))}
                </select>
            </div>
            <div style={{ position: 'relative' }}>
               <ArrowUpDown size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
               <select 
                 value={sortOrder}
                 onChange={(e) => setSortOrder(e.target.value)}
                 style={{ appearance: 'none', padding: '12px 40px 12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'Inter', cursor: 'pointer', outline: 'none' }}>
                  <option value="highest">Sort: Highest to Lowest</option>
                  <option value="lowest">Sort: Lowest to Highest</option>
               </select>
            </div>
          </div>
          
          {user && user.role !== 'guest' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenSquare size={18} /> Write Review
            </button>
          )}
        </div>

        {showForm && user && user.role !== 'guest' && (
          <div className="glass-card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--accent-pink)' }}>
            <h3 style={{ marginBottom: '16px' }}>Submit a Review / Comment</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handlePostComment}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="University ID/Name" 
                  value={newCommentUni}
                  onChange={(e) => setNewCommentUni(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
                  required
                />
                <select 
                  value={newCommentCat}
                  onChange={(e) => setNewCommentCat(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <textarea 
                placeholder="Write your honest feedback..." 
                rows={4} 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }} 
                required
              />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={submitLoading}>
                {submitLoading ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading reviews...</div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {sortedReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No reviews found.</div>
            ) : (
              sortedReviews.map(review => (
                <div key={review.id || review._id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-pink)', fontWeight: 'bold' }}>{review.type || (review.category?.name || review.category) || 'General'}</span>
                      <h3 style={{ fontSize: '20px', marginTop: '4px' }}>{review.subject || review.title || 'Review'}</h3>
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{review.university?.name || review.university || review.universityId} • Posted by {review.user?.name || review.author || review.userId || 'Anonymous'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '20px' }}>
                        <Star size={16} color="#F6E05E" fill="#F6E05E" />
                        <span style={{ fontWeight: 'bold' }}>{review.rating || 5}.0</span>
                      </div>
                      {user && user.role !== 'guest' && (
                        <button 
                          onClick={() => handleDeleteComment(review.id || review._id)}
                          style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          onMouseOver={(e) => e.currentTarget.style.color='#f56565'} 
                          onMouseOut={(e) => e.currentTarget.style.color='var(--text-muted)'}
                          title="Delete Comment"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '16px' }}>"{review.text || review.content}"</p>
                  
                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button 
                      onClick={() => handleLike(review.id || review._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', transition: 'color 0.2s ease' }} 
                      onMouseOver={(e) => e.currentTarget.style.color='var(--accent-purple)'} 
                      onMouseOut={(e) => e.currentTarget.style.color='var(--text-secondary)'}
                    >
                      <ThumbsUp size={18} /> {Array.isArray(review.likes) ? review.likes.length : (review.likes || 0)}
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === (review.id || review._id) ? null : (review.id || review._id))}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', color: replyingTo === (review.id || review._id) ? 'var(--accent-blue)' : 'var(--text-secondary)', transition: 'color 0.2s ease' }} 
                      onMouseOver={(e) => e.currentTarget.style.color='var(--accent-blue)'} 
                      onMouseOut={(e) => e.currentTarget.style.color= replyingTo === (review.id || review._id) ? 'var(--accent-blue)' : 'var(--text-secondary)'}
                    >
                      <MessageSquare size={18} /> {Array.isArray(review.replies) ? review.replies.length : (review.replies || 0)}
                    </button>
                  </div>

                  {replyingTo === (review.id || review._id) && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        placeholder="Write a reply..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ flex: 1, padding: '10px 16px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                      />
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '10px 20px', borderRadius: '20px' }}
                        onClick={() => handleReply(review.id || review._id)}
                        disabled={replyLoading || !replyText}
                      >
                        {replyLoading ? '...' : 'Reply'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
