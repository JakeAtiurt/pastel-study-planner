import React from "react";
import { Heart, Book, Sparkles, Star, Coffee, Palette } from "lucide-react";

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
  const timeSlots = Array.from({ length: 21 }, (_, i) => 8 + i * 0.5); // 8:00 to 18:30 in 30-min intervals

  const scheduleData: ScheduleData = {
    Monday: [], // No classes
    Tuesday: [
      { subject: "Physics for Engineering", code: "SC133", startTime: 8, endTime: 9.5, color: "pink", icon: "sparkles" },
      { subject: "Critical Thinking", code: "LAS101", startTime: 9.5, endTime: 12.5, color: "green", icon: "heart" }
    ],
    Wednesday: [
      { subject: "Fundamental of Calculus", code: "MA111", startTime: 9.5, endTime: 11, color: "blue", icon: "star" },
      { subject: "Fundamental Chemistry", code: "SC123", startTime: 11, endTime: 12.5, color: "purple", icon: "book" },
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
      { subject: "Fundamental Chemistry", code: "SC123", startTime: 11, endTime: 12.5, color: "purple", icon: "book" },
      { subject: "Chemistry Lab", code: "SC173", startTime: 13.5, endTime: 16.5, color: "purple", icon: "book" }
    ],
    Saturday: [], // No classes
    Sunday: [] // No classes
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "heart": return <Heart className="w-3 h-3" />;
      case "book": return <Book className="w-3 h-3" />;
      case "sparkles": return <Sparkles className="w-3 h-3" />;
      case "star": return <Star className="w-3 h-3" />;
      case "coffee": return <Coffee className="w-3 h-3" />;
      case "palette": return <Palette className="w-3 h-3" />;
      default: return <Book className="w-3 h-3" />;
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

  const renderTimeGrid = () => {
    return (
      <div className="grid grid-cols-8 gap-1 md:gap-2 text-xs md:text-sm">
        {/* Header row */}
        <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg">
          <div className="text-center font-semibold text-purple-700">Time</div>
        </div>
        {days.map((day) => (
          <div key={day} className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg">
            <div className="text-center font-semibold text-purple-700 text-xs md:text-sm">
              {day.substring(0, 3)}
            </div>
          </div>
        ))}
        
        {/* Time slots */}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="bg-white/80 backdrop-blur-sm p-1 md:p-2 rounded-lg md:rounded-xl shadow-sm border border-pastel-pink-border">
              <div className="text-center text-xs font-medium text-muted-foreground">
                {formatTime(hour)}
              </div>
            </div>
            
            {/* Day columns */}
            {days.map((day) => {
              const classForSlot = scheduleData[day]?.find(
                (classBlock) => hour >= classBlock.startTime && hour < classBlock.endTime
              );
              
              return (
                <div key={`${day}-${hour}`} className="min-h-[25px] md:min-h-[30px] relative">
                  {classForSlot && hour === classForSlot.startTime && (
                    <div 
                      className={`absolute inset-x-0 rounded-xl md:rounded-2xl border-2 p-2 md:p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${getColorClasses(classForSlot.color)}`}
                      style={{
                        height: `${(classForSlot.endTime - classForSlot.startTime) * 50}px`,
                        zIndex: 10
                      }}
                    >
                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                        {getIcon(classForSlot.icon)}
                        <span className="text-xs font-bold">{classForSlot.code}</span>
                      </div>
                      <div className="text-xs font-medium leading-tight hidden sm:block">
                        {classForSlot.subject}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {`${formatTime(classForSlot.startTime)}–${formatTime(classForSlot.endTime)}`}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-pastel-pink/20 to-pastel-blue/20 p-3 md:p-6 print:bg-white print:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8 print:mb-6">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 print:text-black">
            ✨ My Weekly Schedule ✨
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg print:text-gray-600">Stay organized and beautiful! 💕</p>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-2xl border border-white/50 print:bg-white print:shadow-none print:border-gray-300">
          {renderTimeGrid()}
        </div>

        {/* Legend */}
        <div className="mt-4 md:mt-8 bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-white/50 print:bg-white print:shadow-none print:border-gray-300 print:mt-6">
          <h3 className="text-base md:text-lg font-semibold text-center mb-3 md:mb-4 text-purple-700 print:text-black">Subject Colors 🎨</h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {[
              { color: "pink", subject: "Physics & Laboratory", icon: "sparkles" },
              { color: "blue", subject: "Mathematics", icon: "star" },
              { color: "green", subject: "Critical Thinking", icon: "heart" },
              { color: "purple", subject: "Chemistry & Laboratory", icon: "book" },
              { color: "orange", subject: "Engineering Graphics", icon: "palette" },
              { color: "yellow", subject: "Innovation & Entrepreneurship", icon: "coffee" }
            ].map((item) => (
              <div key={item.color} className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 rounded-full border-2 text-xs md:text-sm ${getColorClasses(item.color)} print:border-gray-400`}>
                {getIcon(item.icon)}
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