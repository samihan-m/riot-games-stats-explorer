export type MapInfo = {
    mapId: number,
    mapName: string,
    notes: string
}

export async function getAllMapInfo(): Promise<MapInfo[]> {
    const mapInfoUrl = "https://static.developer.riotgames.com/docs/lol/maps.json";
    let mapInfoResponse = await fetch(mapInfoUrl);
    if(mapInfoResponse.ok === false) {
        const mapInfo: MapInfo[] = [
            {
                "mapId": 1,
                "mapName": "Summoner's Rift",
                "notes": "Original Summer variant"
            },
            {
                "mapId": 2,
                "mapName": "Summoner's Rift",
                "notes": "Original Autumn variant"
            },
            {
                "mapId": 3,
                "mapName": "The Proving Grounds",
                "notes": "Tutorial Map"
            },
            {
                "mapId": 4,
                "mapName": "Twisted Treeline",
                "notes": "Original Version"
            },
            {
                "mapId": 8,
                "mapName": "The Crystal Scar",
                "notes": "Dominion map"
            },
            {
                "mapId": 10,
                "mapName": "Twisted Treeline",
                "notes": "Last TT map"
            },
            {
                "mapId": 11,
                "mapName": "Summoner's Rift",
                "notes": "Current Version"
            },
            {
                "mapId": 12,
                "mapName": "Howling Abyss",
                "notes": "ARAM map"
            },
            {
                "mapId": 14,
                "mapName": "Butcher's Bridge",
                "notes": "Alternate ARAM map"
            },
            {
                "mapId": 16,
                "mapName": "Cosmic Ruins",
                "notes": "Dark Star: Singularity map"
            },
            {
                "mapId": 18,
                "mapName": "Valoran City Park",
                "notes": "Star Guardian Invasion map"
            },
            {
                "mapId": 19,
                "mapName": "Substructure 43",
                "notes": "PROJECT: Hunters map"
            },
            {
                "mapId": 20,
                "mapName": "Crash Site",
                "notes": "Odyssey: Extraction map"
            },
            {
                "mapId": 21,
                "mapName": "Nexus Blitz",
                "notes": "Nexus Blitz map"
            },
            {
                "mapId": 22,
                "mapName": "Convergence",
                "notes": "Teamfight Tactics map"
            }
        ];
        return mapInfo;
    }
    let mapInfo: MapInfo[] = await mapInfoResponse.json();
    return mapInfo;
}

export function getMapInfo(mapId: number, allMapInfo: MapInfo[]): MapInfo {
    for(let map of allMapInfo) {
        if(map.mapId === mapId) {
            return map;
        }
    }
    return {
        mapId: mapId,
        mapName: String(mapId),
        notes: "Other",
    }
}
