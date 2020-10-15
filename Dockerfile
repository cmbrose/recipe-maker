FROM ruby:2.7
COPY . /app
WORKDIR /app
RUN bundle install
EXPOSE 3000
ENTRYPOINT ["rails"]
CMD ["s"]