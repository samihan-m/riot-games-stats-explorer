// Interfaces taken from https://github.com/iann838/Pyot/blob/master/pyot/models/val/match.py

// Alias for MatchInfoData
export interface ValMatchData extends Match {};

export interface MatchInfoData {
  id: string;
  map_url: string;
  start_millis: number;
  length_millis: number;
  alt_region: string;
  provisioning_flow_id: string;
  is_completed: boolean;
  custom_game_name: string;
  queue_id: string;
  game_mode: string;
  game_version: string;
  is_ranked: boolean;
  season_id: string;
}

export interface MatchPlayerAbilityCastData {
  grenade_casts: number;
  ability1_casts: number;
  ability2_casts: number;
  ultimate_casts: number;
}

export interface MatchPlayerAbilityData {
  grenade_effects: number;
  ability1_effects: number;
  ability2_effects: number;
  ultimate_effects: number;
}

export interface MatchPlayerStatData {
  score: number;
  rounds_played: number;
  kills: number;
  deaths: number;
  assists: number;
  playtime_millis: number;
  ability_casts: MatchPlayerAbilityCastData;
}

export interface MatchPlayerData {
  puuid: string;
  game_name: string;
  tag_line: string;
  team_id: string;
  party_id: string;
  character_id: string;
  stats: MatchPlayerStatData;
  competitive_tier: number;
  player_card_id: string;
  player_title_id: string;
}

export interface MatchTeamData {
  id: string;
  won: boolean;
  rounds_played: number;
  rounds_won: number;
  num_points: number;
}

export interface MatchLocationData {
  x: number;
  y: number;
}

export interface MatchPlayerLocationData {
  puuid: string;
  view_radians: number;
  location: MatchLocationData;
}

export interface MatchPlayerFinishingDamageData {
  damage_type: string;
  damage_item: string;
  is_secondary_fire_mode: boolean;
}

export interface MatchPlayerKillData {
  game_time_millis: number;
  round_time_millis: number;
  killer_puuid: string;
  victim_puuid: string;
  victim_location: MatchLocationData;
  assistant_puuids: string[];
  player_locations: MatchPlayerLocationData[];
  finishing_damage: MatchPlayerFinishingDamageData;
}

export interface MatchPlayerDamageData {
  receiver: string;
  damage: number;
  legshots: number;
  bodyshots: number;
  headshots: number;
}

export interface MatchPlayerEconomyData {
  loadout_value: number;
  weapon_id: string;
  armor_id: string;
  remaining: number;
  spent: number;
}

export interface MatchPlayerRoundStatData {
  puuid: string;
  kills: MatchPlayerKillData[];
  damage: MatchPlayerDamageData[];
  score: number;
  economy: MatchPlayerEconomyData;
  ability: MatchPlayerAbilityData;
}

export interface MatchRoundResultData {
  round_num: number;
  round_result: string;
  round_ceremony: string;
  winning_team: string;
  bomb_planter_puuid: string;
  bomb_defuser_puuid: string;
  plant_round_millis: number;
  plant_player_locations: MatchPlayerLocationData[];
  plant_location: MatchLocationData;
  plant_site: string;
  defuse_round_millis: number;
  defuse_player_locations: MatchPlayerLocationData[];
  defuse_location: MatchLocationData;
  player_stats: MatchPlayerRoundStatData[];
  round_result_code: string;
}

export interface MatchCoachData {
  puuid: string;
  team_id: string;
}

export interface Match {
  id: string;
  info: MatchInfoData;
  players: MatchPlayerData[];
  teams: MatchTeamData[];
  coaches: MatchCoachData[];
  round_results: MatchRoundResultData[];
  // Note: These fields don't seem accessible, and this weird comment
  // was above them:
  // # <~> MatchHistory
  // start_time_millis: number;
  // team_id: string;
  // queue_id: string;
}

