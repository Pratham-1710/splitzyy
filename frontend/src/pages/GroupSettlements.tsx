import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

function GroupSettlements() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axiosInstance.get(`/groups/${groupId}/settlements`);
        
        console.log("result", res.data)
        setSettlements(res.data.settlements);
      } catch (err) {
        console.error("Error fetching settlements", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettlements();
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading settlements...</span>
      </div>
    );
  }

  {{console.log("only settlements",settlements)}}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {settlements.length > 0 ? (
          <div className="space-y-4">
            {settlements.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-2 text-gray-800">
                  <span className="font-medium">{s.from}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{s.to}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{s.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All Settled Up 🎉
            </h3>
            <p className="text-gray-500">
              No pending settlements for this group.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default GroupSettlements;






// import React,{ useEffect, useState} from 'react'
// import { useParams } from 'react-router-dom'
// import axiosInstance from '../utils/axiosInstance'



// // Settlement ka structure define kar diya
// interface Settlement {
//   from: string;   // kisne paisa dena hai
//   to: string;     // kisko paisa lena hai
//   amount: number; // kitna paisa dena hai
// }



// function GroupSettlements() {
//   // URL se groupId extract kar rahe hai (/group/:groupId/settlements)
//   const { groupId } = useParams<{ groupId: string }>();

//   // Settlements list aur loading state maintain karne ke liye state
//   const [settlements, setSettlements] = useState<Settlement[]>([]);
//   const [loading, setLoading] = useState(true);




//   useEffect(()=>{
      
//        const fetchSettlements = async () => {
//             try {
//                 // Backend call to get settlement data
//         const res = await axiosInstance.get(`/groups/${groupId}/settlements`);
//         setSettlements(res.data);
//       } catch (err) {
//         console.error("Error fetching settlements", err);
//       } finally {
//         // Loading complete ho gaya
//         setLoading(false);
//       }
//        };

//        fetchSettlements()
//   },[groupId])


//   if (loading) return <p className="p-6 text-gray-500">Loading settlements...</p>


//   return (
//     <div className='max-w-3xl mx-auto '>


      
//        <h1>Settlements</h1>

//          {settlements.length > 0 ? (
               
//                 <div className='space-y-4'>
//                         {
//                             settlements.map((s,i) =>(
//                                  <div>
//                                     <span>
//                                              {s.from} → {s.to}
//                                     </span>

//                                     <span>
//                                         {s.amount.toFixed(2)}
//                                     </span>
//                                 </div>
//                             ))
//                         }

//                 </div>
//          ):(
//                 <p>
//                          <p className="text-gray-500 text-lg">All settled up 🎉</p>
//                 </p>
//          )} 
//     </div>
//   )
// }

// export default GroupSettlements