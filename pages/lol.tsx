import SummonerSearch from "@/components/common/SummonerSearch";
import CustomHeadLayout from "@/components/common/CustomHeadLayout";

export default function LolPage() {
    
    return (
        <>
            <CustomHeadLayout title={`Search for a LoL player`} description={`Search for a LoL player's stats`}>
                <h1 className="center-text">Search for a LoL player</h1>
                <div className="center-form">
                    <SummonerSearch/>
                </div>
            </CustomHeadLayout>
        </>
    )
}