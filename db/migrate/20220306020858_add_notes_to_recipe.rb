class AddNotesToRecipe < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :notes, :string
  end
end
