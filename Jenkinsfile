pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = 1
    }

    stages {
        stage('Build Docker Image') {
            steps {
                echo '→ Build de l\'image Docker'
                sh 'docker build --network host -t gestion_absences_image:latest -f Dockerfile .'
            }
        }

        stage('Docker Compose Up') {
            steps {
                echo '→ Lancement des services via docker-compose'
                sh 'docker-compose up -d --build'
            }
        }

        stage('Deploy with Ansible') {
            steps {
                echo '→ Déploiement via Ansible (local)'
                sh 'ansible-playbook -i ansible/inventory.ini ansible/playbooks/deploy.yml --connection=local'
            }
        }

        stage('Install dependencies') {
            steps {
                echo '→ Installation des dépendances Selenium'
                sh 'pip3 install selenium'
            }
        }
    }

    post {
        always {
            echo 'Pipeline – logs Docker-Compose :'
            sh 'docker-compose logs --tail=50'
            sh 'docker-compose down --remove-orphans'
        }
    }
}
