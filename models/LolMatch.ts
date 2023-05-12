import { LolMatchData } from "./LolMatchData"

export type LolMatch = {
    _id: string,
    platform: string,
    json_data: LolMatchData,
    timestamp: number,
    last_accessed: string, // 2023-03-08T11:12:44.130526
}
