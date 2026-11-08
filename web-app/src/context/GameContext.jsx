"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  TASK_BLOCKS,
  INITIAL_GAME_RECORDS,
  fetchGamesFromServer,
  getStoredActiveGame,
  saveActiveGame,
  calculateLeaderboard,
  calculateSummaryStats
} from "@/data/data";
import { getSocket, roomsAPI, gamesAPI } from "@/lib/api";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [history, setHistory] = useState(INITIAL_GAME_RECORDS);
  const [activeGame, setActiveGame] = useState(null); // Local 1-device game
  const [hydrated, setHydrated] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [latestFinishedGame, setLatestFinishedGame] = useState(null);

  // Live Online Challenge State
  const [liveRoom, setLiveRoom] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); // "player1" | "player2" | null
  const [opponentAlert, setOpponentAlert] = useState(null); // Real-time toast when opponent spots task

  const isFinishingRef = useRef(false);

  // Load history from Backend (MongoDB) with fallback on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Try backend API first
        const backendHistory = await gamesAPI.getHistory();
        if (isMounted && backendHistory.success && Array.isArray(backendHistory.games)) {
          setHistory(backendHistory.games);
        } else {
          // Fallback to local server API
          const serverGames = await fetchGamesFromServer();
          if (isMounted && Array.isArray(serverGames)) {
            setHistory(serverGames);
          }
        }
      } catch (err) {
        console.warn("Using fallback game data:", err);
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

  // Sync active local game to storage
  useEffect(() => {
    if (!hydrated) return;
    saveActiveGame(activeGame);
  }, [activeGame, hydrated]);

  // Socket.IO event listeners for live room
  useEffect(() => {
    if (!liveRoom?.roomCode) return;

    const socket = getSocket();
    const roomCode = liveRoom.roomCode;

    const handleRoomState = (room) => {
      if (room && room.roomCode === roomCode) {
        setLiveRoom(room);
      }
    };

    const handlePlayerJoined = ({ room, player2 }) => {
      console.log("Player 2 joined live room:", player2);
      if (room) setLiveRoom(room);
      setOpponentAlert({
        type: "join",
        text: `🎉 ${player2.name} joined with Block ${player2.blockId}! Hunt is now LIVE!`
      });
      setTimeout(() => setOpponentAlert(null), 4000);
    };

    const handleGameUpdated = (room) => {
      if (room && room.roomCode === roomCode) {
        setLiveRoom(room);
      }
    };

    const handleOpponentTask = ({ playerName, taskText, alreadyChecked, score }) => {
      setOpponentAlert({
        type: "task",
        text: alreadyChecked
          ? `⚠️ ${playerName} unchecked a task (${score}/10)`
          : `🎯 ${playerName} spotted: "${(taskText || "a task").slice(0, 30)}..." (${score}/10)`
      });
      setTimeout(() => setOpponentAlert(null), 3500);
    };

    const handleGameOver = ({ winnerName, isTie, room, durationMinutes }) => {
      console.log("🏆 Game Over received via socket:", winnerName);
      if (room) {
        setLiveRoom(room);
        setLatestFinishedGame({
          ...room,
          winnerName,
          isTie,
          durationMinutes: durationMinutes || room.durationMinutes || 1
        });
      }
      setWinnerModalOpen(true);

      // Refresh history from backend
      gamesAPI.getHistory().then((res) => {
        if (res.success && Array.isArray(res.games)) {
          setHistory(res.games);
        }
      });
    };

    const handleBlockSelected = ({ playerRole: selRole, blockId, room }) => {
      if (room && room.roomCode === roomCode) {
        setLiveRoom(room);
        const selPlayerName = room[selRole]?.name || (selRole === "player1" ? "Player 1" : "Player 2");
        setOpponentAlert({
          type: "block",
          text: `📦 ${selPlayerName} selected Block ${blockId}!`
        });
        setTimeout(() => setOpponentAlert(null), 3000);
      }
    };

    const handleGameAbandoned = ({ message }) => {
      setOpponentAlert({
        type: "abandon",
        text: message || "Opponent abandoned the challenge."
      });
      setTimeout(() => {
        setOpponentAlert(null);
        setLiveRoom(null);
      }, 3000);
    };

    socket.on("room_state", handleRoomState);
    socket.on("player_joined", handlePlayerJoined);
    socket.on("game_updated", handleGameUpdated);
    socket.on("block_selected", handleBlockSelected);
    socket.on("opponent_task_updated", handleOpponentTask);
    socket.on("game_over", handleGameOver);
    socket.on("game_abandoned", handleGameAbandoned);

    return () => {
      socket.off("room_state", handleRoomState);
      socket.off("player_joined", handlePlayerJoined);
      socket.off("game_updated", handleGameUpdated);
      socket.off("block_selected", handleBlockSelected);
      socket.off("opponent_task_updated", handleOpponentTask);
      socket.off("game_over", handleGameOver);
      socket.off("game_abandoned", handleGameAbandoned);
    };
  }, [liveRoom?.roomCode]);

  // LIVE ROOM: Create Challenge Room (Player 1)
  const createLiveRoom = async ({ blockId = "A", location = "FC Road & Deccan", playerName }) => {
    try {
      const res = await roomsAPI.create({ blockId, location, playerName });
      if (res.success && res.room) {
        setLiveRoom(res.room);
        setPlayerRole("player1");
        setActiveGame(null); // Switch from local mode to live mode

        const socket = getSocket();
        socket.emit("join_room", {
          roomCode: res.room.roomCode,
          playerName: res.room.player1.name
        });
        return { success: true, room: res.room };
      }
      return { success: false, message: res.message || "Failed to create room" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // LIVE ROOM: Join Challenge Room (Player 2)
  const joinLiveRoom = async ({ roomCode, blockId = "B", playerName }) => {
    try {
      const res = await roomsAPI.join({ roomCode, blockId, playerName });
      if (res.success && res.room) {
        setLiveRoom(res.room);
        setPlayerRole(res.role || "player2");
        setActiveGame(null);

        const socket = getSocket();
        socket.emit("join_room", {
          roomCode: res.room.roomCode,
          playerName: res.role === "player1" ? res.room.player1.name : res.room.player2.name
        });
        return { success: true, room: res.room, role: res.role };
      }
      return { success: false, message: res.message || "Failed to join room" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // LIVE ROOM: Toggle task completion in real-time
  const toggleLiveTask = (taskId, taskText) => {
    if (!liveRoom || !playerRole || liveRoom.status === "completed") return;

    const socket = getSocket();
    socket.emit("toggle_task", {
      roomCode: liveRoom.roomCode,
      playerRole,
      taskId,
      taskText
    });

    // Optimistic local update for zero-latency instant tap response
    setLiveRoom((prev) => {
      if (!prev) return prev;
      const player = prev[playerRole];
      if (!player) return prev;

      const alreadyChecked = player.completedTaskIds.includes(taskId);
      const updated = alreadyChecked
        ? player.completedTaskIds.filter((id) => id !== taskId)
        : [...player.completedTaskIds, taskId];

      return {
        ...prev,
        [playerRole]: {
          ...player,
          completedTaskIds: updated,
          score: updated.length
        }
      };
    });
  };

  // LIVE ROOM: Abandon live match
  const abandonLiveRoom = async () => {
    if (!liveRoom) return;
    try {
      await roomsAPI.abandon(liveRoom.roomCode);
    } catch (err) {
      console.error(err);
    }
    setLiveRoom(null);
    setPlayerRole(null);
  };

  // LIVE ROOM: Select spotting block after both players connect
  const selectLiveBlock = (blockId) => {
    if (!liveRoom?.roomCode || !playerRole) return;
    const socket = getSocket();
    socket.emit("select_block", {
      roomCode: liveRoom.roomCode,
      playerRole,
      blockId
    });
  };

  // LOCAL 1-DEVICE GAME: Start new game
  const startNewGame = ({
    player1Name = "Player 1",
    player1Block = "A",
    player2Name = "Player 2",
    player2Block = "B",
    location = "Pune Exploration Route"
  }) => {
    isFinishingRef.current = false;
    setLiveRoom(null);
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

  // LOCAL 1-DEVICE GAME: Toggle task
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

      setHistory((prev) => {
        const withoutThis = prev.filter((g) => g.id !== finishedRecord.id);
        return [finishedRecord, ...withoutThis];
      });

      setLatestFinishedGame(finishedRecord);
      setWinnerModalOpen(true);
      setActiveGame(null);
      saveActiveGame(null);
      return;
    }

    setActiveGame({
      ...activeGame,
      [playerKey]: updatedPlayer,
      recentActivity: [activityItem, ...(activeGame.recentActivity || [])].slice(0, 8)
    });
  };

  const abandonGame = () => {
    isFinishingRef.current = false;
    setActiveGame(null);
    saveActiveGame(null);
  };

  const restartSameMatch = () => {
    const p1 = latestFinishedGame?.player1?.name || "Player 1";
    const b1 = latestFinishedGame?.player1?.blockId || "A";
    const p2 = latestFinishedGame?.player2?.name || "Player 2";
    const b2 = latestFinishedGame?.player2?.blockId || "B";
    const loc = latestFinishedGame?.location || "Pune Exploration Route";

    startNewGame({
      player1Name: p1,
      player1Block: b1,
      player2Name: p2,
      player2Block: b2,
      location: loc
    });
    setWinnerModalOpen(false);
  };

  const handleResetData = () => {
    isFinishingRef.current = false;
    setHistory([]);
    setActiveGame(null);
    setLiveRoom(null);
    saveActiveGame(null);
    setWinnerModalOpen(false);
    setLatestFinishedGame(null);
  };

  const leaderboard = useMemo(() => calculateLeaderboard(history), [history]);
  const summaryStats = useMemo(() => calculateSummaryStats(history, activeGame || liveRoom), [history, activeGame, liveRoom]);

  const value = {
    hydrated,
    activeGame,
    liveRoom,
    playerRole,
    opponentAlert,
    history,
    leaderboard,
    summaryStats,
    createLiveRoom,
    joinLiveRoom,
    selectLiveBlock,
    toggleLiveTask,
    abandonLiveRoom,
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
