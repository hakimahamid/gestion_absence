pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = 1
    }

    stages {
        stage('Build Docker Image') {
            steps {
                echo '→ Build de l\'image Docker'
                sh 'newgrp docker -c "docker build --network host -t gestion_absences_image:latest -f Dockerfile ."'
            }
        }

        stage('Docker Compose Up') {
            steps {
                echo '→ Lancement des services via docker-compose'
                sh 'newgrp docker -c "docker-compose up -d --build"'
            }
        }

        stage('Deploy with Ansible') {
            steps {
                echo '→ Déploiement via Ansible (local)'
                sh 'newgrp docker -c "ansible-playbook -i ansible/inventory.ini ansible/playbooks/deploy.yml --connection=local"'
            }
        }

        stage('Install dependencies') {
            steps {
                echo '→ Installation des dépendances Selenium'
                sh 'newgrp docker -c "pip3 install selenium"'
            }
        }

        stage('Run Selenium Test') {
            steps {
                echo '→ Exécution du test Selenium'
                sh 'newgrp docker -c "python3 tests/test_google.py"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline – logs Docker-Compose :'
            sh 'newgrp docker -c "docker-compose logs --tail=50"'
            sh 'newgrp docker -c "docker-compose down --remove-orphans"'
        }
    }
}
