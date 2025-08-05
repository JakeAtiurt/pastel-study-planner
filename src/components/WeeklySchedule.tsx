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

  // Create optimized time slots - only show relevant hours (8:00 to 19:00)
  const timeSlots = Array.from({ length: 22 }, (_, i) => 8 + i * 0.5);
  
  // Get all class times to determine which slots we actually need
  const getAllClassTimes = () => {
    const times = new Set<number>();
    Object.values(scheduleData).forEach(dayClasses => {
      dayClasses.forEach(classBlock => {
        for (let time = classBlock.startTime; time < classBlock.endTime; time += 0.5) {
          times.add(time);
        }
      });
    });
    return Array.from(times).sort((a, b) => a - b);
  };

  const activeTimeSlots = getAllClassTimes();
  const minTime = Math.max(8, Math.min(...activeTimeSlots) - 0.5);
  const maxTime = Math.min(19, Math.max(...activeTimeSlots) + 0.5);
  const relevantTimeSlots = timeSlots.filter(time => time >= minTime && time <= maxTime);

  const getGridRow = (startTime: number) => {
    // Convert time to grid row based on relevant slots
    const index = relevantTimeSlots.findIndex(slot => slot >= startTime);
    return index + 1;
  };

  const getGridSpan = (startTime: number, endTime: number) => {
    // Calculate span more accurately
    return Math.round((endTime - startTime) * 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            🎀 My Uni Schedule 🎀
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Stay cute, stay productive! ✨</p>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Kawaii Sidebar - Made Thinner */}
          <div className="hidden md:flex flex-col items-center bg-gradient-to-b from-pink-100 to-purple-100 rounded-3xl p-4 shadow-xl border-2 border-pink-200 w-36">
            <div className="text-center mb-4">
              <p className="text-xs font-semibold text-purple-700 mb-3 writing-mode-vertical-rl text-orientation-mixed rotate-180">
                ✨ Learn. Grow. Glow. ✨
              </p>
            </div>
            
            {/* Kawaii Sticker Stack - Compact */}
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-yellow-100 rounded-full p-2 shadow-lg border-2 border-yellow-200 transform rotate-12">
                <span className="text-xl">✏️</span>
              </div>
              <div className="bg-blue-100 rounded-full p-2 shadow-lg border-2 border-blue-200 transform -rotate-6">
                <span className="text-xl">📒</span>
              </div>
              <div className="bg-pink-100 rounded-full p-2 shadow-lg border-2 border-pink-200 transform rotate-6">
                <span className="text-xl">✨</span>
              </div>
              <div className="bg-purple-100 rounded-full p-2 shadow-lg border-2 border-purple-200 transform -rotate-12">
                <span className="text-xl">💗</span>
              </div>
              <div className="bg-green-100 rounded-full p-2 shadow-lg border-2 border-green-200 transform rotate-3">
                <span className="text-xl">🌸</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-purple-600 font-medium">Aug 5 - Aug 11</p>
              <p className="text-xs text-gray-500">Week 32</p>
            </div>
          </div>

          {/* Schedule Grid - More Compact */}
          <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border border-white/50">
            {/* Day Headers - Compact */}
            <div className="grid grid-cols-7 gap-3 md:gap-4 mb-4">
              {days.map((day) => (
                <div key={day} className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-3 rounded-2xl shadow-lg">
                  <h3 className="font-semibold text-purple-700 text-sm md:text-base text-center">
                    {day}
                  </h3>
                </div>
              ))}
            </div>

            {/* Grid Container with Compact Time Slots */}
            <div className="grid grid-cols-7 gap-3 md:gap-4 relative">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <div 
                  className="grid grid-cols-7 gap-3 md:gap-4 h-full"
                  style={{ gridTemplateRows: `repeat(${relevantTimeSlots.length}, 35px)` }}
                >
                  {Array.from({ length: 7 * relevantTimeSlots.length }).map((_, index) => (
                    <div 
                      key={index} 
                      className="border-dashed border-gray-300 border-b last:border-b-0"
                    />
                  ))}
                </div>
              </div>

              {/* Day Columns - Compact */}
              {days.map((day, dayIndex) => (
                <div 
                  key={day} 
                  className="relative"
                  style={{ 
                    display: 'grid',
                    gridTemplateRows: `repeat(${relevantTimeSlots.length}, 35px)`,
                    gap: '4px',
                    minHeight: `${relevantTimeSlots.length * 39}px`
                  }}
                >
                  {/* Subject Background Tints */}
                  {scheduleData[day]?.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-2xl"></div>
                  )}

                  {/* Class Cards - Compact */}
                  {scheduleData[day]?.map((classBlock, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl border-2 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 ${getColorClasses(classBlock.color)} z-10 relative overflow-hidden`}
                      style={{
                        gridRow: `${getGridRow(classBlock.startTime)} / span ${Math.max(1, getGridSpan(classBlock.startTime, classBlock.endTime))}`,
                        minHeight: '60px'
                      }}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      
                      <div className="relative">
                        {/* Course Code and Icon - Compact */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1 bg-white/40 rounded-full">
                            {getIcon(classBlock.icon)}
                          </div>
                          <span className="text-sm font-bold tracking-wide">{classBlock.code}</span>
                        </div>
                        
                        {/* Subject Name - More compact */}
                        <div className="text-xs font-medium leading-tight mb-2 line-clamp-2">
                          {classBlock.subject.length > 20 ? 
                            classBlock.subject.substring(0, 18) + "..." : 
                            classBlock.subject
                          }
                        </div>
                        
                        {/* Time Badge - Smaller */}
                        <div className="inline-flex text-xs font-medium bg-white/50 backdrop-blur-sm rounded-full px-2 py-1 border border-white/30">
                          {`${formatTime(classBlock.startTime)}–${formatTime(classBlock.endTime)}`}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Simplified Empty Day */}
                  {scheduleData[day]?.length === 0 && (
                    <div 
                      className="flex items-center justify-center text-gray-300"
                      style={{ gridRow: `${Math.floor(relevantTimeSlots.length / 2)} / span 1` }}
                    >
                      <span className="text-2xl opacity-50">🌸</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend - Compact Bottom Margin */}
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border border-white/50">
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