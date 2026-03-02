FROM ruby:3.3.0-slim

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      texlive-latex-extra \
      texlive-fonts-extra \
      texlive-fonts-recommended \
      texlive-plain-generic \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
