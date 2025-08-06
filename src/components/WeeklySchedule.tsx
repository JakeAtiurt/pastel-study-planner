import React from "react";
import { Heart, Book, Sparkles, Star, Coffee, Palette, TestTube } from "lucide-react";

interface ClassBlock {
  subject: string;
  code: string;
  section: string;
  startTime: number;
  endTime: number;
  color: string;
  icon: string;
  classroom?: string;
}

interface ScheduleData {
  [key: string]: ClassBlock[];
}

const WeeklySchedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const scheduleData: ScheduleData = {
    Monday: [], // No classes
    Tuesday: [
      { subject: "Physics for Engineering", code: "SC133", section: "010001", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4001" },
      { subject: "Critical Thinking", code: "LAS101", section: "230009", startTime: 9.5, endTime: 12.5, color: "mint", icon: "thinking", classroom: "SC1012" }
    ],
    Wednesday: [
      { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
      { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
      { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 13.5, endTime: 15.5, color: "peach", icon: "engineering", classroom: "EGR311" },
      { subject: "Engineering Graphics", code: "ME100", section: "908802", startTime: 15.5, endTime: 18.5, color: "peach", icon: "engineering", classroom: "EGR503" }
    ],
    Thursday: [
      { subject: "Physics for Engineering", code: "SC133", section: "010001", startTime: 8, endTime: 9.5, color: "pink", icon: "physics", classroom: "SC4001" },
      { subject: "Physics Lab", code: "SC183", section: "003201", startTime: 9.5, endTime: 12.5, color: "pink", icon: "physics" },
      { subject: "Innovation and Entrepreneurial Mindset", code: "TU109", section: "540001", startTime: 13.5, endTime: 16.5, color: "yellow", icon: "innovation", classroom: "SC3-413" }
    ],
    Friday: [
      { subject: "Fundamental of Calculus", code: "MA111", section: "070003", startTime: 9.5, endTime: 11, color: "blue", icon: "math", classroom: "SC3006" },
      { subject: "Fundamental Chemistry", code: "SC123", section: "080001", startTime: 11, endTime: 12.5, color: "lavender", icon: "chemistry", classroom: "SC3049" },
      { subject: "Chemistry Lab", code: "SC173", section: "009101", startTime: 13.5, endTime: 16.5, color: "lavender", icon: "chemistry" }
    ],
    Saturday: [], // No classes
    Sunday: [] // No classes
  };

  const getEmojiIcon = (iconType: string) => {
    switch (iconType) {
      case "physics": return "🌸";
      case "math": return "📘";
      case "chemistry": return "🧪";
      case "engineering": return "⚙️";
      case "thinking": return "🧠";
      case "innovation": return "💡";
      default: return "📚";
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: "bg-pink-100/80 border-pink-200 text-pink-900 shadow-pink-200/50",
      blue: "bg-blue-100/80 border-blue-200 text-blue-900 shadow-blue-200/50", 
      mint: "bg-emerald-100/80 border-emerald-200 text-emerald-900 shadow-emerald-200/50",
      lavender: "bg-purple-100/80 border-purple-200 text-purple-900 shadow-purple-200/50",
      yellow: "bg-amber-100/80 border-amber-200 text-amber-900 shadow-amber-200/50",
      peach: "bg-orange-100/80 border-orange-200 text-orange-900 shadow-orange-200/50"
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

  const getGridRow = (startTime: number, dayClasses: ClassBlock[], currentIndex: number) => {
    // Convert time to grid row based on relevant slots
    const baseIndex = relevantTimeSlots.findIndex(slot => slot >= startTime);
    
    // Add small offset for consecutive classes to create visual separation
    let offset = 0;
    if (currentIndex > 0) {
      const previousClass = dayClasses[currentIndex - 1];
      if (previousClass && previousClass.endTime === startTime) {
        offset = 1; // Add 1 grid row gap for visual separation
      }
    }
    
    return baseIndex + 1 + offset;
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

            {/* Grid Container with Enhanced Spacing */}
            <div className="grid grid-cols-7 gap-3 md:gap-4 relative">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <div 
                  className="grid grid-cols-7 gap-3 md:gap-4 h-full"
                  style={{ gridTemplateRows: `repeat(${relevantTimeSlots.length}, 42px)` }}
                >
                  {Array.from({ length: 7 * relevantTimeSlots.length }).map((_, index) => (
                    <div 
                      key={index} 
                      className="border-dashed border-gray-300 border-b last:border-b-0"
                    />
                  ))}
                </div>
              </div>

              {/* Day Columns - Enhanced Spacing */}
              {days.map((day, dayIndex) => (
                <div 
                  key={day} 
                  className="relative"
                  style={{ 
                    display: 'grid',
                    gridTemplateRows: `repeat(${relevantTimeSlots.length}, 42px)`,
                    gap: '8px',
                    minHeight: `${relevantTimeSlots.length * 50}px`
                  }}
                >
                  {/* Subject Background Tints */}
                  {scheduleData[day]?.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-2xl"></div>
                  )}

                   {/* Class Cards - Enhanced Layout with Clear Time Display */}
                  {scheduleData[day]?.map((classBlock, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl border-2 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 ${getColorClasses(classBlock.color)} z-10 relative overflow-hidden`}
                      style={{
                        gridRow: `${getGridRow(classBlock.startTime, scheduleData[day], index)} / span ${Math.max(4, getGridSpan(classBlock.startTime, classBlock.endTime))}`,
                        minHeight: '160px'
                      }}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                      
                      <div className="relative h-full flex flex-col">
                        {/* Top Section: Icon and Course Code */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getEmojiIcon(classBlock.icon)}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-wide">{classBlock.code}</span>
                            <span className="text-xs opacity-75 font-medium">Sec {classBlock.section}</span>
                            {classBlock.classroom && (
                              <span className="text-xs opacity-70 font-medium mt-0.5">{classBlock.classroom}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Middle Section: Subject Name with better spacing */}
                        <div className="text-xs font-medium leading-relaxed mb-3 flex-1">
                          {classBlock.subject}
                        </div>
                        
                        {/* Bottom Section: Clear Time Display */}
                        <div className="mt-auto pt-2 border-t border-white/20 pb-2">
                          <div className="bg-white/90 text-gray-800 text-xs font-bold rounded-lg px-2.5 py-1.5 shadow-sm border border-white/60 text-center">
                            {`${formatTime(classBlock.startTime)} – ${formatTime(classBlock.endTime)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Cute Free Day Icons */}
                  {scheduleData[day]?.length === 0 && (
                    <div 
                      className="flex flex-col items-center justify-center text-gray-400 bg-white/30 rounded-2xl p-4 border-2 border-dashed border-gray-300"
                      style={{ gridRow: `${Math.floor(relevantTimeSlots.length / 2)} / span 2` }}
                    >
                      <span className="text-3xl mb-2">
                        {day === 'Monday' ? '🌸' : day === 'Saturday' ? '🧠' : '📚'}
                      </span>
                      <span className="text-xs font-medium text-gray-500">Free Day</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend - Emoji Style */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">Subject Legend ✨</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { color: "pink", subject: "Physics & Labs", emoji: "🌸" },
              { color: "blue", subject: "Mathematics", emoji: "📘" },
              { color: "mint", subject: "Critical Thinking", emoji: "🍃" },
              { color: "lavender", subject: "Chemistry & Labs", emoji: "💜" },
              { color: "peach", subject: "Engineering Graphics", emoji: "🍑" },
              { color: "yellow", subject: "Innovation", emoji: "🍯" }
            ].map((item) => (
              <div key={item.color} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium ${getColorClasses(item.color)}`}>
                <span className="text-base">{item.emoji}</span>
                <span>{item.subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;