import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Send,
  ThumbsUp,
  Award,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { MOCK_COMMUNITY_POSTS } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const Community = () => {
  const [posts, setPosts] = useState(MOCK_COMMUNITY_POSTS);
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const tabs = [
    { id: 'posts', label: 'Community Posts', icon: MessageCircle },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
  ];

  const postTags = [
    'weight-loss', 'recipes', 'meal-prep', 'success-story', 
    'vegetarian', 'keto', 'workout', 'motivation', 'tips'
  ];

  const mockAchievements = [
    { id: 1, title: '7-Day Streak', description: 'Logged meals for 7 consecutive days', earned: true, date: '2025-06-15' },
    { id: 2, title: 'Recipe Master', description: 'Tried 10 different recipes', earned: true, date: '2025-06-12' },
    { id: 3, title: 'Healthy Choices', description: 'Scanned 50 healthy products', earned: false, progress: 32 },
    { id: 4, title: 'Community Helper', description: 'Received 25 likes on posts', earned: false, progress: 18 }
  ];

  const mockLeaderboard = [
    { rank: 1, name: 'HealthyEater22', points: 2450, avatar: '👩‍🦰', badge: '🏆' },
    { rank: 2, name: 'FitnessFan', points: 2380, avatar: '🏋️‍♂️', badge: '🥈' },
    { rank: 3, name: 'MomOfThree', points: 2210, avatar: '👩‍👧‍👦', badge: '🥉' },
    { rank: 4, name: 'PlantPower', points: 1990, avatar: '🌱', badge: '' },
    { rank: 5, name: 'YogaLife', points: 1850, avatar: '🧘‍♀️', badge: '' }
  ];

  const createPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    const post = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '👤',
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      tags: newPost.tags
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', tags: [] });
    setIsCreatingPost(false);

    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community.",
    });
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const addTag = (tag) => {
    if (!newPost.tags.includes(tag)) {
      setNewPost(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag) => {
    setNewPost(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(filter));

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">
          Connect with others on their health journey
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex-1 gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'posts' && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Share with Community
                  </div>
                  {!isCreatingPost && (
                    <Button onClick={() => setIsCreatingPost(true)}>
                      Create Post
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              {isCreatingPost && (
                <CardContent className="space-y-4">
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Post title..."
                  />
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, progress, or ask for advice..."
                    rows={4}
                  />
                  
                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {postTags.map(tag => (
                        <Button
                          key={tag}
                          variant={newPost.tags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => newPost.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                    {newPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {newPost.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={createPost} className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingPost(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter by tag:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">All Posts</option>
                    {postTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="text-3xl">{post.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{post.author}</h3>
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(post.timestamp)}
                            </span>
                          </div>
                          
                          <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(post.id)}
                              className={`gap-1 ${
                                likedPosts.includes(post.id) 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${
                                likedPosts.includes(post.id) ? 'fill-current' : ''
                              }`} />
                              {post.likes}
                            </Button>
                            
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </Button>
                            
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Share2 className="w-4 h-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned 
                          ? 'border-yellow-300 bg-yellow-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                          🏆
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      
                      {achievement.earned ? (
                        <div className="text-xs text-green-600 font-medium">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/50</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Community Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((user, index) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-600">#{user.rank}</span>
                        {user.badge && <span className="text-2xl">{user.badge}</span>}
                      </div>
                      
                      <div className="text-3xl">{user.avatar}</div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.points} points</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{user.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;