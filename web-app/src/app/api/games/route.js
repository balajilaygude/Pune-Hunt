import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const GAMES_FILE_PATH = path.join(process.cwd(), "src", "data", "games.js");

// Helper to extract JSON array from games.js
async function readGamesFromFile() {
  try {
    const content = await fs.readFile(GAMES_FILE_PATH, "utf-8");
    const match = content.match(/export const COMPLETED_GAMES\s*=\s*(\[[\s\S]*?\]);/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    return [];
  } catch (error) {
    console.error("Error reading games.js:", error);
    return [];
  }
}

// Helper to write JSON array to games.js
async function writeGamesToFile(gamesArray) {
  const fileContent = `/**
 * Pune Travel Hunt - Completed Games Record File
 * This file stores all completed game results permanently on the filesystem.
 */

export const COMPLETED_GAMES = ${JSON.stringify(gamesArray, null, 2)};
`;
  await fs.writeFile(GAMES_FILE_PATH, fileContent, "utf-8");
}

export async function GET() {
  try {
    const games = await readGamesFromFile();
    return NextResponse.json({ success: true, games });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newGame = body.game;

    if (!newGame || !newGame.id) {
      return NextResponse.json({ success: false, error: "Invalid game record" }, { status: 400 });
    }

    const currentGames = await readGamesFromFile();

    // Prevent duplicate entries by ID
    const exists = currentGames.some((g) => g.id === newGame.id);
    let updatedGames = currentGames;

    if (!exists) {
      updatedGames = [newGame, ...currentGames];
      await writeGamesToFile(updatedGames);
    }

    return NextResponse.json({ success: true, games: updatedGames });
  } catch (error) {
    console.error("Error saving game to games.js:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await writeGamesToFile([]);
    return NextResponse.json({ success: true, games: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
