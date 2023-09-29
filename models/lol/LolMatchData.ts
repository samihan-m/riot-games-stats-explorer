// from https://codebeautify.org/json-to-typescript-pojo-generator#:~:text=JSON%20OData%20to%20ts%20class%20converter%20is%20easy,URL%2C%20which%20loads%20JSON%20and%20converts%20to%20TypeScript.

// To parse this data:
//
//   import { Convert, LolMatchData } from "./file";
//
//   const LolMatchData = Convert.toLolMatchData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface LolMatchData {
    metadata: Metadata;
    info:     Info;
    id:       string;
}

export interface Info {
    game_id:         number;
    creation_millis: number;
    duration_units:  number;
    start_millis:    number;
    end_millis:      number;
    mode:            string;
    name:            string;
    type:            string;
    version:         string;
    platform:        string;
    map_id:          number;
    queue_id:        number;
    tournament_code: string;
    participants:    Participant[];
    teams:           Team[];
}

export interface Participant {
    id:                                 number;
    assists:                            number;
    baron_kills:                        number;
    basic_pings:                        number;
    bounty_level:                       number;
    champ_experience:                   number;
    champ_level:                        number;
    champion_id:                        number;
    champion_name:                      string;
    champion_transform:                 number;
    consumables_purchased:              number;
    damage_dealt_to_buildings:          number;
    damage_dealt_to_objectives:         number;
    damage_dealt_to_turrets:            number;
    damage_self_mitigated:              number;
    deaths:                             number;
    detector_wards_placed:              number;
    double_kills:                       number;
    dragon_kills:                       number;
    eligible_for_progression:           boolean;
    first_blood_assist:                 boolean;
    first_blood_kill:                   boolean;
    first_tower_assist:                 boolean;
    first_tower_kill:                   boolean;
    game_ended_in_early_surrender:      boolean;
    game_ended_in_surrender:            boolean;
    gold_earned:                        number;
    gold_spent:                         number;
    individual_position:                IndividualPosition;
    inhibitor_kills:                    number;
    inhibitor_takedowns:                number;
    inhibitors_lost:                    number;
    item0:                              number;
    item1:                              number;
    item2:                              number;
    item3:                              number;
    item4:                              number;
    item5:                              number;
    item6:                              number;
    items_purchased:                    number;
    killing_sprees:                     number;
    kills:                              number;
    lane:                               Lane;
    largest_critical_strike:            number;
    largest_killing_spree:              number;
    largest_multi_kill:                 number;
    longest_time_spent_living_secs:     number;
    magic_damage_dealt:                 number;
    magic_damage_dealt_to_champions:    number;
    magic_damage_taken:                 number;
    neutral_minions_killed:             number;
    nexus_kills:                        number;
    nexus_takedowns:                    number;
    nexus_lost:                         number;
    objectives_stolen:                  number;
    objectives_stolen_assists:          number;
    penta_kills:                        number;
    perks:                              Perks;
    physical_damage_dealt:              number;
    physical_damage_dealt_to_champions: number;
    physical_damage_taken:              number;
    profile_icon_id:                    number;
    puuid:                              string;
    quadra_kills:                       number;
    riot_id_name:                       string;
    riot_id_tagline:                    string;
    role:                               Role;
    sight_wards_bought_in_game:         number;
    spell1_casts:                       number;
    spell2_casts:                       number;
    spell3_casts:                       number;
    spell4_casts:                       number;
    summoner1_casts:                    number;
    summoner1_id:                       number;
    summoner2_casts:                    number;
    summoner2_id:                       number;
    summoner_id:                        string;
    summoner_level:                     number;
    summoner_name:                      string;
    team_early_surrendered:             boolean;
    team_id:                            number;
    team_position:                      string;
    time_ccing_others_secs:             number;
    time_played_secs:                   number;
    total_damage_dealt:                 number;
    total_damage_dealt_to_champions:    number;
    total_damage_shielded_on_teammates: number;
    total_damage_taken:                 number;
    total_heal:                         number;
    total_heals_on_teammates:           number;
    total_minions_killed:               number;
    total_time_cc_dealt_secs:           number;
    total_time_spent_dead_secs:         number;
    total_units_healed:                 number;
    triple_kills:                       number;
    true_damage_dealt:                  number;
    true_damage_dealt_to_champions:     number;
    true_damage_taken:                  number;
    turret_kills:                       number;
    turret_takedowns:                   number;
    turrets_lost:                       number;
    unreal_kills:                       number;
    vision_score:                       number;
    vision_wards_bought_in_game:        number;
    wards_killed:                       number;
    wards_placed:                       number;
    challenges:                         { [key: string]: number };
    win:                                boolean;
}

export enum IndividualPosition {
    Invalid = "Invalid",
}

export enum Lane {
    None = "NONE",
}

export interface Perks {
    stat_perks: StatPerks;
    styles:     Style[];
}

export interface StatPerks {
    offense: number;
    flex:    number;
    defense: number;
}

export interface Style {
    description: Description;
    selections:  Selection[];
    style:       number;
}

export enum Description {
    PrimaryStyle = "primaryStyle",
    SubStyle = "subStyle",
}

export interface Selection {
    perk: number;
    var1: number;
    var2: number;
    var3: number;
}

export enum Role {
    Support = "SUPPORT",
}

export interface Team {
    id:         number;
    win:        boolean;
    bans:       any[];
    objectives: Objectives;
}

export interface Objectives {
    baron:       Baron;
    champion:    Baron;
    dragon:      Baron;
    inhibitor:   Baron;
    rift_herald: Baron;
    tower:       Baron;
}

export interface Baron {
    first: boolean;
    kills: number;
}

export interface Metadata {
    match_id:           string;
    data_version:       string;
    participant_puuids: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toLolMatchData(json: string): LolMatchData {
        return cast(JSON.parse(json), r("LolMatchData"));
    }

    public static LolMatchDataToJson(value: LolMatchData): string {
        return JSON.stringify(uncast(value, r("LolMatchData")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "LolMatchData": o([
        { json: "metadata", js: "metadata", typ: r("Metadata") },
        { json: "info", js: "info", typ: r("Info") },
        { json: "id", js: "id", typ: "" },
    ], false),
    "Info": o([
        { json: "game_id", js: "game_id", typ: 0 },
        { json: "creation_millis", js: "creation_millis", typ: 0 },
        { json: "duration_units", js: "duration_units", typ: 0 },
        { json: "start_millis", js: "start_millis", typ: 0 },
        { json: "end_millis", js: "end_millis", typ: 0 },
        { json: "mode", js: "mode", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "version", js: "version", typ: "" },
        { json: "platform", js: "platform", typ: "" },
        { json: "map_id", js: "map_id", typ: 0 },
        { json: "queue_id", js: "queue_id", typ: 0 },
        { json: "tournament_code", js: "tournament_code", typ: "" },
        { json: "participants", js: "participants", typ: a(r("Participant")) },
        { json: "teams", js: "teams", typ: a(r("Team")) },
    ], false),
    "Participant": o([
        { json: "id", js: "id", typ: 0 },
        { json: "assists", js: "assists", typ: 0 },
        { json: "baron_kills", js: "baron_kills", typ: 0 },
        { json: "basic_pings", js: "basic_pings", typ: 0 },
        { json: "bounty_level", js: "bounty_level", typ: 0 },
        { json: "champ_experience", js: "champ_experience", typ: 0 },
        { json: "champ_level", js: "champ_level", typ: 0 },
        { json: "champion_id", js: "champion_id", typ: 0 },
        { json: "champion_name", js: "champion_name", typ: "" },
        { json: "champion_transform", js: "champion_transform", typ: 0 },
        { json: "consumables_purchased", js: "consumables_purchased", typ: 0 },
        { json: "damage_dealt_to_buildings", js: "damage_dealt_to_buildings", typ: 0 },
        { json: "damage_dealt_to_objectives", js: "damage_dealt_to_objectives", typ: 0 },
        { json: "damage_dealt_to_turrets", js: "damage_dealt_to_turrets", typ: 0 },
        { json: "damage_self_mitigated", js: "damage_self_mitigated", typ: 0 },
        { json: "deaths", js: "deaths", typ: 0 },
        { json: "detector_wards_placed", js: "detector_wards_placed", typ: 0 },
        { json: "double_kills", js: "double_kills", typ: 0 },
        { json: "dragon_kills", js: "dragon_kills", typ: 0 },
        { json: "eligible_for_progression", js: "eligible_for_progression", typ: true },
        { json: "first_blood_assist", js: "first_blood_assist", typ: true },
        { json: "first_blood_kill", js: "first_blood_kill", typ: true },
        { json: "first_tower_assist", js: "first_tower_assist", typ: true },
        { json: "first_tower_kill", js: "first_tower_kill", typ: true },
        { json: "game_ended_in_early_surrender", js: "game_ended_in_early_surrender", typ: true },
        { json: "game_ended_in_surrender", js: "game_ended_in_surrender", typ: true },
        { json: "gold_earned", js: "gold_earned", typ: 0 },
        { json: "gold_spent", js: "gold_spent", typ: 0 },
        { json: "individual_position", js: "individual_position", typ: r("IndividualPosition") },
        { json: "inhibitor_kills", js: "inhibitor_kills", typ: 0 },
        { json: "inhibitor_takedowns", js: "inhibitor_takedowns", typ: 0 },
        { json: "inhibitors_lost", js: "inhibitors_lost", typ: 0 },
        { json: "item0", js: "item0", typ: 0 },
        { json: "item1", js: "item1", typ: 0 },
        { json: "item2", js: "item2", typ: 0 },
        { json: "item3", js: "item3", typ: 0 },
        { json: "item4", js: "item4", typ: 0 },
        { json: "item5", js: "item5", typ: 0 },
        { json: "item6", js: "item6", typ: 0 },
        { json: "items_purchased", js: "items_purchased", typ: 0 },
        { json: "killing_sprees", js: "killing_sprees", typ: 0 },
        { json: "kills", js: "kills", typ: 0 },
        { json: "lane", js: "lane", typ: r("Lane") },
        { json: "largest_critical_strike", js: "largest_critical_strike", typ: 0 },
        { json: "largest_killing_spree", js: "largest_killing_spree", typ: 0 },
        { json: "largest_multi_kill", js: "largest_multi_kill", typ: 0 },
        { json: "longest_time_spent_living_secs", js: "longest_time_spent_living_secs", typ: 0 },
        { json: "magic_damage_dealt", js: "magic_damage_dealt", typ: 0 },
        { json: "magic_damage_dealt_to_champions", js: "magic_damage_dealt_to_champions", typ: 0 },
        { json: "magic_damage_taken", js: "magic_damage_taken", typ: 0 },
        { json: "neutral_minions_killed", js: "neutral_minions_killed", typ: 0 },
        { json: "nexus_kills", js: "nexus_kills", typ: 0 },
        { json: "nexus_takedowns", js: "nexus_takedowns", typ: 0 },
        { json: "nexus_lost", js: "nexus_lost", typ: 0 },
        { json: "objectives_stolen", js: "objectives_stolen", typ: 0 },
        { json: "objectives_stolen_assists", js: "objectives_stolen_assists", typ: 0 },
        { json: "penta_kills", js: "penta_kills", typ: 0 },
        { json: "perks", js: "perks", typ: r("Perks") },
        { json: "physical_damage_dealt", js: "physical_damage_dealt", typ: 0 },
        { json: "physical_damage_dealt_to_champions", js: "physical_damage_dealt_to_champions", typ: 0 },
        { json: "physical_damage_taken", js: "physical_damage_taken", typ: 0 },
        { json: "profile_icon_id", js: "profile_icon_id", typ: 0 },
        { json: "puuid", js: "puuid", typ: "" },
        { json: "quadra_kills", js: "quadra_kills", typ: 0 },
        { json: "riot_id_name", js: "riot_id_name", typ: "" },
        { json: "riot_id_tagline", js: "riot_id_tagline", typ: "" },
        { json: "role", js: "role", typ: r("Role") },
        { json: "sight_wards_bought_in_game", js: "sight_wards_bought_in_game", typ: 0 },
        { json: "spell1_casts", js: "spell1_casts", typ: 0 },
        { json: "spell2_casts", js: "spell2_casts", typ: 0 },
        { json: "spell3_casts", js: "spell3_casts", typ: 0 },
        { json: "spell4_casts", js: "spell4_casts", typ: 0 },
        { json: "summoner1_casts", js: "summoner1_casts", typ: 0 },
        { json: "summoner1_id", js: "summoner1_id", typ: 0 },
        { json: "summoner2_casts", js: "summoner2_casts", typ: 0 },
        { json: "summoner2_id", js: "summoner2_id", typ: 0 },
        { json: "summoner_id", js: "summoner_id", typ: "" },
        { json: "summoner_level", js: "summoner_level", typ: 0 },
        { json: "summoner_name", js: "summoner_name", typ: "" },
        { json: "team_early_surrendered", js: "team_early_surrendered", typ: true },
        { json: "team_id", js: "team_id", typ: 0 },
        { json: "team_position", js: "team_position", typ: "" },
        { json: "time_ccing_others_secs", js: "time_ccing_others_secs", typ: 0 },
        { json: "time_played_secs", js: "time_played_secs", typ: 0 },
        { json: "total_damage_dealt", js: "total_damage_dealt", typ: 0 },
        { json: "total_damage_dealt_to_champions", js: "total_damage_dealt_to_champions", typ: 0 },
        { json: "total_damage_shielded_on_teammates", js: "total_damage_shielded_on_teammates", typ: 0 },
        { json: "total_damage_taken", js: "total_damage_taken", typ: 0 },
        { json: "total_heal", js: "total_heal", typ: 0 },
        { json: "total_heals_on_teammates", js: "total_heals_on_teammates", typ: 0 },
        { json: "total_minions_killed", js: "total_minions_killed", typ: 0 },
        { json: "total_time_cc_dealt_secs", js: "total_time_cc_dealt_secs", typ: 0 },
        { json: "total_time_spent_dead_secs", js: "total_time_spent_dead_secs", typ: 0 },
        { json: "total_units_healed", js: "total_units_healed", typ: 0 },
        { json: "triple_kills", js: "triple_kills", typ: 0 },
        { json: "true_damage_dealt", js: "true_damage_dealt", typ: 0 },
        { json: "true_damage_dealt_to_champions", js: "true_damage_dealt_to_champions", typ: 0 },
        { json: "true_damage_taken", js: "true_damage_taken", typ: 0 },
        { json: "turret_kills", js: "turret_kills", typ: 0 },
        { json: "turret_takedowns", js: "turret_takedowns", typ: 0 },
        { json: "turrets_lost", js: "turrets_lost", typ: 0 },
        { json: "unreal_kills", js: "unreal_kills", typ: 0 },
        { json: "vision_score", js: "vision_score", typ: 0 },
        { json: "vision_wards_bought_in_game", js: "vision_wards_bought_in_game", typ: 0 },
        { json: "wards_killed", js: "wards_killed", typ: 0 },
        { json: "wards_placed", js: "wards_placed", typ: 0 },
        { json: "challenges", js: "challenges", typ: m(3.14) },
        { json: "win", js: "win", typ: true },
    ], false),
    "Perks": o([
        { json: "stat_perks", js: "stat_perks", typ: r("StatPerks") },
        { json: "styles", js: "styles", typ: a(r("Style")) },
    ], false),
    "StatPerks": o([
        { json: "offense", js: "offense", typ: 0 },
        { json: "flex", js: "flex", typ: 0 },
        { json: "defense", js: "defense", typ: 0 },
    ], false),
    "Style": o([
        { json: "description", js: "description", typ: r("Description") },
        { json: "selections", js: "selections", typ: a(r("Selection")) },
        { json: "style", js: "style", typ: 0 },
    ], false),
    "Selection": o([
        { json: "perk", js: "perk", typ: 0 },
        { json: "var1", js: "var1", typ: 0 },
        { json: "var2", js: "var2", typ: 0 },
        { json: "var3", js: "var3", typ: 0 },
    ], false),
    "Team": o([
        { json: "id", js: "id", typ: 0 },
        { json: "win", js: "win", typ: true },
        { json: "bans", js: "bans", typ: a("any") },
        { json: "objectives", js: "objectives", typ: r("Objectives") },
    ], false),
    "Objectives": o([
        { json: "baron", js: "baron", typ: r("Baron") },
        { json: "champion", js: "champion", typ: r("Baron") },
        { json: "dragon", js: "dragon", typ: r("Baron") },
        { json: "inhibitor", js: "inhibitor", typ: r("Baron") },
        { json: "rift_herald", js: "rift_herald", typ: r("Baron") },
        { json: "tower", js: "tower", typ: r("Baron") },
    ], false),
    "Baron": o([
        { json: "first", js: "first", typ: true },
        { json: "kills", js: "kills", typ: 0 },
    ], false),
    "Metadata": o([
        { json: "match_id", js: "match_id", typ: "" },
        { json: "data_version", js: "data_version", typ: "" },
        { json: "participant_puuids", js: "participant_puuids", typ: a("") },
    ], false),
    "IndividualPosition": [
        "Invalid",
    ],
    "Lane": [
        "NONE",
    ],
    "Description": [
        "primaryStyle",
        "subStyle",
    ],
    "Role": [
        "SUPPORT",
    ],
};

// TODO: Switch to this nice interface taken from
// https://github.com/bcho04/galeforce/blob/master/src/galeforce/interfaces/dto/riot-api/match-v5/match.ts
// when I can
// interface Metadata {
//     dataVersion: string;
//     matchId: string;
//     participants: string[];
// }

// interface StatPerks {
//     defense: number;
//     flex: number;
//     offense: number;
// }

// interface Selection {
//     perk: number;
//     var1: number;
//     var2: number;
//     var3: number;
// }

// interface Style {
//     description: string;
//     selections: Selection[];
//     style: number;
// }

// interface Perks {
//     statPerks: StatPerks;
//     styles: Style[];
// }

// interface Participant {
//     assists: number;
//     baronKills: number;
//     bountyLevel: number;
//     champExperience: number;
//     champLevel: number;
//     championId: number;
//     championName: string;
//     championTransform: number;
//     consumablesPurchased: number;
//     damageDealtToBuildings: number;
//     damageDealtToObjectives: number;
//     damageDealtToTurrets: number;
//     damageSelfMitigated: number;
//     deaths: number;
//     detectorWardsPlaced: number;
//     doubleKills: number;
//     dragonKills: number;
//     firstBloodAssist: boolean;
//     firstBloodKill: boolean;
//     firstTowerAssist: boolean;
//     firstTowerKill: boolean;
//     gameEndedInEarlySurrender: boolean;
//     gameEndedInSurrender: boolean;
//     goldEarned: number;
//     goldSpent: number;
//     individualPosition: string;
//     inhibitorKills: number;
//     inhibitorTakedowns: number;
//     inhibitorsLost: number;
//     item0: number;
//     item1: number;
//     item2: number;
//     item3: number;
//     item4: number;
//     item5: number;
//     item6: number;
//     itemsPurchased: number;
//     killingSprees: number;
//     kills: number;
//     lane: string;
//     largestCriticalStrike: number;
//     largestKillingSpree: number;
//     largestMultiKill: number;
//     longestTimeSpentLiving: number;
//     magicDamageDealt: number;
//     magicDamageDealtToChampions: number;
//     magicDamageTaken: number;
//     neutralMinionsKilled: number;
//     nexusKills: number;
//     nexusLost: number;
//     nexusTakedowns: number;
//     objectivesStolen: number;
//     objectivesStolenAssists: number;
//     participantId: number;
//     pentaKills: number;
//     perks: Perks;
//     physicalDamageDealt: number;
//     physicalDamageDealtToChampions: number;
//     physicalDamageTaken: number;
//     profileIcon: number;
//     puuid: string;
//     quadraKills: number;
//     riotIdName: string;
//     riotIdTagline: string;
//     role: string;
//     sightWardsBoughtInGame: number;
//     spell1Casts: number;
//     spell2Casts: number;
//     spell3Casts: number;
//     spell4Casts: number;
//     summoner1Casts: number;
//     summoner1Id: number;
//     summoner2Casts: number;
//     summoner2Id: number;
//     summonerId: string;
//     summonerLevel: number;
//     summonerName: string;
//     teamEarlySurrendered: boolean;
//     teamId: number;
//     teamPosition: string;
//     timeCCingOthers: number;
//     timePlayed: number;
//     totalDamageDealt: number;
//     totalDamageDealtToChampions: number;
//     totalDamageShieldedOnTeammates: number;
//     totalDamageTaken: number;
//     totalHeal: number;
//     totalHealsOnTeammates: number;
//     totalMinionsKilled: number;
//     totalTimeCCDealt: number;
//     totalTimeSpentDead: number;
//     totalUnitsHealed: number;
//     tripleKills: number;
//     trueDamageDealt: number;
//     trueDamageDealtToChampions: number;
//     trueDamageTaken: number;
//     turretKills: number;
//     turretTakedowns: number;
//     turretsLost: number;
//     unrealKills: number;
//     visionScore: number;
//     visionWardsBoughtInGame: number;
//     wardsKilled: number;
//     wardsPlaced: number;
//     win: boolean;
// }

// interface Ban {
//     championId: number;
//     pickTurn: number;
// }

// interface Baron {
//     first: boolean;
//     kills: number;
// }

// interface Champion {
//     first: boolean;
//     kills: number;
// }

// interface Dragon {
//     first: boolean;
//     kills: number;
// }

// interface Inhibitor {
//     first: boolean;
//     kills: number;
// }

// interface RiftHerald {
//     first: boolean;
//     kills: number;
// }

// interface Tower {
//     first: boolean;
//     kills: number;
// }

// interface Objectives {
//     baron: Baron;
//     champion: Champion;
//     dragon: Dragon;
//     inhibitor: Inhibitor;
//     riftHerald: RiftHerald;
//     tower: Tower;
// }

// interface Team {
//     bans: Ban[];
//     objectives: Objectives;
//     teamId: number;
//     win: boolean;
// }

// interface Info {
//     gameCreation: number;
//     gameDuration: number;
//     gameEndTimestamp: number;
//     gameId: number;
//     gameMode: string;
//     gameName: string;
//     gameStartTimestamp: number;
//     gameType: string;
//     gameVersion: string;
//     mapId: number;
//     participants: Participant[];
//     platformId: string;
//     queueId: number;
//     teams: Team[];
//     tournamentCode: string;
// }

// export interface MatchDTO {
//     metadata: Metadata;
//     info: Info;
// }

// export interface LolMatchData extends MatchDTO {}; // Aliasing for convenience