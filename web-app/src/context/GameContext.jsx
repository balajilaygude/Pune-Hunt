"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  TASK_BLOCKS,
  INITIAL_GAME_RECORDS,
  fetchGamesFromServer,
  saveGameToFile,
  resetGamesFile,
  getStoredActiveGame,
  saveActiveGame,
  calculateLeaderboard,
  calculateSummaryStats
} from "@/data/data";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [history, setHistory] = useState(INITIAL_GAME_RECORDS);
  const [activeGame, setActiveGame] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [latestFinishedGame, setLatestFinishedGame] = useState(null);

  // Guard against duplicate win handling in fast/double execution
  const isFinishingRef = useRef(false);

  // Load from games.js via API and active game on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const serverGames = await fetchGamesFromServer();
      if (isMounted) {
        setHistory(serverGames);
      }
      const loadedActive = getStoredActiveGame();
      if (isMounted) {
        setActiveGame(loadedActive);
        setHydrated(true);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync activeGame to storage whenever it updates
  useEffect(() => {
    if (!hydrated) return;
    saveActiveGame(activeGame);
  }, [activeGame, hydrated]);

  // Start new 2-player game
  const startNewGame = ({
    player1Name = "Player 1",
    player1Block = "A",
    player2Name = "Player 2",
    player2Block = "B",
    location = "Pune Exploration Route"
  }) => {
    isFinishingRef.current = false;
    const p1 = player1Name.trim() || "Player 1";
    const p2 = player2Name.trim() || "Player 2";
    const b1 = TASK_BLOCKS[player1Block] ? player1Block : "A";
    const b2 = TASK_BLOCKS[player2Block] ? player2Block : "B";

    const newGame = {
      id: "game-" + Date.now(),
      startTime: new Date().toISOString(),
      location: location.trim() || "Pune Street Trail",
      status: "in-progress",
      winnerName: null,
      isTie: false,
      player1: {
        name: p1,
        blockId: b1,
        blockTitle: TASK_BLOCKS[b1].title,
        completedTaskIds: []
      },
      player2: {
        name: p2,
        blockId: b2,
        blockTitle: TASK_BLOCKS[b2].title,
        completedTaskIds: []
      },
      recentActivity: [
        {
          id: "act-" + Date.now(),
          text: `Game commenced: ${p1} (Block ${b1}) vs ${p2} (Block ${b2})`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setActiveGame(newGame);
    return newGame;
  };

  // Toggle spotting task completion for player1 or player2
  const toggleTask = async (playerKey, taskId) => {
    if (!activeGame || activeGame.status === "completed" || isFinishingRef.current) return;

    const player = activeGame[playerKey];
    if (!player) return;

    const alreadyChecked = player.completedTaskIds.includes(taskId);
    const updatedTaskIds = alreadyChecked
      ? player.completedTaskIds.filter((id) => id !== taskId)
      : [...player.completedTaskIds, taskId];

    const blockInfo = TASK_BLOCKS[player.blockId];
    const taskObj = blockInfo?.tasks.find((t) => t.id === taskId);
    const taskLabel = taskObj ? taskObj.text : taskId;

    const activityItem = {
      id: "act-" + Date.now() + Math.random(),
      text: alreadyChecked
        ? `${player.name} unchecked "${taskLabel.slice(0, 32)}..."`
        : `🎯 ${player.name} spotted "${taskLabel.slice(0, 32)}..." (${updatedTaskIds.length}/10)`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedPlayer = {
      ...player,
      completedTaskIds: updatedTaskIds
    };

    const otherKey = playerKey === "player1" ? "player2" : "player1";
    const otherPlayer = activeGame[otherKey];

    const p1Score = playerKey === "player1" ? updatedTaskIds.length : otherPlayer.completedTaskIds.length;
    const p2Score = playerKey === "player2" ? updatedTaskIds.length : otherPlayer.completedTaskIds.length;

    // Check if this action triggers a WIN (Reaches 10 spots)
    if (updatedTaskIds.length === 10 && !isFinishingRef.current) {
      isFinishingRef.current = true;

      const isTie = otherPlayer.completedTaskIds.length === 10;
      const winnerName = isTie ? "Tie / Draw" : player.name;

      const durationMinutes = Math.max(
        1,
        Math.round((Date.now() - new Date(activeGame.startTime).getTime()) / 60000)
      );

      const finishedRecord = {
        id: activeGame.id,
        date: new Date().toISOString(),
        location: activeGame.location,
        player1: {
          name: activeGame.player1.name,
          blockId: activeGame.player1.blockId,
          blockTitle: activeGame.player1.blockTitle,
          score: p1Score,
          completedTaskIds: playerKey === "player1" ? updatedTaskIds : activeGame.player1.completedTaskIds,
          winner: !isTie && (playerKey === "player1" || activeGame.player1.name === winnerName)
        },
        player2: {
          name: activeGame.player2.name,
          blockId: activeGame.player2.blockId,
          blockTitle: activeGame.player2.blockTitle,
          score: p2Score,
          completedTaskIds: playerKey === "player2" ? updatedTaskIds : activeGame.player2.completedTaskIds,
          winner: !isTie && (playerKey === "player2" || activeGame.player2.name === winnerName)
        },
        winnerName,
        durationMinutes,
        isTie,
        status: "completed"
      };

      // 1. Save to games.js via API
      saveGameToFile(finishedRecord).then((updatedList) => {
        if (updatedList) {
          setHistory(updatedList);
        }
      });

      // 2. Optimistically update local history without duplicate
      setHistory((prev) => {
        const withoutThis = prev.filter((g) => g.id !== finishedRecord.id);
        return [finishedRecord, ...withoutThis];
      });

      // 3. Show Winner Celebration
      setLatestFinishedGame(finishedRecord);
      setWinnerModalOpen(true);

      // 4. CLEAR active game immediately so user does not need to manually abandon it!
      setActiveGame(null);
      saveActiveGame(null);
      return;
    }

    // Standard in-progress update
    setActiveGame({
      ...activeGame,
      [playerKey]: updatedPlayer,
      recentActivity: [activityItem, ...(activeGame.recentActivity || [])].slice(0, 8)
    });
  };

  // Abandon current active game
  const abandonGame = () => {
    isFinishingRef.current = false;
    setActiveGame(null);
    saveActiveGame(null);
  };

  // Restart new match with the same players
  const restartSameMatch = () => {
    const p1 = latestFinishedGame?.player1?.name || activeGame?.player1?.name || "Player 1";
    const b1 = latestFinishedGame?.player1?.blockId || activeGame?.player1?.blockId || "A";
    const p2 = latestFinishedGame?.player2?.name || activeGame?.player2?.name || "Player 2";
    const b2 = latestFinishedGame?.player2?.blockId || activeGame?.player2?.blockId || "B";
    const loc = latestFinishedGame?.location || activeGame?.location || "Pune Exploration Route";

    startNewGame({
      player1Name: p1,
      player1Block: b1,
      player2Name: p2,
      player2Block: b2,
      location: loc
    });
    setWinnerModalOpen(false);
  };

  // Reset all completed games back to empty in games.js
  const handleResetData = async () => {
    isFinishingRef.current = false;
    await resetGamesFile();
    setHistory([]);
    setActiveGame(null);
    saveActiveGame(null);
    setWinnerModalOpen(false);
    setLatestFinishedGame(null);
  };

  // Derived memoized views
  const leaderboard = useMemo(() => calculateLeaderboard(history), [history]);
  const summaryStats = useMemo(() => calculateSummaryStats(history, activeGame), [history, activeGame]);

  const value = {
    hydrated,
    activeGame,
    history,
    leaderboard,
    summaryStats,
    startNewGame,
    toggleTask,
    abandonGame,
    restartSameMatch,
    handleResetData,
    winnerModalOpen,
    setWinnerModalOpen,
    latestFinishedGame,
    setLatestFinishedGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
