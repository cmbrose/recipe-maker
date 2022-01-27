class MenusController < ApplicationController
  def show
    menu = Menu.find(params[:id])
    render locals: { menu: menu }
  end

  def list
    menus = Menu.all
    render json: menus
  end

  def add_recipe
    recipe_id = params[:recipeId].to_i
    menu = Menu.find(params[:id])
    menu.recipes.append(recipe_id) unless menu.recipes.include?(recipe_id)
    menu.save
  end

  def clear
    menu = Menu.find(params[:id])
    menu.recipes = []
    menu.save
  end

  def index
    render locals: { menus: Menu.all }
  end

  def create_empty
    menu = Menu.create!(name: 'Unnamed Menu')
    redirect_to "/menus/#{menu.id}/edit", locals: { menu: menu }
  end

  def new
    menu = Menu.new
    render locals: { menu: menu }
  end

  def edit
    menu = Menu.find(params[:id])
    render locals: { menu: menu }
  end

  def update
    menu = Menu.find(params[:id])
    menu.update(menu_params)
  end

  def destroy
    Menu.destroy(params[:id])
  end

  def menu_params
    params.require(:menu).permit!
  end
end
