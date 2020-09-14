require 'open-uri'

class FetchRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe)
    url = recipe.source

    open(url) { |f|
      html = f.read
      ParseRecipeJob.perform_later(recipe, html)
    }
  end
end
