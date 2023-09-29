import { ValMatch } from "./ValMatch";
import { PlayerDTO } from "./ValMatchData";
import { ValPlayer } from "./ValPlayer";

// TODO: Remove all the redundancy from calculateStatistics().

export type PlayedAgents = Record<string, AgentStatistics> // agent name -> stats

export type AgentPlayCount = {
    agentName: string,
    playCount: number,
}

export function getMostPlayedAgent(agentStatistics: AgentStatistics[]): AgentStatistics {
    let mostPlayedAgentStats: AgentStatistics = {
        "agentName": "",
        "gamesPlayed": 0,
        "gamesWon": 0,
        "gamesLost": 0,
        "roundsPlayed": 0,
        "roundsWon": 0,
        "roundsLost": 0,
        "kills": 0,
        "deaths": 0,
        "assists": 0,
        "playtimeMillis": 0,
        "grenadeCasts": 0,
        "ability1Casts": 0,
        "ability2Casts": 0,
        "ultimateCasts": 0,
        "score": 0,
        "winRate": 0
    }
    for(let agent of agentStatistics) {
        if(agent.gamesPlayed > mostPlayedAgentStats.gamesPlayed) {
            mostPlayedAgentStats = agent;
        }
    }
    return mostPlayedAgentStats;
}

export function calculateKDA(kills: number, deaths: number, assists: number, precision: number = 3): number {
    let kdaDivisor = (deaths === 0) ? 1 : deaths;
    return Number(((kills + assists) / kdaDivisor).toFixed(precision));
}

export type FriendPlayedWith = {
    gameName: string[],
    tagLine: string[],
    puuid: string,
    playCount: number,
    winCount: number,
    lossCount: number,
    roundsPlayedCount: number,
    roundsWinCount: number,
    roundsLossCount: number,
    friendKills: number,
    friendDeaths: number,
    friendAssists: number,
    friendPlayed: PlayedAgents,
    yourKills: number,
    yourDeaths: number,
    yourAssists: number,
    youPlayed: PlayedAgents,
    playtimeMillis: number,
}

type AgentStatistics = {
    agentName: string,
    gamesPlayed: number,
    gamesWon: number,
    gamesLost: number,
    roundsPlayed: number,
    roundsWon: number,
    roundsLost: number,
    kills: number,
    deaths: number,
    assists: number,
    playtimeMillis: number,
    grenadeCasts: number,
    ability1Casts: number,
    ability2Casts: number,
    ultimateCasts: number,
    score: number,
    winRate: number
}

export class ValStatistics {
    mapIdPlayCount: Record<string, number>;
    queueIdPlayCount: Record<string, number>;
    // modePlayCount: Record<string, number>;
    // typePlayCount: Record<string, number>;
    versionPlayCount: Record<string, number>;
    totalWinCount: number;
    totalRoundsPlayed: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalKDA: number;
    totalPlaytimeMillis: number;
    totalGrenadeCasts: number;
    totalAbility1Casts: number;
    totalAbility2Casts: number;
    totalUltimateCasts: number;
    totalScore: number;
    playedAgents: PlayedAgents;
    friendsPlayedWith: FriendPlayedWith[];
    earliestGameTime: number;
    latestGameTime: number;

    constructor(player: ValPlayer | null, valMatches: ValMatch[] | null) {
        this.mapIdPlayCount = {};
        this.queueIdPlayCount = {};
        // this.modePlayCount = {};
        // this.typePlayCount = {};
        this.versionPlayCount = {};
        this.totalWinCount = 0;
        this.totalRoundsPlayed = 0;
        this.totalKills = 0;
        this.totalDeaths = 0;
        this.totalAssists = 0;
        this.totalKDA = 0;
        this.playedAgents = {};

        this.friendsPlayedWith = [];
        this.earliestGameTime = 8640000000000000; // Maximum date (as per https://stackoverflow.com/a/43794682)
        this.latestGameTime = -8640000000000000; // Minimum date (as per https://stackoverflow.com/a/43794682)

        if (player === null || valMatches === null) {
            return;
        }

        console.log("Constructed statistics object, calculating...")
        this.calculateStatistics(player, valMatches);
    }

    resetStatistics() {
        console.log("Resetting statistics");

        this.mapIdPlayCount = {};
        this.queueIdPlayCount = {};
        // this.modePlayCount = {};
        // this.typePlayCount = {};
        this.versionPlayCount = {};
        this.totalWinCount = 0;
        this.totalRoundsPlayed = 0;
        this.totalKills = 0;
        this.totalDeaths = 0;
        this.totalAssists = 0;
        this.totalKDA = 0;
        this.totalPlaytimeMillis = 0;
        this.totalGrenadeCasts = 0;
        this.totalAbility1Casts = 0;
        this.totalAbility2Casts = 0;
        this.totalUltimateCasts = 0;
        this.playedAgents = {};
        this.friendsPlayedWith = [];
        this.earliestGameTime = 8640000000000000; // Maximum date (as per https://stackoverflow.com/a/43794682)
        this.latestGameTime = -8640000000000000; // Minimum date (as per https://stackoverflow.com/a/43794682)
    }

    calculateStatistics(
        player: ValPlayer,
        valMatches: ValMatch[],
        mapIdFilter: Set<string> | null = null,
        queueIdFilter: Set<string> | null = null,
        // modeFilter: Set<string> | null = null,
        // typeFilter: Set<string> | null = null,
        versionFilter: Set<string> | null = null
    ) {
        console.log("Calculating statistics...")

        this.resetStatistics();

        let prototypeAgentStatsObject: AgentStatistics = {
            "agentName": "",
            "gamesPlayed": 0,
            "gamesWon": 0,
            "gamesLost": 0,
            "roundsPlayed": 0,
            "roundsWon": 0,
            "roundsLost": 0,
            "kills": 0,
            "deaths": 0,
            "assists": 0,
            "playtimeMillis": 0,
            "grenadeCasts": 0,
            "ability1Casts": 0,
            "ability2Casts": 0,
            "ultimateCasts": 0,
            "score": 0,
            "winRate": 0
        }

        let agentStatisticsObjectMap = new Map<string, AgentStatistics>(); // Map of agent name to agent statistics object

        let aggregatedAgentStatisticsObject = structuredClone(prototypeAgentStatsObject);
        aggregatedAgentStatisticsObject.agentName = "Total";
        agentStatisticsObjectMap.set(aggregatedAgentStatisticsObject.agentName, aggregatedAgentStatisticsObject);

        function getAgentStatsObject(agentName: string): AgentStatistics {
            let agentStatsObj = agentStatisticsObjectMap.get(agentName);
            if (agentStatsObj !== undefined) {
                return agentStatsObj;
            }
            let newObj = structuredClone(prototypeAgentStatsObject);
            newObj.agentName = agentName;
            agentStatisticsObjectMap.set(agentName, newObj);
            return newObj;
        }

        let prototypeFriendObject: FriendPlayedWith = {
            gameName: [],
            tagLine: [],
            puuid: "",
            playCount: 0,
            winCount: 0,
            lossCount: 0,
            roundsPlayedCount: 0,
            roundsWinCount: 0,
            roundsLossCount: 0,
            friendKills: 0,
            friendDeaths: 0,
            friendAssists: 0,
            friendPlayed: {},
            yourKills: 0,
            yourDeaths: 0,
            yourAssists: 0,
            youPlayed: {},
            playtimeMillis: 0,

        }

        let friendPlayedWithObjectMap = new Map<string, FriendPlayedWith>(); // Map of puuid to friend played with object

        function getFriendObject(puuid: string): FriendPlayedWith {
            let friendObject = friendPlayedWithObjectMap.get(puuid);
            if (friendObject !== undefined) {
                return friendObject;
            }
            let newFriendObject = structuredClone(prototypeFriendObject);
            newFriendObject.puuid = puuid;
            friendPlayedWithObjectMap.set(puuid, newFriendObject);
            return newFriendObject;
        }

        function updateAgentStatistics(newAgentStatistics: AgentStatistics, playedAgents: PlayedAgents): PlayedAgents {
            
            // Find the appropriate agent statistics object in playedAgents
            let agentStatsObjectToUpdate: AgentStatistics | undefined = undefined;
            for (let agentStatsObject of Object.values(playedAgents)) {
                if (agentStatsObject.agentName === newAgentStatistics.agentName) {
                    agentStatsObjectToUpdate = agentStatsObject;
                }
            }
            if(agentStatsObjectToUpdate === undefined) {
                agentStatsObjectToUpdate = structuredClone(prototypeAgentStatsObject);
                playedAgents[newAgentStatistics.agentName] = agentStatsObjectToUpdate;
            }

            // Update the agent statistics object
            agentStatsObjectToUpdate.gamesPlayed += newAgentStatistics.gamesPlayed;
            agentStatsObjectToUpdate.gamesWon += newAgentStatistics.gamesWon;
            agentStatsObjectToUpdate.gamesLost += newAgentStatistics.gamesLost;
            agentStatsObjectToUpdate.roundsPlayed += newAgentStatistics.roundsPlayed;
            agentStatsObjectToUpdate.roundsWon += newAgentStatistics.roundsWon;
            agentStatsObjectToUpdate.roundsLost += newAgentStatistics.roundsLost;
            agentStatsObjectToUpdate.kills += newAgentStatistics.kills;
            agentStatsObjectToUpdate.deaths += newAgentStatistics.deaths;
            agentStatsObjectToUpdate.assists += newAgentStatistics.assists;
            agentStatsObjectToUpdate.playtimeMillis += newAgentStatistics.playtimeMillis;
            agentStatsObjectToUpdate.grenadeCasts += newAgentStatistics.grenadeCasts;
            agentStatsObjectToUpdate.ability1Casts += newAgentStatistics.ability1Casts;
            agentStatsObjectToUpdate.ability2Casts += newAgentStatistics.ability2Casts;
            agentStatsObjectToUpdate.ultimateCasts += newAgentStatistics.ultimateCasts;

            return playedAgents;
        }

        for (let match of valMatches) {

            let mapId = match.json_data.matchInfo.mapId;
            let queueId = match.json_data.matchInfo.queueId
            // let mode = match.json_data.info.mode;
            // let type = match.json_data.info.type;
            let version = match.json_data.matchInfo.gameVersion;

            this.mapIdPlayCount[mapId] = (this.mapIdPlayCount[mapId] === undefined ? 0 : this.mapIdPlayCount[mapId]) + 1;

            this.queueIdPlayCount[queueId] = (this.queueIdPlayCount[queueId] === undefined ? 0 : this.queueIdPlayCount[queueId]) + 1;

            // this.modePlayCount[mode] = (this.modePlayCount[mode] === undefined ? 0 : this.modePlayCount[mode]) + 1;

            // this.typePlayCount[type] = (this.typePlayCount[type] === undefined ? 0 : this.typePlayCount[type]) + 1;

            this.versionPlayCount[version] = (this.versionPlayCount[version] === undefined ? 0 : this.versionPlayCount[version]) + 1;

            if (mapIdFilter?.has(mapId) === true) {
                continue;
            }
            if (queueIdFilter?.has(queueId) === true) {
                continue;
            }
            // if (modeFilter?.has(mode) === true) {
            //     continue;
            // }
            // if (typeFilter?.has(type) === true) {
            //     continue;
            // }
            if (versionFilter?.has(version) === true) {
                continue;
            }

            let matchStartMillis = match.json_data.matchInfo.gameStartMillis;
            if (matchStartMillis <= this.earliestGameTime) {
                this.earliestGameTime = matchStartMillis;
            }

            if (matchStartMillis >= this.latestGameTime) {
                this.latestGameTime = matchStartMillis;
            }

            let playerInformation: PlayerDTO | null = null;
            for (let participant of match.json_data.players) {
                if (participant.puuid === player._id) {
                    playerInformation = participant;
                }
            }
            playerInformation = playerInformation as PlayerDTO;
            let winningTeamId = undefined;
            for(let team of match.json_data.teams) {
                if(team.won === true) {
                    winningTeamId = team.teamId;
                }
            }
            const didPlayerWin = (playerInformation.teamId === winningTeamId);


            // Update agent specific statistics

            let agentStatisticsObject = getAgentStatsObject(playerInformation.characterId);
            agentStatisticsObject.gamesPlayed += 1;
            aggregatedAgentStatisticsObject.gamesPlayed += 1;

            if(didPlayerWin === true) {
                agentStatisticsObject.gamesWon += 1;
                aggregatedAgentStatisticsObject.gamesWon += 1;
            }
            else {
                agentStatisticsObject.gamesLost += 1;
                aggregatedAgentStatisticsObject.gamesLost += 1;
            }
            
            agentStatisticsObject.roundsPlayed += playerInformation.stats.roundsPlayed;
            aggregatedAgentStatisticsObject.roundsPlayed += playerInformation.stats.roundsPlayed;
            agentStatisticsObject.kills += playerInformation.stats.kills;
            aggregatedAgentStatisticsObject.kills += playerInformation.stats.kills;
            agentStatisticsObject.deaths += playerInformation.stats.deaths;
            aggregatedAgentStatisticsObject.deaths += playerInformation.stats.deaths;
            agentStatisticsObject.assists += playerInformation.stats.assists;
            aggregatedAgentStatisticsObject.assists += playerInformation.stats.assists;
            agentStatisticsObject.playtimeMillis += playerInformation.stats.playtimeMillis;
            aggregatedAgentStatisticsObject.playtimeMillis += playerInformation.stats.playtimeMillis;
            agentStatisticsObject.grenadeCasts += playerInformation.stats.abilityCasts.grenadeCasts;
            aggregatedAgentStatisticsObject.grenadeCasts += playerInformation.stats.abilityCasts.grenadeCasts;
            agentStatisticsObject.ability1Casts += playerInformation.stats.abilityCasts.ability1Casts;
            aggregatedAgentStatisticsObject.ability1Casts += playerInformation.stats.abilityCasts.ability1Casts;
            agentStatisticsObject.ability2Casts += playerInformation.stats.abilityCasts.ability2Casts;
            aggregatedAgentStatisticsObject.ability2Casts += playerInformation.stats.abilityCasts.ability2Casts;
            agentStatisticsObject.ultimateCasts += playerInformation.stats.abilityCasts.ultimateCasts;
            aggregatedAgentStatisticsObject.ultimateCasts += playerInformation.stats.abilityCasts.ultimateCasts;
            agentStatisticsObject.score += playerInformation.stats.score;
            aggregatedAgentStatisticsObject.score += playerInformation.stats.score;

            agentStatisticsObject.winRate = ((agentStatisticsObject.gamesWon / agentStatisticsObject.gamesPlayed) * 100);
            aggregatedAgentStatisticsObject.winRate = ((aggregatedAgentStatisticsObject.gamesWon / aggregatedAgentStatisticsObject.gamesPlayed) * 100);


            // Update overall player statistics

            this.totalRoundsPlayed += playerInformation.stats.roundsPlayed;

            if (didPlayerWin === true) {
                this.totalWinCount += 1;
            }

            this.totalKills += playerInformation.stats.kills;
            this.totalDeaths += playerInformation.stats.deaths;
            this.totalAssists += playerInformation.stats.assists;
            this.totalPlaytimeMillis += playerInformation.stats.playtimeMillis;
            this.totalGrenadeCasts += playerInformation.stats.abilityCasts.grenadeCasts;
            this.totalAbility1Casts += playerInformation.stats.abilityCasts.ability1Casts;
            this.totalAbility2Casts += playerInformation.stats.abilityCasts.ability2Casts;
            this.totalUltimateCasts += playerInformation.stats.abilityCasts.ultimateCasts;
            this.totalScore += playerInformation.stats.score;

            this.playedAgents = updateAgentStatistics(playerInformation.champion_name, this.playedAgents);

            this.totalRoundsPlayed += 

            let playerTeamId = playerInformation.team_id;
            let allyParticipants: Participant[] = [];
            for (let participant of match.json_data.info.participants) {
                if (participant.team_id === playerTeamId && participant.puuid !== player._id) {
                    allyParticipants.push(participant);
                }
            }
            for (let allyParticipant of allyParticipants) {
                let friend = getFriendObject(allyParticipant.puuid);
                if (friend.gameName.includes(allyParticipant.summoner_name) === false) {
                    friend.gameName.push(allyParticipant.summoner_name);
                }
                friend.playCount += 1;

                if (playerInformation.win === true) {
                    friend.winCount += 1;
                }
                else {
                    friend.lossCount += 1;
                }

                friend.yourKills += playerInformation.kills;
                friend.yourDeaths += playerInformation.deaths;
                friend.yourAssists += playerInformation.assists;
                friend.friendKills += allyParticipant.kills;
                friend.friendDeaths += allyParticipant.deaths;
                friend.friendAssists += allyParticipant.assists;
                friend.youPlayed = updateAgentStatistics(playerInformation.champion_name, friend.youPlayed);
                friend.friendPlayed = updateAgentStatistics(allyParticipant.champion_name, friend.friendPlayed);
            }

        }

        this.totalKDA = calculateKDA(this.totalKills, this.totalDeaths, this.totalAssists);

        // Turn the champion statistics object map into a list
        this.allAgentSpecificStatistics = Array.from(agentStatisticsObjectMap.values());

        // Calculate KDA for every champion object and add it t the object
        for (let champion of this.allAgentSpecificStatistics) {
            champion["k/d/a"] = calculateKDA(champion.kills as number, champion.deaths as number, champion.assists as number);
        }

        this.allAgentSpecificStatistics.sort((a, b) => (b.gamesPlayed as number) - (a.gamesPlayed as number));

        // Turn the friend object map into a list
        this.friendsPlayedWith = Array.from(friendPlayedWithObjectMap.values());
        
        // Remove all objects that have a playCount of less than 2
        // Treating playing 1 game together as just random queueing into each other
        this.friendsPlayedWith = this.friendsPlayedWith.filter((friend) => friend.playCount >= 2);

        this.friendsPlayedWith.sort((a, b) => (a.playCount > b.playCount) ? -1 : 1);
    }

}
