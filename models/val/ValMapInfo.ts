// Going to get this information from https://dash.valorant-api.com/endpoints/maps

import { defaultValMapInfo } from "./DefaultValMapInfo";

type Location = {
    x: number,
    y: number
}

type Callout = {
    regionName: string,
    superRegionName: string,
    location: Location,
}

export type ValMapInfo = {
    uuid: string,
    displayName: string,
    narrativeDescription: string | null,
    tacticalDescription: string | null,
    coordinates: string | null,
    displayIcon: string | null,
    listViewIcon: string,
    splash: string,
    assetPath: string,
    mapUrl: string,
    xMultiplier: number,
    yMultiplier: number,
    xScalarToAdd: number,
    yScalarToAdd: number,
    callouts: Callout[] | null,
}

export async function getAllValMapInfo(): Promise<ValMapInfo[]> {
    const mapInfoUrl = "https://valorant-api.com/v1/maps";
    let mapInfoResponse = await fetch(mapInfoUrl);
    if(mapInfoResponse.ok === false) {
        return defaultValMapInfo;
    }
    let mapInfoResponseJson = await mapInfoResponse.json() as {status: number, data: ValMapInfo[]};
    let mapInfo = mapInfoResponseJson.data;
    return mapInfo;
}

export function getValMapInfo(mapUrl: string, allMapInfo: ValMapInfo[]): ValMapInfo {
    for(let map of allMapInfo) {
        if(map.mapUrl === mapUrl) {
            return map;
        }
    }
    // Return a null map if we can't find the map
    const nullMap: ValMapInfo = {
        uuid: "",
        displayName: "Other",
        narrativeDescription: null,
        tacticalDescription: null,
        coordinates: null,
        displayIcon: null,
        listViewIcon: "",
        splash: "",
        assetPath: "",
        mapUrl: mapUrl,
        xMultiplier: 0,
        yMultiplier: 0,
        xScalarToAdd: 0,
        yScalarToAdd: 0,
        callouts: [],
    }
    return nullMap;
}

