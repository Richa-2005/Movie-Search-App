<h1>CineVerse: Your Ultimate Movie Discovery App</h1> <br />
CineVerse is a sophisticated and feature-rich web application built with React.js that allows users to not only search for movies but also discover new ones through a powerful, multi-faceted suggestion engine. This application leverages both the OMDb and The Movie Database (TMDb) APIs to provide a comprehensive and dynamic user experience.
<br /><br />
Status: ✅ Complete & Ready for Deployment <br />

<h2> ✨ Features</h2>
CineVerse is more than just a search bar. It's a complete movie exploration tool with three core features:

<h3>1. Robust Movie Search</h3>

⦿ **Search by Title:** Instantly find movies by their title.

⦿ **Filter by Year:** Narrow down results to a specific year.

⦿ **Filter by Decade:** Explore movies from different eras (e.g., 1990s, 2010s).

⦿ **Persistent State:** Your search results are preserved when you navigate to a movie's details and back, ensuring a seamless browsing experience.

<img width="3400" height="1948" alt="image" src="https://github.com/user-attachments/assets/78eed9db-ab1d-4645-8932-4bc791a42e22" />


<h3>2. Detailed Movie Information</h3> 

⦿Click on any movie to view a dedicated details page. <br /> 

⦿See comprehensive information including the plot, poster, runtime, genre, director, actors, box office, and critical ratings from sources like Rotten Tomatoes and Metacritic.

<img width="3262" height="1916" alt="image" src="https://github.com/user-attachments/assets/efbeaced-2bb1-4295-a8a4-747c7759722c" />

<h3>3. "Let's Decide Together" - The Suggestion Engine</h3>
Can't decide what to watch? This feature acts as your personal movie curator.<br />


⦿ **Get Multiple Suggestions:** Receive a list of 5 tailored movie recommendations.

⦿ **Filter by Mood/Genre:** Choose from categories like Action-Packed, Funny, Romantic, and more.

⦿ **Filter by Decade & Runtime:** Specify the era and how much time you have to watch.

⦿ **Filter by People:** Find movies featuring a favorite actor or made by a specific director.

⦿ **Filter by Keyword:** Discover movies based on themes like "time travel," "dystopia," or "based on a true story."

<img width="3262" height="1936" alt="image" src="https://github.com/user-attachments/assets/8de0b06f-77b6-41a3-9193-aae7f25cdd12" />


<h2>🛠️ Tech Stack & APIs</h2>
This project was built using a modern web development stack.

**Frontend:**

**React.js:** For building the user interface with components.

**React Router:** For handling client-side navigation between pages.

**Axios:** For making API requests to the backend server.

**CSS:** For custom styling and a responsive, dark-themed design.

**Backend:**

**Node.js:** As the JavaScript runtime environment.

**Express.js:** To build the robust backend server and API routes.

**Axios:** To communicate with external movie APIs.

**dotenv:** To manage environment variables and API keys securely.

<h2>APIs Used:</h2>

<h3>OMDb API:</h3> Used for the primary title/year search and fetching movie details by IMDb ID.

<h3>The Movie Database (TMDb) API:</h3> Powers the advanced "discover" and suggestion engine, allowing for complex filtering by genre, people, keywords, and more.

<h2>🚀 Getting Started Locally</h2>
To get a local copy up and running, follow these simple steps. <br />

**Prerequisites** <br />
⦿ Node.js and npm installed on your machine.

⦿ A code editor like VS Code.

<h3>Installation</h3>

**1.Clone the repository:** 

git clone https://github.com/Richa-2005/Movie-Search-App.git

**2. Navigate to the backend directory and install dependencies:**

cd cineverse/backend <br />
npm install

**3. Navigate to the frontend directory and install dependencies:**

cd ../frontend <br />
npm install

**4.Create your Environment File:**

⦿ In the backend directory, create a file named .env.

⦿ You will need API keys from both OMDb and TMDb.

⦿ Add your keys to the .env file like this:

**MOVIE_API_KEY**=your_omdb_api_key <br />
**TMDB_API_KEY**=your_tmdb_api_key


<h2>Running the Application</h2>

**1. Start the backend server:**

⦿ In the backend directory terminal:

nodemon backend/server.js

⦿ The server will start on http://localhost:3500.

**2. Start the frontend React app:**

In the frontend directory terminal:

⦿ Your application will open in your browser at http://localhost:5173

npm run dev

 <h2>🏛️ Key Architectural Decisions</h2>
 
**State Management with Context API:** To solve the issue of losing search results on navigation, React's Context API was used to "lift up" the search state. This creates a global state provider that preserves the user's search history across different pages. 


**Backend-for-Frontend (BFF):** A dedicated Express server acts as a middleman. This keeps API keys secure on the server and allows for complex logic (like making multiple API calls for the decade search) to be handled away from the client, improving performance and security.

<h2>🔮 Future Improvements</h2>

This project has a solid foundation with room to grow. Potential future features include: <br />

⦿ User accounts and authentication.

⦿ Creating personal "Watchlists" or "Favorites."

⦿ Pagination for suggestion results.

⦿ Adding trailers and more detailed cast information.
