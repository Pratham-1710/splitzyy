
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Users, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Star,
  Clock,
  Loader2,
  BellElectric,
  BellIcon
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
// import Notif from "../components/notif";
import Notif from "../components/Notif";
import Notification from "../components/Notification";

interface DashboardProps {
  user: any;
  token: string | null;
  focus(): HTMLInputElement
}

interface Group {
  id: string;
  name: string;
  members: string[];
  createdAt?: string;
  totalExpenses?: number;
  recentActivity?: boolean;
}
 


// Helper function to get group initials
const getGroupInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Helper function to get gradient colors based on group name
const getGroupGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
  ];
  
  const index = name.length % gradients.length;
  return gradients[index];
};

// Skeleton loading component for groups
const GroupSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="w-4 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="pt-4 border-t border-gray-100">
      <div className="w-full h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

function Dashboard({ user, token }: DashboardProps) {
    const navigate = useNavigate();

     

    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingGroups, setFetchingGroups] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
        const fetchGroups = async() => {
            try {
                setFetchingGroups(true);
                const res = await axiosInstance.get("/groups");
                setGroups(res.data);
            } catch (error) {
                console.log("Error while fetching groups", error);
            } finally {
                setFetchingGroups(false);
            }
        }

        fetchGroups();
    }, [token]);
  
//    {console.log(user)
//     console.log(token)
//    }

    const handleCreateGroup = async() => {
        if(!newGroupName.trim()) return;

        setLoading(true);

        try {
            const res = await axiosInstance.post(
                "/groups",
                {name: newGroupName}
            );
            
            setGroups([...groups, res.data]);
            setNewGroupName("");
        } catch (err) {
            console.log("Error creating group", err);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreateGroup();
        }
    }

    // Filter groups based on search term
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };
  
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {getGreeting()}, {user.name}!
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Manage your groups and track expenses effortlessly
                                </p>
                            </div>
                        </div>
                        
                        <div className="hidden sm:flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <Users className="w-4 h-4" />
                                <span>{groups.length} group{groups.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <TrendingUp className="w-4 h-4" />
                                <span>Active</span>
                            </div>
{/* 
                            <div className="flex items-center space-x-2 text-sm">
                                <BellIcon className="w-4 h-4" />
                                <span>hello</span>
                            </div> */}

                            <Notif/>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{groups.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Groups</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{groups.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {new Date().toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Group Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Create New Group</h2>
                            <p className="text-sm text-gray-600">Start splitting expenses with friends and family</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Enter group name (e.g., Weekend Trip, House Expenses)"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300"
                                disabled={loading}
                            />
                        </div>
                        <button
                            onClick={handleCreateGroup}
                            disabled={loading || !newGroupName.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Create Group
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Groups Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
                            {groups.length > 0 && (
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                    {filteredGroups.length}
                                </span>
                            )}
                        </div>
                        
                        {groups.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search groups..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                    />
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {fetchingGroups ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(6)].map((_, i) => <GroupSkeleton key={i} />)}
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {groups.length === 0 ? "No groups yet" : "No groups found"}
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                                {groups.length === 0 
                                    ? "Create your first group to start splitting expenses with friends, family, or colleagues."
                                    : `No groups match "${searchTerm}". Try adjusting your search.`
                                }
                            </p>
                            {groups.length === 0 && (
                                <button
                                    onClick={() => (document.querySelector('input[placeholder*="Enter group name"]') as HTMLInputElement | null)?.focus()}
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Your First Group</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGroups.map((group, index) => (
                                <div
                                    key={group.id}
                                    onClick={() => navigate(`/groups/${group.id}`)}
                                    className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${getGroupGradient(group.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                            {getGroupInitials(group.name)}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {group.recentActivity && (
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            )}
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {group.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{group.members?.length || 0} member{(group.members?.length || 0) !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                                                View details & expenses
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-3 h-3 text-gray-300 group-hover:text-yellow-400 transition-colors duration-300" />
                                                <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors duration-300">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Action Button for Mobile */}
            <div className="sm:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => (document.querySelector('input[placeholder*="Enter group name"] ')as HTMLInputElement | null)?.focus()}
                    className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

export default Dashboard;






// ver 2


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Users, ArrowRight } from "lucide-react";
// import axiosInstance from "../utils/axiosInstance";

// interface DashboardProps {
//   user: any;
//   token: string | null;
// }

// interface Group {
//   id: string;
//   name: string;
//   members: string[];
// }

// function Dashboard({ user, token }: DashboardProps) {
//     const navigate = useNavigate();

//     const [groups, setGroups] = useState<Group[]>([]);
//     const [newGroupName, setNewGroupName] = useState("");
//     const [loading, setLoading] = useState(false);
  
//     useEffect(() => {
//         const fetchGroups = async() => {
//             try {
//                 const res = await axiosInstance.get("/groups")
//                 setGroups(res.data);
//                 // console.log(res)
//             } catch (error) {
//                 console.log("Error while fetching groups", error)
//             }
//         }

//         fetchGroups();
//     }, [token])
  
//     const handleCreateGroup = async() => {
//         if(!newGroupName.trim()) return;

//         setLoading(true);

//         try {
//             const res = await axiosInstance.post(
//                 "/groups",
//                 {name: newGroupName}
//             );
            
//             setGroups([...groups, res.data])
//             setNewGroupName("")
//         } catch (err) {
//             console.log("Error creating group", err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             handleCreateGroup();
//         }
//     }
  
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//             <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//                 {/* Header Section */}
//                 <div className="mb-8">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                                 Welcome back, {user.name}!
//                             </h1>
//                             <p className="text-gray-600">
//                                 Manage your groups and track expenses effortlessly
//                             </p>
//                         </div>
//                         <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
//                             <Users className="w-4 h-4" />
//                             <span>{groups.length} group{groups.length !== 1 ? 's' : ''}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Create Group Section */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
//                     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <Plus className="w-5 h-5 text-emerald-600" />
//                         Create New Group
//                     </h2>
                    
//                     <div className="flex gap-3">
//                         <div className="flex-1">
//                             <input
//                                 type="text"
//                                 placeholder="Enter group name (e.g., Weekend Trip, House Expenses)"
//                                 value={newGroupName}
//                                 onChange={(e) => setNewGroupName(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-400 text-gray-900"
//                                 disabled={loading}
//                             />
//                         </div>
//                         <button
//                             onClick={handleCreateGroup}
//                             disabled={loading || !newGroupName.trim()}
//                             className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
//                         >
//                             {loading ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     Creating...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="w-4 h-4" />
//                                     Create Group
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Groups Section */}
//                 <div>
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
//                         {groups.length > 0 && (
//                             <p className="text-sm text-gray-500">Click on any group to view details</p>
//                         )}
//                     </div>
                    
//                     {groups.length === 0 ? (
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <Users className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
//                             <p className="text-gray-500 mb-6 max-w-md mx-auto">
//                                 Create your first group to start splitting expenses with friends, family, or colleagues.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                             {groups.map((group) => (
//                                 <div
//                                     key={group.id}
//                                     onClick={() => navigate(`/groups/${group.id}`)}
//                                     className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all duration-200 transform hover:-translate-y-1"
//                                 >
//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
//                                             {group.name.charAt(0).toUpperCase()}
//                                         </div>
//                                         <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
//                                     </div>
                                    
//                                     <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2">
//                                         {group.name}
//                                     </h3>
                                    
//                                     <div className="flex items-center text-sm text-gray-500">
//                                         <Users className="w-4 h-4 mr-1" />
//                                         <span>{group.members?.length || 0} member{(group.members?.length || 0) !== 1 ? 's' : ''}</span>
//                                     </div>
                                    
//                                     <div className="mt-4 pt-4 border-t border-gray-100">
//                                         <div className="flex items-center justify-between text-xs text-gray-400">
//                                             <span>View details</span>
//                                             <span>→</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
















//vers 1

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";

// interface DashboardProps {
//   user: any;
//   token: string | null;
// }

// interface Group {
//   id: string;
//   name: string;
//   members: string[];
// }

// function Dashboard({ user, token }: DashboardProps) {
//     const navigate = useNavigate();

//     const [groups,setGroups] = useState<Group[]>([]);
//     const [newGroupName,setNewGroupName] = useState("");
//     const [loading, setLoading] = useState(false);
  
       
//     useEffect(() => {
          
//          const fetchGroups = async() =>{


//                try {
//                      const res = await axiosInstance.get("/groups")

//                        setGroups(res.data);
//                        console.log(res)
//                } catch (error) {
//                   console.log("Error while fetching groups", error)
//                }
//          }

//          fetchGroups();
//     }, [token])
  

//     const handleCreateGroup = async()=>{
          
//        if(!newGroupName) return;

//        setLoading(true);

//        try {
              
//            const res = await axiosInstance.post(
//                "/groups",
//                {name: newGroupName}
//            );

           
           
//            setGroups([...groups,res.data])
//            setNewGroupName("")
//        } catch (err) {
//       console.log("Error creating group", err);
//     } finally {
//       setLoading(false);
//     }
//     }
  
//     return (
//     <div className="p-8">
//       {/* Dashboard — User: {JSON.stringify(user)}, Token: {token} */}
//          <h1 className="text-2xl font-bold mb-4">Hello, {user.name}!</h1>
    
//        <div className="mb-6 flex gap-2">
//               <input
//                 type="text"
//                 placeholder="New group name"
//                 value={newGroupName}
//                 onChange={(e) => setNewGroupName(e.target.value)}
//                 className="px-4 py-2 border rounded-lg flex-1"
//               />

//               <button
//                onClick={handleCreateGroup}
//                disabled={loading}
//                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//               >
//                   {loading? "Creating..." : "Create group"}
//               </button>
//        </div>

//         <h2 className="text-xl font-semibold mb-2">Your Groups:</h2>
    
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {groups.map((group)=>(
//                 <div
//                   key={group.id}
//                   onClick={() => navigate(`/group/${group.id}`)}
//                   className="p-4 bg-green-600 rounded-lg shadow cursor-pointer hover:bg-gray-100"
          
//                  >
//                    <h3 className="font-bold">{group.name}</h3>
//                    {/* <h3 className="text-sm text-gray-500">{group.members?.length || 0} members</h3> */}
//                 </div>
//             ))}
//         </div>
//     </div>
//   );
// }

// export default Dashboard;
