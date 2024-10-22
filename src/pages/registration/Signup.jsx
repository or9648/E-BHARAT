import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../components/context/MyContext"; // Correct import
import { Timestamp, addDoc, collection } from "firebase/firestore";

const Signup = () => {
    const { loading, setLoading } = useContext(myContext); // Using the context
    const navigate = useNavigate();

    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user" // Default role
    });

    const handleChange = (e) => {
        setUserSignup({
            ...userSignup,
            [e.target.name]: e.target.value
        });
    };

    const userSignupFunction = async () => {
        if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);
            const user = {
                name: userSignup.name,
                email: userCredential.user.email,
                uid: userCredential.user.uid,
                role: userSignup.role, // Use selected role
                time: Timestamp.now(),
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            };

            const userReference = collection(fireDB, "user");
            await addDoc(userReference, user);

            // Reset state
            setUserSignup({
                name: "",
                email: "",
                password: "",
                role: "user" // Reset to default role
            });
            setLoading(false);
            navigate('/login');
            toast.success("Signup successful");
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500'>Signup</h2>
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        value={userSignup.name}
                        onChange={handleChange}
                        placeholder='Full Name'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        value={userSignup.email}
                        onChange={handleChange}
                        placeholder='Email Address'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                <div className="mb-5">
                    <input
                        type="password"
                        name="password"
                        value={userSignup.password}
                        onChange={handleChange}
                        placeholder='Password'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>
                <div className="mb-5">
    <select
        name="role"
        value={userSignup.role}
        onChange={handleChange}
        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none appearance-none'
    >
        <option className='bg-pink-50' value="user">User</option>
        <option  className='bg-pink-50'  value="admin">Admin</option>
    </select>
</div>

                <div className="mb-5">
                    <button
                        type='button'
                        onClick={userSignupFunction}
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Signup'}
                    </button>
                </div>
                <div>
                    <h2 className='text-black'>Have an account? <Link className='text-pink-500 font-bold' to={'/login'}>Login</Link></h2>
                </div>
            </div>
        </div>
    );
}

export default Signup;
