require 'open-uri'

class FetchRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe, async=true)
    url = recipe.source

    begin
      open(url) { |f|
        html = f.read
        async ? ParseRecipeJob.perform_later(recipe, html, true) : ParseRecipeJob.perform_now(recipe, html, false)
      }
    rescue => ex
      raise "Failed to fetch recipe from '#{url}'"
    end
  end
end
