import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '../../store/slices/productSlice';
import API from '../../store/api/axiosInstance';
import { getImageUrl } from '../../utils/imageUrl';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiCheck, FiAlertTriangle, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyProduct = { name: '', brand: '', price: '', discountPrice: '', category: 'whey-protein', description: '', stock: '', goals: '', flavours: '', weight: '', images: [] };
const categories = ['whey-protein','creatine','mass-gainer','pre-workout','vitamins','fat-burner','accessories'];

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.products);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { dispatch(fetchAdminProducts({})); }, [dispatch]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      category: product.category || 'whey-protein',
      description: product.description || '',
      stock: product.stock || '',
      goals: product.goals?.join(', ') || '',
      flavours: product.flavours?.join(', ') || '',
      weight: product.weight || '',
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setForm(prev => ({
          ...prev,
          images: [...(prev.images || []), ...res.data.images],
        }));
        toast.success(`${res.data.images.length} image(s) uploaded!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: Number(form.stock),
      goals: form.goals ? form.goals.split(',').map(g => g.trim()).filter(Boolean) : [],
      flavours: form.flavours ? form.flavours.split(',').map(f => f.trim()).filter(Boolean) : [],
    };

    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, data: productData })).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created!');
      }
      setShowForm(false);
      setForm(emptyProduct);
      setEditingId(null);
      dispatch(fetchAdminProducts({}));
    } catch (err) {
      toast.error(err || 'Failed to save product');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
    setDeleting(null);
  };

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">Manage <span className="gradient-text">Products</span></h1>
          <button onClick={() => showForm ? (setShowForm(false), setEditingId(null)) : openCreateForm()} className="btn-primary flex items-center gap-2">
            {showForm ? <><FiX size={16} /> Cancel</> : <><FiPlus size={16} /> Add Product</>}
          </button>
        </div>

        {/* Create / Edit form */}
        {showForm && (
          <div className="glass-card p-6 mb-8 slide-up">
            <h3 className="font-heading text-xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Brand *</label>
                  <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" placeholder="Brand name" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Price (₹) *</label>
                  <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="2499" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Discount Price (₹)</label>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" placeholder="1999" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Stock *</label>
                  <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="50" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c} value={c}>{c.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Goals <span className="text-dark-300">(comma separated)</span></label>
                  <input value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} className="input-field" placeholder="muscle-gain, strength" />
                </div>
                <div>
                  <label className="text-sm text-dark-100 mb-1.5 block">Flavours <span className="text-dark-300">(comma separated)</span></label>
                  <input value={form.flavours} onChange={(e) => setForm({ ...form, flavours: e.target.value })} className="input-field" placeholder="Chocolate, Vanilla" />
                </div>
              </div>
              <div>
                <label className="text-sm text-dark-100 mb-1.5 block">Weight</label>
                <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input-field" placeholder="1 kg" />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm text-dark-100 mb-1.5 block">Product Images</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-card !rounded-xl p-6 border-2 border-dashed border-white/10 hover:border-neon-red/30 cursor-pointer transition-colors text-center"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-neon-red border-t-transparent rounded-full animate-spin" />
                      <p className="text-dark-200 text-sm">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FiUpload size={24} className="text-dark-300" />
                      <p className="text-dark-200 text-sm">Click to upload images</p>
                      <p className="text-dark-300 text-xs">JPG, PNG, WebP — Max 5MB each, up to 5 images</p>
                    </div>
                  )}
                </div>

                {/* Image previews */}
                {form.images?.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                        <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiX size={18} className="text-neon-red" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-dark-100 mb-1.5 block">Description *</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-y" placeholder="Product description..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary !py-3 flex items-center gap-2">
                  {saving ? 'Saving...' : editingId ? <><FiCheck size={16} /> Update Product</> : <><FiPlus size={16} /> Create Product</>}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary !py-3">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Products table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-200 text-xs uppercase border-b border-white/10 bg-dark-800/50">
                  <th className="text-left py-4 px-4">Product</th>
                  <th className="text-left py-4 px-4">Category</th>
                  <th className="text-left py-4 px-4">Price</th>
                  <th className="text-left py-4 px-4">Stock</th>
                  <th className="text-left py-4 px-4">Rating</th>
                  <th className="text-right py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="skeleton h-10 rounded-lg" /></td></tr>
                  ))
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-dark-200">No products found. Click "Add Product" to add your first product!</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                            {p.images?.[0]?.url ? (
                              <img src={getImageUrl(p.images[0].url)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FiImage className="w-full h-full p-2 text-dark-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate max-w-[200px]">{p.name}</p>
                            <p className="text-dark-200 text-xs">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><span className="badge badge-blue text-xs">{p.category}</span></td>
                      <td className="py-3 px-4">
                        <span className="font-semibold">₹{(p.discountPrice || p.price)?.toLocaleString()}</span>
                        {p.discountPrice > 0 && <span className="text-dark-300 text-xs line-through ml-1">₹{p.price?.toLocaleString()}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={p.stock > 5 ? 'text-neon-green' : p.stock > 0 ? 'text-neon-orange' : 'text-neon-red'}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4 text-dark-200">{p.ratings?.average?.toFixed(1) || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {deleteConfirm === p._id ? (
                            <>
                              <span className="text-neon-orange text-xs mr-2 flex items-center gap-1"><FiAlertTriangle size={12} /> Delete?</span>
                              <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="text-xs bg-neon-red/20 text-neon-red hover:bg-neon-red/30 px-3 py-1.5 rounded-lg transition-colors font-semibold">
                                {deleting === p._id ? '...' : 'Yes'}
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-white/5 text-dark-100 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">No</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => openEditForm(p)} className="text-dark-300 hover:text-neon-blue transition-colors p-1.5 hover:bg-white/5 rounded-lg" title="Edit">
                                <FiEdit2 size={15} />
                              </button>
                              <button onClick={() => setDeleteConfirm(p._id)} className="text-dark-300 hover:text-neon-red transition-colors p-1.5 hover:bg-white/5 rounded-lg" title="Delete">
                                <FiTrash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
