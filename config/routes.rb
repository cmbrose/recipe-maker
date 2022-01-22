Rails.application.routes.draw do
  get 'home/index'

  resources :recipes
  post 'recipes/create_from_url'
  post 'recipes/create_empty'
  get 'recipes/:id/live', controller: :recipes, action: :live

  resources :menus
  post 'menus/create_empty'

  get '/api/recipes/:id', controller: :recipes, action: :get
  get '/api/menus', controller: :menus, action: :list
  put '/api/menus/:id/recipes', controller: :menus, action: :add_recipe

  get 'errors/exception', controller: :errors, action: :exception

  root 'home#index'
end
