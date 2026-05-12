function CategoryCard({ category, onClick }) {
  return (
    <div 
      className="card category-card h-100"
      onClick={() => onClick && onClick(category)}
      role="button"
    >
      <div className="card-body text-center">
        <div className="category-icon">
          {category.emoji}
        </div>
        <h6 className="category-name mb-0">{category.name}</h6>
      </div>
    </div>
  )
}

export default CategoryCard
