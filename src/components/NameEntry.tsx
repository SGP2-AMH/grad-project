import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NameEntryProps {
  onNameSubmit: (name: string) => void;
}

const NameEntry = ({ onNameSubmit }: NameEntryProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chess vs Robotic Arm
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Enter your name to begin the match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg h-12 shadow-md"
              autoFocus
            />
            <Button 
              type="submit" 
              className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all"
              disabled={!name.trim()}
            >
              Start Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NameEntry;
