class RecipesController < ApplicationController
  include ActionController::Live

  skip_before_action :verify_authenticity_token

  def live
    id = params[:id]

    response.headers["Content-Type"] = "text/event-stream"
    
    listener = Recipe.on_update do |recipe|
      response.stream.write('event: recipe_update')
      response.stream.write(recipe.to_json)
    end

    begin
      loop do
        response.stream.write('event: recipe_update')
        response.stream.write('data: ' + Recipe.find(1).to_json)
        sleep 1
      end
    rescue IOError
      # When the client disconnects, we'll get an IOError on write
    ensure      
      listener.dispose
      response.stream.close
    end
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
