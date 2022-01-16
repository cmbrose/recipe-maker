class MenusController < ApplicationController
  def show
    menu = Menu.find(params[:id])
    render locals: { menu: menu }
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
end
