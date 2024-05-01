import Diagram from '../components/Diagram';
import SideRail from '../components/SideRail';

const SchemaPage = () => {

    return (
        <div className="flex bg-black-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <div className="w-[2px] h-screen bg-gray-100 opacity-10"></div>

            <Diagram />
        </div>
    );
};

export default SchemaPage;
