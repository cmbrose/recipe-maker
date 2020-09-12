Rails.application.routes.draw do
  get 'home/index'

  resources :recipes

  root 'recipes#new'
end
