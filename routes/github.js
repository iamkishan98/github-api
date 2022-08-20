
import { Router } from 'express'
const router = Router()

// Import helper
import githubHelper from '../helper/githubApi.helper.js';




router.get("/get-repositories", async(req, res, next) => {
  try {
    if(!req.query.organization) res.status(400).send("Bad request. Please provide an organization name.");
    const {organization} = req.query;


    if(req.query.repositories){
      var {repositories} = req.query;
      if(isNaN(repositories) || Number(repositories) <= 0) res.status(400).send("Bad request. Please provide a valid number of repositories to be fetched.");
      repositories = Number(repositories);
    }else{
      // Set default values if no parameters are specified
      repositories = 4;
    }


    if(req.query.committees){
      var {committees} = req.query;
      if(isNaN(committees) || Number(committees) <= 0) res.status(400).send("Bad request. Please provide a valid number of committees to be fetched.");
      committees = Number(committees);
    }else{
      // Set default values if no parameters are specified
      committees = 2;
    }


    const result = await githubHelper.getRepositoriesByOrg(organization, repositories, committees);

    res.status(200).send({
      totalCount: result.length,
      data: result
    });

  } catch (error) {
    res.status(500).send({message:"Something went wrong"});
  }
 
});


router.get("/test", (req, res, next) => {
    res.status(200).send("Hello");
});


export default router