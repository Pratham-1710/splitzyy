


import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { 
  Users, 
  Plus, 
  Calculator, 
  Calendar, 
  User, 
  ArrowUpRight,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Coffee,
  Plane,
  Receipt,
  ChevronLeft,
} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import AddMemberModal from '../components/AddMemberModal'
import Notif from '../components/Notif'

interface Member {
  user: any
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

// Helper: category icon
const getCategoryIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('food') || desc.includes('restaurant') || desc.includes('lunch') || desc.includes('dinner')) {
    return <Utensils className="w-5 h-5 text-orange-500" />;
  } else if (desc.includes('uber') || desc.includes('taxi') || desc.includes('gas') || desc.includes('transport')) {
    return <Car className="w-5 h-5 text-blue-500" />;
  } else if (desc.includes('rent') || desc.includes('utilities') || desc.includes('electricity') || desc.includes('internet')) {
    return <Home className="w-5 h-5 text-green-500" />;
  } else if (desc.includes('shopping') || desc.includes('groceries') || desc.includes('store')) {
    return <ShoppingBag className="w-5 h-5 text-purple-500" />;
  } else if (desc.includes('coffee') || desc.includes('drinks') || desc.includes('bar') || desc.includes('entertainment')) {
    return <Coffee className="w-5 h-5 text-amber-500" />;
  } else if (desc.includes('flight') || desc.includes('hotel') || desc.includes('travel') || desc.includes('vacation')) {
    return <Plane className="w-5 h-5 text-indigo-500" />;
  } else {
    return <Receipt className="w-5 h-5 text-gray-500" />;
  }
};

// Helper: format date
const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper: initials
const getInitials = (name?: string | null) => {
  if (!name) return "";
  return name
    .trim()
    .split(" ")
    .map(n => n[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
};

// Skeleton loading
const MemberSkeleton = () => (
  <div className="flex flex-col items-center space-y-2">
    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
    <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const ExpenseSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-20 h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
);

function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpense] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  useEffect(() => {
    const fetchGroupDetail = async () => {
      try {
        if (groupId) {
          const res = await axiosInstance.get(`/groups/${groupId}`);
          setMembers(res.data.members);
          setGroupName(res.data.name);
          setExpense(res.data.expenses);
        } else {
          console.log("error occured")
        }
      } catch (error) {
        console.log("Error fetching group detail", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupDetail();
  }, [groupId]);

    // During loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Members Section Skeleton */}
          <div className="space-y-4">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {[...Array(3)].map((_, i) => <MemberSkeleton key={i} />)}
            </div>
          </div>

          {/* Expenses Section Skeleton */}
          <div className="space-y-4">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <ExpenseSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span>{groupName}</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''} • {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Notif />
        </div>
      </header>

      {/* Members Section */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              {members.length}
            </span>
          </div>

          {members.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  className="flex flex-col items-center space-y-3 min-w-max group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
                    {getInitials(member.user.name)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center max-w-[80px] truncate">
                    {member.user.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No members yet</p>
            </div>
          )}
        </section>

        {/* Expenses Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {expenses.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                    <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-300 flex-shrink-0">
                      {getCategoryIcon(expense.description)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {expense.description}
                      </h3>
                      <div className="flex flex-wrap sm:flex-nowrap items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>
                            Paid by{" "}
                            {expense.paidBy?.name ? (
                              <span className="font-medium text-gray-900">
                                {expense.paidBy.name}
                              </span>
                            ) : (
                              <span className="italic">Unknown</span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatRelativeDate(expense.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{expense.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 space-y-4">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">No expenses yet</h3>
                <p className="text-gray-500">Start by adding your first group expense</p>
                <button
                  onClick={() => navigate(`/group/${groupId}/add-expense`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Expense</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50 hidden sm:flex">
        <button
          onClick={() => navigate(`/group/${groupId}/settlements`)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden sm:inline">Settle Up</span>
        </button>

        <button
          onClick={() => navigate(`/group/${groupId}/add-expense`)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Add Expense</span>
        </button>

        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        groupId={groupId!}
        onMemberAdded={(newMember) => setMembers((prev) => [...prev, newMember])}
      />

      {/* Mobile-only bottom action bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex space-x-2">
        <button
          onClick={() => navigate(`/group/${groupId}/add-expense`)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>

        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Member</span>
        </button>

        <button
          onClick={() => navigate(`/group/${groupId}/settlements`)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Calculator className="w-5 h-5" />
          <span>Settle Up</span>
        </button>
      </div>
    </div>
  )
}

export default GroupDetail












// import React from 'react'
// import { useEffect, useState } from 'react'
// import { useParams, useNavigate} from "react-router-dom"
// import { 
//   Users, 
//   Plus, 
//   Calculator, 
//   Calendar, 
//   User, 
//   ArrowUpRight,
//   Utensils,
//   Car,
//   Home,
//   ShoppingBag,
//   Coffee,
//   Plane,
//   Receipt,
//   ChevronLeft,
//   Loader2
// } from 'lucide-react'
// import axiosInstance from '../utils/axiosInstance'
// import AddMemberModal from '../components/AddMemberModal'
// import Notif from '../components/Notif'

// interface Member{
//     user: any
//     id: string;
//     name: string;
    
// }

// interface Expense {
//   id: string;
//   description: string;
//   amount: number;
//   paidBy? :{
//     id: string;
//     name: string;
//   } | null;
//   createdAt: string;
// }

// // Helper function to get category icon based on description
// const getCategoryIcon = (description: string) => {
//   const desc = description.toLowerCase();
//   if (desc.includes('food') || desc.includes('restaurant') || desc.includes('lunch') || desc.includes('dinner')) {
//     return <Utensils className="w-5 h-5 text-orange-500" />;
//   } else if (desc.includes('uber') || desc.includes('taxi') || desc.includes('gas') || desc.includes('transport')) {
//     return <Car className="w-5 h-5 text-blue-500" />;
//   } else if (desc.includes('rent') || desc.includes('utilities') || desc.includes('electricity') || desc.includes('internet')) {
//     return <Home className="w-5 h-5 text-green-500" />;
//   } else if (desc.includes('shopping') || desc.includes('groceries') || desc.includes('store')) {
//     return <ShoppingBag className="w-5 h-5 text-purple-500" />;
//   } else if (desc.includes('coffee') || desc.includes('drinks') || desc.includes('bar') || desc.includes('entertainment')) {
//     return <Coffee className="w-5 h-5 text-amber-500" />;
//   } else if (desc.includes('flight') || desc.includes('hotel') || desc.includes('travel') || desc.includes('vacation')) {
//     return <Plane className="w-5 h-5 text-indigo-500" />;
//   } else {
//     return <Receipt className="w-5 h-5 text-gray-500" />;
//   }
// };

// // Helper function to format relative dates
// const formatRelativeDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays === 0) return 'Today';
//   if (diffDays === 1) return 'Yesterday';
//   if (diffDays <= 7) return `${diffDays} days ago`;
//   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// };

// // Helper function to get member initials
// const getInitials = (name?: string | null) => {
//  if (!name) return "";
//   return name
//     .trim()
//     .split(" ")
//     .map(n => n[0]?.toUpperCase() ?? "")
//     .join("")
//     .slice(0, 2);
// };

// // Skeleton loading components
// const MemberSkeleton = () => (
//   <div className="flex flex-col items-center space-y-2">
//     <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
//     <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
//   </div>
// );

// const ExpenseSkeleton = () => (
//   <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
//     <div className="flex items-start justify-between mb-4">
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
//         <div className="space-y-2">
//           <div className="w-32 h-4 bg-gray-200 rounded"></div>
//           <div className="w-24 h-3 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//       <div className="w-20 h-6 bg-gray-200 rounded"></div>
//     </div>
//   </div>
// );

// function GroupDetail() {
//    const {groupId} = useParams<{ groupId: string}>()
//    const navigate = useNavigate();

//    const [groupName, setGroupName] = useState("")
//    const [members,setMembers] = useState<Member[]>([])
//    const [expenses,setExpense] = useState<Expense[]>([])
//    const [loading, setLoading] = useState(true);
//    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
//   //  const[ex,setex] = useState("");

//    useEffect(() =>{
//     const fetchGroupDetail = async () =>{
//         try {
//             if(groupId){
//                 const res = await axiosInstance.get(`/groups/${groupId}`);
//                 setMembers(res.data.members);
//                 setGroupName(res.data.name);
//                 setExpense(res.data.expenses);
//                 // setex(res)
//             } else{
//                 console.log("error occured")
//             }
//         } catch (error) {
//              console.log("Error fetching group detail", error);
//         } finally{
//             setLoading(false);
//         }
//     }

//       fetchGroupDetail();
//    }, [groupId])


//      // to get rid of refreshing page everytime new expense added
//      // this topic known as state lifting lift of child state to parent

//      // call back fn to add expense locally
//     //  const handleAddExpense = (newExpense: Expense) =>{
             
//     //     setExpense((prev) => [newExpense, ...prev]);
//     //  }
    
//   //  {console.log("example ",ex)}
//   //  {console.log("members ki detail",members)}
//   //  {console.log("members ka  expense",expenses)}



//   // during loading this will show as if something is appearing
//    if (loading) {
//      return (
//        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//          {/* Header Skeleton */}
//          <div className="bg-white shadow-sm border-b border-gray-100">
//            <div className="max-w-4xl mx-auto px-4 py-6">
//              <div className="flex items-center space-x-4">
//                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
//                <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
//              </div>
//            </div>
//          </div>

//          {/* Content Skeleton */}
//          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
//            {/* Members Section */}
//            <div className="space-y-4">
//              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
//              <div className="flex space-x-4 overflow-hidden">
//                {[...Array(3)].map((_, i) => <MemberSkeleton key={i} />)}
//              </div>
//            </div>

//            {/* Expenses Section */}
//            <div className="space-y-4">
//              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
//              <div className="space-y-4">
//                {[...Array(3)].map((_, i) => <ExpenseSkeleton key={i} />)}
//              </div>
//            </div>
//          </div>
//        </div>
//      );
//    }

//    return (
//      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//        {/* Header */}
//        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
//          <div className="max-w-4xl mx-auto px-4 py-6">
//            <div className="flex items-center justify-between">
//              <div className="flex items-center space-x-4">
//                <button 
//                  onClick={() => navigate(-1)}
//                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
//                >
//                  <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
//                </button>
//                <div>
              

//                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
//                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
//                      <Users className="w-5 h-5 text-white" />
//                    </div>
//                    <span>{groupName}</span>
//                  </h1>
//                  <p className="text-sm text-gray-600 mt-1">
//                    {members.length} member{members.length !== 1 ? 's' : ''} • {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
//                  </p>
                 
                   
                
                   
                
                  
                
//                </div>
                
//              </div>
//              <Notif/>
             
//            </div>
//          </div>
//        </header>

//        <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
//          {/* Members Section */}
//          <section className="mb-12">
//            <div className="flex items-center space-x-2 mb-6">
//              <Users className="w-5 h-5 text-gray-700" />
//              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
//              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
//                {members.length}
//              </span>
//            </div>
           
//            {members.length > 0 ? (
//              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
//                {members.map((member) => (
//                  <div 
//                    key={member.id} 
//                    className="flex flex-col items-center space-y-3 min-w-max group cursor-pointer"
//                  >
//                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300">
//                      {getInitials(member.user.name)}
                     
//                    </div>
//                    <span className="text-sm font-medium text-gray-700 text-center max-w-[80px] truncate">
//                      {member.user.name}
//                    </span>
//                  </div>
//                ))}
//              </div>
//            ) : (
//              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
//                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                <p className="text-gray-500">No members yet</p>
//              </div>
//            )}
//          </section>

//          {/* Expenses Section */}
//          <section className="space-y-6">
//            <div className="flex items-center justify-between">
//              <div className="flex items-center space-x-2">
//                <Receipt className="w-5 h-5 text-gray-700" />
//                <h2 className="text-xl font-semibold text-gray-900">Recent Expenses</h2>
//                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
//                  {expenses.length}
//                </span>
//              </div>
//            </div>

//            <div className="space-y-4">
//              {expenses.length > 0 ? (
//                expenses.map((expense) => (
//                  <div
//                    key={expense.id}
//                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group cursor-pointer"
//                  >
//                    <div className="flex items-start justify-between">
//                      <div className="flex items-center space-x-4 flex-1">
//                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-300">
//                          {getCategoryIcon(expense.description)}
//                        </div>
                       
//                        <div className="flex-1 min-w-0">
//                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
//                            {expense.description}
//                          </h3>
                         
//                          <div className="flex items-center space-x-4 text-sm text-gray-600">
//                            <div className="flex items-center space-x-1">
//                              <User className="w-4 h-4" />
//                              <span>
//                                Paid by{" "}
//                                {expense.paidBy?.name ? (
//                                  <span className="font-medium text-gray-900">
//                                    {expense.paidBy.name}
//                                  </span>
//                                ) : (
//                                  <span className="italic">Unknown</span>
//                                )}
//                              </span>
//                            </div>
                           
//                            <div className="flex items-center space-x-1">
//                              <Calendar className="w-4 h-4" />
//                              <span>{formatRelativeDate(expense.createdAt)}</span>
//                            </div>
//                          </div>
//                        </div>
//                      </div>
                     
//                      <div className="flex items-center space-x-2">
//                        <ArrowUpRight className="w-4 h-4 text-red-500" />
//                        <span className="text-2xl font-bold text-gray-900">
//                          ₹{expense.amount.toFixed(2)}
//                        </span>
//                      </div>
//                    </div>
//                  </div>
//                ))
//              ) : (
//                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
//                  <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                  <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
//                  <p className="text-gray-500 mb-6">Start by adding your first group expense</p>
//                  <button
//                    onClick={() => navigate(`/group/${groupId}/add-expense`, 
//                     {
                         

//                     //  // sending this fn handleAddExpense to child
//                     //  state: {
//                     //    onExpenseAdded: (newExpense: any) => {
//                     //           setExpense((prev) => [...prev, newExpense]); // instant update
//                     //     }                       
//                     //   }
//                    })
//                   }
//                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
//                  >
//                    <Plus className="w-4 h-4" />
//                    <span>Add First Expense</span>
//                  </button>
//                </div>
//              )}
//            </div>
//          </section>
//        </main>

//        {/* Floating Action Buttons */}
//        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
//          <button
//            onClick={() => navigate(`/group/${groupId}/settlements`)}
//            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
//          >
//            <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
//            <span className="hidden sm:inline">Settle Up</span>
//          </button>
         
//          <button
//            onClick={() => navigate(`/group/${groupId}/add-expense`)}
//            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
//          >
//            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//            <span className="hidden sm:inline">Add Expense</span>
//          </button>

//  <button
//     onClick={() => setIsAddMemberOpen(true)}
//     className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
//   >
//     <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//     <span className="hidden sm:inline">Add Member</span>
//   </button>

//        </div>

//        {/* Add Member Modal */}
//        <AddMemberModal
//          isOpen={isAddMemberOpen}
//          onClose={() => setIsAddMemberOpen(false)}
//          groupId={groupId!}
//          onMemberAdded={(newMember) => setMembers((prev) => [...prev, newMember])}
//        />

//        {/* Mobile-only bottom action bar */}
//        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex space-x-4">
//          <button
//            onClick={() => navigate(`/group/${groupId}/add-expense`)}
//            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//          >
//            <Plus className="w-5 h-5" />
//            <span>Add Expense</span>
//          </button>
//  <button
//     onClick={() => setIsAddMemberOpen(true)
      
//     }
//     className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//   >
//     <Plus className="w-5 h-5" />
//     <span>Add Member</span>
//   </button>
         
//          <button
//            onClick={() => navigate(`/group/${groupId}/settlements`)}
//            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//          >
//            <Calculator className="w-5 h-5" />
//            <span>Settle Up</span>
//          </button>
//        </div>
//      </div>
//    )
// }

// export default GroupDetail









// import { useEffect, useState } from 'react'
// import { useParams, useNavigate} from "react-router-dom"
// import axiosInstance from '../utils/axiosInstance'



// interface Member{
//     id: string;
//     name: string
// }
// interface Expense {
//   id: string;
//   description: string;
//   amount: number;
//   paidBy? :{
//     id: string;
//     name: string;
//   } | null;
//   createdAt: string;
// }

// function GroupDetail() {

//     // take out groupId from url
//    const {groupId} = useParams<{ groupId: string}>()
//    const navigate = useNavigate();

//    const [groupName, setGroupName] = useState("")
//    const [members,setMembers] = useState<Member[]>([])
//    const [expenses,setExpense] = useState<Expense[]>([])
//    const [loading, setLoading] = useState(true);

//    useEffect(() =>{
       
//     const fetchGroupDetail = async () =>{
//         try {

//             if(groupId){

//                 const res = await axiosInstance.get(`/groups/${groupId}`);
//                 setMembers(res.data.members);
//                 setGroupName(res.data.name);
//                 setExpense(res.data.expenses);
                
//                 // console.log("specific group ki detail",res.data)
//             }

//             else{
//                 console.log("error occured")
//             }
//         } catch (error) {
//              console.log("Error fetching group detail", error);
     
//         } finally{
//             setLoading(false);
//         }
//     }

//       fetchGroupDetail();
//    }, [groupId])

//       if (loading) return <p className='p-6'>Loading group details</p>
//     return (
//     <div className='p-6'>

        
//           <h1 className='text-xl font-semibold mb-2'>Members</h1>
//           {members  ?(    <ul className='mb-6'>
//            {members.map((m) => ( 
//                <li key={m.id} className='text-gray-700'>
//                 {m.name}
//                </li>
//            ))}
//         </ul>    ):(<p>No members yet</p>)}
   



//       <h2 className='text-xl font-semibold mb-2'>Expenses</h2>
//       <div>
//         {expenses ? (
//             expenses.map((exp) =>(

//                 <div
//                 key={exp.id}
//                 className='p-4 bg-white shadow rounded-lg border'>

//                   <p className='font-bold'>{exp.description}</p>
//                     <p>
//                         {exp.amount} paid by{" "}
//                         {/* <span className='font-medium'>{exp.paidBy}</span> */}
                          
//                            {exp.paidBy?.name ? (
//                                     <span className="font-medium">{exp.paidBy.name}</span>
//                                 ) : (
//                                     <span className="text-gray-500 italic">Unknown</span>
//                                 )}
                        
//                     </p>
//                     <p>
//                         {new Date(exp.createdAt).toLocaleDateString()}
//                     </p>
//                 </div>
//             ))
//         ): (
//             <p className="text-gray-500">No expenses yet.</p>
//         )}
//       </div>

//         {/* Actions */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => navigate(`/group/${groupId}/add-expense`)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           Add Expense
//         </button>
//         <button
//           onClick={() => navigate(`/group/${groupId}/settlements`)}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           Settle Up
//         </button>
//       </div>


//     </div>
//   )
// }

// export default GroupDetail