import {currentUser} from "@clerk/nextjs/server";



async function DashboardPage(){
    const user = await currentUser();
    return <div>
        {/* analytics matrics -premium */}
        {/* Customize linktree link url form */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8 ">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                <UsernameForm/>
                </div>
            </div>
        </div>

        {/* Page Customization */}
        {/* manage links */}

    </div>;
}

export default DashboardPage;