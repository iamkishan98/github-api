"use strict";

import axios from 'axios';

/**
 * function to returns repositories for specified organisation
 * 
 * @param string  organisation (Required) 
 * @param integer  repositories 
 * @param integer  committees
 * 
 * @return  []      result 
 */
async function getRepositoriesByOrg(organization, repositories, committees){

    var currentPage = 1;
    var result = [];

    while(repositories != 0){
        // github API returns max. 100 results per page so store min(repositories, maxResultCount) pages at a time
        var maxResultCount = 100;
        if(repositories <= 100){
            maxResultCount = repositories;
        }

        // decrement the count of remaining repositories
        repositories -= maxResultCount;

        // Fetch organization repositories by forks count
        var orgRepositories = await axios({
            method: 'get',
            url: `https://api.github.com/search/repositories?q=org:${organization}`,
            params: {
                sort: 'forks',
                order: 'desc',
                per_page: maxResultCount,
                page: currentPage
            }
        });


        // Loop over all the repositories in current page  
        for(var i in orgRepositories.data.items){

            let repository = orgRepositories.data.items[i];

            result.push({
                id: repository.id,
                node_id: repository.node_id,
                name: repository.name,
                description: repository.description,
                full_name: repository.full_name,
                url: repository.url,
                forks: repository.forks,
                stargazers_count: repository.stargazers_count,
                language: repository.language,
                visibility: repository.visibility
            })

            
            let contributorsUrl = orgRepositories.data.items[i].contributors_url;
            // For each repository find the contributors with by sorting by given parameters
            const contributors = await getRepositoryContributors(contributorsUrl, committees);

            if(contributors && contributors.length != 0){
                var contributorsArray = [];
                for(var j in contributors){
                    const contributor = contributors[j];
                    contributorsArray.push({
                        id: contributor.id,
                        login: contributor.login,
                        node_id: contributor.node_id,
                        url: contributor.url,
                        avatar_url: contributor.avatar_url,
                        contributions: contributor.contributions,
                        type: contributor.type,
                    })
                }

                // Push the contributors to current repository's contributors
                result[i]["contributors"] = contributorsArray;
            }else{
                // If no contributors found then leave it as empty
                result[i]["contributors"] = [];
            }
        }

        // Go to next page
        currentPage++;
    }

    return result;
}



async function getRepositoryContributors(contributorsUrl, committees){
    let contributors = await axios({
        method: 'get',
        url: contributorsUrl,
        params: {
          sort: 'contributions',
          direction: 'desc',
          per_page: committees
        }
    });

    return contributors.data;
}



export default {
    getRepositoriesByOrg
}
  