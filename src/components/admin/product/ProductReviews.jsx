// src/pages/product/ProductReviews.jsx
import React, { useEffect, useState } from "react";
// import { apiRequestGet } from "../../../utils/ApiService"; // 🔁 Replaced with static data

function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchReviews() {
            try {
                // 🔁 Replace API call with static reviews data
                const res = await apiRequestGet(`/product/${productId}/reviews`);
                setReviews(res.data);

                // ✅ Static reviews data
                // const staticReviews = [
                //     {
                //         id: 1,
                //         reviewer: "Alice",
                //         rating: 5,
                //         comment: "Fantastic product! Highly recommend.",
                //         date: "2025-05-01"
                //     },
                //     {
                //         id: 2,
                //         reviewer: "Bob",
                //         rating: 4,
                //         comment: "Very good quality, but a bit expensive.",
                //         date: "2025-05-05"
                //     },
                //     {
                //         id: 3,
                //         reviewer: "Charlie",
                //         rating: 3,
                //         comment: "It's okay, met expectations.",
                //         date: "2025-05-10"
                //     }
                // ];
                // setReviews(staticReviews);
            } catch (err) {
                console.error("Failed to load product reviews", err);
            }
        }
        fetchReviews();
    }, [productId]);

    return (
        <div className="container mt-4">
            <h5>Product Reviews</h5>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="card mb-3">
                        <div className="card-body">
                            <h6 className="card-title mb-1">{review.reviewer}</h6>
                            <p className="mb-1">
                                <strong>Rating:</strong> {review.rating} / 5
                            </p>
                            <p className="card-text mb-1">{review.comment}</p>
                            <small className="text-muted">Reviewed on {review.date}</small>
                        </div>
                    </div>
                ))
            ) : (
                <p>"API not working " No reviews available.</p>
            )}
        </div>
    );
}

export default ProductReviews;
