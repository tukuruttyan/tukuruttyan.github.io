// Build-time script to generate games.ts from existing games.json
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Game data interface
interface GameData {
  title: string;
  teamName: string;
  description: string;
  publishedDate: string;
  link: string;
  thumbnailUrl: string;
}

async function generateGamesTypeScript(): Promise<void> {
  try {
    console.log('Reading games data from JSON file...');

    // Read game data from existing JSON file
    const jsonPath = join(__dirname, '../src/data/games.json');
    const jsonContent = readFileSync(jsonPath, 'utf8');
    const gameData: GameData[] = JSON.parse(jsonContent);

    console.log(`Loaded ${gameData.length} games from JSON file`);

    const jsonData = JSON.stringify(gameData, null, 2);

    // Also create a TypeScript version for better type safety
    const tsContent = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export interface GameData {
  title: string;
  teamName: string;
  description: string;
  publishedDate: string;
  link: string;
  thumbnailUrl: string;
}

export const gamesData: GameData[] = ${jsonData};

export default gamesData;
`;

    const tsOutputPath = join(__dirname, '../src/data/games.ts');
    writeFileSync(tsOutputPath, tsContent, 'utf8');

    console.log(`TypeScript games data saved to ${tsOutputPath}`);

  } catch (error) {
    console.error('Failed to read games data or generate TypeScript file:', error);

    // Create fallback TypeScript file with empty data
    const tsOutputPath = join(__dirname, '../src/data/games.ts');

    const fallbackTsContent = `// Auto-generated file - fallback for failed generation
// Generated at: ${new Date().toISOString()}

export interface GameData {
  title: string;
  teamName: string;
  description: string;
  publishedDate: string;
  link: string;
  thumbnailUrl: string;
}

export const gamesData: GameData[] = [];

export default gamesData;
`;

    writeFileSync(tsOutputPath, fallbackTsContent, 'utf8');

    console.log('Created fallback TypeScript file with empty data');
    process.exit(1);
  }
}

// Run the script
generateGamesTypeScript();