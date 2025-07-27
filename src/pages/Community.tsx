
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { MessageSquare, Heart, Star, Users, Plus } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/posts";
interface Comment {
  author: string;
  text: string;
  time: string;
}
interface Post {
  _id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies: number;
  tags: string[];
  image: string | null;
  audio: string | null;
  flagged: boolean;
  comments?: Comment[]; // ✅ Add this
  isHealthWorker?: boolean; // optional
}
const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [newImage, setNewImage] = useState<string | null>(null);
const [audioURL, setAudioURL] = useState<string | null>(null);
const [isRecording, setIsRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

const activeMembers = new Set(posts.map(p => p.author)).size;
const recipesCount = posts.filter(p => p.tags.includes("recipes")).length;
const healthTipsCount = posts.filter(p => p.tags.includes("health")).length;

const [replyText, setReplyText] = useState<string>("");
const [activePost, setActivePost] = useState<string | null>(null); // For tracking which post is being replied to
const [tags, setTags] = useState<string[]>([]);

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");

  const fetchQuestions = async () => {
    const res = await fetch("http://localhost:5000/api/questions");
    const data = await res.json();
    setQuestions(data);
  };

    const [isQuestion, setIsQuestion] = useState(false);

const tagCounts: Record<string, number> = {};
posts.forEach(post => {
  post.tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});
const popularTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
const [healthWorkers, setHealthWorkers] = useState([
  { name: "ASHA Meera", status: "online" },
  { name: "ANM Sunita", status: "online" },
  { name: "Dr. Ravi", status: "away" }
]);
useEffect(() => {
  axios.get(API_URL)
    .then((res) => {
      console.log("API Response:", res.data);
      setPosts(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("API Error:", err);
      setLoading(false);
    });
}, []);

useEffect(() => {
    fetchQuestions();
  }, []);

 const handleAsk = async () => {
    await fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, askedBy: "User" })
    });
    setQuestion("");
    fetchQuestions();
  };

const handlePost = async () => {
  if (!newPost && !newImage && !audioURL) {
    alert("Please add some content!");
    return;
  }

  const newEntry = {
    author: "You",
    avatar: "🧑",
    time: "Just now",
    content: newPost,
    likes: 0,
    replies: 0,
     tags, // ✅ dynamic tags
    image: newImage,
    audio: audioURL,
    flagged: false
  };
  const res = await axios.post(API_URL, newEntry);
  setPosts([res.data, ...posts]);
  setNewPost("");
  setNewImage(null);
  setAudioURL(null);
};
const handleLike = async (id: string) => {
  const res = await axios.put(`${API_URL}/${id}/like`);
  setPosts(posts.map((p) => (p._id === id ? res.data : p)));
};

const handleComment = async (id: string) => {
  if (!replyText) return alert("Reply cannot be empty");

  const res = await axios.put(`${API_URL}/${id}/comment`, {
    author: "You",
    text: replyText
  });

  setPosts(posts.map((p) => (p._id === id ? res.data : p)));
  setReplyText("");
  setActivePost(null);
};

const handleReply = async (id: string) => {
  const res = await axios.put(`${API_URL}/${id}/reply`);
  setPosts(posts.map((p) => (p._id === id ? res.data : p)));
};

const handleFlag = async (id: string) => {
  const res = await axios.put(`${API_URL}/${id}/flag`);
  setPosts(posts.map((p) => (p._id === id ? res.data : p)));
};

if (loading) return <p>Loading...</p>;
if (!posts || posts.length === 0) return <p>No posts available</p>;

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
                <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }}
  className="mt-2"
/>

{/* Preview image */}
{newImage && (
  <img src={newImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
)}
<Button
  variant="outline"
  onClick={async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" }); // ✅ Use webm
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);

        // ✅ Stop mic after recording
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
    }
  }}
>
  {isRecording ? (
    <span className="text-red-600 animate-pulse">● Recording...</span>
  ) : (
    "🎤 Record Voice"
  )}
</Button>

{/* Audio Preview */}
{audioURL && (
  <audio controls src={audioURL} className="mt-2 w-full"></audio>
)}
<Input
  placeholder="Add tags (comma separated)"
  className="mt-2"
  onChange={(e) => setTags(e.target.value.split(","))}
/>

<Button
  className="bg-green-600 hover:bg-green-700 mt-2"
  disabled={!newPost && !newImage && !audioURL}
  onClick={handlePost}
>
  Post
</Button>
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
                </div>
                <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isQuestion}
    onChange={() => setIsQuestion(!isQuestion)}
  />
  <label>Ask as Question</label>
</div>

              </CardContent>
            </Card>

            {/* Posts */}
{posts.map((post) => (
  <Card key={post._id} className="bg-white/80 backdrop-blur-sm">
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
      {/* Post Content */}
      <p className="text-gray-700">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="Post" className="rounded-lg max-h-60" />
      )}
      {post.audio && (
        <audio controls src={post.audio} className="mt-2 w-full"></audio>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="cursor-pointer">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Comments */}
      {post.comments && post.comments.length > 0 && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Replies:</h4>
          {post.comments.map((c, i) => (
            <div key={i} className="border-b last:border-none py-2">
              <p className="text-sm">
                <strong>{c.author}</strong>: {c.text}
              </p>
              <p className="text-xs text-gray-500">{c.time}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={() => handleLike(post._id)}>
          <Heart className="w-4 h-4 mr-1" /> {post.likes}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActivePost(post._id)}
        >
          💬 Reply
        </Button>

        {activePost === post._id && (
          <div className="mt-3">
            <Input
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button
              className="mt-2 bg-green-600 text-white"
              onClick={() => handleComment(post._id)}
            >
              Submit Reply
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFlag(post._id)}
        >
          🚩 {post.flagged ? "Unflag" : "Flag"}
        </Button>
      </div>

      {post.flagged && (
        <p className="text-red-600 font-semibold">
          ⚠ This post is flagged for review
        </p>
      )}
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
                  <span className="font-semibold">{activeMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipes Shared</span>
                  <span className="font-semibold">{recipesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Tips</span>
                  <span className="font-semibold">{healthTipsCount}</span>
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
