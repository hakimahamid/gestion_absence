# Image de base avec Docker CLI
FROM docker:24.0.5-cli

# Installer Python3, pip, Node.js, npm, Ansible, docker-compose, wget, unzip, curl, gnupg2 et logiciels nécessaires pour Selenium
RUN apk add --no-cache \
      python3 py3-pip nodejs npm openssh-client git wget unzip curl gnupg2 software-properties-common \
    && pip3 install --no-cache-dir ansible docker-compose selenium \
    && npm install -g npm@latest

# Installation de Google Chrome et ChromeDriver
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    CHROME_VERSION=$(google-chrome --version | cut -d ' ' -f 3 | cut -d '.' -f 1) && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/${CHROME_VERSION}.0/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver

# Répertoire de travail (facultatif)
WORKDIR /workspace

# Utilisation de l'utilisateur Jenkins
USER jenkins

