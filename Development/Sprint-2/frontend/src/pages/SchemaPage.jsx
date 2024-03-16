import Diagram from '../components/Diagram';
import SideRail from '../components/SideRail';

const SchemaPage = () => {

    return (
        <div className="flex bg-gray-900 text-gray-50 h-screen max-h-screen">
            <SideRail />
            <Diagram />
        </div>
    );
};

export default SchemaPage;
