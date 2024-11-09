// MainPage.jsx
import React from 'react';

const MainPage = ({ plans, onSelectPlan, onAddToCart }) => (
  <div>
    {/* Render main content, e.g., a list of plans */}
    <h1>Main Page</h1>
    {/* Example usage */}
    {plans && plans.map((plan) => (
      <div key={plan.id}>
        <h2>{plan.name}</h2>
        <button onClick={() => onAddToCart(plan)}>Add to Cart</button>
      </div>
    ))}
  </div>
);

export default MainPage;
