import React from "react";
import { Heart, Book, Sparkles, Star, Coffee, Palette, TestTube } from "lucide-react";

interface ClassBlock {
  subject: string;
  code: string;
  startTime: number;
  endTime: number;
  color: string;
  icon: string;
}

interface ScheduleData {
  [key: string]: ClassBlock[];
}

const WeeklySchedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const scheduleData: ScheduleData = {
    Monday: [], // No classes
    Tuesday: [
      { subject: "Physics for Engineering", code: "SC133", startTime: 8, endTime: 9.5, color: "pink", icon: "sparkles" },
      { subject: "Critical Thinking", code: "LAS101", startTime: 9.5, endTime: 12.5, color: "green", icon: "heart" }
    ],
    Wednesday: [
      { subject: "Fundamental of Calculus", code: "MA111", startTime: 9.5, endTime: 11, color: "blue", icon: "star" },
      { subject: "Fundamental Chemistry", code: "SC123", startTime: 11, endTime: 12.5, color: "purple", icon: "testTube" },
      { subject: "Engineering Graphics", code: "ME100", startTime: 13.5, endTime: 15.5, color: "orange", icon: "palette" },
      { subject: "Engineering Graphics", code: "ME100", startTime: 15.5, endTime: 18.5, color: "orange", icon: "palette" }
    ],
    Thursday: [
      { subject: "Physics for Engineering", code: "SC133", startTime: 8, endTime: 9.5, color: "pink", icon: "sparkles" },
      { subject: "Physics Lab", code: "SC183", startTime: 9.5, endTime: 12.5, color: "pink", icon: "sparkles" },
      { subject: "Innovation & Entrepreneurial Mindset", code: "TU109", startTime: 13.5, endTime: 16.5, color: "yellow", icon: "coffee" }
    ],
    Friday: [
      { subject: "Fundamental of Calculus", code: "MA111", startTime: 9.5, endTime: 11, color: "blue", icon: "star" },
      { subject: "Fundamental Chemistry", code: "SC123", startTime: 11, endTime: 12.5, color: "purple", icon: "testTube" },
      { subject: "Chemistry Lab", code: "SC173", startTime: 13.5, endTime: 16.5, color: "purple", icon: "testTube" }
    ],
    Saturday: [], // No classes
    Sunday: [] // No classes
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "heart": return <Heart className="w-4 h-4" />;
      case "book": return <Book className="w-4 h-4" />;
      case "sparkles": return <Sparkles className="w-4 h-4" />;
      case "star": return <Star className="w-4 h-4" />;
      case "coffee": return <Coffee className="w-4 h-4" />;
      case "palette": return <Palette className="w-4 h-4" />;
      case "testTube": return <TestTube className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: "bg-pastel-pink border-pastel-pink-border text-pink-800",
      blue: "bg-pastel-blue border-pastel-blue-border text-blue-800",
      green: "bg-pastel-green border-pastel-green-border text-green-800",
      purple: "bg-pastel-purple border-pastel-purple-border text-purple-800",
      yellow: "bg-pastel-yellow border-pastel-yellow-border text-yellow-800",
      orange: "bg-pastel-orange border-pastel-orange-border text-orange-800"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.pink;
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTopPosition = (startTime: number) => {
    // Convert time to position from 8:00 (0%) to 19:00 (100%)
    const minTime = 8;
    const maxTime = 19;
    return ((startTime - minTime) / (maxTime - minTime)) * 100;
  };

  const getHeight = (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    const maxDuration = 11; // 11 hours from 8:00 to 19:00
    return (duration / maxDuration) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            🎀 My Uni Schedule 🎀
          </h1>
          <p className="text-gray-600 text-lg">Stay cute, stay productive! ✨</p>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Kawaii Sidebar */}
          <div className="hidden md:flex flex-col items-center bg-gradient-to-b from-pink-100 to-purple-100 rounded-3xl p-6 shadow-xl border-2 border-pink-200 w-48">
            <div className="text-center mb-6">
              <p className="text-sm font-semibold text-purple-700 mb-4 writing-mode-vertical-rl text-orientation-mixed rotate-180">
                ✨ Learn. Grow. Glow. ✨
              </p>
            </div>
            
            {/* Kawaii Sticker Stack */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-yellow-100 rounded-full p-3 shadow-lg border-2 border-yellow-200 transform rotate-12">
                <span className="text-2xl">✏️</span>
              </div>
              <div className="bg-blue-100 rounded-full p-3 shadow-lg border-2 border-blue-200 transform -rotate-6">
                <span className="text-2xl">📒</span>
              </div>
              <div className="bg-pink-100 rounded-full p-3 shadow-lg border-2 border-pink-200 transform rotate-6">
                <span className="text-2xl">✨</span>
              </div>
              <div className="bg-purple-100 rounded-full p-3 shadow-lg border-2 border-purple-200 transform -rotate-12">
                <span className="text-2xl">💗</span>
              </div>
              <div className="bg-green-100 rounded-full p-3 shadow-lg border-2 border-green-200 transform rotate-3">
                <span className="text-2xl">🌸</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-purple-600 font-medium">Aug 5 - Aug 11</p>
              <p className="text-xs text-gray-500">Week 32</p>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-white/50">
            <div className="grid grid-cols-7 gap-2 md:gap-4 h-[600px]">
              {/* Day Headers */}
              {days.map((day) => (
                <div key={day} className="text-center">
                  <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-3 rounded-2xl shadow-lg mb-4">
                    <h3 className="font-semibold text-purple-700 text-sm md:text-base">
                      {day}
                    </h3>
                  </div>
                  
                  {/* Day Column with Classes */}
                  <div className="relative h-full">
                    {scheduleData[day]?.map((classBlock, index) => (
                      <div
                        key={index}
                        className={`absolute w-full rounded-2xl border-2 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${getColorClasses(classBlock.color)}`}
                        style={{
                          top: `${getTopPosition(classBlock.startTime)}%`,
                          height: `${getHeight(classBlock.startTime, classBlock.endTime)}%`,
                          minHeight: '80px'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getIcon(classBlock.icon)}
                          <span className="text-xs font-bold">{classBlock.code}</span>
                        </div>
                        <div className="text-xs font-semibold leading-tight mb-2">
                          {classBlock.subject}
                        </div>
                        <div className="text-xs opacity-80 font-medium bg-white/30 rounded-lg px-2 py-1">
                          {`${formatTime(classBlock.startTime)} - ${formatTime(classBlock.endTime)}`}
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty day message */}
                    {scheduleData[day]?.length === 0 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        <div className="text-center">
                          <span className="text-2xl">🌸</span>
                          <p className="text-xs mt-1">Free day!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-white/50">
          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">Subject Colors 🎨</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { color: "pink", subject: "Physics & Lab", icon: "sparkles", emoji: "⚡" },
              { color: "blue", subject: "Mathematics", icon: "star", emoji: "📐" },
              { color: "green", subject: "Critical Thinking", icon: "heart", emoji: "💭" },
              { color: "purple", subject: "Chemistry & Lab", icon: "testTube", emoji: "🧪" },
              { color: "orange", subject: "Engineering Graphics", icon: "palette", emoji: "📐" },
              { color: "yellow", subject: "Innovation", icon: "coffee", emoji: "💡" }
            ].map((item) => (
              <div key={item.color} className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm ${getColorClasses(item.color)}`}>
                <span>{item.emoji}</span>
                <span className="font-medium">{item.subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;