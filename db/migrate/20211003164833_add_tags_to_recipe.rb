class AddTagsToRecipe < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :tags, :text
  end
end
