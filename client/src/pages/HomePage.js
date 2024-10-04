import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessListing from '../pages/business/BusinessListing';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTshirt, faMedkit, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from '../actions/categoryActions';
import { toast } from 'react-toastify';

const HomePage = () => {
  const navigate = useNavigate();
  const businessListingRef = useRef(null);
  const dispatch = useDispatch();
  
  // State selection
  const { categories, loading, error } = useSelector((state) => ({
    categories: state.category.categories,
    loading: state.category.loading,
    error: state.category.error,
  }));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Smooth scrolling to business listing
  const handleExploreClick = () => {
    if (businessListingRef.current) {
      businessListingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Banner Section */}
      <Banner navigate={navigate} handleExploreClick={handleExploreClick} />

      {/* Business Listing Section */}
      <section className="py-5 mb-10" ref={businessListingRef}>
        <BusinessListing />
      </section>

      {/* Categories Section */}
      <CategoriesSection categories={categories} loading={loading} error={error} />
    </div>
  );
};

// Banner Component
const Banner = ({ navigate, handleExploreClick }) => (
  <div className="relative w-full h-96 bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/1920x700?text=Welcome+to+Lorley')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
      <h2 className="text-4xl font-bold">Welcome to Lorley</h2>
      <p className="text-lg">Your one-stop platform for discovering businesses.</p>
      <div className="mt-4 space-x-4">
        <Button text="Join Us" color="blue" onClick={() => navigate('/business/register')} />
        <Button text="Explore Businesses" color="green" onClick={handleExploreClick} />
      </div>
    </div>
  </div>
);

// Button Component
const Button = ({ text, color, onClick }) => (
  <button
    className={`bg-${color}-600 hover:bg-${color}-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 ease-in-out transform hover:scale-105`}
    onClick={onClick}
  >
    {text}
  </button>
);

// Categories Section Component
const CategoriesSection = ({ categories, loading, error }) => (
  <div className="py-10">
    <h2 className="text-4xl text-center font-semibold mb-8">Categories</h2>
    {loading && <p>Loading categories...</p>}
    {error && <p className="text-red-500 text-center">{error}</p>}
    <div className="flex flex-wrap justify-center gap-6">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  </div>
);

// Category Card Component
const CategoryCard = ({ category }) => {
  const categoryIcons = {
    Food: faUtensils,
    Clothing: faTshirt,
    Medicine: faMedkit,
    Grocery: faShoppingCart,
  };

  return (
    <div className="border rounded-lg shadow-md p-6 text-center bg-white w-60 h-60 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <FontAwesomeIcon icon={categoryIcons[category.name]} className="text-5xl text-blue-500 mb-2" />
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </div>
    </div>
  );
};

export default HomePage;
