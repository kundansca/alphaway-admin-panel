import React, { useState, useEffect } from "react";
import config from "../../../config/config";
import ToastMsg from "../../shared/ToastMsg";
import { apiRequestPost } from "../../../utils/ApiService";

function ProductModal({ show, handleClose, editingProduct }) {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = config.api_base_url;

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [fssiCode, setFssiCode] = useState("");
  const [productcode, setProductcode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formErrors, setFormErrors] = useState({});

//   useEffect(() => {
//     fetch(`${apiBaseUrl}/categories`)
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Failed to fetch categories", err));

//     fetch(`${apiBaseUrl}/brands`)
//       .then((res) => res.json())
//       .then((data) => setBrands(data))
//       .catch((err) => console.error("Failed to fetch brands", err));
//   }, []);


useEffect(() => {
    if (editingProduct) {
        setId(editingProduct.id || "");
        setName(editingProduct.name || "");
        setCategoryId(editingProduct.cat_id || "");
        setBrandId(editingProduct.brand_id || "1");
        setFssiCode(editingProduct.fssi_code || "1");
        setProductcode(editingProduct.product_code || "1");
        setStatus(editingProduct.status || "1");
        // setStatus(editingProduct.slug || "1");
    } else {
        setName("");
        setCategoryId("");
        setFssiCode();
        setProductcode();
        setBrandId("");
        setStatus("");
        // setStatus("");
    }
    // setErrors({});
}, [editingProduct]);
  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Product name is required";
    if (!categoryId) errors.categoryId = "Category is required";
    if (!brandId) errors.brandId = "Brand is required";
    if (!fssiCode.match(/^[A-Za-z0-9]{5,}$/))
      errors.fssiCode = "FSSI Code must be at least 5 alphanumeric characters";
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
    const formData = {
      name,
      cat_id: categoryId,
      brand_id: brandId,
      fssi_code: fssiCode,
      product_code: productcode,
      description,
    };

     if(editingProduct){
            formData.id = editingProduct.id;
        }
    const endpoint = editingProduct ? `/product/update` : "/product/addnew";

    const response = await apiRequestPost(endpoint, formData); // JSON body

    if (response.status) {
      ToastMsg(
                    editingProduct ? "Updated successfully" : "Created successfully",
                    "success"
                );
      setName("");
      setCategoryId("");
      setBrandId("");
      setFssiCode("");
      setProductcode("");
      setDescription("");
      setFormErrors({});
      handleClose(); // close modal after success
    } else {
                ToastMsg(response.error || "Something went wrong", "error");
    }
  } catch (err) {
    console.error(err);
            ToastMsg(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingProduct ? "Edit" : "Add"} Product
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
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
                {formErrors.name && (
                  <small className="text-danger">{formErrors.name}</small>
                )}
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="cat_id"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                  <option key="1" value="1">Buscuit</option>
                </select>
                <label htmlFor="cat_id">Category</label>
                {formErrors.categoryId && (
                  <small className="text-danger">{formErrors.categoryId}</small>
                )}
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="brand_id"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                <option key="1" value="1">Haldiram</option>

                </select>
                <label htmlFor="brand_id">Brand</label>
                {formErrors.brandId && (
                  <small className="text-danger">{formErrors.brandId}</small>
                )}
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
                {formErrors.fssiCode && (
                  <small className="text-danger">{formErrors.fssiCode}</small>
                )}
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
                {formErrors.productcode && (
                  <small className="text-danger">{formErrors.productcode}</small>
                )}
              </div>

              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Description"
                  value={description}
                  style={{ height: "100px" }}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                {formErrors.description && (
                  <small className="text-danger">{formErrors.description}</small>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Processing..." : "Save Product"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
