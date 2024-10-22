import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { fireDB } from "../../firebase/FirebaseConfig"; // Adjust the import based on your Firebase config location
import { toast } from "react-toastify"; // Make sure you have react-toastify installed

const categoryList = [
    { name: 'fashion' },
    { name: 'shirt' },
    { name: 'jacket' },
    { name: 'mobile' },
    { name: 'laptop' },
    { name: 'shoes' },
    { name: 'home' },
    { name: 'books' }
];

const AddProductPage = () => {
    const [product, setProduct] = useState({
        title: '',
        price: '',
        imageUrl: '',
        category: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async () => {
        if (!product.title || !product.price || !product.imageUrl || !product.category || !product.description) {
            toast.error("Please fill all fields.");
            return;
        }

        try {
            const productRef = collection(fireDB, "products"); // Ensure the collection name matches your Firestore setup
            const newProduct = {
                ...product,
                price: parseFloat(product.price), // Ensure price is a number
                time: Timestamp.now() // Use Timestamp for Firestore
            };

            await addDoc(productRef, newProduct);
            toast.success("Product added successfully!");

            // Reset the form
            setProduct({
                title: '',
                price: '',
                imageUrl: '',
                category: '',
                description: ''
            });
        } catch (error) {
            toast.error("Error adding product: " + error.message);
        }
    };

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                {/* Add Product Form */}
                <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                    {/* Top Heading */}
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500'>
                            Add Product
                        </h2>
                    </div>

                    {/* Input One - Product Title */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={handleChange}
                            placeholder='Product Title'
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Two - Product Price */}
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder='Product Price'
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Three - Product Image URL */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            placeholder='Product Image Url'
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Four - Product Category */}
                    <div className="mb-3">
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none"
                        >
                            <option disabled value="">Select Product Category</option>
                            {categoryList.map((value, index) => {
                                const { name } = value;
                                return (
                                    <option key={index} value={name} className="first-letter:uppercase">
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Input Five - Product Description */}
                    <div className="mb-3">
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="Product Description"
                            rows="5"
                            className="w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300"
                        />
                    </div>

                    {/* Add Product Button */}
                    <div className="mb-3">
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
