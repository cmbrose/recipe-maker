class RenameUrlToSourceForRecipe < ActiveRecord::Migration[6.0]
  def change
    remove_column :recipes, :url, :string
    add_column :recipes, :source, :string
    add_column :recipes, :source_kind, :string
  end
end
