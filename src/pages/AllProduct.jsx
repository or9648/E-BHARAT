import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, deleteFromCart } from '../redux/CartSlice'
import { toast } from "react-toastify"; // Ensure you have react-toastify installed
import myContext from "../components/context/MyContext";

const AllProduct = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    }

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout>
            <div className="py-8">
                {/* Heading */}
                <div className="">
                    <h1 className="text-center mb-5 text-2xl font-semibold">All Products</h1>
                </div>

                {/* Main Section */}
                <section className="text-gray-600 body-font">
                    <div className="container px-5 lg:px-0 py-5 mx-auto">
                        <div className="flex flex-wrap -m-4">
                            {getAllProduct && getAllProduct.length > 0 ? (
                                getAllProduct.map((item, index) => {
                                    const { id, title, price, imageUrl } = item;
                                    return (
                                        <div key={index} className="p-4 w-full md:w-1/4">
                                            <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                                <img
                                                    onClick={() => navigate(`/productinfo/${id}`)}
                                                    className="lg:h-80 h-96 w-full"
                                                    src={imageUrl}
                                                    alt={title}
                                                />
                                                <div className="p-6">
                                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                        {title.substring(0, 25)}
                                                    </h1>
                                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                        ₹{price}
                                                    </h1>
                                                    <div className="flex justify-center">
                                                        {cartItems.some((p) => p.id === item.id) ? (
                                                            <button
                                                                onClick={() => deleteCart(item)}
                                                                className="bg-red-700 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                            >
                                                                Remove from Cart
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addCart(item)}
                                                                className="bg-pink-500 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No products available</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default AllProduct;
