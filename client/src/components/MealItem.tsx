// client/src/components/MealItem.tsx
interface Meal {
    _id: string;
    foodItem: string;
    calories?: number;
    createdAt: string;
  }
  
  interface MealItemProps {
    meal: Meal;
  }
  
  const MealItem = ({ meal }: MealItemProps) => {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <h3>{meal.foodItem}</h3>
        <p>Calories: {meal.calories || 'N/A'}</p>
        <p>Logged on: {new Date(meal.createdAt).toLocaleString()}</p>
      </div>
    );
  };
  
  export default MealItem;