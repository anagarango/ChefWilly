# Chef Willy

This project is designed to assist users (mostly for my brother) in finding recipes based on the ingredients they have on hand. Whether you're looking to whip up a quick meal or get creative with what's in your pantry, ChefWilly has you covered.

### Recipe Search
Search for recipes based on the ingredients added. The search results are sorted by recipes that require the fewest additional ingredients first, making it easier to find recipes with what you have on hand.

### Recipe Details
View detailed information about each recipe, including ingredients, cooking instructions, preparation time, and serving sizes. Nutritional icons are included showing what diets these recipes fall into.

### Filtering Options
Refine recipe search results based on various criteria such as cuisine type, dietary restrictions, or meal types.

### Ingredient Storage
Once signed in, users can store their commonly used ingredients. The app provides a database with autocomplete suggestions for users to update/delete their stored ingredients as needed.

### Cookbook Storage
Save your favorite recipes to your personalized cookbook for easy access later.

### Secure Authentication
Users can create accounts and sign in securely to manage their saved recipes and stored ingredients, ensuring personalization and data persistence across sessions.

## Getting Started

To get started with Recipe Generator, follow these steps:

```bash
git clone https://github.com/anagarango/ChefWilly.git

cd ChefWilly
```

Set up the database and configure authentication according to the provided instructions:
- Create a .env.local file with these environmental variables:
```js
NEXT_PUBLIC_API_KEY=
MYSQLPORT=
MYSQLDATABASE=
MYSQLPASSWORD=
MYSQLUSER=
MYSQLHOST=
```
- [Spoonacular API](https://spoonacular.com/food-api), sign up and paste the API key to NEXT_PUBLIC_API_KEY
- Add your credentials of your MySQL database, set up a database and add tables found under: src/app/api/DB.sql;

Start the server by running npm start.
```bash
npm install

npm run dev
```

## Technologies Used
- NextJS
- TypeScript
- Chakra-UI
- Axios
- MySQL
- API - [Spoonacular API](https://spoonacular.com/food-api)
