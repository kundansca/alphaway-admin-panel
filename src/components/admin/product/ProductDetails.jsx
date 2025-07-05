// src/pages/product/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { apiRequestGet } from "../../../utils/ApiService"; // 🔁 Replaced with static data

function ProductDetails({ id }) {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // 🔁 Replace API call with static product data
                const res = await apiRequestGet(`product/detail`, { id });
                console.log("Product response:", res);
                setProduct(res.data);


                // ✅ Static product data
                // const staticProduct = {
                //     id: productId,
                //     name: "Demo Product",
                //     price: 149.99,
                //     productcode: "DEMO123",
                //     status: "Available",
                //     image: "https://via.placeholder.com/400x300?text=Product+Image"
                // };
                // setProduct(staticProduct);
            } catch (err) {
                console.error("Failed to load product details", err);
            }
        }
        fetchData();
    }, [id]);

    return (
        <div className="container mt-4">
            <h5>Product Details</h5>
            {product ? (
                <div className="card p-3">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-4">
                            <img
                                src={product.image || "https://via.placeholder.com/300"}
                                alt={product.name}
                                className="img-fluid rounded"
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                                <p className="card-text"><strong>Product Code:</strong> {product.productcode}</p>
                                <p className="card-text"><strong>Status:</strong> {product.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>"API not working " Loading product details...</p>

            )}
        </div>
    );
}

export default ProductDetails;
