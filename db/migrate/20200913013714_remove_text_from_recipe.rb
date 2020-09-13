class RemoveTextFromRecipe < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :text, :string
  end
end
