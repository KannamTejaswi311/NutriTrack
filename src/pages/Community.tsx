
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { MessageSquare, Heart, Star, Users, Plus } from "lucide-react";
import { useState } from "react";

const Community = () => {
  const [newPost, setNewPost] = useState("");

  const posts = [
    {
      id: 1,
      author: "Priya M.",
      avatar: "👩‍🦰",
      time: "2 hours ago",
      content: "Anyone have a good recipe for making dal more interesting for kids? My daughter is getting bored of the same taste!",
      likes: 12,
      replies: 5,
      tags: ["recipes", "kids", "dal"]
    },
    {
      id: 2,
      author: "Rajesh K.",
      avatar: "👨‍🌾",
      time: "4 hours ago", 
      content: "Sharing my grandmother's secret for making vegetables more nutritious - always add a pinch of jaggery while cooking. It enhances iron absorption!",
      likes: 28,
      replies: 8,
      tags: ["tips", "traditional", "nutrition"]
    },
    {
      id: 3,
      author: "ASHA Worker - Meera",
      avatar: "👩‍⚕️",
      time: "1 day ago",
      content: "Reminder: Green leafy vegetables are very important for children's growth. Try to include spinach, fenugreek leaves, or amaranth in daily meals.",
      likes: 45,
      replies: 12,
      tags: ["health-tip", "children", "vegetables"],
      isHealthWorker: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Community Forum
          </h1>
          <p className="text-gray-600">
            Connect with neighbors, share recipes, and learn from health experts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Share with Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ask a question, share a recipe, or give a nutrition tip..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-green-50">
                      #recipe
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      #tips
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-50">
                      #health
                    </Badge>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id} className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{post.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{post.author}</h3>
                          {post.isHealthWorker && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Health Worker
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{post.time}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-gray-200"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.replies}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipes Shared</span>
                  <span className="font-semibold">342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Tips</span>
                  <span className="font-semibold">156</span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Topics */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { tag: "kid-friendly-recipes", count: 28 },
                  { tag: "budget-nutrition", count: 22 },
                  { tag: "traditional-foods", count: 19 },
                  { tag: "quick-meals", count: 16 },
                  { tag: "home-remedies", count: 14 }
                ].map((topic, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <Badge variant="outline" className="cursor-pointer">
                      #{topic.tag}
                    </Badge>
                    <span className="text-sm text-gray-600">{topic.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Workers */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Health Workers Online</CardTitle>
                <CardDescription>
                  Get expert advice from certified health workers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "ASHA Meera", status: "online" },
                  { name: "ANM Sunita", status: "online" },
                  { name: "Dr. Ravi", status: "away" }
                ].map((worker, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-lg">👩‍⚕️</div>
                      <span className="text-sm font-medium">{worker.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      worker.status === 'online' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
