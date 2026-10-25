import { COMPLETED_GAMES } from "./games.js";

/**
 * Pune Travel Hunt - Core Game Data & Storage
 * Contains mixed task blocks (A, B, C, D) with tasks drawn from all categories
 * (Vehicles, People, Pune Special, and Random Discoveries) for maximum variety.
 * Completed games are stored in games.js on the filesystem.
 */

export const TASK_BLOCKS = {
  A: {
    id: "A",
    title: "Block A — Pune Mixed Hunt",
    category: "Mixed Variety Pack",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    accentColor: "#064E3B",
    description: "An exciting blend of Pune transit, local food spots, street life, and culture.",
    iconName: "Compass",
    tasks: [
      { id: "a1", text: "Spot an iconic yellow-and-black auto-rickshaw", hint: "Pune's trusty three-wheeler lifeline", category: "Vehicles & Roads" },
      { id: "a2", text: "Spot a food delivery partner (Zomato or Swiggy uniform/bag)", hint: "Rushing with hot food containers", category: "People & Daily Life" },
      { id: "a3", text: "Spot a famous Misal Pav restaurant or signboard", hint: "Spicy Puneri breakfast favorite", category: "Pune Special" },
      { id: "a4", text: "Spot a roadside Amruttulya tea stall with brass samovar", hint: "Hot cardamom tea served in cutting glasses", category: "Random Discoveries" },
      { id: "a5", text: "Spot a modern electric scooter (Ather, Ola, Chetak)", hint: "Check near signals and EV charging points", category: "Vehicles & Roads" },
      { id: "a6", text: "Spot someone carrying a large multi-strap travel backpack", hint: "Students heading to study rooms or library", category: "People & Daily Life" },
      { id: "a7", text: "Spot a Marathi signboard or humorous Puneri Patya notice", hint: "Pune's legendary witty advisory signs!", category: "Pune Special" },
      { id: "a8", text: "Spot a friendly street dog or cat resting beside a shop", hint: "Pune's relaxed four-legged neighborhood locals", category: "Random Discoveries" },
      { id: "a9", text: "Spot a vehicle with an out-of-state number plate (DL, KA, GJ, etc.)", hint: "Look along main arterial routes and highways", category: "Vehicles & Roads" },
      { id: "a10", text: "Spot an elevated Pune Metro train or a metro station entrance", hint: "Purple or Aqua line viaducts", category: "Pune Special" }
    ]
  },
  B: {
    id: "B",
    title: "Block B — Pune Mixed Hunt",
    category: "Mixed Variety Pack",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    accentColor: "#16845B",
    description: "A fun mix of Pune city buses, food delicacies, street commuters, and colorful finds.",
    iconName: "Compass",
    tasks: [
      { id: "b1", text: "Spot a classic red or green PMPML municipal bus", hint: "Frequent along main bus routes", category: "Vehicles & Roads" },
      { id: "b2", text: "Spot a commuter wearing over-ear or wireless headphones", hint: "Commuting while tuned into music", category: "People & Daily Life" },
      { id: "b3", text: "Spot a sizzling hot Wada Pav or Kanda Bhaji stall", hint: "Follow the irresistible aroma of fried besan", category: "Pune Special" },
      { id: "b4", text: "Spot a bright fire-engine red passenger car", hint: "Stands out clearly in the street flow", category: "Random Discoveries" },
      { id: "b5", text: "Spot a Royal Enfield 'Bullet' motorcycle with thump", hint: "Pune college campus favourite", category: "Vehicles & Roads" },
      { id: "b6", text: "Spot a two-wheeler rider wearing a proper safety helmet", hint: "A safe and responsible Punekar rider!", category: "People & Daily Life" },
      { id: "b7", text: "Spot a shop or signboard selling Chitale Bandhu Bakarwadi", hint: "The undisputed savoury pride of Pune", category: "Pune Special" },
      { id: "b8", text: "Spot a flower seller stringing sweet Mogra Gajras or marigolds", hint: "Fragrant roadside stall near market corners", category: "Random Discoveries" },
      { id: "b9", text: "Spot a college or university student with a campus ID lanyard", hint: "Near FC, Fergusson, COEP, or SP College", category: "People & Daily Life" },
      { id: "b10", text: "Spot a person gracefully wearing an elegant Indian Kurta", hint: "Casual linen or festive silk attire", category: "Random Discoveries" }
    ]
  },
  C: {
    id: "C",
    title: "Block C — Pune Mixed Hunt",
    category: "Mixed Variety Pack",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    accentColor: "#B45309",
    description: "A diverse collection of heritage monuments, luxury cars, local markets, and Pune street sights.",
    iconName: "Compass",
    tasks: [
      { id: "c1", text: "Spot a luxury brand car (Mercedes-Benz, BMW, or Audi)", hint: "Sleek European sedans or SUVs", category: "Vehicles & Roads" },
      { id: "c2", text: "Spot a street vendor selling fresh seasonal fruits or roasted corn", hint: "Roadside carts laden with fresh produce", category: "People & Daily Life" },
      { id: "c3", text: "Spot a historic Peshwa-style Wada or colonial stone building", hint: "Classic wooden carved pillars or stone archways", category: "Pune Special" },
      { id: "c4", text: "Spot a family SUV or car with an overhead roof luggage carrier", hint: "Ready for a trip to the hills", category: "Random Discoveries" },
      { id: "c5", text: "Spot a Pune traffic police officer on duty at a chowk", hint: "At major junctions and busy intersections", category: "Vehicles & Roads" },
      { id: "c6", text: "Spot someone wearing a stylish hat, cap, or traditional Puneri Pheta", hint: "Beating the sunny afternoon glare", category: "People & Daily Life" },
      { id: "c7", text: "Spot a roadside Ganpati temple or street shrine", hint: "Decorated with marigold flowers and bells", category: "Pune Special" },
      { id: "c8", text: "Spot a retail shop or storefront with a prominent green signboard", hint: "Notice the lively emerald or mint facade", category: "Random Discoveries" },
      { id: "c9", text: "Spot a fresh sugarcane juice stall (Rasavanti Gruha)", hint: "Look for the mechanical roller and brass bell", category: "Pune Special" },
      { id: "c10", text: "Spot a decorated vehicle with flowers, ribbons, or festive signs", hint: "Newly purchased vehicle or celebration", category: "Random Discoveries" }
    ]
  },
  D: {
    id: "D",
    title: "Block D — Pune Mixed Hunt",
    category: "Mixed Variety Pack",
    badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-400",
    accentColor: "#059669",
    description: "An unexpected mix of tech park transit, pets, unique buildings, and quirky discoveries.",
    iconName: "Compass",
    tasks: [
      { id: "d1", text: "Spot a vehicle with a fancy or single-digit number plate", hint: "Look for bold fonts or VIP series", category: "Vehicles & Roads" },
      { id: "d2", text: "Spot a person walking their pet dog on the footpath", hint: "Popular morning or evening sighting", category: "People & Daily Life" },
      { id: "d3", text: "Spot an IT company shuttle or Hinjawadi techie car sticker", hint: "Connecting Infotech parks across town", category: "Pune Special" },
      { id: "d4", text: "Spot an auto-rickshaw with witty or poetic Marathi shayari behind it", hint: "Check the rear bumper or canvas flap", category: "Random Discoveries" },
      { id: "d5", text: "Spot a commercial vehicle carrying oversized goods or crates", hint: "Pickups or tempos loaded high", category: "Vehicles & Roads" },
      { id: "d6", text: "Spot a courier delivery agent with parcels", hint: "BlueDart, DTDC, or Amazon vans", category: "People & Daily Life" },
      { id: "d7", text: "Spot a PMPML bus shelter with a route schedule board", hint: "Yellow and blue municipal sign boards", category: "Pune Special" },
      { id: "d8", text: "Spot a building with a unique or unusual architectural design", hint: "Glass facades or uniquely angled balconies", category: "Random Discoveries" },
      { id: "d9", text: "Spot a newspaper stall or vendor with Marathi dailies", hint: "Look for Sakal, Lokmat, or Loksatta", category: "People & Daily Life" },
      { id: "d10", text: "Spot a delivery rider carrying goods on a bicycle", hint: "Common near local bakeries and markets", category: "Vehicles & Roads" }
    ]
  }
};

export const INITIAL_GAME_RECORDS = Array.isArray(COMPLETED_GAMES) ? COMPLETED_GAMES : [];

const STORAGE_KEYS = {
  ACTIVE_GAME: "pune_travel_hunt_active_game_v3"
};

/**
 * Fetch games list directly from API (which reads games.js)
 */
export async function fetchGamesFromServer() {
  try {
    const res = await fetch("/api/games");
    if (!res.ok) return INITIAL_GAME_RECORDS;
    const data = await res.json();
    return Array.isArray(data.games) ? data.games : INITIAL_GAME_RECORDS;
  } catch (e) {
    console.error("Error fetching games from server:", e);
    return INITIAL_GAME_RECORDS;
  }
}

/**
 * Save a newly completed game directly to games.js via API
 */
export async function saveGameToFile(record) {
  try {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: record })
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.games)) {
      return data.games;
    }
  } catch (e) {
    console.error("Error saving game to file:", e);
  }
  return null;
}

/**
 * Reset games stored in games.js via API
 */
export async function resetGamesFile() {
  try {
    const res = await fetch("/api/games", { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      return [];
    }
  } catch (e) {
    console.error("Error resetting games file:", e);
  }
  return [];
}

/**
 * Retrieve ongoing active game if any
 */
export function getStoredActiveGame() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading active game:", e);
    return null;
  }
}

/**
 * Persist ongoing game progress
 */
export function saveActiveGame(game) {
  if (typeof window === "undefined") return;
  try {
    if (!game) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, JSON.stringify(game));
    }
  } catch (e) {
    console.error("Error saving active game:", e);
  }
}

/**
 * Compute Leaderboard aggregated metrics from all matches
 */
export function calculateLeaderboard(history) {
  const map = {};

  (history || []).forEach((game) => {
    if (game.status !== "completed") return;

    [game.player1, game.player2].forEach((p) => {
      if (!p || !p.name) return;
      const key = p.name.trim();
      if (!map[key]) {
        map[key] = {
          name: key,
          played: 0,
          won: 0,
          lost: 0,
          ties: 0,
          tasksCompleted: 0,
          blocksUsed: {}
        };
      }
      map[key].played += 1;
      map[key].tasksCompleted += p.score || 0;

      if (game.isTie) {
        map[key].ties += 1;
      } else if (p.winner || game.winnerName === key) {
        map[key].won += 1;
      } else {
        map[key].lost += 1;
      }

      const b = p.blockId || "A";
      map[key].blocksUsed[b] = (map[key].blocksUsed[b] || 0) + 1;
    });
  });

  return Object.values(map)
    .map((item) => {
      const winRate = item.played > 0 ? Math.round((item.won / item.played) * 100) : 0;
      let favBlock = "A";
      let maxCount = -1;
      Object.entries(item.blocksUsed).forEach(([blk, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          favBlock = blk;
        }
      });
      return {
        ...item,
        winRate,
        favBlock
      };
    })
    .sort((a, b) => {
      if (b.won !== a.won) return b.won - a.won;
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.tasksCompleted - a.tasksCompleted;
    });
}

/**
 * Overall summary metrics for dashboard cards
 */
export function calculateSummaryStats(history, activeGame) {
  const completed = (history || []).filter((g) => g.status === "completed");
  const totalGames = completed.length;
  let totalTasks = 0;
  completed.forEach((g) => {
    totalTasks += (g.player1?.score || 0) + (g.player2?.score || 0);
  });

  const leaderboard = calculateLeaderboard(completed);
  const topPlayer = leaderboard[0] || null;

  return {
    gamesPlayed: totalGames,
    tasksCompleted: totalTasks,
    topPlayerName: topPlayer ? topPlayer.name : "None Yet",
    topPlayerWins: topPlayer ? topPlayer.won : 0,
    avgCompletionRate: totalGames > 0 ? Math.round((totalTasks / (totalGames * 20)) * 100) : 0,
    hasActiveGame: !!activeGame
  };
}
