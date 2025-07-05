// src/pages/product/ProductImages.jsx
import React, { useEffect, useState } from "react";

function ProductImages({ productId }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchImages() {
            try {
                // 🔁 Replace API call with static product images
                // const res = await apiRequestGet(`/product/${productId}/images`);
                // setImages(res.data);

                // ✅ Static product image data
                const staticImages = [
                    {
                        id: 1,
                        url: "https://via.placeholder.com/150",
                        alt: "Product Image 1"
                    },
                    {
                        id: 2,
                        url: "https://via.placeholder.com/150/0000FF/FFFFFF",
                        alt: "Product Image 2"
                    },
                    {
                        id: 3,
                        url: "https://via.placeholder.com/150/FF0000/FFFFFF",
                        alt: "Product Image 3"
                    }
                ];
                setImages(staticImages);
            } catch (err) {
                console.error("Failed to load product images", err);
            }
        }

        fetchImages();
    }, [productId]);

    const handleDelete = (id) => {
        // 🔁 Replace API delete logic with local state update
        // await apiRequestDelete(`/product/${productId}/images/${id}`);
        // console.log(`Image with ID ${id} deleted`);
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    };

    return (
        <div className="container mt-4">
            <h5>Product Images</h5>
            {images.length > 0 ? (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Image</th>
                            <th style={{ width: "100px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((img) => (
                            <tr key={img.id}>
                                <td>
                                    <img src={img.url} alt={img.alt} style={{ height: "100px" }} />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(img.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>"API not working" Loading product  images not available.</p>
            )}
        </div>
    );
}

export default ProductImages;
