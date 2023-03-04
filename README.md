# **D-Auction** :moneybag: <br> <em>because fine and rare products deserve the Blockchain technology</em>

## <i>Final project of Holberton fundamental curriculum</i> <br>

### **Introduction**

The project purpose if to provide a website with several real world assets proposed on sale on an auction system. To be able to connect, view and bid on the products, you **need to install the web browser extension Metamask :fox_face:**. A Link to a **_"how-to"_** is provided on our index page. We had a lot of fun designing this final year project ! <br>
The final and deployed version (at this stage) is available out [there](https://dauction-test1.herokuapp.com) <br>
You can also find a feedback from Anthony in [this blogpost](https://medium.com/@4984_30211/holberton-school-final-project-story-9ba069fd44c8) on Medium.

Please share with us your comments or questions via our Linkedin, Fabien Pineau is hidden [there](https://www.linkedin.com/in/fabien-pineau-a08686231/), whereas Anthony hides [over here](https://www.linkedin.com/in/anthony-pizzoni-794517233/)

### **_Installation_**

If you want to try, experiment our platform, start by **git cloning** this repository. <br>
Please note this is an **API Nodejs based on express**

- To start developing run in your terminal (for starting database): <br>
  `docker-compose up -d ` <br>
  ==> If you are a windows user, installing docker desktop would be a must, so that you can see your container on the graphical interface.

  ### Important Note! Dev resources

**After starting docker compose, create a dotenv file with values:**

```
DATABASE_URL=postgres://postgres:changeme@localhost:5432/postgres?sslmode=disable
```

- To start development engine please run:

`npm install && npm start`

==> npm install will install all the dependencies needed for the project, those you can find in the **_package.json_** file.

- Finally in another terminal, run

`cd hardhat/ && npm install && npx hardhat node`

==> here again, npm install will install all the dependencies needed for "Hardhat" features. More details on Hardhat [here](https://hardhat.org/tutorial).

### **Usage** :star: <br>

Once you ran `npm install` in one terminal, an `npx hardhat node` in another terminal, you should be able to see the index page by going in your browser at **_localhost:3000_**.

### **Lincensing** :spiral_notepad:

Totally **Open-Source**

<b>Website created by Anthony Pizzoni and Fabien Pineau<b>
