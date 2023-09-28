# Preparations before the event

## Hosting

We have gathered instructions for some different hosting solutions. There are som pros and cons with all so you have to pick the one suiting you. You can always host your Battlesnake in other places if you want.

- Replit. Supereasy to get started but you have to use a browser based IDE.
- Google App Enging. You can develop on your machine and use a cli tool to publish your app.
- Railway. You can develop on your machine and let Railway build your app when pushed to Github. But you need to give the Railway App access to your Github account.
- Render. You can develop locally just like Railway but you don't need to give access to you repo. The build is however very slow.

### Replit

Replit is a free browser based hosting and IDE. You will edit your files directly in the browser with their built in IDE.

1. Go to https://replit.com/ and create an account.
2. Click "+ Create" to create a new Repl.
3. Choose "Import from github".
4. Paste "github.com/ola-gawell-dct/battlesnake-ts-starter" as GitHub URL.
5. Choose Typescript from Language.
6. Click "Import from GitHub".
7. Click "Run" to build your project and launch the server. This will takes some time the first time since it needs to install all the npm dependencies. The next time will be much faster. 
8. When you see `Running Battlesnake at http://0.0.0.0:8000...` in the log the server is up and running. A small browser window will show up.
9. Copy the URL from the small browser window and use it in the next section. NOTE: It can somtimes take a while for the first request to the server to repond. The server might go into sleep mode after som inactivity so its good to call your url before the big finals.

### Google App Engine
1. Go to [https://cloud.google.com/appengine/](https://cloud.google.com/appengine/) and start a free account.
2. Add the required information and continue.
3. Install the CLI tool by following these instructions [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install).
4. Create a project follow these instructions [https://cloud.google.com/appengine/docs/standard/nodejs/building-app/creating-project](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/creating-project).
5. Deploy your app by running
```
gcloud app deploy
```
6. The url to your hosted bot should be printed out in the console. If not you can run `gcloud app browse`. Copy the url and use it in the Battlesnake instructions section.

### Railway

Railway is a free browser based hosting.

1. Go to [https://github.com/ola-gawell-dct/battlesnake-ts-starter](https://github.com/ola-gawell-dct/battlesnake-ts-starter) and fork the repo.
1. Go to [https://railway.app/](https://railway.app/) and click "login" to create a new account. Use your Github account to log in.
2. Click "+ New Project".
3. Choose "Deploy from GitHub repo" and then “Configure GitHub App.
4. Do the configuration and choose the forked repo.
5. Click “+ Add variables” and enter a new variable “PORT” with value 6774 then press “+ Add” (Or whatever port is in the logs under the "Deployments tab)
6. When you see `Running Battlesnake at http://0.0.0.0:6774...` in the log, the server is up and running.
7. Go to “Settings” and press “Generate Domain”.
8. Copy the URL from "Settings" under "Domain" and use it in the Battlesnake instructions section. (You might have to re-deploy after adding variable or generating domain if you can't ping the web server later from the Battlesnake website)

Notes
* Servers seems to be located in US-west, relevant when choosing engine region in the Battlesnake instructions section.

### Render

1. Go to [https://github.com/ola-gawell-dct/battlesnake-ts-starter](https://github.com/ola-gawell-dct/battlesnake-ts-starter) and fork the repo and make it public. 
2. Go to https://dashboard.render.com/register.
3. Create an account in any way you like.
4. Select New Web Serivces.
5. Paste the url to you forked repo from step 1 in the Public Git Repository field or choose to connect to you Github account (not tested).
6. Press Continue.
7. Name your project to anything you like.
8. Choose Node as Environment. 
9. Press Create Web Service.
10. The build will start immediately but will take some time. Every time you push changes to the git repository you need to press the Manual Deploy > Deploy latest commit.
11. 

### Heroku

NOTE: Heroku is not longer free to use. You can still use it but these instructions might not be complete anymore. 

By following these instructions your server will be depolyed to Heroku. If you don't want to install or use the Heroku CLI it is also possible to integrate Heroku with a Github repo, but that is not covered by this guide (https://devcenter.heroku.com/articles/github-integration).

1. Clone this repo.
2. Install Heroku CLI (might requiere a XCode and MacOS update on Mac) and create a Heroku account.
    https://devcenter.heroku.com/articles/heroku-cli
3. Run `heroku login`.
4. Remove the git directory in this repo `rm -rf .git`.
5. Initialize a fresh git repo `git init`.
6. Commit all files 
    ```
    git add .
    git commit -m "Initial commit"
    ```
7. Create a heroku app `heroku create your-app-name`.
8. Deploy your code `git push heroku main`. 

    **NOTE** if you encounter an error messsge saying something the one below, you're trying to push a branch that doesn't exist.

    ````
    error: src refspec master does not match any  
    error: failed to push some refs to 'https://git.heroku.com/most-super-snake.git'
    ````
    
    Change to the branch your're current using, for instance `master`.
    
9. Verify by browsing to the URL printed by the last command. 
    
    ````
    remote: -----> Launching...
    remote:        Released v3
    remote:        https://most-super-snake.herokuapp.com/ deployed to Heroku <---- THIS ONE 
    ````

## Add your snake to Battlesnake

1. Create a Battlesnake account at https://play.battlesnake.com/.
2. Press "Create Battlesnake" on the Battlesnake site under "Battlesnakes".
3. Choose a name and set the url to your url from last section.
4. Choose Public battlesnake.
5. Save
6. Create a game and add your snake.
7. Run it to verify that it respond to the call from Battlesnake.

## Run tests

Run jest test cases with:
```
npm run test
```

## Play a Game Locally (optional)

Install dependencies using npm

```sh
npm install
```

Start your Battlesnake

```sh
npm run start
```

You should see the following output once it is running

```sh
Running Battlesnake at http://0.0.0.0:8000
```

Open [localhost:8000](http://localhost:8000) in your browser and you should see

```json
{"apiversion":"1","author":"","color":"#888888","head":"default","tail":"default"}
```

Install the [Battlesnake CLI](https://github.com/BattlesnakeOfficial/rules/tree/main/cli)
* You can [download compiled binaries here](https://github.com/BattlesnakeOfficial/rules/releases)
* or [install as a go package](https://github.com/BattlesnakeOfficial/rules/tree/main/cli#installation) (requires Go 1.18 or higher)

Command to run a local game

```sh
battlesnake play -W 11 -H 11 --name 'TypeScript Starter Project' --url http://localhost:8000 -g solo --browser
```

## Links
[Battlesnake Quickstart Guide](https://docs.battlesnake.com/quickstart)
[Battlesnake API Docs](https://docs.battlesnake.com/api)
