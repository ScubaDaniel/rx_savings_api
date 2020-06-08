# rx_savings_api

Setup
----
1. Ensure you have installed [NodeJS/npm](https://nodejs.org/en/download/)
2. Clone repository locally and navigate to 'rx_savings_api' in the terminal
3. Using the terminal, run `npm install` to install dependencies 
4. Start the server by running the 'start' script: `npm run start`

Usage
----
* You can use a browser to call the endpoint by navigating to http://127.0.0.1:15151/
* You can also make a GET request directly to the endpoint:
  * `http://127.0.0.1:15151/pharmacy?latitude={latitudeValue}&longitude={longitudeValue}`

Summary
----
This is my first REST endpoint in NodeJS. I've been doing RESTful API development with Ruby on Rails since November 2019, but feel more comfortable using NodeJS and JavaScript.

I have decided to skip any CSS, client-side validation, server-side validation, linting, or unit testing for this challenge. If I were to lint, I'd use ESLint. I'd use Jasmine or AVA for unit testing. The web form ensures the values are numeric when calling the endpoint there, but there is no validation done server-side to prevent invalid calls. 

 Resources Used
----
* https://stonecypher.github.io/explanations/EasiestNodeEndpoint/
* http://www.liferayui.com/building-knn-algorithm/
* https://www.movable-type.co.uk/scripts/latlong.html
* https://github.com/chrisveness/geodesy