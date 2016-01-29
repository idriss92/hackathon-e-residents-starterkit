# Starter kit: e-Resident with craft ai  #

Here is an example of a Node.js application using [**craft ai**](http://craft.ai) 
realized as a support for the [Hackathon e-Résident](http://hackathon.dalkia.fr/).

As there are no real-time data available for the purpose of this hachaton, 
the application deals with simulated time.

### Setup ###

- Log in to GitHub and fork the [starterkit project](https://github.com/craft-ai/hackathon-e-residents-starterkit),
- Go to [the **craft ai** workbench](https://workbench.craft.ai),
- Sign up (or log in if you already signed up) with your GitHub account,
- Click on the `Add projects...` button and select the `hackathon-e-resident-starterkit`,
- Clone your GitHub fork of the project on your computer,
- Install [Node.js](https://nodejs.org/en/download/) on your computer,
- Install dependencies by running `npm install` in a terminal from the directory where
you cloned the project

### Starting ###

- From the **craft ai** workbench, edit the project (`pencil` button) and open the `craft_project.json`
file to access your application credentials,
- Run the application by running `npm start` in a teminal and fill in the form.

### Under the hood ###

#### Intent API Actions ####

This starter kit contains some example of calls to the [Intent API](https://apidalkia.hubintent.com/documentation/reference.html#/)
wrapped into **craft ai** actions.
These actions handles the authentication to the API.
Feel free to use them as examples to make your own custom actions! 

#### Behavior trees ####

There is a single behavior tree used in this starter kit, and it is quite simple. What it does is:
* retrieving a list of streams associated to a given part,
* logging the data for one of those streams at certain times,
* displaying an alert whenever the value crosses a threshold.

### Resources ###

- [Documentation](http://doc.craft.ai/index.html),
- [Tutorials](http://doc.craft.ai/tutorials/index.html).

Technical questions can be sent through the chat widget of the **craft ai**  workbench
or by email at [support@craft.ai](mailto:support@craft.ai).
