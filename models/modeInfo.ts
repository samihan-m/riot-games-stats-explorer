export type ModeInfo = {
    gameMode: string,
    description: string,
}

export const defaultModeInfo: ModeInfo[] = [
    {
        "gameMode": "CLASSIC",
        "description": "Classic Summoner's Rift and Twisted Treeline games"
    },
    {
        "gameMode": "ODIN",
        "description": "Dominion/Crystal Scar games"
    },
    {
        "gameMode": "ARAM",
        "description": "ARAM games"
    },
    {
        "gameMode": "TUTORIAL",
        "description": "Tutorial games"
    },
    {
        "gameMode": "URF",
        "description": "URF games"
    },
    {
        "gameMode": "DOOMBOTSTEEMO",
        "description": "Doom Bot games"
    },
    {
        "gameMode": "ONEFORALL",
        "description": "One for All games"
    },
    {
        "gameMode": "ASCENSION",
        "description": "Ascension games"
    },
    {
        "gameMode": "FIRSTBLOOD",
        "description": "Snowdown Showdown games"
    },
    {
        "gameMode": "KINGPORO",
        "description": "Legend of the Poro King games"
    },
    {
        "gameMode": "SIEGE",
        "description": "Nexus Siege games"
    },
    {
        "gameMode": "ASSASSINATE",
        "description": "Blood Hunt Assassin games"
    },
    {
        "gameMode": "ARSR",
        "description": "All Random Summoner's Rift games"
    },
    {
        "gameMode": "DARKSTAR",
        "description": "Dark Star: Singularity games"
    },
    {
        "gameMode": "STARGUARDIAN",
        "description": "Star Guardian Invasion games"
    },
    {
        "gameMode": "PROJECT",
        "description": "PROJECT: Hunters games"
    },
    {
        "gameMode": "GAMEMODEX",
        "description": "Nexus Blitz games"
    },
    {
        "gameMode": "ODYSSEY",
        "description": "Odyssey: Extraction games"
    },
    {
        "gameMode": "NEXUSBLITZ",
        "description": "Nexus Blitz games"
    },
    {
        "gameMode": "ULTBOOK",
        "description": "Ultimate Spellbook games"
    }
]

export async function getAllModeInfo(): Promise<ModeInfo[]> {
    const modeInfoUrl = "https://static.developer.riotgames.com/docs/lol/gameModes.json";
    let modeInfoResponse = await fetch(modeInfoUrl);
    if (modeInfoResponse.ok === false) {
        return defaultModeInfo;
    }
    let modeInfo: ModeInfo[] = await modeInfoResponse.json();
    return modeInfo;
}

export function getModeInfo(modeName: string, allModeInfo: ModeInfo[]): ModeInfo {
    for (let mode of allModeInfo) {
        if (mode.gameMode === modeName) {
            return mode;
        }
    }
    return {
        gameMode: "Other",
        description: modeName,
    }
}
