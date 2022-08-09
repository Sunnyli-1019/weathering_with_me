How to push changes to heroku remote git repository

1. Clone local repository from github

2. Login to Heroku CLI
 - $ heroku login

2. Add a remote to your local repository with the heroku git:remote command
 - $ heroku git:remote -a weathering-with-me-g12

3. Deploy the code to push the code from your local repository’s main branch to your heroku remote
 - $ git push heroku main

4. Visit API server via the following URL: https://weathering-with-me-g12.herokuapp.com