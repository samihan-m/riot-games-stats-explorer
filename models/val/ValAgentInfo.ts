// Models taken from https://dash.valorant-api.com/endpoints/agents

import { defaultValAgentInfo } from "./DefaultValAgentInfo"

type Role = {
    uuid: string,
    displayName: string,
    description: string,
    displayIcon: string,
    assetPath: string,
}

type RecruitmentData = {
    counterId: string,
    milestoneId: string,
    milestoneThreshold: number,
    useLevelVpCostOverride: boolean,
    levelVpCostOverride: number,
    startDate: string,
    endDate: string,
}

type Ability = {
    slot: string,
    displayName: string,
    description: string,
    displayIcon: string | null,
}

type Media = {
    id: number,
    wwise: string,
    wave: string,
}

type VoiceLine = {
    minDuration: number,
    maxDuration: number,
    mediaList: Media[],
}

export type ValAgentInfo = {
    uuid: string,
    displayName: string,
    description: string,
    developerName: string,
    characterTags: string[] | null,
    displayIcon: string,
    displayIconSmall: string,
    bustPortrait: string,
    fullPortrait: string,
    fullPortraitV2: string,
    killfeedPortrait: string,
    background: string,
    backgroundGradientColors: string[],
    assetPath: string,
    isFullPortraitRightFacing: boolean,
    isPlayableCharacter: boolean,
    isAvailableForTest: boolean,
    isBaseContent: boolean,
    role: Role,
    recruitmentData: RecruitmentData | null,
    abilities: Ability[],
    voiceLine: VoiceLine[] | null,
}



export async function getAllValAgentInfo(): Promise<ValAgentInfo[]> {
    const agentInfoUrl = "https://valorant-api.com/v1/agents";
    let agentInfoResponse = await fetch(agentInfoUrl);
    if(agentInfoResponse.ok === false) {
        return defaultValAgentInfo;
    }
    let agentInfoResponseJson = await agentInfoResponse.json() as {status: number, data: ValAgentInfo[]};
    let agentInfo = agentInfoResponseJson.data;
    // Filter out non-playable characters (i.e. duplicate Sova)
    agentInfo = agentInfo.filter(agent => agent.isPlayableCharacter === true);
    return agentInfo;
}

export function getAgentName(agentUuid: string, allAgentInfo: ValAgentInfo[]): string {
    // Searches through the list of all agents to find the agent with the given uuid and returns their name
    let agent = allAgentInfo.find(agent => agent.uuid === agentUuid);
    if(agent === undefined) {
        return "Unknown";
    }
    return agent.displayName;
}