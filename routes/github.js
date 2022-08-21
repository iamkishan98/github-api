
import { Router } from 'express'
const router = Router()

// Import helper
import githubHelper from '../helper/githubApi.helper.js';

/**
 * REST API to return the n number of repositories sorted desc by forks count with 
 * m committees(contributors sorted desc by commit_counts) for specified organisation
 *
 * GET /get-repositories
 * 
 * @param string  organisation (Required) 
 * @param integer  n 
 * @param integer  m 
 * 
 * @return  json   {total_count (integer), data([])} 
 */

router.get("/get-repositories", async(req, res, next) => {
  try {
    if(!req.query.organisation) res.status(400).send("Bad request. Please provide an organisation name.");
    const {organisation} = req.query;

    // n = No. of repositories
    if(req.query.n){
      var {n} = req.query;
      if(isNaN(n) || Number(n) <= 0) res.status(400).send("Bad request. Please provide a valid number of repositories to be fetched.");
      n = Number(n);
    }else{
      // Set default values if no parameters are specified
      n = 4;
    }


    if(req.query.m){
      var {m} = req.query;
      if(isNaN(m) || Number(m) <= 0) res.status(400).send("Bad request. Please provide a valid number of committees to be fetched.");
      m = Number(m);
    }else{
      // Set default values if no parameters are specified
      m = 2;
    }


    const result = await githubHelper.getRepositoriesByOrg(organisation, n, m);

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