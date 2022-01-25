## How to deploy quizio on vps

- SSH into the vps along with [agent forwarding](https://www.cloudsavvyit.com/25/what-is-ssh-agent-forwarding-and-how-do-you-use-it/): `ssh -A username@ipadress`
- Remove any irrelevant folder named Quizio-Backend-V2: `rm -rf Quizio-Backend-V2`
- Clone the repo and cd into it `git clone git@github.com:sdslabs/Quizio-Backend-V2.git && cd Quizio-Backend-V2`
- Edit the env file and add all the keys: `cp .env.example .env && nano .env`
- Build the docker image: `docker-compose build`
- Spin up the docker container: `docker-compose up -d`

At this stage, you should have your api working on localhost:5050. Now the task is to write a proxy to forward this local API to a public IP adress (or a domain name). We will use Nginx to do this.

- Copy the nginx conf to the nginx directory: `rm /etc/nginx/sites/available/quizio-backend && cp ./nginx/quizio-backend /etc/nginx/sites/available/quizio-backend`
- Create a sym-link from sites available to sites enabled: `ln -s /etc/nginx/sites-available/quizio-backend /etc/nginx/sites-enabled/quizio-backend`
- Restart nginx service: `systemctl restart nginx`
- Now Quizio Backend API should be accesible on the ip adress / domain name specified in the nginx config