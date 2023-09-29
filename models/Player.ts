import { LolPlatform } from "./Platform"

export type Player = {
    _id: string,
    platform: LolPlatform,
    last_updated: string, // This will look like: 2023-03-08T11:12:44.130526
    lol_name?: string,
    lol_level?: string,
    lol_profile_icon_id?: number,
    lol_match_ids: string[],
    // val_match_ids: string[],
}