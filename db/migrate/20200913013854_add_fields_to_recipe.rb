class AddFieldsToRecipe < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :name, :string
    add_column :recipes, :prep_time, :string
    add_column :recipes, :cook_time, :string
    add_column :recipes, :total_time, :string
    add_column :recipes, :servings, :string
    add_column :recipes, :ingredients, :string
    add_column :recipes, :directions, :string
    add_column :recipes, :preview_url, :string
  end
end
