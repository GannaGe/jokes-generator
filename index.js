import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Route to render the form
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Route to handle form submission and fetch a joke
app.post("/joke", async (req, res) => {
  const { name } = req.body;

  try {
    // Fetch a joke from a public API
    const response = await axios.get(API_URL + "/joke/Programming");
    console.log("API Response:", response.data);

    let joke = "";

    if (response.data.type === 'single') {
        joke = response.data.joke;
    } else if (response.data.type === 'twopart') {
        joke = `${response.data.setup} - ${response.data.delivery}`;
    }

    res.render("joke.ejs", { name, joke });
  } catch (error) {
    console.error("Error fetching joke: ", error.message);
    if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
    }

    res.status(500).send("Error fetching joke!");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});