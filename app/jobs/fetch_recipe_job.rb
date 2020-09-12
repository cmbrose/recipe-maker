require 'open-uri'

class FetchRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe)
    url = recipe.url

    open(url) { |f|
      html = f.read
      recipe.parse!(html)
    }
  end
end
