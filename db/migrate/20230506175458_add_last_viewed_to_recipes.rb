class AddLastViewedToRecipes < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :last_viewed, :datetime
  end
end
