/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import myContext from "../../components/context/MyContext";
import { fireDB } from "../../firebase/FirebaseConfig";

const Login = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.value
        });
    };

    const userLoginFunction = async () => {
        // Validation
        if (userLogin.email === "" || userLogin.password === "") {
            toast.error("All Fields are required");
            return;
        }
        
        setLoading(true);
        try {
            const q = query(
                collection(fireDB, "user"),
                where('email', '==', userLogin.email) // Ensure you're checking the email
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let user = null;
                QuerySnapshot.forEach((doc) => {
                    user = doc.data();
                });

                if (user) {
                    // Assuming you have logic for password validation here
                    // You may want to use Firebase Auth for password verification

                    localStorage.setItem("users", JSON.stringify(user));
                    setUserLogin({
                        email: "",
                        password: ""
                    });
                    toast.success("Login Successfully");

                    // Navigate to user dashboard
                    if (user.role === "user") {
                        navigate('/user-dashboard');
                    } else {
                        navigate('/admin-dashboard'); // You can choose what to do for admins
                    }
                } else {
                    toast.error("User not found");
                }
                setLoading(false);
            });

            return () => unsubscribe(); // Clean up the subscription
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Login Failed");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            {/* Login Form  */}
            <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">

                {/* Top Heading  */}
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>
                        Login
                    </h2>
                </div>

                {/* Input Two (Email) */}
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        value={userLogin.email}
                        onChange={handleChange}
                        placeholder='Email Address'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                {/* Input Three (Password) */}
                <div className="mb-5">
                    <input
                        type="password"
                        name="password"
                        value={userLogin.password}
                        onChange={handleChange}
                        placeholder='Password'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                {/* Login Button */}
                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userLoginFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                <div>
                    <h2 className='text-black'>Don't Have an account? <Link className='text-pink-500 font-bold' to={'/signup'}>Signup</Link></h2>
                </div>
            </div>
        </div>
    );
}

export default Login;
