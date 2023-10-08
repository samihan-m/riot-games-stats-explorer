import { ValMatch } from "./ValMatch";
import { MatchPlayerData, MatchTeamData } from "./ValMatchData";
import { ValPlayer } from "./ValPlayer";

export function getFirstElement(map: Map<string, number>): string | null {
    // Returns the first element of a map, or null if the map is empty
    let array = Array.from(map.keys());
    for (let element of Array.from(map.keys())) {
        return element;
    }
    return null;
}
export class ValMatchStatistics {
    // This class will keep track of all stats I care about for one match.
    // This will be able to be added to other statistics objects to aggregate them.
    // I will have separate aggregations for each agent as well.

    gamesPlayed: number = 0;

    score: number = 0;
    roundsPlayed: number = 0;
    kills: number = 0;
    deaths: number = 0;
    assists: number = 0;
    playtimeMillis: number = 0;
    grenadeCasts: number = 0;
    ability1Casts: number = 0;
    ability2Casts: number = 0;
    ultimateCasts: number = 0;
    roundsWon: number = 0;
    numPoints: number = 0;
    won: number = 0;    // This one comes from teamData

    agentsPlayed: Map<string, number> = new Map(); // agent id -> number of times played
    friendsPlayedWith: Map<string, number> = new Map(); // friend puuid -> number of times played with

    // Everything below here is from round data
    spikesPlanted: number = 0;
    spikesDefused: number = 0;
    spikePlantMillis: number = 0; // Milliseconds into the round when the spike was planted
    spikeDefuseMillis: number = 0; // Milliseconds into the round when the spike was defused
    favoritePlantSites: Map<string, number> = new Map(); // plant_site -> number of times planted

    // From player stats from round data
    damageTaken: number = 0;
    legShotsTaken: number = 0;
    bodyShotsTaken: number = 0;
    headShotsTaken: number = 0;

    spentCredits: number = 0; // Maybe figure out if any gamemodes where you don't actually buy anything contribute to spentCredits 

    damageGiven: number = 0;
    legShotsGiven: number = 0;
    bodyShotsGiven: number = 0;
    headShotsGiven: number = 0;

    soloKills: number = 0; // I'll treat it like a solo kill if there is no assistant_puuid in the kill object
    weaponKills: Map<string, number> = new Map(); // damage_item in the finishing_damage object -> number of kills
    adsKills: number = 0; // If is_secondary_fire_mode is true in the finishing_damage object

    // All of these are contingent on the player's team winning the round
    clutches: number = 0; // If the round_ceremony is "CeremonyClutch" and the player has the kill with the latest game_time_millis field of all kills in the round
    aces: number = 0; // If the round_ceremony is "CeremonyAce" and the player has 5 kills in the round
    teamAces: number = 0; // If the round_ceremony is "CeremonyTeamAce" and the player has 5 kills in the round
    thrifties: number = 0; // If the round_ceremony is "CeremonyThrifty"
    flawlesses: number = 0; // If the round_ceremony is "CeremonyFlawless"

    aggregateStatistics(otherStatistics: ValMatchStatistics): ValMatchStatistics {
        // Adds the other statistics object to this one and returns the result
        let result = new ValMatchStatistics();
        result.gamesPlayed = this.gamesPlayed + otherStatistics.gamesPlayed;
        result.score = this.score + otherStatistics.score;
        result.roundsPlayed = this.roundsPlayed + otherStatistics.roundsPlayed;
        result.kills = this.kills + otherStatistics.kills;
        result.deaths = this.deaths + otherStatistics.deaths;
        result.assists = this.assists + otherStatistics.assists;
        result.playtimeMillis = this.playtimeMillis + otherStatistics.playtimeMillis;
        result.grenadeCasts = this.grenadeCasts + otherStatistics.grenadeCasts;
        result.ability1Casts = this.ability1Casts + otherStatistics.ability1Casts;
        result.ability2Casts = this.ability2Casts + otherStatistics.ability2Casts;
        result.ultimateCasts = this.ultimateCasts + otherStatistics.ultimateCasts;
        result.roundsWon = this.roundsWon + otherStatistics.roundsWon;
        result.numPoints = this.numPoints + otherStatistics.numPoints;
        result.won = this.won + otherStatistics.won;

        function mapMerge(mapOne: Map<string, number>, mapTwo: Map<string, number>): Map<string, number> {
            // Merges two maps and returns the result
            let result: Map<string, number> = new Map<string, number>();
            mapOne.forEach((value, key) => result.set(key, value));
            mapTwo.forEach((value, key) => {
                if (result.has(key)) {
                    result.set(key, (result.get(key) ?? 0) + value);
                }
                else {
                    result.set(key, value);
                }
            });
            return result;
        }

        result.agentsPlayed = mapMerge(this.agentsPlayed, otherStatistics.agentsPlayed);

        result.friendsPlayedWith = mapMerge(this.friendsPlayedWith, otherStatistics.friendsPlayedWith);

        result.spikesPlanted = this.spikesPlanted + otherStatistics.spikesPlanted;
        result.spikesDefused = this.spikesDefused + otherStatistics.spikesDefused;
        result.spikePlantMillis = this.spikePlantMillis + otherStatistics.spikePlantMillis;
        result.spikeDefuseMillis = this.spikeDefuseMillis + otherStatistics.spikeDefuseMillis;

        result.favoritePlantSites = mapMerge(this.favoritePlantSites, otherStatistics.favoritePlantSites);

        result.damageTaken = this.damageTaken + otherStatistics.damageTaken;
        result.legShotsTaken = this.legShotsTaken + otherStatistics.legShotsTaken;
        result.bodyShotsTaken = this.bodyShotsTaken + otherStatistics.bodyShotsTaken;
        result.headShotsTaken = this.headShotsTaken + otherStatistics.headShotsTaken;

        result.spentCredits = this.spentCredits + otherStatistics.spentCredits;

        result.damageGiven = this.damageGiven + otherStatistics.damageGiven;
        result.legShotsGiven = this.legShotsGiven + otherStatistics.legShotsGiven;
        result.bodyShotsGiven = this.bodyShotsGiven + otherStatistics.bodyShotsGiven;
        result.headShotsGiven = this.headShotsGiven + otherStatistics.headShotsGiven;

        result.soloKills = this.soloKills + otherStatistics.soloKills;
        result.weaponKills = mapMerge(this.weaponKills, otherStatistics.weaponKills);
        result.adsKills = this.adsKills + otherStatistics.adsKills;

        result.clutches = this.clutches + otherStatistics.clutches;
        result.aces = this.aces + otherStatistics.aces;
        result.teamAces = this.teamAces + otherStatistics.teamAces;
        result.thrifties = this.thrifties + otherStatistics.thrifties;
        result.flawlesses = this.flawlesses + otherStatistics.flawlesses;

        return result;
    }

}

export class ValMatchStatisticsByAgent extends ValMatchStatistics {
    agentUuid: string = "";
    agentName: string = "";
    gamesPlayed: number = 0;
}

export class ValMatchStatisticsByFriend extends ValMatchStatistics {
    friendPuuid: string = "";
    friendName: string = "";
    gamesPlayed: number = 0;
}

export class ValStatistics {
    player: ValPlayer | null;
    matches: ValMatch[] | null;
    mapIdPlayCount: Record<string, number> = {};
    queueIdPlayCount: Record<string, number> = {};
    versionPlayCount: Record<string, number> = {};
    seasonPlayCount: Record<string, number> = {};
    // TODO: Think further about what data types I want these statistics objects to be
    aggregatedStatisticsForAllParticipants: Map<string, ValMatchStatistics> = new Map(); // puuid -> ValMatchStatistics
    aggregatedStatistics: ValMatchStatistics = new ValMatchStatistics();
    matchStatistics: ValMatchStatistics[] = [];
    matchStatisticsByAgent: ValMatchStatisticsByAgent[] = []; // Ordered from most played to least played agent
    matchStatisticsByFriend: ValMatchStatisticsByFriend[] = []; // Ordered from most played with to least played with friend

    constructor(player: ValPlayer | null = null, matches: ValMatch[] | null = null) {
        this.player = player;
        this.matches = matches;
        if (player === null || matches === null) {
            return;
        }
        this.calculateStatistics();
    }

    calculateStatistics(mapIdFilterSet: Set<string> | null = null, queueIdFilterSet: Set<string> | null = null, versionFilterSet: Set<string> | null = null, seasonFilterSet: Set<string> | null = null) {
        if (this.player === null || this.matches === null) {
            return;
        }

        console.log("Calculating statistics")

        // Reset statistics
        this.mapIdPlayCount = {};
        this.queueIdPlayCount = {};
        this.versionPlayCount = {};
        this.seasonPlayCount = {};
        this.aggregatedStatisticsForAllParticipants = new Map();
        this.aggregatedStatistics = new ValMatchStatistics();
        this.matchStatistics = [];
        this.matchStatisticsByAgent = [];
        this.matchStatisticsByFriend = [];

        // Map friend puuids to game names
        let friendPuuidToGameNameMap = new Map();

        for (let match of this.matches) {

            // Update play counts
            const updateSetCount = (set: Record<string, number>, key: string) => {
                set[key] = (set[key] === undefined ? 0 : set[key]) + 1;
            }

            updateSetCount(this.mapIdPlayCount, match.json_data.info.map_url);
            updateSetCount(this.queueIdPlayCount, match.json_data.info.queue_id);
            updateSetCount(this.versionPlayCount, match.json_data.info.game_version);
            updateSetCount(this.seasonPlayCount, match.json_data.info.season_id);

            // Filter out matches that don't match the filter
            if (mapIdFilterSet?.has(match.json_data.info.map_url) === true) {
                continue;
            }
            if (queueIdFilterSet?.has(match.json_data.info.queue_id) === true) {
                continue;
            }
            if (versionFilterSet?.has(match.json_data.info.game_version) === true) {
                continue;
            }
            if (seasonFilterSet?.has(match.json_data.info.season_id) === true) {
                continue;
            }

            // Calculate statistics for everyone so we have friend statistics on hand for displaying
            for (let matchParticipant of match.json_data.players) {
                let matchStatistics = new ValMatchStatistics();
                matchStatistics.gamesPlayed += 1;

                const playerData = match.json_data.players.find((player) => player.puuid === matchParticipant.puuid) as MatchPlayerData;
                const teamData = match.json_data.teams.find((team) => team.id === playerData.team_id) as MatchTeamData;

                if(playerData.stats !== undefined) {
                    matchStatistics.score = playerData.stats.score;
                    matchStatistics.roundsPlayed = playerData.stats.rounds_played;
                    matchStatistics.kills = playerData.stats.kills;
                    matchStatistics.deaths = playerData.stats.deaths;
                    matchStatistics.assists = playerData.stats.assists;
                    matchStatistics.playtimeMillis = playerData.stats.playtime_millis;
                    if (playerData.stats.ability_casts !== undefined) {
                        matchStatistics.grenadeCasts = playerData.stats.ability_casts.grenade_casts;
                        matchStatistics.ability1Casts = playerData.stats.ability_casts.ability1_casts;
                        matchStatistics.ability2Casts = playerData.stats.ability_casts.ability2_casts;
                        matchStatistics.ultimateCasts = playerData.stats.ability_casts.ultimate_casts;
                    }
                }
                if(teamData !== undefined) {
                    matchStatistics.roundsWon = teamData.rounds_won;
                    matchStatistics.numPoints = teamData.num_points;
                    matchStatistics.won = teamData.won ? 1 : 0;
                }
                
                // Also, look at each round
                const rounds = match.json_data.round_results;

                for (let round of rounds) {

                    // Find the player's stats for this round
                    const playerStatsForRound = round.player_stats.find((player) => player.puuid === playerData.puuid);
                    if (playerStatsForRound === undefined) {
                        // This should never happen but just in caase
                        continue;
                    }

                    // Update spike plant / defuse stats
                    if (round.bomb_planter_puuid === playerData.puuid) {
                        matchStatistics.spikesPlanted += 1;
                        matchStatistics.spikePlantMillis += round.plant_round_millis;
                        let sitePlantCount = matchStatistics.favoritePlantSites.get(round.plant_site) ?? 0;
                        matchStatistics.favoritePlantSites.set(round.plant_site, sitePlantCount + 1);
                    }
                    if (round.bomb_defuser_puuid === playerData.puuid) {
                        matchStatistics.spikesDefused += 1;
                        matchStatistics.spikeDefuseMillis += round.defuse_round_millis;
                    }

                    // Update damage taken stats
                    const allDamageInRound = round.player_stats.flatMap((player) => player.damage);
                    const damageDealtToPlayer = allDamageInRound.filter((damage) => damage.receiver === playerData.puuid);
                    for (let damageTaken of damageDealtToPlayer) {
                        matchStatistics.damageTaken += damageTaken.damage;
                        matchStatistics.legShotsTaken += damageTaken.legshots;
                        matchStatistics.bodyShotsTaken += damageTaken.bodyshots;
                        matchStatistics.headShotsTaken += damageTaken.headshots;
                    }

                    // Update spent credits
                    matchStatistics.spentCredits += playerStatsForRound.economy.spent;

                    // Update damage given stats
                    for (let damageGiven of playerStatsForRound.damage) {
                        matchStatistics.damageGiven += damageGiven.damage;
                        matchStatistics.legShotsGiven += damageGiven.legshots;
                        matchStatistics.bodyShotsGiven += damageGiven.bodyshots;
                        matchStatistics.headShotsGiven += damageGiven.headshots;
                    }

                    // Update kill stats
                    for (let kill of playerStatsForRound.kills) {
                        if (kill.assistant_puuids.length === 0) {
                            matchStatistics.soloKills += 1;
                        }
                        if (kill.finishing_damage.is_secondary_fire_mode === true) {
                            matchStatistics.adsKills += 1;
                        }
                        let weaponKillCount = matchStatistics.weaponKills.get(kill.finishing_damage.damage_item) ?? 0;
                        matchStatistics.weaponKills.set(kill.finishing_damage.damage_item, weaponKillCount + 1);
                    }

                    // Skip the round-end-based stats collection if the player's team didn't win the round
                    if (teamData === undefined || teamData.won === false) {
                        continue;
                    }

                    // Update round-end-based stats
                    switch (round.round_ceremony) {
                        case "CeremonyClutch":
                            // If the player has the kill with the latest game_time_millis field of all kills in the round
                            const allKills = round.player_stats.flatMap((player) => player.kills);
                            const latestKill = allKills.reduce((latestKill, kill) => {
                                return (kill.game_time_millis > latestKill.game_time_millis) ? kill : latestKill;
                            });
                            if (latestKill.killer_puuid === playerData.puuid) {
                                matchStatistics.clutches += 1;
                            }
                            break;
                        case "CeremonyAce":
                            // If the player has 5 kills (or more) in the round
                            if (playerStatsForRound.kills.length >= 5) {
                                matchStatistics.aces += 1;
                            }
                            break;
                        case "CeremonyTeamAce":
                            matchStatistics.teamAces += 1;
                            break;
                        case "CeremonyThrifty":
                            matchStatistics.thrifties += 1;
                            break;
                        case "CeremonyFlawless":
                            matchStatistics.flawlesses += 1;
                            break;
                        default:
                            break;
                    }

                }

                // Update played agents
                const agentUuid = playerData.character_id;
                let agentPlayCount = matchStatistics.agentsPlayed.get(agentUuid) ?? 0;
                matchStatistics.agentsPlayed.set(agentUuid, agentPlayCount + 1);

                // Update played friends
                const teamMates = match.json_data.players.filter((player) => player.team_id === playerData.team_id && player.puuid !== playerData.puuid);
                for (let teamMate of teamMates) {
                    let friendPlayCount = matchStatistics.friendsPlayedWith.get(teamMate.puuid) ?? 0;
                    matchStatistics.friendsPlayedWith.set(teamMate.puuid, friendPlayCount + 1);
                    friendPuuidToGameNameMap.set(teamMate.puuid, teamMate.game_name);
                }

                // Add to the aggregated statistics
                let currentStatsForPlayer = this.aggregatedStatisticsForAllParticipants.get(playerData.puuid) ?? new ValMatchStatistics();
                this.aggregatedStatisticsForAllParticipants.set(playerData.puuid, currentStatsForPlayer.aggregateStatistics(matchStatistics));
                if(playerData.puuid === this.player._id) {
                    this.matchStatistics.push(matchStatistics);
                }
            }
        }

        let currentUserStatistics = this.aggregatedStatisticsForAllParticipants.get(this.player._id) as ValMatchStatistics;
        this.aggregatedStatistics = currentUserStatistics;

        // Pull out every match statistic object per agent and sort them by games played
        let matchStatisticsByAgent: ValMatchStatisticsByAgent[] = [];
        this.aggregatedStatistics.agentsPlayed.forEach((value, key) => {
            let agentMatchStatistics = new ValMatchStatistics();
            for (let matchStatistics of this.matchStatistics) {
                if (matchStatistics.agentsPlayed.has(key)) {
                    agentMatchStatistics = agentMatchStatistics.aggregateStatistics(matchStatistics);
                }
            }
            // Convert agentMatchStatistics into a ValMatchStatisticsByAgent object
            let agentMatchStatisticsByAgent = agentMatchStatistics as ValMatchStatisticsByAgent;
            agentMatchStatisticsByAgent.agentUuid = key;
            // Agent name will be filled in later
            agentMatchStatisticsByAgent.gamesPlayed = value;
            matchStatisticsByAgent.push(agentMatchStatisticsByAgent);
        });
        matchStatisticsByAgent.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        this.matchStatisticsByAgent = matchStatisticsByAgent;

        // Pull out every match statistic object per friend and sort them by games played
        let matchStatisticsByFriend: ValMatchStatisticsByFriend[] = [];
        this.aggregatedStatistics.friendsPlayedWith.forEach((value, key) => {
            let friendMatchStatistics = new ValMatchStatistics();
            for (let matchStatistics of this.matchStatistics) {
                if (matchStatistics.friendsPlayedWith.has(key)) {
                    friendMatchStatistics = friendMatchStatistics.aggregateStatistics(matchStatistics);
                }
            }
            // Convert friendMatchStatistics into a ValMatchStatisticsByFriend object
            let friendMatchStatisticsByFriend = friendMatchStatistics as ValMatchStatisticsByFriend;
            friendMatchStatisticsByFriend.friendPuuid = key;
            friendMatchStatisticsByFriend.friendName = friendPuuidToGameNameMap.get(key) ?? "";
            matchStatisticsByFriend.push(friendMatchStatisticsByFriend);
        });
        matchStatisticsByFriend.sort((a, b) => b.gamesPlayed - a.gamesPlayed);
        this.matchStatisticsByFriend = matchStatisticsByFriend;
    }
};
