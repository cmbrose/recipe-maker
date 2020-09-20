class RecipesController < ApplicationController
  include ActionController::Live

  skip_before_action :verify_authenticity_token

  def live
    id = params[:id]

    response.headers["Content-Type"] = "text/event-stream"
    
    listener = Recipe.on_update(id) do |recipe|
      response.stream.write("event: recipe_update\n")
      response.stream.write("data: #{recipe.to_json}\n")
      response.stream.write("\n")
    end

    # begin
    #   loop do
    #     response.stream.write("event: recipe_update\n")
    #     response.stream.write("data: #{Recipe.find(1).to_json}\n")
    #     response.stream.write("\n")
    #     sleep 1
    #   end
    # rescue IOError
    #   # When the client disconnects, we'll get an IOError on write
    # ensure      
    #   listener.dispose
    #   response.stream.close
    # end
  end

  def show
    recipe = Recipe.find(params[:id])
    render :locals => { recipe: recipe }
  end

  def new
    recipe = Recipe.new
    render :locals => { recipe: recipe }
  end

  def create_from_url
    url = params[:recipe][:url]

    recipe = Recipe.create(source: url, source_kind: "url")
    CreateRecipeJob.perform_later(recipe)

    redirect_to "/recipes/#{recipe.id}", locals: { recipe: recipe }
  end
end
