import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';  // Import Firestore methods
import { fireDB } from '../firebase/FirebaseConfig'; // Import Firestore configuration
import Layout from '../components/Layout';
import myContext from '../components/context/MyContext'; // Import your context
import Loader from '../components/Loader'; // Import Loader component if you have it

function PageInfo() {
    const context = useContext(myContext); // Get context
    const { loading, setLoading } = context;

    const [product, setProduct] = useState('');
    const { id } = useParams(); // Get product ID from URL params

    // Fetch product data based on the ID
    const getProductData = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id)); // Fetch product document by ID
            if (productTemp.exists()) {
                setProduct(productTemp.data()); // Set product state with fetched data
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProductData(); // Fetch product data when the component mounts
    }, [id]); // Ensure this runs when 'id' changes

    return (
        <Layout>
            <section className="py-5 lg:py-16 font-poppins ">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader /> {/* Display loader when loading */}
                    </div>
                ) : (
                    <div className="max-w-6xl px-4 mx-auto">
                        <div className="flex flex-wrap mb-24 -mx-4">
                            {/* Product Image Section */}
                            <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                                <img
                                    className="w-full lg:h-[39em] rounded-lg"
                                    src={product?.imageUrl}
                                    alt={product?.title}
                                />
                            </div>

                            {/* Product Info Section */}
                            <div className="w-full px-4 md:w-1/2">
                                <div className="lg:pl-20">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                                            {product?.title}
                                        </h2>
                                        <div className="flex items-center mb-6">
                                            <ul className="flex mb-4 mr-2 lg:mb-0">
                                                {/* Render star ratings or any other icons you need */}
                                            </ul>
                                        </div>
                                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-400">
                                            ₹ {product?.price}
                                        </p>
                                    </div>

                                    {/* Product Description */}
                                    <div className="mb-6">
                                        <p>{product?.description}</p>
                                    </div>

                                    {/* Add to Cart Button (Update as needed) */}
                                    <div className="mb-6">
                                        <button className="w-full px-4 py-3 text-center text-pink-600 bg-pink-100 border border-pink-600 hover:bg-pink-600 hover:text-gray-100 rounded-xl">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
}

export default PageInfo;
