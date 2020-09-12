class Recipe < ApplicationRecord
  def fetch!
    FetchRecipeJob.perform_now(self)
  end

  def parse! html
    ParseRecipeJob.perform_now(self, html)
  end
end
