FROM ruby:2.7.2

ARG USER=root

RUN (id -u $USER && \
        echo "User $USER already exists") || \
    (echo "Adding user $USER" && \
        useradd -m -g root -G sudo -s /bin/bash $USER && \
        echo "$USER ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USER)
        
USER $USER

RUN apt-get update -qq && apt-get install -y --no-install-recommends nodejs curl sudo lsb-release

# Cleanup apt cruft
RUN apt -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION=12.16.3
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN npm install yarn -g

RUN node --version
RUN npm --version
RUN yarn --version

RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

COPY . /app

RUN yarn install

RUN rails assets:precompile

# Add a script to be executed every time the container starts.
COPY deploy/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
