import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../../config/config";
import Layout from "../../../layout/Index";
import { apiRequestGet } from "../../../utils/ApiService";
// import axios from "axios";

const ProductEdit = () => {
    const { id } = useParams();
    const apiBaseUrl = config.API_URL;
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        productcode: "",
        status: "active",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch product details
    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await apiRequestGet(`/product/${id}`);
            console.log("Product response:", response);
            setProduct(response.data);
        } catch (err) {
            console.error("Failed to fetch product:", err);
            setError("Unable to load product data.");
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit updated product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await apiRequestPut(`/product/${id}`, product);
            alert("Product updated successfully!");
            navigate("/admin/product");
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    return (
        <Layout>
            <div className="container-fluid col-12 ">
                <div className="row justify-content-start">
                    <div className="col-md-10 mt-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg- text-">
                                <h4 className="mb-0">Edit Product</h4>
                            </div>
                            <div className="card-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={product.name}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Basic Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={product.price}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Product Code</label>
                                            <input
                                                type="text"
                                                name="productcode"
                                                value={product.productcode}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                name="status"
                                                value={product.status}
                                                onChange={handleChange}
                                                className="form-control"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-success" disabled={loading}>
                                                {loading ? "Updating..." : "Update Product"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductEdit;
