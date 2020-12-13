require 'open-uri'

class FetchRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe, async=true)
    url = recipe.source

    html = nil
    begin
      URI.open(url) { |f|
        html = f.read
      }

      while html.nil?
        ;
      end
    rescue OpenURI::HTTPError
      raise "Failed to fetch recipe from '#{url}'"
    end

    async ? ParseRecipeJob.perform_later(recipe, html, true) : ParseRecipeJob.perform_now(recipe, html, false)
  end
end
