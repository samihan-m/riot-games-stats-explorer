export type TypeInfo = {
    gametype: string,
    description: string,
}

export const defaultTypeInfo: TypeInfo[] = [
    {
        "gametype": "CUSTOM_GAME",
        "description": "Custom games"
    },
    {
        "gametype": "TUTORIAL_GAME",
        "description": "Tutorial games"
    },
    {
        "gametype": "MATCHED_GAME",
        "description": "all other games"
    }
];

export async function getAllTypeInfo(): Promise<TypeInfo[]> {
    const typeInfoUrl = "https://static.developer.riotgames.com/docs/lol/gameTypes.json";
    let typeInfoResponse = await fetch(typeInfoUrl);
    if (typeInfoResponse.ok === false) {
        return defaultTypeInfo;
    }
    let typeInfo: TypeInfo[] = await typeInfoResponse.json();
    return typeInfo;
}

export function getTypeInfo(typeName: string, allTypeInfo: TypeInfo[]): TypeInfo {
    for (let type of allTypeInfo) {
        if (type.gametype === typeName) {
            return type;
        }
    }
    return {
        gametype: "Other",
        description: typeName,
    }
}
