# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution. 
Feel free to modify the current codebase as needed, including adding or removing dependencies. 
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

<!-- Write-up/conclusion section -->

So for this task I was thinking of it in terms of an actual hotel searching site so performance, scalability and testing were pretty high on my list going in.

I looked over the existing code and saw that everything was all in the app file so it was quite bloated. So I planned to separate concerns and split things into reusable components for displaying data, and then make custom hooks for all of the logic. Reasoning being that it should make the code more maintainable, testable and scalable etc. If later on you wanted to add or update then you wouldn’t have to dig through everything to do it.

I started with the backend index file. There was one route for hotels which fetched everything and then it was filtered in memory on the frontend. I thought it would make more sense to do as much on the server side as possible for performance, so I created a more flexible search endpoint for hotels cities and countries, using $or so that you can view all hotels by hotel name country or city and $regex for partial searching. This would solve the task (type in ‘uni’ and get UK as a country, and hotels within the UK etc).

Later on I decided to also have id based routes for searching each dataset by its id, so you can navigate to each hotel, city or country on the frontend and then you would be able to display all the data for hotels for instance. I then also expanded on this by adding routes so you can fetch hotels by city or country name and display all the hotels related to a city or country when clicking it.

I then moved on to the frontend. I created three hooks, each handling a separate piece of logic. useSearch handles server-side data fetching etc. useSearchQuery handles more client-side (debouncing). useSelectedItem is for fetching the hotel city or country when navigating to its page and retrieving related data.

I could have had all of these as one larger hook, but again I was thinking about reusability (useSearchQuery could be used for other search-based features down the line potentially). It also made it much easier to maintain, read and test by separating them.

Once I did this it meant I could have reusable UI components with all the logic separated. Instead of one big component I split it into smaller modular components for handling user input search results and selected items etc, making everything more scalable and maintainable..

I also made sure that clicking on an item in the list navigates to its own page, with hotel showing all its data, and city/country displaying all related hotels with clickable links to navigate to those as well (which might be a bit extra for this task, but I thought it was an interesting feature, and seemed the next logical step).

The app file uses lazy loading and suspense to only load necessary components when needed instead of loading everything upfront, which should improve initial load time.

Because everything was split into reusable hooks and components it was much easier to write unit tests for each individual part. I used vitest to test every hook and component (e.g making sure the search bar updates correctly and handles debouncing etc.)

So overall I focused on performance scalability and testability. I tried to ensure clean and reusable hooks and components and make navigating between related items as seamless as possible. I also tried to retain as much of the original styling as possible, but expanded on it in a way that was interesting, but not too out there (the gradient headers may have been a bit too much…). 

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
