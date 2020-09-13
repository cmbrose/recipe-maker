class Recipe < ApplicationRecord
  serialize :ingredients, JSON
  serialize :directions, JSON

  def fetch!
    FetchRecipeJob.perform_now(self)
  end

  def parse! html
    ParseRecipeJob.perform_now(self, html)
  end
end
