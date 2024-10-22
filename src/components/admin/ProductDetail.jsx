import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../context/MyContext";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;
    const navigate = useNavigate();

    // Fetch products on mount
    useEffect(() => {
        getAllProductFunction();
    }, [getAllProductFunction]);

    // Delete product function
    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product Deleted successfully');
            await getAllProductFunction(); // Refresh product list
        } catch (error) {
            console.error(error);
            toast.error('Error deleting product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="py-5 flex justify-between items-center">
                {/* Heading */}
                <h1 className="text-xl text-pink-300 font-bold">All Products</h1>
                {/* Add Product Button */}
                <Link to={'/addproduct'}>
                    <button className="px-5 py-2 bg-pink-50 border border-pink-100 rounded-lg">Add Product</button>
                </Link>
            </div>

            {/* Product Table */}
            <div className="w-full overflow-x-auto mb-5">
                <table className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400">
                    <thead>
                        <tr>
                            <th className="h-12 px-6">S.No.</th>
                            <th className="h-12 px-6">Image</th>
                            <th className="h-12 px-6">Title</th>
                            <th className="h-12 px-6">Price</th>
                            <th className="h-12 px-6">Category</th>
                            <th className="h-12 px-6">Date</th>
                            <th className="h-12 px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllProduct.length > 0 ? (
                            getAllProduct.map((item, index) => {
                                const { id, title, price, category, date, imageUrl } = item;
                                return (
                                    <tr key={id} className="text-pink-300">
                                        <td className="h-12 px-6">{index + 1}.</td>
                                        <td className="h-12 px-6">
                                            <div className="flex justify-center">
                                                <img className="w-20" src={imageUrl} alt={title} />
                                            </div>
                                        </td>
                                        <td className="h-12 px-6">{title}</td>
                                        <td className="h-12 px-6">₹{price}</td>
                                        <td className="h-12 px-6">{category}</td>
                                        <td className="h-12 px-6">{date}</td>
                                        <td className="h-12 px-6">
                                            <span 
                                                onClick={() => navigate(`/updateproduct/${id}`)} 
                                                className="text-green-500 cursor-pointer"
                                            >
                                                Edit
                                            </span>
                                            <span className="mx-3">|</span>
                                            <span 
                                                onClick={() => deleteProduct(id)} 
                                                className="text-red-500 cursor-pointer"
                                            >
                                                Delete
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500">No products available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;
