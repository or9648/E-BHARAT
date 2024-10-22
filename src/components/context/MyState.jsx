/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import myContext from './MyContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function MyState({ children }) {
    // Loading State for products, orders, and users
    const [loading, setLoading] = useState(false);

    // Product State
    const [getAllProduct, setGetAllProduct] = useState([]);
    
    // Order State
    const [getAllOrder, setGetAllOrder] = useState([]);

    // User State
    const [getAllUser, setGetAllUser] = useState([]);

    /**========================================================================
     *                          GET All Product Function
     *========================================================================**/
    const getAllProductFunction = () => {
        setLoading(true);
        const q = query(
            collection(fireDB, "products"),
            orderBy('time') // Ensure the field name matches your Firestore setup
        );

        // Set up a listener for real-time updates from Firestore
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const productArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGetAllProduct(productArray);
                setLoading(false);  // Only stop loading once data is successfully fetched
            },
            (error) => {
                console.error("Error fetching products: ", error);
                setLoading(false);  // Stop loading in case of error
            }
        );

        // Return the cleanup function to unsubscribe from the listener
        return unsubscribe;
    };

    /**========================================================================
     *                          GET All Order Function
     *========================================================================**/
    const getAllOrderFunction = () => {
        setLoading(true);
        const q = query(
            collection(fireDB, "order"),
            orderBy('time')
        );

        // Set up a listener for real-time updates from Firestore
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const orderArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGetAllOrder(orderArray);
                setLoading(false);  // Only stop loading once data is successfully fetched
            },
            (error) => {
                console.error("Error fetching orders: ", error);
                setLoading(false);  // Stop loading in case of error
            }
        );

        // Return the cleanup function to unsubscribe from the listener
        return unsubscribe;
    };

    /**========================================================================
     *                          GET All User Function
     *========================================================================**/
    const getAllUserFunction = () => {
        setLoading(true);
        const q = query(
            collection(fireDB, "user"),
            orderBy('time')
        );

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const userArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGetAllUser(userArray);
                setLoading(false);  // Only stop loading once data is successfully fetched
            },
            (error) => {
                console.error("Error fetching users: ", error);
                setLoading(false);  // Stop loading in case of error
            }
        );

        // Return the cleanup function to unsubscribe from the listener
        return unsubscribe;
    };

    useEffect(() => {
        // Call the function to get products, orders, and users, and set up the listener
        const unsubscribeProducts = getAllProductFunction();
        const unsubscribeOrders = getAllOrderFunction();
        const unsubscribeUsers = getAllUserFunction();

        // Clean up the listeners when the component unmounts
        return () => {
            if (unsubscribeProducts) unsubscribeProducts();
            if (unsubscribeOrders) unsubscribeOrders();
            if (unsubscribeUsers) unsubscribeUsers();
        };
    }, []);

    return (
        <myContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            getAllOrder,
            getAllUser,  // Add this to context for accessing user data
            getAllProductFunction,
            getAllOrderFunction,
            getAllUserFunction // Expose this function in case you need to call it externally
        }}>
            {children}
        </myContext.Provider>
    );
}

export default MyState;
