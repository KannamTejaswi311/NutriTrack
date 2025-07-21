
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { User, Settings, Bell, Download, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase"; // make sure your Firebase config exports db
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc  } from "firebase/firestore";
import i18n from "@/i18n";

const loggedInUser = {
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
};

const Profile = () => {
  const { logout } = useAuth();
const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: loggedInUser.name ?? "",
    email: loggedInUser.email ?? "",
    phone: "",
    age: "",
   // address: "",
  });  
  const [familyMembers, setFamilyMembers] = useState([
  { name: "Rahul Sharma", relation: "Spouse", age: 35 },
  { name: "Aarav Sharma", relation: "Child", age: 8 },
  { name: "Devi Sharma", relation: "Child", age: 5 }
]);
const handleLanguageChange = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("preferredLanguage", lang);

  if (currentUser) {
    const userRef = doc(db, "users", currentUser.uid);
    updateDoc(userRef, { language: lang });
  }
};

const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [newMember, setNewMember] = useState({ name: "", relation: "", age: "" });
const handleEditChange = (index: number, field: string, value: string) => {
  const updated = [...familyMembers];
  updated[index][field] = value;
  setFamilyMembers(updated);
};

const handleLogout = async () => {
  try {
    await logout();
    toast({
      title: "✅ Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/auth");
  } catch (err) {
    toast({
      title: "❌ Logout Failed",
      description: "Please try again.",
    });
  }
};

const { currentUser } = useAuth(); // for example

useEffect(() => {
  if (currentUser) {
    setFormData(prev => ({
      ...prev,
      name: currentUser.displayName ?? "",
      email: currentUser.email ?? "",
    }));
  }
}, [currentUser]);
useEffect(() => {
  const fetchUserData = async () => {
    if (!currentUser) return;

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setFormData(prev => ({
        ...prev,
        ...userData,
      }));
    }
  };

  fetchUserData();
}, [currentUser]);

const handleSave = async () => {
  try {
    if (!currentUser?.uid) {
      throw new Error("User not logged in");
    }
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, formData, { merge: true });

    await updateProfile(currentUser, {
      displayName: formData.name,
    });

    toast({
      title: "✅ Profile Updated",
      description: "Your changes have been saved successfully!",
    });
  } catch (err) {
    toast({
      title: "❌ Save Failed",
      description: "Something went wrong. Try again.",
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile & Settings
            </h1>
            <p className="text-gray-600">
              Manage your account and customize your NutriTrack experience
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}          // ⬅️ was defaultValue
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={formData.phone === "" ? "text-gray-400" : "text-black"}
                        placeholder="+91 98765 43210"
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={formData.age === "" ? "text-gray-400" : "text-black"}
                        placeholder="32"
                        />
                    </div>
                  </div>
                  
                {/*  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={formData.address === "" ? "text-gray-400" : "text-black"}
                        placeholder="Village Rampur, District Sitapur, UP"
                        />
                  </div>  */}

                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save
                </Button>

                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>My Family</CardTitle>
                  <CardDescription>
                    Add family members to get personalized nutrition recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Existing members list */}
                  <div className="space-y-4">
                    {familyMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="w-full">
                          {editingIndex === index ? (
                            <div className="grid md:grid-cols-3 gap-4">
                              <Input
                                value={member.name}
                                onChange={(e) => handleEditChange(index, "name", e.target.value)}
                                placeholder="Name"
                              />
                              <Input
                                value={member.relation}
                                onChange={(e) => handleEditChange(index, "relation", e.target.value)}
                                placeholder="Relation"
                              />
                              <Input
                                value={member.age}
                                onChange={(e) => handleEditChange(index, "age", e.target.value)}
                                placeholder="Age"
                                type="number"
                              />
                            </div>
                          ) : (
                            <>
                              <h4 className="font-medium text-gray-800">{member.name}</h4>
                              <p className="text-sm text-gray-600">
                                {member.relation} • {member.age} years old
                              </p>
                            </>
                          )}
                        </div>

                        <div className="ml-4">
                          {editingIndex === index ? (
                            <Button size="sm" onClick={() => setEditingIndex(null)}>
                              Save
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => setEditingIndex(index)}>
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new member */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                    <Input
                      placeholder="Relation"
                      value={newMember.relation}
                      onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                    />
                    <Input
                      placeholder="Age"
                      type="number"
                      value={newMember.age}
                      onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                    if (newMember.name && newMember.relation && newMember.age) {
                      setFamilyMembers([
                        ...familyMembers,
                        {
                          name: newMember.name,
                          relation: newMember.relation,
                          age: Number(newMember.age), // 🔁 convert to number
                        },
                      ]);
                      setNewMember({ name: "", relation: "", age: "" });
                      toast({
                        title: "👪 Member Added",
                        description: "Family member added successfully!",
                      });
                    } else {
                      toast({
                        title: "⚠️ Missing Info",
                        description: "Please fill out all fields.",
                      });
                    }
                  }}
                  >
                    Add Family Member
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Language & Region */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Language</Label>
                    <Select defaultValue="english">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                        <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Your Region</Label>
                    <Select defaultValue="north">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Meal Reminders</p>
                      <p className="text-sm text-gray-600">Get reminded to log your meals</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Quiz Notifications</p>
                      <p className="text-sm text-gray-600">Daily nutrition quiz reminders</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Community Updates</p>
                      <p className="text-sm text-gray-600">New posts and replies in community</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

                  <div className="pt-4 border-t space-y-4">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    🔓 Logout
                  </Button>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
