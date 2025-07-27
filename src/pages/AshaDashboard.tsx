import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AshaDashboard = () => {
  const [status, setStatus] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">ASHA Worker Dashboard</h1>
        <p className="text-gray-700 mb-6">Guide rural families, share health tips, and stay connected.</p>

        {/* ✅ Status Toggle */}
        <div className="mb-6">
          <Button
            onClick={() => setStatus(!status)}
            className={`${status ? "bg-green-600" : "bg-red-500"} text-white`}
          >
            {status ? "✅ Online" : "❌ Offline"}
          </Button>
        </div>

        {/* ✅ Tabs for Features */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="questions">Community Questions</TabsTrigger>
            <TabsTrigger value="upload">Upload Tips</TabsTrigger>
            <TabsTrigger value="status">Health Updates</TabsTrigger>
          </TabsList>

          {/* Questions */}
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Questions from Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No questions yet. (Demo feature)</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tips */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="bg-purple-600 text-white">📤 Upload Video</Button>
                <Button variant="outline" className="ml-4">📄 Upload PDF</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Community Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Track upcoming camps, anemia cases, child nutrition alerts. (Coming Soon)</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AshaDashboard;
