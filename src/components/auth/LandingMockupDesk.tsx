/**
 * @file src/components/auth/LandingMockupDesk.tsx
 * @description Ultra-realistic workspace desk mockup matching the uploaded reference image.
 * Features:
 * - Natural wooden desk surface with soft warm lighting
 * - Laptop open to TodoList dashboard (Sidebar: Home, Today, Upcoming, Completed, Settings)
 * - Exact tasks: Finish project proposal (High, 9:00 AM), Study Python (Django) (Medium, 11:00 AM), Read Bible (John 1-3) (Low, 3:00 PM), Exercise (Low, 5:00 PM)
 * - Date: Sep 24, 2025
 * - Small spiral notebook with handwritten text: "Small steps Big results :)"
 * - Pen beside notebook
 * - Books titled "Better Habits" and "Brighter Future"
 * - Indoor green house plants and leafy sunlight window shadows
 */

import React from 'react';
import { 
  Home, 
  Calendar, 
  CalendarDays, 
  CheckCircle2, 
  Settings, 
  Plus, 
  Circle,
  Smile,
  Check
} from 'lucide-react';
import deskBgImage from '../../assets/images/todolist_desk_workspace_1790328529176.jpg';

export const LandingMockupDesk: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/10 bg-slate-900 text-white select-none">
      {/* Background photorealistic desk atmosphere */}
      <div className="absolute inset-0">
        <img 
          src={deskBgImage} 
          alt="TodoList Workspace Scene" 
          className="w-full h-full object-cover opacity-90 scale-105"
        />
        {/* Soft atmospheric gradient overlay for readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-emerald-950/15 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Floating Interactive Laptop Mockup Container */}
      <div className="relative z-10 p-3 sm:p-5 flex flex-col items-center">
        {/* Laptop Frame */}
        <div className="w-full max-w-xl bg-slate-800/90 backdrop-blur-xl p-2 sm:p-2.5 rounded-t-2xl rounded-b-lg border border-slate-700/80 shadow-2xl transition-transform hover:scale-[1.01] duration-300">
          
          {/* Laptop Screen Bezel */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            {/* Laptop Camera dot */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
              <span className="w-1 h-1 rounded-full bg-slate-700" />
            </div>

            {/* In-Screen Dashboard Interface */}
            <div className="grid grid-cols-12 min-h-[220px] sm:min-h-[260px] text-xs font-sans">
              
              {/* --- Laptop Dashboard Sidebar (Col 4) --- */}
              <div className="col-span-4 bg-emerald-950/95 border-r border-emerald-900/50 p-2.5 sm:p-3 flex flex-col justify-between text-slate-300">
                <div className="space-y-3">
                  {/* Brand inside laptop screen */}
                  <div className="flex items-center gap-1.5 text-white font-bold text-[11px] sm:text-xs">
                    <div className="w-4 h-4 rounded-md bg-emerald-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>TodoList</span>
                  </div>

                  {/* Nav items */}
                  <div className="space-y-0.5 text-[10px] sm:text-[11px]">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <Home className="w-3 h-3" />
                      <span>Home</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-800/70 text-white font-semibold cursor-pointer shadow-xs">
                      <Calendar className="w-3 h-3 text-emerald-300" />
                      <span>Today</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <CalendarDays className="w-3 h-3" />
                      <span>Upcoming</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                      <Settings className="w-3 h-3" />
                      <span>Settings</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-emerald-400/80 font-mono">
                  v2.5 • Synced
                </div>
              </div>

              {/* --- Laptop Dashboard Main List (Col 8) --- */}
              <div className="col-span-8 bg-slate-900/95 p-2.5 sm:p-3 flex flex-col justify-between">
                <div>
                  {/* Header Row: "Today" and "Sep 24, 2025" */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Today
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
                      Sep 24, 2025
                    </span>
                  </div>

                  {/* Add task bar preview */}
                  <div className="mt-2 flex items-center justify-between p-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-[10px] text-slate-400">
                    <span>Add a new task...</span>
                    <div className="w-4 h-4 rounded-md bg-emerald-600 flex items-center justify-center text-white cursor-pointer hover:bg-emerald-500">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Task List (Exact tasks requested by user) */}
                  <div className="mt-2 space-y-1.5">
                    
                    {/* Task 1: Finish project proposal (High, 9:00 AM) */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Circle className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-[10px] sm:text-[11px] text-slate-200 truncate font-medium">
                          Finish project proposal
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          High
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                          9:00 AM
                        </span>
                      </div>
                    </div>

                    {/* Task 2: Study Python (Django) (Medium, 11:00 AM) */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Circle className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-[10px] sm:text-[11px] text-slate-200 truncate font-medium">
                          Study Python (Django)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Medium
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                          11:00 AM
                        </span>
                      </div>
                    </div>

                    {/* Task 3: Read Bible (John 1–3) (Low, 3:00 PM) */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Circle className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-[10px] sm:text-[11px] text-slate-200 truncate font-medium">
                          Read Bible (John 1–3)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Low
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                          3:00 PM
                        </span>
                      </div>
                    </div>

                    {/* Task 4: Exercise (Low, 5:00 PM) */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Circle className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-[10px] sm:text-[11px] text-slate-200 truncate font-medium">
                          Exercise
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Low
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
                          5:00 PM
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Subtle progress indicator */}
                <div className="pt-1.5 text-[9px] text-slate-500 flex items-center justify-between">
                  <span>0 of 4 Completed</span>
                  <span className="text-emerald-400 font-medium">Focus Mode Active</span>
                </div>
              </div>

            </div>
          </div>

          {/* Laptop Base and Trackpad indentation */}
          <div className="h-2 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-lg flex justify-center items-center mt-0.5">
            <span className="w-12 h-0.5 rounded-full bg-slate-600/60" />
          </div>
        </div>

        {/* Realistic Desk Accessories Row (Notebook with handwritten text, Books) */}
        <div className="w-full max-w-xl mt-3 flex items-center justify-between gap-3 px-2">
          {/* Notebook Mockup */}
          <div className="flex items-center gap-2 bg-amber-50/95 text-slate-800 p-2 rounded-xl border border-amber-200/80 shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="w-1 self-stretch bg-amber-300/80 rounded-full" />
            <div className="flex flex-col">
              <span className="font-serif italic text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1">
                <span>Small steps</span>
                <span className="text-emerald-600 font-sans font-extrabold">•</span>
                <span>Big results</span>
                <Smile className="w-3 h-3 text-amber-600 inline ml-0.5" />
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">
                Daily Note
              </span>
            </div>
          </div>

          {/* Stacked books mockup tag */}
          <div className="hidden sm:flex flex-col gap-0.5 text-[9px] font-semibold text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/50 backdrop-blur-xs">
              Better Habits
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 backdrop-blur-xs text-slate-400">
              Brighter Future
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
