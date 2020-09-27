class CreateRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe, async=true)
    if recipe.source_is_url?
      async ? FetchRecipeJob.perform_later(recipe, true) : FetchRecipeJob.perform_now(recipe, false)
    end
    # TODO - error handle here
  end
end
