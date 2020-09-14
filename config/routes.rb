Rails.application.routes.draw do
  get 'home/index'

  resources :recipes
  post 'recipes/create_from_url'
  get 'recipes/:id/live', controller: :recipes, action: :live

  root 'home#index'
end
