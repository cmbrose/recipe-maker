class SetStringLengths < ActiveRecord::Migration[6.0]
  def self.up
    change_column :recipes, :ingredients, :text
    change_column :recipes, :directions, :text
    change_column :recipes, :source, :string, :limit => 1024
    change_column :recipes, :preview_url, :string, :limit => 1024
  end

  def self.down
    change_column :recipes, :ingredients, :string
    change_column :recipes, :directions, :string
    change_column :recipes, :source, :string
    change_column :recipes, :preview_url, :string
  end
end
