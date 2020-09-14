class CreateRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe)
    if recipe.source_is_url?
      FetchRecipeJob.perform_later(recipe)
    end
    # TODO - error handle here
  end
end
