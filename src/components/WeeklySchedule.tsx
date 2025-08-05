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
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

  const scheduleData: ScheduleData = {
    Monday: [
      { subject: "Computer Science", code: "SC133", startTime: 8, endTime: 10, color: "pink", icon: "book" },
      { subject: "Liberal Arts", code: "LAS101", startTime: 10, endTime: 12, color: "green", icon: "heart" }
    ],
    Tuesday: [
      { subject: "Computer Science", code: "SC134", startTime: 8, endTime: 10, color: "pink", icon: "book" },
      { subject: "Mathematics", code: "MATH", startTime: 10, endTime: 12, color: "blue", icon: "star" },
      { subject: "Statistics", code: "SC123", startTime: 12, endTime: 13, color: "purple", icon: "sparkles" }
    ],
    Wednesday: [
      { subject: "Mathematics", code: "MATH", startTime: 10, endTime: 12, color: "blue", icon: "star" },
      { subject: "Statistics", code: "SC123", startTime: 12, endTime: 13, color: "purple", icon: "sparkles" }
    ],
    Thursday: [
      { subject: "Statistics", code: "SC183", startTime: 8, endTime: 10, color: "purple", icon: "sparkles" },
      { subject: "Tourism", code: "TU109", startTime: 13, endTime: 16, color: "blue", icon: "coffee" },
      { subject: "Statistics", code: "SC173", startTime: 16, endTime: 18, color: "purple", icon: "sparkles" }
    ],
    Friday: [
      { subject: "Mechanical Engineering", code: "ME100", startTime: 11, endTime: 13, color: "orange", icon: "palette" },
      { subject: "Mechanical Engineering", code: "ME100", startTime: 15, endTime: 17, color: "orange", icon: "palette" }
    ],
    Saturday: [],
    Sunday: []
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

  const renderTimeGrid = () => {
    return (
      <div className="grid grid-cols-8 gap-2">
        {/* Header row */}
        <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-4 rounded-2xl shadow-lg">
          <div className="text-center font-semibold text-purple-700">Time</div>
        </div>
        {days.map((day) => (
          <div key={day} className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-4 rounded-2xl shadow-lg">
            <div className="text-center font-semibold text-purple-700">{day}</div>
          </div>
        ))}
        
        {/* Time slots */}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-pastel-pink-border">
              <div className="text-center text-sm font-medium text-muted-foreground">
                {`${hour}:00 - ${hour + 1}:00`}
              </div>
            </div>
            
            {/* Day columns */}
            {days.map((day) => {
              const classForSlot = scheduleData[day]?.find(
                (classBlock) => hour >= classBlock.startTime && hour < classBlock.endTime
              );
              
              return (
                <div key={`${day}-${hour}`} className="min-h-[60px] relative">
                  {classForSlot && hour === classForSlot.startTime && (
                    <div 
                      className={`absolute inset-x-0 rounded-2xl border-2 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${getColorClasses(classForSlot.color)}`}
                      style={{
                        height: `${(classForSlot.endTime - classForSlot.startTime) * 60 + (classForSlot.endTime - classForSlot.startTime - 1) * 8}px`,
                        zIndex: 10
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(classForSlot.icon)}
                        <span className="text-xs font-bold">{classForSlot.code}</span>
                      </div>
                      <div className="text-xs font-medium leading-tight">
                        {classForSlot.subject}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {`${classForSlot.startTime}:00-${classForSlot.endTime}:00`}
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
    <div className="min-h-screen bg-gradient-to-br from-background via-pastel-pink/20 to-pastel-blue/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ✨ My Weekly Schedule ✨
          </h1>
          <p className="text-muted-foreground text-lg">Stay organized and beautiful! 💕</p>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50">
          {renderTimeGrid()}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">Subject Colors 🎨</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { color: "pink", subject: "Computer Science", icon: "book" },
              { color: "blue", subject: "Mathematics & Tourism", icon: "star" },
              { color: "green", subject: "Liberal Arts", icon: "heart" },
              { color: "purple", subject: "Statistics", icon: "sparkles" },
              { color: "orange", subject: "Mechanical Engineering", icon: "palette" }
            ].map((item) => (
              <div key={item.color} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getColorClasses(item.color)}`}>
                {getIcon(item.icon)}
                <span className="text-sm font-medium">{item.subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;