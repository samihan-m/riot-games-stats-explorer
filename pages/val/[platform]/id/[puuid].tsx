import ValPlayerPage, { ValPlayerPageProps } from "../[gameName]/[tagLine]";
import { getServerSideProps } from "../[gameName]/[tagLine]";

export default function ValPlayerByPuuidPage(props: ValPlayerPageProps) {
    return ValPlayerPage(props);
}

export {getServerSideProps};