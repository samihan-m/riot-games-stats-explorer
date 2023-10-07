import { defaultValQueueInfo } from "./DefaultValQueueInfo";

export type ValQueueInfo = {
    uuid: string,
    queueId: string,
    displayName: string | null,
    description: string | null,
    dropdownText: string,
    selectedText: string,
    isBeta: boolean,
    displayIcon: string | null,
    assetPath: string,
}

export async function getAllValQueueInfo(): Promise<ValQueueInfo[]> {
    const queueInfoUrl = "https://valorant-api.com/v1/gamemodes/queues";
    let queueInfoResponse = await fetch(queueInfoUrl);
    if(queueInfoResponse.ok === false) {
        return defaultValQueueInfo;
    }
    let queueInfoResponseJson = await queueInfoResponse.json() as {status: number, data: ValQueueInfo[]};
    let queueInfo = queueInfoResponseJson.data;
    return queueInfo;
}

export function getValQueueInfo(queueUuid: string, allQueueInfo: ValQueueInfo[]): ValQueueInfo {
    for(let queue of allQueueInfo) {
        if(queue.queueId === queueUuid) {
            return queue;
        }
    }
    // Return a null queue if we can't find the queue
    const nullQueue: ValQueueInfo = {
        uuid: queueUuid,
        queueId: "Other",
        displayName: null,
        description: null,
        dropdownText: "",
        selectedText: "",
        isBeta: false,
        displayIcon: null,
        assetPath: "",
    }
    return nullQueue;
}
