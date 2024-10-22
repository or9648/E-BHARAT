import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { Trash } from 'lucide-react';
import { decrementQuantity, deleteFromCart, incrementQuantity } from "../redux/CartSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../firebase/FirebaseConfig";
import BuyNowModal from "../components/BuyNowModal";
import { Navigate } from "react-router-dom";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Item removed from cart");
    };

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    const cartItemTotal = cartItems.reduce((prevValue, currValue) => prevValue + currValue.quantity, 0);
    const cartTotal = cartItems.reduce((prevValue, currValue) => prevValue + currValue.price * currValue.quantity, 0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const user = JSON.parse(localStorage.getItem('users'));

    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });
    const buyNowFunction = async () => {
        // Validation 
        if (addressInfo.name === "" || addressInfo.address === "" || addressInfo.pincode === "" || addressInfo.mobileNumber === "") {
            return toast.error("All Fields are required");
        }
    
        // Order Info 
        const orderInfo = {
            cartItems,
            addressInfo,
            email: user.email,
            userid: user.uid,
            status: "confirmed",
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        };
    
        try {
            // Firestore collection reference
            const orderRef = collection(fireDB, 'order');
            await addDoc(orderRef, orderInfo); // Ensure to await this async operation
            
            // Reset the address info after successful order placement
            setAddressInfo({
                name: "",
                address: "",
                pincode: "",
                mobileNumber: "",
            });
    
            // Show success message
            toast.success("Order placed successfully!");
    
        } catch (error) {
            // Detailed error logging
            console.error("Error placing order:", error.message);
            toast.error("Failed to place order. Please try again later.");
        }
    };
    

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Shopping Cart
                    </h1>
                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.length > 0 ?
                                    cartItems.map((item, index) => {
                                        const { id, title, price, imageUrl, quantity, category } = item;
                                        return (
                                            <div key={index} className="">
                                                <li className="flex py-6 sm:py-6 ">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={imageUrl}
                                                            alt="img"
                                                            className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                            <div>
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-sm font-semibold text-black">
                                                                        {title}
                                                                    </h3>
                                                                </div>
                                                                <div className="mt-1 flex text-sm">
                                                                    <p className="text-sm text-gray-500">{category}</p>
                                                                </div>
                                                                <div className="mt-1 flex items-end">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        ₹{price}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <div className="mb-2 flex">
                                                    <div className="min-w-24 flex">
                                                        <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7">-</button>
                                                        <input type="text" className="mx-1 h-7 w-9 rounded-md border text-center" value={quantity} readOnly />
                                                        <button onClick={() => handleIncrement(id)} type="button" className="flex h-7 w-7 items-center justify-center">+</button>
                                                    </div>
                                                    <div className="ml-6 flex text-sm">
                                                        <button onClick={() => deleteCart(item)} type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
                                                            <Trash size={12} className="text-red-500" />
                                                            <span className="text-xs font-medium text-red-500">Remove</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : <h1>Your cart is empty</h1>
                                }
                            </ul>
                        </section>
                        <section aria-labelledby="summary-heading" className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0">
                            <h2 id="summary-heading" className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4">
                                Price Details
                            </h2>
                            <div>
                                <dl className="space-y-1 px-2 py-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Price ({cartItemTotal} item{cartItemTotal > 1 && 's'})</dt>
                                        <dd className="text-sm font-medium text-gray-900">₹ {cartTotal}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="flex text-sm text-gray-800">Delivery Charges</dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-y border-dashed py-4">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">₹ {cartTotal}</dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        {user
                                            ? <BuyNowModal addressInfo={addressInfo} setAddressInfo={setAddressInfo} buyNowFunction={buyNowFunction} />
                                            : <Navigate to="/login" />
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;
