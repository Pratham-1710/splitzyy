import React from 'react'
import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  ChevronLeft, 
  DollarSign, 
  FileText, 
  Plus, 
  AlertCircle,
  Loader2,
  Receipt,
  Calculator
} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'

function AddExpense() {
    // Extract the group ID from the URL parameters (e.g., /groups/123/add-expense -> groupId = "123")
    const { groupId } = useParams<{ groupId: string }>();
    
    // Hook to programmatically navigate between pages
    const navigate = useNavigate();

    // help in taking state form groupdetail to this file
    const location = useLocation();


    // get the callback fn from groupDetai;
    const { onExpenseAdded } = (location.state as { onExpenseAdded?: Function}) || {};

    // State variables to manage form data and UI states
    const [description, setDescription] = useState(""); // What the expense was for
    const [amount, setAmount] = useState(""); // How much money was spent
    const [loading, setLoading] = useState(false); // Whether we're currently submitting the form
    const [error, setError] = useState(""); // Any error messages to show the user

    // Function that runs when the user submits the form
    const handleAddExpense = async (e: React.FormEvent) => {
        // Prevent the browser from refreshing the page (default form behavior)
        e.preventDefault();
        
        // Clear any previous error messages
        setError("");
        
        // Check if we have a valid group ID from the URL
        if (!groupId) return setError("Group not found");

        // Validate that the user entered valid data
        if (!description.trim() || !amount || Number(amount) <= 0) {
            return setError("Please enter a valid description and amount")
        }

        // Show loading state while we send the request
        setLoading(true);

        try {
            // Send a POST request to our backend API to create the expense
            const res = await axiosInstance.post(`groups/${groupId}/add-expense`, {
                description,
                amount: Number(amount), // Convert string to number
            });

            console.log("Create expense response:", res?.data);


            // this help in this state transferring
            // write now there is not change but if more user comes then we will se the change in smothness
            if(onExpenseAdded){
                onExpenseAdded(res.data)
            }
            
            // Navigate back to the group detail page after successful creation
            // navigate(`/groups/${groupId}`)

            navigate(-1)
        } catch (error: any) {
            // If something goes wrong, show an error message to the user
            console.error("Error adding expense:", error);
            setError(error?.response?.data?.error || error?.message || "Error adding expense")
        } finally {
            // Always turn off loading state, whether success or failure
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section - Shows page title and back button */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    <div className="flex items-center space-x-4">
                        {/* Back button - takes user to previous page */}
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                        </button>
                        
                        {/* Page title with icon */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
                                <p className="text-sm text-gray-600 mt-1">Split costs with your group members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Error Message Display - Only shows if there's an error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                            <Receipt className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Expense Details</h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Enter the details of your shared expense</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleAddExpense} className="p-6 space-y-6">
                        {/* Description Input Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span>What was this expense for?</span>
                            </label>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300"
                                placeholder="e.g., Dinner at Italian restaurant, Uber ride home, Groceries for the week"
                                disabled={loading}
                                required
                            />
                            <p className="text-xs text-gray-500">Be specific so everyone knows what this expense was for</p>
                        </div>

                        {/* Amount Input Field */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span>How much did it cost?</span>
                            </label>
                            <div className="relative">
                                {/* Dollar sign icon inside the input */}
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-lg font-medium">$</span>
                                </div>
                                <input
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 hover:border-gray-300 text-lg font-medium"
                                    placeholder="0.00"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500">Enter the total amount that was paid</p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !description.trim() || !amount || Number(amount) <= 0}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        {/* Spinning loader icon */}
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Adding Expense...</span>
                                    </>
                                ) : (
                                    <>
                                        {/* Calculator icon for the button */}
                                        <Calculator className="w-5 h-5" />
                                        <span>Add Expense</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Section - Tips for users */}
                <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for adding expenses</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Be descriptive so everyone knows what the expense was for</li>
                                <li>• Include the location or store name when helpful</li>
                                <li>• The expense will be automatically split among all group members</li>
                                <li>• You can settle up later using the "Settle Up" feature</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AddExpense


//v1



// import React from 'react'
// import { useState } from 'react'
// import { useParams,useNavigate } from 'react-router-dom'
// import axiosInstance from '../utils/axiosInstance'




// function AddExpense() {

//     const {groupId} = useParams<{groupId: string}>();
    
//     const navigate = useNavigate();
//     // console.log("inside add expense",token,user)

//     const [description,setDescription] = useState("");
//     const [amount, setAmount] = useState("")
//     const [loading,setLoading] = useState(false)
//     const [error,setError] = useState("");


//   const handleAddExpense = async (e: React.FormEvent) =>{
       
//            e.preventDefault();
//            setError("");
//            if(!groupId) return setError("Group not found");

//            if(!description.trim() || !amount || Number(amount) <=0 ){
//                 return setError("Please enter a valid description and amount")
//            }

//            setLoading(true);

//            try {
              
//             //Post request to backend
//              const res = await axiosInstance.post(`groups/${groupId}/add-expense`,{
//                 description,
//                 amount: Number(amount),
//              });
              
//              console.log("Create expense response:", res?.data);
//                setAmount(res.data.amount);
//                setDescription(res.data.description);

//              navigate(`/groups/${groupId}`)
//            } catch (error:any) {
//                console.error("Error adding expense:", error);
//                setError(error?.response?.data?.error || error?.message || "Error adding expense")
//            } finally{
//                setLoading(false);
//            }

//   }

//   return (
//     <div className='p-6 max-w-md mx-auto'> 
//             <h1>Add expense</h1>

//             {error && <p className='text-red-500'> {error}</p>}

//              <form onSubmit={handleAddExpense}>
//                  <div>
//                     <label className='block mb-1'>Description</label>
//                     <input
//                      value={description}
//                      onChange={(e)=> setDescription(e.target.value)}
//                      className="w-full border p-2 rounded"
//                      placeholder="e.g. Dinner at restaurant"
//                     />
//                  </div>

//                  <div>
//           <label className="block mb-1">Amount</label>
//           <input
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             type="number"
//             step="0.01"
//             className="w-full border p-2 rounded"
//             placeholder="e.g. 500"
//             required
//           />
//         </div>

//         <button
//          type='submit'
//          disabled={loading}
//          className='w-full bg-blue-600 text-white rounded disabled:opacity-50'>
//             {loading? "Adding...": "Add Expense"}
//         </button>
//              </form>
//     </div>
//   )
// }

// export default AddExpense