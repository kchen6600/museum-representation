# Representation in Museum Collections
*team members (The Curators):* Karen Chen, Eleanor Eng, and Cindy Tian

*link to website (located in the README of our repo):* https://github.com/kchen6600/museum-representation/blob/main/README.md
*screencast video:* https://vimeo.com/653759994

## Abstract
For this project, we are investigating the acquisition and overall collection of artworks found at one of the largest art museums in the United States - The Museum of Modern Art in New York. Especially as a leader in contemporary and modern art, it speaks well to our current times and can be seen as a reflection of the nation and museum collecting today as a whole. We plan to track trends in acquisition over the course of the museum’s history, and look into the geographical/nationality and gender representation in the museum’s collecting practices. Our goal is to expose issues in gender and race representation in museums, as well as any other interesting trends found in the data. The data set is open access on Github, and can be found at https://github.com/MuseumofModernArt/collection. It presents the museum’s current collection with details on artist, artist gender, artist nationality as well as information on the art pieces themselves.

## Our Code
*js/*
* artVis.js - top female artists represented bar chart
* barVis.js - male/female representation by department bar chart
* countVis.js - acquisition line chart with brush
* main.js - main file for loading data and all visualizations
* sankeyVis.js - gender, nationality, and department sankey visualization
* spiderAttempt.js - gender and nationality spider graph
* spiderVis.js - gender and nationality spider graph

*css/*
* styles.css - custom css file

index.html - main html file for our website

## Libraries
* all code included in js/libraries (js/libraries/fullpage.js)
* css/fullpage.css

## Interface Functionality
* Acquistion chart has a brush tooltip that one can also zoom in on to get a closer look at. The brush changes the period data one is looking at with regards to male vs female representation by department. 
* Male vs Female Representation by Department bar chart has a tooltip that shows the exact number of pieces each bar is representing.
* Hovering over the Gender, Nationality, and Art Classification Relationships sankey visualization focuses in on the link you are looking at.
* Click the button to see the distribution of Female and Male artists ranked by the Top 8 Female Nationalities, including and not including americans.
* Hovering over bars in the Top Female Artists Represented in the MoMA Collection reveals an example artwork of the artist represented.
