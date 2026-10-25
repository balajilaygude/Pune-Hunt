"use client";

import React from "react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import CurrentGameCard from "@/components/dashboard/CurrentGameCard";
import RecentGamesTable from "@/components/dashboard/RecentGamesTable";
import LeaderboardCard from "@/components/dashboard/LeaderboardCard";

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      {/* 1. Welcome Section */}
      <WelcomeBanner />



      {/* 3. Current Game Card (Interactive & Launchable) */}
      <CurrentGameCard />

      {/* 4. Recent Games & Leaderboard in a clean 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentGamesTable />
        <LeaderboardCard />
      </div>
    </div>
  );
}
