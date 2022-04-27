FROM jenkins/jenkins:2.318-jdk11
EXPOSE 8080

ENV JENKINS_USER admin
ENV JENKINS_PASS admin

# Skip initial setup
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

COPY plugins.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/install-plugins.sh < usr/share/jenkins/plugins.txt

USER root

# Install Node and NPM
RUN apt update && apt upgrade -y
RUN apt install curl && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh && apt install nodejs

# Install Terraform
RUN curl -O https://releases.hashicorp.com/terraform/1.1.9/terraform_1.1.9_linux_arm.zip
RUN unzip terraform_1.1.9_linux_arm.zip
RUN rm terraform_1.1.9_linux_arm.zip
RUN mv terraform /usr/local/bin/terraform

USER jenkins