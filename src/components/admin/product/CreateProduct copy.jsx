import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config/config';
import Layout from '../../../layout/Index';

const CreateProduct = () => {
    const navigate = useNavigate();
    const apiBaseUrl = config.api_base_url;

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [fssiCode, setFssiCode] = useState('');
    const [productcode, setProductcode] = useState('');
    const [description, setDescription] = useState('');

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${apiBaseUrl}/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories", err));

        fetch(`${apiBaseUrl}/brands`)
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to fetch brands", err));
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) errors.name = "Product name is required";
        if (!categoryId) errors.categoryId = "Category is required";
        if (!brandId) errors.brandId = "Brand is required";
        if (!fssiCode.match(/^[A-Za-z0-9]{5,}$/)) errors.fssiCode = "FSSI Code must be at least 5 alphanumeric characters";
        if (!productcode.trim()) errors.productcode = "Product code is required";
        if (!description.trim()) errors.description = "Description is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

            const urlencoded = new URLSearchParams();
            urlencoded.append('name', name);
            urlencoded.append('cat_id', categoryId);
            urlencoded.append('brand_id', brandId);
            urlencoded.append('fssi_code', fssiCode);
            urlencoded.append('product_code', productcode);
            urlencoded.append('description', description);

            const endpoint = editingBrand ? '/brand/update' : '/brand/addnew';
            // const response = await apiRequestPost(endpoint, formData, true);

            const response = await fetch(`${apiBaseUrl}/product/create`, {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
            });

            const data = await response.json();

            if (data.status) {
                alert('Product created successfully!');
                setName('');
                setCategoryId('');
                setBrandId('');
                setFssiCode('');
                setProductcode('');
                setDescription('');
                setFormErrors({});
            } else {
                alert(data.error || 'Product creation failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container-fluid col-12">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card shadow-lg border-0 rounded-lg mt-5">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <button
                                    className="btn btn-link"
                                    onClick={() => navigate("/admin/Product")}
                                    style={{
                                        color: "#007bff",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "50px",
                                        height: "50px",
                                        fontWeight: "800",
                                        fontSize: "25px",
                                        background: "none",
                                        border: "none",
                                    }}
                                    title="Back to Product List"
                                >
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <h3 className="text-center font-weight-light my-4">Create Product</h3>
                                <div style={{ width: '50px' }}></div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            id="name"
                                            type="text"
                                            placeholder="Product Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <label htmlFor="name">Product Name</label>
                                        {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="cat_id"
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="cat_id">Category</label>
                                        {formErrors.categoryId && <small className="text-danger">{formErrors.categoryId}</small>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="brand_id"
                                            value={brandId}
                                            onChange={(e) => setBrandId(e.target.value)}
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="brand_id">Brand</label>
                                        {formErrors.brandId && <small className="text-danger">{formErrors.brandId}</small>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            id="fssi_code"
                                            type="text"
                                            placeholder="FSSI Code"
                                            value={fssiCode}
                                            onChange={(e) => setFssiCode(e.target.value)}
                                        />
                                        <label htmlFor="fssi_code">FSSI Code</label>
                                        {formErrors.fssiCode && <small className="text-danger">{formErrors.fssiCode}</small>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            className="form-control"
                                            id="productcode"
                                            type="text"
                                            placeholder="Product Code"
                                            value={productcode}
                                            onChange={(e) => setProductcode(e.target.value)}
                                        />
                                        <label htmlFor="productcode">Product Code</label>
                                        {formErrors.productcode && <small className="text-danger">{formErrors.productcode}</small>}
                                    </div>

                                    <div className="form-floating mb-3">
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <label htmlFor="description">Description</label>
                                        {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding Product...' : 'Add Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProduct;
