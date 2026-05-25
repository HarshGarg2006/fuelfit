import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const categories = ['whey-protein','creatine','mass-gainer','pre-workout','vitamins','fat-burner','accessories'];
const brands = ['Optimum Nutrition','MuscleBlaze','MyProtein','Dymatize','MuscleTech','BSN','GNC','Cellucor'];
const goals = ['muscle-gain','fat-loss','strength','endurance','general-health'];
const sortOptions = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low → High' },
  { value: '-price', label: 'Price: High → Low' },
  { value: '-ratings.average', label: 'Top Rated' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, total, pages, loading } = useSelector((s) => s.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const goal = searchParams.get('goal') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (goal) params.goal = goal;
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    dispatch(fetchProducts(params));
    window.scrollTo(0, 0);
  }, [dispatch, page, category, brand, goal, sort, minPrice, maxPrice, searchParams]);

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter('search', search);
  };

  const clearAll = () => {
    setSearch('');
    setSearchParams({});
  };

  const activeFilters = [category, brand, goal, minPrice, maxPrice, searchParams.get('search')].filter(Boolean).length;

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">All <span className="gradient-text">Products</span></h1>
            <p className="text-dark-200 text-sm mt-1">{total} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-10 !pr-4 !py-2.5 text-sm" placeholder="Search products..." />
            </form>
            <select value={sort} onChange={(e) => setFilter('sort', e.target.value)} className="input-field !w-auto !py-2.5 text-sm">
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary !py-2.5 !px-4 flex items-center gap-2 text-sm md:hidden ${activeFilters > 0 ? '!border-neon-red/50' : ''}`}>
              <FiFilter size={16} /> {activeFilters > 0 && <span className="badge badge-red !py-0 !px-1.5 text-[10px]">{activeFilters}</span>}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-dark-900 p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:z-auto md:bg-transparent md:p-0 w-full md:w-56 flex-shrink-0`}>
            <div className="flex items-center justify-between md:hidden mb-6">
              <h3 className="font-heading text-lg font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}><FiX size={24} /></button>
            </div>

            {activeFilters > 0 && (
              <button onClick={clearAll} className="text-neon-red text-sm mb-4 hover:underline">Clear All Filters</button>
            )}

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-dark-100">Category</h4>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button key={c} onClick={() => setFilter('category', category === c ? '' : c)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === c ? 'bg-neon-red/10 text-neon-red' : 'text-dark-200 hover:text-white hover:bg-white/5'}`}>
                    {c.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-dark-100">Brand</h4>
              <div className="space-y-1.5">
                {brands.map((b) => (
                  <button key={b} onClick={() => setFilter('brand', brand === b ? '' : b)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${brand === b ? 'bg-neon-red/10 text-neon-red' : 'text-dark-200 hover:text-white hover:bg-white/5'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-dark-100">Goal</h4>
              <div className="space-y-1.5">
                {goals.map((g) => (
                  <button key={g} onClick={() => setFilter('goal', goal === g ? '' : g)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${goal === g ? 'bg-neon-red/10 text-neon-red' : 'text-dark-200 hover:text-white hover:bg-white/5'}`}>
                    {g.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h4 className="font-semibold text-sm mb-3 text-dark-100">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setFilter('minPrice', e.target.value)} className="input-field !py-2 text-sm w-1/2" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} className="input-field !py-2 text-sm w-1/2" />
              </div>
            </div>

            <button onClick={() => setShowFilters(false)} className="btn-primary w-full md:hidden">Apply Filters</button>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-dark-200 text-lg mb-4">No products found</p>
                <button onClick={clearAll} className="btn-secondary">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page <= 1} onClick={() => setFilter('page', String(page - 1))} className="btn-secondary !py-2 !px-3 disabled:opacity-30">
                  <FiChevronLeft size={18} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
                  <button key={p} onClick={() => setFilter('page', String(p))} className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-neon-red text-white' : 'bg-dark-700 hover:bg-dark-600 text-dark-100'}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page >= pages} onClick={() => setFilter('page', String(page + 1))} className="btn-secondary !py-2 !px-3 disabled:opacity-30">
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
