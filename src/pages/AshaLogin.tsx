import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ashaData from "@/data/ashaWorkers.json"; // ✅ Import JSON database

const AshaLogin = () => {
  const [ashaId, setAshaId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = ashaData.find(
      (worker) => worker.ashaId === ashaId && worker.password === password
    );

    if (user) {
      localStorage.setItem("ashaUser", JSON.stringify(user));
      navigate("/asha-dashboard");
    } else {
      setError("Invalid ASHA ID or Password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Card className="w-[400px] p-6 shadow-lg">
        <CardHeader>
          <CardTitle>ASHA Worker Login</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="Enter ASHA ID"
            value={ashaId}
            onChange={(e) => setAshaId(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <Button onClick={handleLogin} className="w-full bg-blue-600 text-white">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AshaLogin;
