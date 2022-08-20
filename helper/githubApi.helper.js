"use strict";

import axios from 'axios';

async function getRepositoriesByOrg(organization, repositories, committees){

    var currentPage = 1;
    var result = [];

    while(repositories != 0){
        var maxResultCount = 100;
        if(repositories <= 100){
            maxResultCount = repositories;
        }

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

                result[i]["contributors"] = contributorsArray;
            }else{
                result[i]["contributors"] = [];
            }
        }

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
  