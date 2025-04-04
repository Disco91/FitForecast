# FIT**FORECAST** #
### Video Demo: [<URL>](https://youtu.be/m_KTceBfKVo)https://youtu.be/m_KTceBfKVo
### Description:
#### **Brief Description**
FitForecast is a weather and sports forecasting web app designed to provide users with quick feedback on the best activities to enjoy today.

#### **Inspiration**
Being an active person who is into running, cycling, swimming, surfing, dragon boating and SUP. I often found it frustrating to quickly check the weather forecast before doing exercise. This is particularly the case for water based sports that can even be dangerous if you should go out in the wrong conditions. Often, to find out if I can go for a surf I need to go to a specific surf forecast website which tells me the wave height and period after sitting through adverts. I thought to myself, if I could summarize the weather forecast and give rating scores to each sport and visualize that in an appealing way it could be a really handy tool for myself, and perhaps even others.

#### **How it works?**
Upon opening the app the user is presented with a row of sports. Each sport is encapsulated in a pill shaped container which is colourised based on which sport is most suitable based on todays weather. 

- Dark Green is a great day
- Light Green is a good day  
- Orange is an average day
- Red is not recommended

Below the row of 'sports pills' is the 'smart index'. This index is a calculated score from weather data and a formula that I wrote to determine a score between 0 and 100.
Scores affect the color and fullness of the gauge. Below the gauge is a changing message based on the score value. Each sport has its own calculated Index score.

After the 'smart index' we have the 'tiles'. These tiles are parametric containers that can hold header-text, text and icons as specified by myself. By 'parametric', I mean that I am able to create these tiles with as many rows or columns of data I wish. This allows for consistent styles but also allows freedom to create tiles for all the different information inputs i wished to show.

Once the weather tile templates were created they can then be assigned to each sport. This means when selecting different sports the tiles shown can be different and are generated in the order they're stored in the list.  

I chose this modular parametric design as I wanted to be able to generate alot of tile variations quickly during development. If I ever go back to further develop this project, it would be very easy to mock up many more tiles and even to implement other data types such as pictures or charts.

### Tools Used:

#### **Figma**
In order to design my website I used figma to assist with the styling and layout of my webapp.
See here for design produced https://www.figma.com/design/S1qajnL0FYRw2N9fIBDt24/FitForecast?node-id=0-1&m=dev&t=qmdqbGzr0OfDp45Y-1

#### **Notion**
Notion I used at the project start to plan out my design and breakdown the project into achievable milestones.

#### **GitHub**
Using Github I created regular backups of my project at key milestones. I figured learning to use github would be criitical for any future collaboration with others. See here for link - https://github.com/Disco91/FitForecast

I learned how to push commits to my project, how to role back changes to a previous version and how to inspect past versions through VSCODE.

#### **Django**
Django was used to build the website application. Simply running 'django-admin startproject fitForecast setup' the folders and files required to run a basic HTML server. This could then be previewed in a web browser while developing the program on the side. It took some research and assistance from ChatGPT to understand all the different files that are created.

To test usability on different devices I deployed the site onto my device IP address to allow me to use the website on my mobile phone through the wifi. Alongside the Google Chrome inspect this allowed me to refine the UX design of the project and ensure a smooth user experience.

#### **CSS**
CSS was large part of this project, I wanted to ensure the webpage looked appealing and was particually representative of an App you would find on your phone. CSS is used in this project to stylise all my HTML code including that what was generated from javascript.
I paid alot of attention to ensure my design was compatible with all sizes and shapes of screen size through the use of % and justification of html elements.

#### **JavaScript**
JavaScript was used to control much of the interactivity of the site. It was used to create the following effects: 
- The sliding effect of 'sports pills' and 'tiles (tiles.js) 
- Animate the 'smart index' gauge. (smart-index-gauge.js)
- Calculate the different sports index scores based on weather and optimum conditions (data-controller.js)
- Colourise the pills and smart index based on score (Select-pill.js)

#### **Python**
Python was mostly provided by the Django environment on this project. However I did use python to generate 'dummy' weather data that I fed to the rest of my website JavaScript files as it was easiest to set up random values and random choices.

### Conclusion and Learnings
At the start of this project I set out to build a website that could provide quick glance metrics to allow user to decide what sport was best to do on that day. I believe the design choices I made through using tools such as Figma to create an appealing layout and the simplicity of the metrics shown have achieved that goal. 

Instead of generating random weather data I would have considered implementing a real API call to return real world data based on any location. After researching I decided against this purely due to the limitations on amount of API calls that can be made and the possibility of being charged per call. An improvement could have been to implement a json format that would be compatible format with an API call so the dummy data could be easily switched out. For the scope of this project I decided not to pursue this idea.

In summary I am proud of the product I produced, it functions well and with a bit more effort and time allowed I believe it could become a very useful tool to many people. I may well return to this one day to do just that. I feel alot more confident with developing websites and has boosted my skills within the Javascript environment.

Thank you CS50 team and David Malin for the excellent course you've provided, it was a great joy working through the projects over the last four months and I look forward to moving onto CS50 AI next.