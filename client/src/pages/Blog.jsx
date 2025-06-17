import React, { useEffect, useState } from "react";

export default function Blog() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const dummyBlogs = [
    {
      _id: "1",
      name: "How to Clean Your Bathroom Efficiently",
      description: "Learn quick and effective bathroom cleaning techniques.",
      category: "Cleaning",
      rating: 4.5,
      images: ["/img/bathroom.avif"],
    },
    {
      _id: "2",
      name: "Top 5 Plumbing Tips for Beginners",
      description: "Simple fixes for common plumbing problems.",
      category: "Plumbing",
      rating: 4.2,
      images: ["/img/plumberingg.avif"],
    },
    {
      _id: "3",
      name: "DIY Electrical Repairs at Home",
      description: "Safety first! Basic electrical fixes you can do yourself.",
      category: "Electrical",
      rating: 4.7,
      images: ["/img/electrician org.jpg"],
    },
    {
      _id: "4",
      name: "Home Cleaning Checklist",
      description: "Your ultimate guide to a spotless home.",
      category: "Cleaning",
      rating: 4.6,
      images: ["/img/cleaninggg.jpg"],
    },
    {
      _id: "5",
      name: "Essential Repair Tools You Need",
      description: "Tools that every homeowner should have.",
      category: "Repairs",
      rating: 4.3,
      images: ["/img/tool.avif"],
    },
    {
      _id: "6",
      name: "Tips for AC ",
      description: "Keep your pipes in top shape with these tips.",
      category: "Tips",
      rating: 4.4,
      images: ["/img/AC.jpg"],
    },
  ];

  // Filter blogs by category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(dummyBlogs);
    } else {
      const filtered = dummyBlogs.filter((blog) => blog.category === category);
      setFilteredProducts(filtered);
    }
  };

  // Load dummy blogs on component mount
  useEffect(() => {
    setFilteredProducts(dummyBlogs);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-2">Our Latest Blogs</h2>
        <p className="text-lg mb-4">
          Explore insights, tips, and trends in home services
        </p>
        <input
          type="text"
          placeholder="Search blogs..."
          className="mt-4 px-4 py-2 rounded w-full max-w-md text-black"
        />
      </section>

      {/* Categories Filter */}
      <div className="flex justify-center gap-4 py-6 flex-wrap">
        {["All", "Cleaning", "Repairs", "Tips", "Plumbing", "Electrical"].map(
          (category) => (
            <span
              key={category}
              className={`px-4 py-1 rounded-full text-sm cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </span>
          )
        )}
      </div>

      {/* Blog Cards */}
      <section className="text-center pb-16">
        <h2 className="text-3xl font-bold">Popular Blogs</h2>

        {loading ? (
          <p className="mt-4 text-gray-500">Loading blogs...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-4">No blogs found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition duration-300"
              >
                <img
                  src={product.images?.[0] || "/default.jpg"}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-3 rounded"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-sm text-blue-600 mt-2">
                  Rating: {product.rating} ★
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}