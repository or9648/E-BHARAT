import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import myContext from '../../components/context/MyContext';
import { toast } from 'react-toastify'; // Make sure to install react-toastify for toast notifications

const categoryList = [
    { name: 'fashion' },
    { name: 'shirt' },
    { name: 'jacket' },
    { name: 'mobile' },
    { name: 'laptop' },
    { name: 'shoes' },
    { name: 'home' },
    { name: 'books' },
];

const UpdateProductPage = () => {
    const context = useContext(myContext);
    const { setLoading, getAllProductFunction } = context;

    // Navigate
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from the URL

    // Product state
    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 0,
        time: Timestamp.now(), // Correct time usage
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });

    // Get Single Product Function wrapped in useCallback to prevent re-renders
    const getSingleProductFunction = useCallback(async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            const productData = productTemp.data();
            if (productData) {
                setProduct({
                    title: productData.title || "",
                    price: productData.price || "",
                    productImageUrl: productData.productImageUrl || "",
                    category: productData.category || "",
                    description: productData.description || "",
                    quantity: productData.quantity || 0,
                    time: productData.time || Timestamp.now(),
                    date: productData.date || new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }),
                });
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }, [id, setLoading]);

    // Update Product Function
    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', id), product);
            toast.success("Product Updated successfully");
            getAllProductFunction();
            setLoading(false);
            navigate('/admin-dashboard');
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProductFunction();
    }, [getSingleProductFunction]); // Correct dependency array

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                {/* Update Product Form */}
                <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">

                    {/* Top Heading */}
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500'>
                            Update Product
                        </h2>
                    </div>

                    {/* Input One: Product Title */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            placeholder='Product Title'
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Two: Product Price */}
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            placeholder='Product Price'
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Three: Product Image URL */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="productImageUrl"
                            placeholder='Product Image URL'
                            value={product.productImageUrl}
                            onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Four: Product Category */}
                    <div className="mb-3">
                        <select
                            name="category"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none"
                        >
                            <option disabled>Select Product Category</option>
                            {categoryList.map((category, index) => (
                                <option key={index} value={category.name} className="first-letter:uppercase">
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Input Five: Product Description */}
                    <div className="mb-3">
                        <textarea
                            name="description"
                            placeholder="Product Description"
                            rows="5"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            className="w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300"
                        />
                    </div>

                    {/* Update Product Button */}
                    <div className="mb-3">
                        <button
                            type='button'
                            onClick={updateProduct} // Call the update function on button click
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Update Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductPage;
